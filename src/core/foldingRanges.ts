// Code folding (F5) for #MACRO/#ENDMACRO, #STARTEXPORT/#ENDEXPORT and the
// #IFDEF-family/#END blocks — the generic "// <region>"/"// <endregion>"
// markers in language-configuration.json don't recognize these. Pure,
// line-based, and deliberately independent of the full include-graph
// machinery (F0/F3): folding is a per-document, per-editor concern, not a
// program-order one, so there's no need to resolve INCLUDEs or #ifdef
// activity to decide what folds — even an inactive branch should still
// fold in the editor showing it.
//
// Directive recognition is shared with src/core/diagnostics.ts / formatter.ts
// via src/core/directives.ts (which also handles multiple directives on one
// line — a single-line `#ifdef X … #end` simply produces no fold range,
// since start and end are the same line — and drops a directive token
// sitting in a comment or string).
//
// The runtime block keywords (IFBLOCK/WHILEBLOCK/ENDBLOCK/ELSEBLOCK/
// SETFILTER/ENDFILTER — real statements, not `#`-preprocessor directives)
// fold too, via the same line-anchored regexes
// src/core/diagnostics.ts's checkUnmatchedBlocks uses — NOT the statement
// classifier's own `ClassifiedStatement.block` (design doc P1.1): IFBLOCK/
// WHILEBLOCK/ELSEBLOCK have no terminating `;` in real gessTabs syntax, so
// running them through a `;`-bounded logical-statement pass would merge
// an open with everything up to the next unrelated statement's `;` (see
// diagnostics.ts's own comment on this for the full reasoning).

import { scanBlockDirectives } from './directives';

export interface FoldRange {
  startLine: number;
  endLine: number;
  kind: 'macro' | 'conditional' | 'export' | 'block' | 'filter';
}

const ifOrWhileBlockRe = /^\s*(?:ifblock|whileblock)\b/i;
const endblockRe = /^\s*endblock\b/i;
// `SETFILTER [<filtername>] [TEXT "…"] = <cond>;` — mirrors
// checkUnmatchedBlocks' own name extraction (src/core/diagnostics.ts) so
// a named ENDFILTER's pop-until-match folds every SETFILTER it actually
// closes, not just the innermost one; the name is optional, so a bare
// `SETFILTER TEXT "…" = …;` must not mistake TEXT for the name.
const setfilterStartRe = /^\s*setfilter\b/i;
const setfilterNameRe = /^\s*setfilter\s+(?!text\b)([A-Za-z_]\w*)/i;
const endfilterStartRe = /^\s*endfilter\b/i;
const endfilterNameRe = /^\s*endfilter\s+([A-Za-z_]\w*)/i;

// `isNotInComment(line, char)` lets a caller exclude directive-looking
// text that's actually inside a comment (an old, commented-out
// "#MACRO"/"#ENDMACRO" fragment; a `#end // #ifdef X` annotation) — a
// stray one would otherwise throw off fold nesting for everything after
// it. Defaults to "no comments anywhere".
export function findFoldRanges(
  lines: string[],
  isNotInComment: (line: number, char: number) => boolean = () => true
): FoldRange[] {
  const ranges: FoldRange[] = [];
  const conditionalStack: number[] = [];
  // A #MACRO body *can* legally contain another #MACRO (Makros page:
  // "Man kann ein Macro auch innerhalb eines Macros definieren …
  // funktioniert rekursiv") — track opens on a stack and pair each
  // #ENDMACRO with the nearest still-open #MACRO, like the conditionals.
  const macroStack: number[] = [];
  const exportStack: number[] = [];

  lines.forEach((text, i) => {
    scanBlockDirectives(text, (col) => isNotInComment(i, col)).forEach((d) => {
      if (d.kind === 'conditional-start') {
        conditionalStack.push(i);
      } else if (d.kind === 'conditional-end') {
        const start = conditionalStack.pop();
        if (start !== undefined && i > start) {
          ranges.push({ startLine: start, endLine: i, kind: 'conditional' });
        }
      } else if (d.kind === 'macro-start') {
        macroStack.push(i);
      } else if (d.kind === 'macro-end') {
        const start = macroStack.pop();
        if (start !== undefined && i > start) {
          ranges.push({ startLine: start, endLine: i, kind: 'macro' });
        }
      } else if (d.kind === 'export-start') {
        exportStack.push(i);
      } else if (d.kind === 'export-end') {
        const start = exportStack.pop();
        if (start !== undefined && i > start) {
          ranges.push({ startLine: start, endLine: i, kind: 'export' });
        }
      }
    });
  });

  // --- runtime blocks: IFBLOCK/WHILEBLOCK…ENDBLOCK, SETFILTER…ENDFILTER --
  const blockStack: number[] = [];
  const filterStack: { line: number; name?: string }[] = [];

  lines.forEach((lineText, i) => {
    const start = lineText.search(/\S/);
    if (start === -1) return;
    if (!isNotInComment(i, start)) return;

    if (ifOrWhileBlockRe.test(lineText)) {
      blockStack.push(i);
      return;
    }
    if (endblockRe.test(lineText)) {
      const startLine = blockStack.pop();
      if (startLine !== undefined && i > startLine) {
        ranges.push({ startLine, endLine: i, kind: 'block' });
      }
      return;
    }
    if (setfilterStartRe.test(lineText)) {
      const name = lineText.match(setfilterNameRe)?.[1];
      filterStack.push({ line: i, name });
      return;
    }
    if (endfilterStartRe.test(lineText)) {
      const name = lineText.match(endfilterNameRe)?.[1];
      if (filterStack.length === 0) return;
      if (!name) {
        const frame = filterStack.pop();
        if (frame && i > frame.line) {
          ranges.push({ startLine: frame.line, endLine: i, kind: 'filter' });
        }
        return;
      }
      const matchIdx = [...filterStack]
        .reverse()
        .findIndex((f) => f.name === name);
      if (matchIdx === -1) return;
      // Pop every frame down to and including the matching one, each
      // folding up to this same ENDFILTER line.
      const closed = filterStack.splice(filterStack.length - 1 - matchIdx);
      closed.forEach((frame) => {
        if (i > frame.line) {
          ranges.push({ startLine: frame.line, endLine: i, kind: 'filter' });
        }
      });
    }
  });

  return ranges;
}
