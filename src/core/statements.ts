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

  const endStatement = (terminated: boolean) => {
    flush(pieces, terminated, out);
    pieces = [];
    inString = null;
  };

  for (let i = 0; i < order.length; i++) {
    const rl = order[i];

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
      if (ch === ';') {
        pieces.push({ line: rl, text: text.slice(segStart, c + 1) });
        endStatement(true);
        segStart = c + 1;
      }
    }
    if (segStart < text.length) {
      pieces.push({ line: rl, text: text.slice(segStart) });
    }
  }

  endStatement(false);
  return out;
}
