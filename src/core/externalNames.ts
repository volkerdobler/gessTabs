// Reads the "raw" variable names a gessTabs script pulls in from its data
// source — the names that never appear in a declaration statement but are
// most of a real project's variables. See docs/variable-model-design.md §11.
//
// Scope (P0, first cut):
//   - CSVINFILE            -> first line of the file, split on ; or ,
//   - DATAFILE <delimited> -> same, when the first line carries ; or ,
//   - SPSSINFILE (.sav)    -> front-of-file dictionary parser (savDictionary.ts),
//                             names + type only
// Out of scope here: column-fixed DATAFILE / COLBININFILE / INVERTIN (their
// names come from a vardef INCLUDE — a later phase), ZSAV ($FL3), SPSS
// variable/value labels.
//
// Pure: statement scanning works on a resolved include `order`; name
// resolution takes an injected byte reader so it stays unit-testable
// without touching the filesystem. The vscode-facing watcher/cache lives in
// src/providers/externalNamesProvider.ts.

import * as path from 'path';
import { TextDecoder } from 'util';
import { ResolvedLine } from './includeGraph';
import { readSavDictionary } from './savDictionary';

export type DataSourceKind = 'spss' | 'csv' | 'datafile';

export interface DataSourceStatement {
  kind: DataSourceKind;
  // The .tab/.inc file that physically contains the statement — the path is
  // resolved relative to this file's directory.
  file: string;
  line: number; // 0-based, within `file`
  rawPath: string; // the <filepath> token exactly as written (unquoted)
  fileKey?: string; // [ FILEKEY <key> ] — irrelevant to name extraction, kept for display
  delimiterToken?: string; // the explicit [ <delimchar> ] slot, verbatim
  text: string; // the whole statement line, trimmed
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
}

export interface ExternalNamesIO {
  // Returns the file's bytes (or at least its first ~64 KiB), or undefined
  // when the file cannot be read.
  readBytes(absPath: string): Uint8Array | undefined;
}

// SPSSINFILE [ FILEKEY <k> ] = <path>;
// CSVINFILE  [ FILEKEY <k> ] [ <delimchar> ] = <path>;
// DATAFILE   [ FILEKEY <k> ] = <path>;
// Single physical line (the documented shape); a statement wrapped across
// lines is a known v1 gap.
const statementRe =
  /^\s*(spssinfile|csvinfile|datafile)\b([^=]*?)=\s*(["']?)([^"';\r\n]+)\3\s*;?/i;
const fileKeyRe = /\bfilekey\s+(\S+)/i;

const KIND_BY_KEYWORD: Record<string, DataSourceKind> = {
  spssinfile: 'spss',
  csvinfile: 'csv',
  datafile: 'datafile',
};

const UNRESOLVABLE_PATH = /[#&*?]/;

export function findDataSourceStatements(
  order: ResolvedLine[]
): DataSourceStatement[] {
  const out: DataSourceStatement[] = [];
  for (let i = 0; i < order.length; i += 1) {
    const rl = order[i];
    const m = rl.text.match(statementRe);
    if (!m) continue;
    const fk = fileKeyRe.exec(m[2]);
    const mid = (fk ? m[2].replace(fileKeyRe, ' ') : m[2]).trim();
    out.push({
      kind: KIND_BY_KEYWORD[m[1].toLowerCase()],
      file: rl.file,
      line: rl.line,
      rawPath: m[4].trim(),
      fileKey: fk ? fk[1] : undefined,
      delimiterToken: mid || undefined,
      text: rl.text.trim(),
    });
  }
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
// is sometimes CP-1252 (see the manual's Encoding page).
export function decodeText(bytes: Uint8Array): string {
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

function firstLineOf(bytes: Uint8Array): string {
  const slice = bytes.subarray(0, Math.min(bytes.length, 65536));
  return decodeText(slice).split(/\r?\n/)[0] ?? '';
}

// Splits one delimited line into fields, honouring "double-quoted" fields
// (with "" as an embedded quote). The quote characters themselves are not
// part of the returned field.
function splitDelimited(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
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
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
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

function resolveOne(
  st: DataSourceStatement,
  io: ExternalNamesIO
): ExternalNameSource {
  if (UNRESOLVABLE_PATH.test(st.rawPath)) {
    return {
      statement: st,
      names: 'unresolved',
      reason:
        'Datenpfad nicht statisch auflösbar (#EXPAND / &token& / Wildcard)',
    };
  }

  const absPath = path.resolve(path.dirname(st.file), st.rawPath);
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

  const header = parseDelimitedHeader(
    firstLineOf(bytes),
    interpretDelimiter(st.delimiterToken)
  );
  if (!header) {
    return {
      statement: st,
      absPath,
      names: 'unresolved',
      reason:
        st.kind === 'datafile'
          ? 'spaltenfixiertes DATAFILE — Variablennamen werden noch nicht gelesen'
          : 'CSV-Kopfzeile enthält kein ; oder , — keine getrennte Quelle',
    };
  }

  const names = header.names.filter((n) => n.length > 0);
  const columnIndex: Record<string, number> = {};
  header.names.forEach((n, i) => {
    if (n) columnIndex[n.toLowerCase()] = i;
  });
  return { statement: st, absPath, names, columnIndex };
}

export function resolveExternalNames(
  statements: DataSourceStatement[],
  io: ExternalNamesIO
): ExternalNameSource[] {
  return statements.map((st) => resolveOne(st, io));
}

// Convenience: scan + resolve in one call.
export function readExternalNames(
  order: ResolvedLine[],
  io: ExternalNamesIO
): ExternalNameSource[] {
  return resolveExternalNames(findDataSourceStatements(order), io);
}

// The distinct raw names across every resolved source (case-preserving,
// first-seen casing wins). Sources that are 'unresolved' contribute nothing
// but are reported via `hasUnresolved`.
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
