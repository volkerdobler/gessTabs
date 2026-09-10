// Groups the INCLUDE-resolved line list (src/core/symbolIndex.ts's
// `order`) into whole logical statements — the unit the variable-model
// statement classifier (src/core/variableStatements.ts) works on.
//
// gessTabs statements end at a `;` and freely span lines (a `GROUPS` /
// `INTERVALS` / `VALUELABELS` body is routinely 20+ lines, one `;`), and
// more than one can share a physical line (`compute a = 1; compute b = 2;`).
// `collectStatement` in src/core/variableInfo.ts is a one-off, line-
// granular version of this (widen a single start line to the next `;`);
// this module replaces it with a proper top-level `;` split.
//
// One real exception to "statements end at `;`": a column-1 macro/
// preprocessor call — `#name( args )`, `#DOMACRO(...)`/`#DOMACRO2..4(...)`
// included — is a self-terminating construct that ends at its own balanced
// `)` and must NOT be followed by a `;` (confirmed against a real script:
// `#makemulti2( f71_16mult f71_m1.16.1 … )` with no trailing `;`, directly
// followed by an ordinary `COMPUTE …;`). Without special-casing this, the
// scan below would keep swallowing lines — including the next several real
// statements — looking for a `;` that was never meant to come, corrupting
// everything up to the next one it actually finds.
//
// Comments are already blanked to spaces in `order` (see
// src/core/includeGraph.ts `blankComments`), so the only scope this needs
// to track when hunting the terminating `;` is string quoting: a `;`
// inside `"a; b"` does not end the statement.

import { ResolvedLine } from './includeGraph';

export interface LogicalStatement {
  // The resolved lines this statement touches, in order (a line shared by
  // two statements appears in both).
  lines: ResolvedLine[];
  // The statement's own text — the slice between the previous top-level
  // `;` (or line start) and its own terminating `;`, inclusive — with the
  // per-line pieces joined by `\n` and the whole thing trimmed.
  text: string;
  // file + 0-based line of the first contributing line, for jump links.
  file: string;
  startLine: number;
  // false when the accumulator hit end-of-file (or a file boundary) with
  // no terminating `;` — a run-away / truncated statement.
  terminated: boolean;
}

// No gessTabs statement runs anywhere near this long; the cap just stops a
// missing `;` from swallowing the rest of the program into one statement.
const MAX_STATEMENT_LINES = 200;

// A column-1 `#name(` macro/preprocessor call — same shape as
// macroExpansion.ts's own `callStartRe`, kept independent since that
// module is about substitution, not statement boundaries. Deliberately
// anchored to the very start of the line (only checked at `c === 0` below)
// to match the documented "always a column-1 construct" macro-call
// convention — never triggers mid-line after a preceding `;`.
const macroCallStartRe = /^\s*#[A-Za-z_][\w.]*\s*\(/;

// `#macro <#name>( … )` opens a macro-definition body; `#endmacro` /
// `#macroend` closes it (nesting is legal — see the diagnostics tests).
// The body is a substitution template, not a run of program statements:
// its `&1` / `&param` tokens would be misread as variable names by every
// classifier consumer, and — worse — a `#macro`/`#endmacro` line has no
// `;`, so without this the first real statement after `#endmacro` (and
// the first body line after `#macro`) got glued onto the directive line
// and lost. macroExpansion.ts parses macro bodies separately from its own
// line scan, so nothing here needs them. `#endmacro` is tested before
// `#macro` since `#macroend` starts with `#macro`.
const macroBlockStartRe = /^\s*#macro\b/i;
const macroBlockEndRe = /^\s*#(?:endmacro|macroend)\b/i;

interface Piece {
  line: ResolvedLine;
  text: string;
}

function flush(
  pieces: Piece[],
  terminated: boolean,
  out: LogicalStatement[]
): void {
  if (pieces.length === 0) return;
  const joined = pieces
    .map((p) => p.text)
    .join('\n')
    .trim();
  if (joined.length === 0) return;
  out.push({
    lines: pieces.map((p) => p.line),
    text: joined,
    file: pieces[0].line.file,
    startLine: pieces[0].line.line,
    terminated,
  });
}

export function toLogicalStatements(order: ResolvedLine[]): LogicalStatement[] {
  const out: LogicalStatement[] = [];
  let pieces: Piece[] = [];
  let inString: '"' | "'" | null = null;
  // null: not inside a macro-call statement's own `( … )`. Once a fresh
  // statement's first line matches macroCallStartRe, this counts paren
  // depth instead of scanning for `;` — the statement ends the moment it
  // returns to 0, `;` or not (see the module doc comment above).
  let macroCallDepth: number | null = null;
  // >0 while inside one or more nested `#macro … #endmacro` blocks; those
  // body lines are skipped entirely. Reset on a file change — an unclosed
  // `#macro` never spans files.
  let macroBlockDepth = 0;
  let prevFile: string | undefined;

  const endStatement = (terminated: boolean) => {
    flush(pieces, terminated, out);
    pieces = [];
    inString = null;
    macroCallDepth = null;
  };

  for (let i = 0; i < order.length; i++) {
    const rl = order[i];

    if (prevFile !== undefined && prevFile !== rl.file) macroBlockDepth = 0;
    prevFile = rl.file;

    // A `#macro … #endmacro` body is a template, not statements — skip it,
    // flushing any half-open statement at the block's edges.
    if (macroBlockEndRe.test(rl.text)) {
      if (macroBlockDepth > 0) macroBlockDepth -= 1;
      if (macroBlockDepth === 0) endStatement(false);
      continue;
    }
    if (macroBlockStartRe.test(rl.text)) {
      if (macroBlockDepth === 0) endStatement(false);
      macroBlockDepth += 1;
      continue;
    }
    if (macroBlockDepth > 0) continue;

    // A file boundary or an over-long run interrupts an unterminated
    // statement — emit what we have as truncated and start fresh.
    if (
      pieces.length > 0 &&
      (pieces[pieces.length - 1].line.file !== rl.file ||
        pieces.length >= MAX_STATEMENT_LINES)
    ) {
      endStatement(false);
    }

    const { text } = rl;
    let segStart = 0;
    if (pieces.length === 0 && macroCallStartRe.test(text)) {
      macroCallDepth = 0;
    }
    for (let c = 0; c < text.length; c++) {
      const ch = text[c];
      if (inString) {
        if (ch === inString) inString = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inString = ch;
        continue;
      }
      if (macroCallDepth !== null) {
        if (ch === '(') macroCallDepth += 1;
        else if (ch === ')') {
          macroCallDepth -= 1;
          if (macroCallDepth === 0) {
            pieces.push({ line: rl, text: text.slice(segStart, c + 1) });
            endStatement(true);
            segStart = c + 1;
          }
        }
        continue;
      }
      if (ch === ';') {
        pieces.push({ line: rl, text: text.slice(segStart, c + 1) });
        endStatement(true);
        segStart = c + 1;
      }
    }
    if (segStart < text.length) {
      const frag = text.slice(segStart);
      // A whitespace-only tail — most often what a trailing `// …` comment
      // becomes once blankComments() has run (e.g. `document = "";   // note`)
      // — must NOT open a fresh statement. If it did, it became that
      // statement's `pieces[0]`, anchoring the NEXT real statement's
      // `startLine` to the line of the *previous* statement's `;`. With
      // skipped lines (comments, #ifdef directives) in between, the next
      // statement could be reported many lines too early — a real bug:
      // go-to-definition / hover on a raw dataset variable jumped to the
      // CSVINFILE/SPSSINFILE line's predecessor. A whitespace tail mid-
      // statement (a blank line inside a GROUPS body) is still kept — it
      // keeps `locateInStatement`'s newline math aligned.
      if (pieces.length > 0 || /\S/.test(frag)) {
        pieces.push({ line: rl, text: frag });
      }
    }
  }

  endStatement(false);
  return out;
}

// Maps an offset within a LogicalStatement's (trimmed) `text` back to the
// resolved line and character it came from. `text` is trimmed for display,
// so an offset on the first line is shifted by however much leading
// whitespace `.trim()` stripped — undone here by reading that whitespace
// back off the line's own (untrimmed) source text. Exact for the common
// case (the statement starts fresh on its own line, not sharing it with a
// preceding one); a statement whose start line IS shared
// (`a = 1; b = 2;`) can be off by that shared prefix's length on its own
// first line only — rare in practice, and callers (hover, semantic
// tokens) lose at most a few columns, never the line.
export function locateInStatement(
  stmt: LogicalStatement,
  offset: number
): { line: ResolvedLine; character: number } {
  const firstLineText = stmt.lines[0]?.text ?? '';
  const leadingWs = firstLineText.length - firstLineText.trimStart().length;
  let consumed = 0;
  for (let i = 0; i < stmt.lines.length; i += 1) {
    const piece = stmt.lines[i];
    const len = piece.text.length - (i === 0 ? leadingWs : 0);
    if (offset <= consumed + len) {
      const character =
        i === 0 ? offset + leadingWs : Math.max(0, offset - consumed);
      return { line: piece, character };
    }
    consumed += len + 1; // + '\n'
  }
  const last = stmt.lines[stmt.lines.length - 1];
  return { line: last, character: 0 };
}

// The logical statement that contains (file, line) — the one whose
// resolved lines include that exact line. Used by consumers that start
// from a single ResolvedLine (a definition, the cursor position) and need
// the whole statement around it.
export function findLogicalStatement(
  statements: LogicalStatement[],
  file: string,
  line: number
): LogicalStatement | undefined {
  return statements.find((s) =>
    s.lines.some((l) => l.file === file && l.line === line)
  );
}
