// Shared recognition of the block-structuring preprocessor directives —
// #MACRO/#ENDMACRO and the #IFDEF-family/#ELSE/#END — for every consumer
// that cares about their *nesting*: the F2 "unmatched block" diagnostic
// (src/core/diagnostics.ts), F5 code folding (src/core/foldingRanges.ts), the F5
// formatter's indent-by-depth pass (src/core/formatter.ts), and the
// INCLUDE/#ifdef resolver (src/core/includeGraph.ts — for the conditional
// directives; it still handles #define/#undefine/#ignorecase/INCLUDE with
// its own one-per-line-at-start regexes).
//
// Each used to carry its own `^\s*#…`-anchored copy that assumed at most
// one directive per line and bailed out of the line the moment it matched
// one — which wrongly reported `#ifnempty "&x" &x #else 1:99 #end` (a
// valid single-line idiom, common in macro bodies) as an unclosed block,
// mis-indented everything after it, and — in the resolver — left an
// #ifdef block "open" for the rest of the file, hiding later #MACRO
// definitions. This scans a line for *every* block directive on it, left
// to right, so those single-line forms pair up correctly.
//
// #ELSE is reported (the formatter and the resolver need it) even though
// it neither opens nor closes a block.
//
// Comment/string awareness is per *character*, not per line: `#end // …`
// annotations (and the odd directive keyword mentioned inside a comment
// or string) are common, so a hit is kept only where `isCodeAt` says that
// column is real code. Callers pick their strictness — the resolver uses
// `isNormalScope` (code only); the editor-facing consumers use
// `isNotInComment` (code or string), matching what they already do
// elsewhere.

export type BlockDirectiveKind =
  | 'macro-start'
  | 'macro-end'
  | 'conditional-start'
  | 'conditional-else'
  | 'conditional-end';

export interface BlockDirective {
  kind: BlockDirectiveKind;
  // Column (0-based char offset) of the leading '#', so a caller with
  // character-level comment info can drop a directive sitting in a
  // trailing comment.
  index: number;
  // The matched directive token as written, e.g. '#ifnempty', '#MACRO'.
  text: string;
}

// One alternation, tried left to right at each position:
//  - #macro <#name> (            -> macro-start (same strict shape the
//                                   old macroStartRe required; a bare
//                                   `#macro` with no name/paren is not a
//                                   start, matching prior behaviour)
//  - #endmacro | #macroend       -> macro-end   (before #end, which is a
//                                   prefix of neither but shares '#end…')
//  - #if[n]def | #if[n]empty
//      | #if[n]exist[s]          -> conditional-start
//  - #else                       -> conditional-else
//  - #end                        -> conditional-end
const directiveRe = new RegExp(
  [
    '#macro\\s+#\\S+\\s*\\(',
    '#(?:endmacro|macroend)\\b',
    '#if(?:n?def|n?empty|n?exists?)\\b',
    '#else\\b',
    '#end\\b',
  ].join('|'),
  'gi'
);

function classify(token: string): BlockDirectiveKind {
  const t = token.toLowerCase();
  // #endmacro / #macroend before #macro (both start with "#macro…"),
  // and #endmacro before #end (it starts "#end…").
  if (t.startsWith('#endmacro') || t.startsWith('#macroend'))
    return 'macro-end';
  if (t.startsWith('#macro')) return 'macro-start';
  if (t.startsWith('#else')) return 'conditional-else';
  if (t.startsWith('#end')) return 'conditional-end';
  return 'conditional-start';
}

// Every block directive on `line`, in source order. `isCodeAt(col)` drops
// a hit that isn't real code at that column — a directive token sitting
// in a trailing `// …` comment (e.g. `#end // #ifdef PowerChart`, a very
// common annotation) or a `{ … }` comment span, or inside a string. It
// defaults to "everything is code"; the real callers pass a Scope-backed
// check curried to this line.
export function scanBlockDirectives(
  line: string,
  isCodeAt: (col: number) => boolean = () => true
): BlockDirective[] {
  const out: BlockDirective[] = [];
  directiveRe.lastIndex = 0;
  let m = directiveRe.exec(line);
  while (m !== null) {
    if (isCodeAt(m.index)) {
      out.push({ kind: classify(m[0]), index: m.index, text: m[0] });
    }
    // Guard against a zero-length match stalling the loop (can't happen
    // with these alternatives, but cheap insurance).
    if (m.index === directiveRe.lastIndex) directiveRe.lastIndex += 1;
    m = directiveRe.exec(line);
  }
  return out;
}
