// Reads the "raw" variable names a gessTabs script pulls in from its data
// source — the names that never appear in a declaration statement but are
// most of a real project's variables. See docs/variable-model-design.md §11.
//
// Scope (P0):
//   - CSVINFILE                -> first line of the file, split on ; or ,
//   - DATAFILE/INFILE <delimited> -> same, when the first line carries ; or ,
//   - DATAFILE/INFILE <wildcard>  -> the union of every matching file's header
//   - SPSSINFILE (.sav)        -> front-of-file dictionary parser
//                                  (savDictionary.ts), names + type only
//   - ENCODING DATAFILE = ...  -> overrides the auto-detected encoding for
//                                  CSVINFILE/DATAFILE/INFILE header reading
// Out of scope here: column-fixed DATAFILE/INFILE / COLBININFILE / INVERTIN
// (their names come from a VARNAME vardef — a later phase), ZSAV ($FL3, no
// special handling needed, see savDictionary.ts), SPSS variable/value labels.
//
// Pure: statement scanning works on a resolved include `order`; name
// resolution takes an injected byte reader so it stays unit-testable
// without touching the filesystem. The vscode-facing watcher/cache lives in
// src/providers/externalNamesProvider.ts.

import * as path from 'path';
import { TextDecoder } from 'util';
import { ResolvedLine } from './includeGraph';
import { toLogicalStatements, locateInStatement } from './statements';
import { readSavDictionary } from './savDictionary';
import { globToRegExp } from '../util/glob';

export type DataSourceKind = 'spss' | 'csv' | 'datafile';

export interface DataSourceStatement {
  kind: DataSourceKind;
  // The .tab/.inc file that physically contains the statement — the path is
  // resolved relative to this file's directory.
  file: string;
  line: number; // 0-based, the statement's own first line, within `file`
  rawPath: string; // the <filepath> token exactly as written (unquoted)
  fileKey?: string; // [ FILEKEY <key> ] — irrelevant to name extraction, kept for display
  delimiterToken?: string; // the explicit [ <delimchar> ] slot, verbatim
  text: string; // the statement's first line, trimmed (display / go-to-def)
  // Set when the statement wraps across physical lines and <filepath> sits
  // on a later one than `line` — the exact location of the path token
  // itself, for a precise DocumentLink range. Undefined (fall back to
  // `line`) when the statement is the common single-line shape, or when
  // locating the token failed for some reason.
  pathLine?: number;
  pathChar?: number;
}

export type ExternalNameOrigin = DataSourceKind;

export interface ExternalNameSource {
  statement: DataSourceStatement;
  absPath?: string;
  // The recovered variable names in file order, or 'unresolved' when they
  // could not be read (see `reason`). 'unresolved' is a normal state — the
  // data file is often not on the editing machine.
  names: string[] | 'unresolved';
  reason?: string;
  // name (lower-cased) -> column index, for CSV go-to / hover ("Spalte 3").
  columnIndex?: Record<string, number>;
  // name (lower-cased) -> character range of that name within line 0 of
  // `absPath` (the header row), for a header-cell go-to-definition jump.
  // Only set for a delimited (csv/datafile) source; approximate when a
  // field's quoting uses an escaped `""` (rare in header rows).
  columnRanges?: Record<string, { start: number; end: number }>;
  // Every absolute path an OS-wildcard `rawPath` (e.g. "WELLE.*") matched,
  // alphabetically sorted — `absPath` is `matchedPaths[0]`. Undefined for
  // a non-wildcard source.
  matchedPaths?: string[];
}

export interface ExternalNamesIO {
  // Returns the file's bytes (or at least its first ~64 KiB), or undefined
  // when the file cannot be read.
  readBytes(absPath: string): Uint8Array | undefined;
  // Lists the basenames of files in `dirAbsPath` (non-recursive). Only
  // needed to resolve an OS-wildcard DATAFILE/INFILE/CSVINFILE path; safe to
  // omit — a wildcard path then resolves as 'unresolved'.
  listFiles?(dirAbsPath: string): string[];
}

// SPSSINFILE [ FILEKEY <k> ]                = <path>;
// CSVINFILE  [ FILEKEY <k> ] [ <delimchar> ] = <path>;
// DATAFILE   [ FILEKEY <k> ]                = <path>;
// INFILE     [ FILEKEY <k> ]                = <path>; — documented synonym
//   for DATAFILE (manual: "Anhang > Historisches > Handhabung von
//   ASCII-Daten > Daten-Input" and the DATAFILE keyword's own syntax entry).
// Matched against a whole logical statement's (possibly multi-line-joined)
// text, so a statement wrapped across several physical lines is still
// found (§11.7 "multi-line input statements").
const statementRe =
  /^\s*(spssinfile|csvinfile|datafile|infile)\b([^=]*?)=\s*(["']?)([^"';\r\n]+)\3\s*;?/i;
const fileKeyRe = /\bfilekey\s+(\S+)/i;

const KIND_BY_KEYWORD: Record<string, DataSourceKind> = {
  spssinfile: 'spss',
  csvinfile: 'csv',
  datafile: 'datafile',
  infile: 'datafile',
};

// A `VARNAME = <name> <startcol> <width>;` statement — the vardef shape a
// column-fixed DATAFILE/INFILE's fields are declared with (manual: the
// VARNAME keyword entry). Its mere presence anywhere in the entry program
// tells `resolveOne` that a DATAFILE with no ; or , on its first line is
// genuinely column-fixed, rather than an unreadable/unknown format.
const vardefStatementRe = /^\s*varname\s*=/i;

export function hasVardefStatements(order: ResolvedLine[]): boolean {
  return order.some((rl) => vardefStatementRe.test(rl.text));
}

// A token that can only resolve at runtime (#EXPAND / &macro-param&) — we
// never guess at these, unlike an OS wildcard (`*`/`?`), which is a static
// glob against the real filesystem (see resolveWildcard).
const DYNAMIC_TOKEN = /[#&]/;
const WILDCARD_TOKEN = /[*?]/;

export type EncodingOverrideValue = 'latin1' | 'utf8' | 'utf16le' | 'utf16be';

// ENCODING <filetype> = [ LATIN1 | UTF8 | UTF16LE | UTF16BE ];
// filetype = [ DATAFILE | OPENQFILE | EXCELOUT | HG | EXPORTFILE ]
// (manual: "Daten und Datensatz > Encoding"). Only the `DATAFILE` filetype
// matters here — it overrides the auto-detected encoding used to read a
// CSVINFILE/DATAFILE/INFILE header (OPENQFILE/EXCELOUT/HG/EXPORTFILE are
// output-side / a different input, out of scope for raw-name reading).
const encodingStatementRe =
  /^\s*encoding\s+(\w+)\s*=\s*(latin1|utf8|utf16le|utf16be)\s*;?/i;

// The last `ENCODING <filetype> = ...;` for `filetype` in program order
// wins — the manual allows changing encoding mid-run, so a later statement
// supersedes an earlier one for any file read after it. v1 keeps this
// simple (whole-program override) rather than tracking where in the order
// each data-source statement falls relative to it.
export function findEncodingOverride(
  order: ResolvedLine[],
  filetype: string
): EncodingOverrideValue | undefined {
  let result: EncodingOverrideValue | undefined;
  order.forEach((rl) => {
    const m = rl.text.match(encodingStatementRe);
    if (!m || m[1].toLowerCase() !== filetype.toLowerCase()) return;
    result = m[2].toLowerCase() as EncodingOverrideValue;
  });
  return result;
}

export function findDataSourceStatements(
  order: ResolvedLine[]
): DataSourceStatement[] {
  const out: DataSourceStatement[] = [];
  toLogicalStatements(order).forEach((stmt) => {
    const m = stmt.text.match(statementRe);
    if (!m) return;
    const fk = fileKeyRe.exec(m[2]);
    const mid = (fk ? m[2].replace(fileKeyRe, ' ') : m[2]).trim();
    const rawPath = m[4].trim();

    let pathLine: number | undefined;
    let pathChar: number | undefined;
    const pathOffset = stmt.text.indexOf(rawPath);
    if (pathOffset !== -1) {
      const loc = locateInStatement(stmt, pathOffset);
      pathLine = loc.line.line;
      pathChar = loc.character;
    }

    out.push({
      kind: KIND_BY_KEYWORD[m[1].toLowerCase()],
      file: stmt.file,
      line: stmt.startLine,
      rawPath,
      fileKey: fk ? fk[1] : undefined,
      delimiterToken: mid || undefined,
      text: (stmt.lines[0]?.text ?? stmt.text).trim(),
      pathLine,
      pathChar,
    });
  });
  return out;
}

const NAMED_DELIMITERS: Record<string, string> = {
  tab: '\t',
  tabulator: '\t',
  semicolon: ';',
  semikolon: ';',
  comma: ',',
  komma: ',',
  space: ' ',
  blank: ' ',
};

export function interpretDelimiter(
  token: string | undefined
): string | undefined {
  if (!token) return undefined;
  const t = token.trim().replace(/^["']|["']$/g, '');
  if (t.length === 1) return t;
  return NAMED_DELIMITERS[t.toLowerCase()];
}

// Decodes bytes as UTF-8 (honouring a BOM, and UTF-16 LE/BE BOMs), falling
// back to Windows-1252 when the bytes are not valid UTF-8 — external data
// is sometimes CP-1252 (see the manual's Encoding page). `override`, when
// given (an explicit `ENCODING DATAFILE = ...;` in the script), replaces
// this auto-detection entirely — the author knows better than a heuristic.
export function decodeText(
  bytes: Uint8Array,
  override?: EncodingOverrideValue
): string {
  if (override === 'utf16le') return new TextDecoder('utf-16le').decode(bytes);
  if (override === 'utf16be') return new TextDecoder('utf-16be').decode(bytes);
  if (override === 'latin1')
    return new TextDecoder('windows-1252').decode(bytes);
  if (override === 'utf8') return new TextDecoder('utf-8').decode(bytes);

  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    try {
      return new TextDecoder('windows-1252').decode(bytes);
    } catch {
      return new TextDecoder('latin1').decode(bytes);
    }
  }
}

function firstLineOf(
  bytes: Uint8Array,
  override?: EncodingOverrideValue
): string {
  const slice = bytes.subarray(0, Math.min(bytes.length, 65536));
  return decodeText(slice, override).split(/\r?\n/)[0] ?? '';
}

// Splits one delimited line into fields, keeping each raw field's [start,
// end) offset in `line` (including any surrounding whitespace/quotes)
// alongside its unquoted value — used by splitDelimited (the value only)
// and by fieldRanges (the header-cell character range for go-to-
// definition), honouring "double-quoted" fields (with "" as an embedded
// quote). The quote characters themselves are not part of `value`.
function splitDelimitedWithOffsets(
  line: string,
  delim: string
): { value: string; start: number; end: number }[] {
  const out: { value: string; start: number; end: number }[] = [];
  let cur = '';
  let inQuotes = false;
  let start = 0;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      out.push({ value: cur, start, end: i });
      cur = '';
      start = i + 1;
    } else {
      cur += ch;
    }
  }
  out.push({ value: cur, start, end: line.length });
  return out;
}

function splitDelimited(line: string, delim: string): string[] {
  return splitDelimitedWithOffsets(line, delim).map((f) => f.value);
}

export interface DelimitedHeader {
  names: string[];
  delimiter: string;
}

// Parses a CSV/delimited header line. Delimiter: the explicit one if given,
// else auto-detected as ';' or ',' (whichever occurs; the more frequent one
// if both). A line with neither and no explicit delimiter is not a delimited
// source -> null.
export function parseDelimitedHeader(
  firstLine: string,
  explicitDelimiter?: string
): DelimitedHeader | null {
  const line = firstLine.replace(/^\uFEFF/, '').replace(/\r$/, '');
  let delimiter = explicitDelimiter;
  if (!delimiter) {
    const semi = (line.match(/;/g) ?? []).length;
    const comma = (line.match(/,/g) ?? []).length;
    if (semi === 0 && comma === 0) return null;
    delimiter = semi >= comma ? ';' : ',';
  }
  const names = splitDelimited(line, delimiter).map((f) => f.trim());
  return { names, delimiter };
}

// Character range of each header field's *content* (trimmed, unquoted)
// within `firstLine`, in the same order `parseDelimitedHeader` returns
// names — for the CSV-header-cell go-to-definition jump. Approximate when a
// field contains an escaped `""` (the unescaped value is shorter than the
// raw span, rare in header rows).
function fieldRanges(
  firstLine: string,
  delimiter: string
): { name: string; start: number; end: number }[] {
  const line = firstLine.replace(/^\uFEFF/, '').replace(/\r$/, '');
  return splitDelimitedWithOffsets(line, delimiter).map(
    ({ value, start, end }) => {
      const raw = line.slice(start, end);
      const leadingWs = raw.length - raw.trimStart().length;
      const trimmedRaw = raw.trim();
      const quoted =
        trimmedRaw.length >= 2 &&
        trimmedRaw.startsWith('"') &&
        trimmedRaw.endsWith('"');
      const innerStart = start + leadingWs + (quoted ? 1 : 0);
      const name = value.trim();
      return { name, start: innerStart, end: innerStart + name.length };
    }
  );
}

export interface ResolveExternalNamesOptions {
  // The script declares a VARNAME vardef anywhere in its resolved program —
  // see hasVardefStatements. Changes the reason a column-fixed DATAFILE
  // (no ; or , on its first line) is reported unresolved with.
  hasVardefInclude?: boolean;
  // An explicit `ENCODING DATAFILE = ...;` override, applied to every
  // csv/datafile-kind source's header read (never to SPSSINFILE, which
  // decodes names via the .sav dictionary's own encoding record).
  datafileEncoding?: EncodingOverrideValue;
}

// The distinct raw names across every resolved source (case-preserving,
// first-seen casing wins). Sources that are 'unresolved' contribute nothing
// but are reported via `hasUnresolved`. Used both as the public "union
// across every wave" helper and internally by resolveWildcard to union the
// names an OS-wildcard path's several matched files each contribute.
export function collectExternalNames(sources: ExternalNameSource[]): {
  names: string[];
  hasUnresolved: boolean;
} {
  const seen = new Map<string, string>();
  let hasUnresolved = false;
  sources.forEach((s) => {
    if (s.names === 'unresolved') {
      hasUnresolved = true;
      return;
    }
    s.names.forEach((n) => {
      const key = n.toLowerCase();
      if (!seen.has(key)) seen.set(key, n);
    });
  });
  return { names: Array.from(seen.values()), hasUnresolved };
}

function resolveKnownFile(
  st: DataSourceStatement,
  absPath: string,
  io: ExternalNamesIO,
  opts: ResolveExternalNamesOptions
): ExternalNameSource {
  const bytes = io.readBytes(absPath);
  if (!bytes) {
    return {
      statement: st,
      absPath,
      names: 'unresolved',
      reason: `Datenquelle nicht gefunden: ${absPath}`,
    };
  }

  if (st.kind === 'spss') {
    const dict = readSavDictionary(bytes);
    if (dict.kind === 'error') {
      return {
        statement: st,
        absPath,
        names: 'unresolved',
        reason: dict.reason,
      };
    }
    return { statement: st, absPath, names: dict.names };
  }

  const encoding = opts.datafileEncoding;
  const firstLine = firstLineOf(bytes, encoding);
  const header = parseDelimitedHeader(
    firstLine,
    interpretDelimiter(st.delimiterToken)
  );
  if (!header) {
    if (st.kind === 'datafile') {
      return {
        statement: st,
        absPath,
        names: 'unresolved',
        reason: opts.hasVardefInclude
          ? 'spaltenfixiertes DATAFILE — Variablennamen werden noch nicht gelesen'
          : 'DATAFILE-Format kann nicht bestimmt werden (keine Trennzeichen in der ersten Zeile, keine VARNAME-Vardef gefunden)',
      };
    }
    return {
      statement: st,
      absPath,
      names: 'unresolved',
      reason: 'CSV-Kopfzeile enthält kein ; oder , — keine getrennte Quelle',
    };
  }

  const names = header.names.filter((n) => n.length > 0);
  const columnIndex: Record<string, number> = {};
  header.names.forEach((n, i) => {
    if (n) columnIndex[n.toLowerCase()] = i;
  });
  const columnRanges: Record<string, { start: number; end: number }> = {};
  fieldRanges(firstLine, header.delimiter).forEach(({ name, start, end }) => {
    if (name) columnRanges[name.toLowerCase()] = { start, end };
  });
  return { statement: st, absPath, names, columnIndex, columnRanges };
}

// An OS-wildcard DATAFILE/INFILE/CSVINFILE path ("WELLE.*", manual: "Anhang
// > ... > Daten-Input") — the directory is searched for every matching
// file, the list sorted alphabetically (documented order), and every
// match's header contributes to the union (§11.7 "wildcard-path
// resolution"). Unresolved only when nothing matches, or `io.listFiles` is
// unavailable.
function resolveWildcard(
  st: DataSourceStatement,
  io: ExternalNamesIO,
  opts: ResolveExternalNamesOptions
): ExternalNameSource {
  const fullPattern = path.resolve(path.dirname(st.file), st.rawPath);
  const dir = path.dirname(fullPattern);
  const patternRe = globToRegExp(path.basename(fullPattern));
  const list = io.listFiles ? io.listFiles(dir) : undefined;
  const matches = (list ?? [])
    .filter((name) => patternRe.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(dir, name));

  if (matches.length === 0) {
    return {
      statement: st,
      names: 'unresolved',
      reason: `Datenquelle nicht gefunden (Wildcard "${st.rawPath}" ohne Treffer)`,
    };
  }

  const results = matches.map((absPath) =>
    resolveKnownFile(st, absPath, io, opts)
  );
  const ok = results.filter(
    (r): r is ExternalNameSource & { names: string[] } =>
      r.names !== 'unresolved'
  );
  if (ok.length === 0) {
    return {
      statement: st,
      absPath: matches[0],
      names: 'unresolved',
      reason: results[0].reason,
      matchedPaths: matches,
    };
  }

  const { names } = collectExternalNames(ok);
  return {
    statement: st,
    absPath: ok[0].absPath,
    names,
    columnIndex: ok[0].columnIndex,
    columnRanges: ok[0].columnRanges,
    matchedPaths: matches,
  };
}

function resolveOne(
  st: DataSourceStatement,
  io: ExternalNamesIO,
  opts: ResolveExternalNamesOptions
): ExternalNameSource {
  if (DYNAMIC_TOKEN.test(st.rawPath)) {
    return {
      statement: st,
      names: 'unresolved',
      reason: 'Datenpfad nicht statisch auflösbar (#EXPAND / &token&)',
    };
  }
  if (WILDCARD_TOKEN.test(st.rawPath)) {
    return resolveWildcard(st, io, opts);
  }

  const absPath = path.resolve(path.dirname(st.file), st.rawPath);
  return resolveKnownFile(st, absPath, io, opts);
}

export function resolveExternalNames(
  statements: DataSourceStatement[],
  io: ExternalNamesIO,
  opts: ResolveExternalNamesOptions = {}
): ExternalNameSource[] {
  return statements.map((st) => resolveOne(st, io, opts));
}

// Convenience: scan + resolve in one call.
export function readExternalNames(
  order: ResolvedLine[],
  io: ExternalNamesIO
): ExternalNameSource[] {
  const opts: ResolveExternalNamesOptions = {
    hasVardefInclude: hasVardefStatements(order),
    datafileEncoding: findEncodingOverride(order, 'datafile'),
  };
  return resolveExternalNames(findDataSourceStatements(order), io, opts);
}
