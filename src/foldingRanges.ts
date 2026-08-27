// Code folding (F5) for #MACRO/#ENDMACRO and the #IFDEF-family/#END
// blocks — the generic "// <region>"/"// <endregion>" markers in
// language-configuration.json don't recognize these. Pure, line-based,
// and deliberately independent of the full include-graph machinery
// (F0/F3): folding is a per-document, per-editor concern, not a
// program-order one, so there's no need to resolve INCLUDEs or #ifdef
// activity to decide what folds — even an inactive branch should still
// fold in the editor showing it.

export interface FoldRange {
  startLine: number;
  endLine: number;
  kind: 'macro' | 'conditional';
}

const macroStartRe = /^\s*#macro\s+#\S+\s*\(/i;
const macroEndRe = /^\s*#(?:endmacro|macroend)\b/i;
const conditionalStartRe =
  /^\s*#(?:ifdef|ifndef|ifempty|ifnempty|ifexist|ifnexist|ifnexists)\b/i;
const conditionalEndRe = /^\s*#end\b/i;

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

    if (conditionalStartRe.test(text)) {
      conditionalStack.push(i);
      return;
    }
    if (conditionalEndRe.test(text)) {
      const start = conditionalStack.pop();
      if (start !== undefined && i > start) {
        ranges.push({ startLine: start, endLine: i, kind: 'conditional' });
      }
      return;
    }
    if (macroStart === undefined && macroStartRe.test(text)) {
      macroStart = i;
      return;
    }
    if (macroStart !== undefined && macroEndRe.test(text)) {
      if (i > macroStart) {
        ranges.push({ startLine: macroStart, endLine: i, kind: 'macro' });
      }
      macroStart = undefined;
    }
  });

  return ranges;
}
