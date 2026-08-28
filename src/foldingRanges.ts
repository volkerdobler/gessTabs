// Code folding (F5) for #MACRO/#ENDMACRO and the #IFDEF-family/#END
// blocks — the generic "// <region>"/"// <endregion>" markers in
// language-configuration.json don't recognize these. Pure, line-based,
// and deliberately independent of the full include-graph machinery
// (F0/F3): folding is a per-document, per-editor concern, not a
// program-order one, so there's no need to resolve INCLUDEs or #ifdef
// activity to decide what folds — even an inactive branch should still
// fold in the editor showing it.
//
// Directive recognition is shared with src/diagnostics.ts / formatter.ts
// via src/directives.ts (which also handles multiple directives on one
// line — a single-line `#ifdef X … #end` simply produces no fold range,
// since start and end are the same line).

import { scanBlockDirectives } from './directives';

export interface FoldRange {
  startLine: number;
  endLine: number;
  kind: 'macro' | 'conditional';
}

// `isCodeLine(lineIndex)` lets a caller exclude a line whose directive-
// looking text is actually inside a comment (e.g. an old, commented-out
// "#MACRO"/"#ENDMACRO" fragment) — the exact real-world bug already fixed
// once for findMacroDefinitions (see src/includeGraph.ts's blankComments)
// and worth guarding against here too, since a stray commented directive
// would otherwise throw off fold nesting for everything after it.
export function findFoldRanges(
  lines: string[],
  isCodeLine: (lineIndex: number) => boolean = () => true
): FoldRange[] {
  const ranges: FoldRange[] = [];
  const conditionalStack: number[] = [];
  // A #MACRO body can't legally contain another #MACRO (see
  // macroExpansion.ts) — a single open-start slot mirrors that.
  let macroStart: number | undefined;

  lines.forEach((text, i) => {
    if (!isCodeLine(i)) return;

    scanBlockDirectives(text).forEach((d) => {
      if (d.kind === 'conditional-start') {
        conditionalStack.push(i);
      } else if (d.kind === 'conditional-end') {
        const start = conditionalStack.pop();
        if (start !== undefined && i > start) {
          ranges.push({ startLine: start, endLine: i, kind: 'conditional' });
        }
      } else if (d.kind === 'macro-start') {
        if (macroStart === undefined) macroStart = i;
      } else if (d.kind === 'macro-end' && macroStart !== undefined) {
        if (i > macroStart) {
          ranges.push({ startLine: macroStart, endLine: i, kind: 'macro' });
        }
        macroStart = undefined;
      }
    });
  });

  return ranges;
}
