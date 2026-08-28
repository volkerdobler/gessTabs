// Shared recognition of the block-structuring preprocessor directives —
// #MACRO/#ENDMACRO and the #IFDEF-family/#ELSE/#END — for the three
// per-document, line-based consumers that care about their *nesting*:
// the F2 "unmatched block" diagnostic (src/diagnostics.ts), F5 code
// folding (src/foldingRanges.ts), and the F5 formatter's indent-by-depth
// pass (src/formatter.ts). Each of those used to carry its own
// `^\s*#…`-anchored copy that assumed at most one directive per line and
// bailed out of the line the moment it matched one — which wrongly
// reported `#ifnempty "&x" &x #else 1:99 #end` (a valid single-line
// idiom, common in macro bodies) as an unclosed block, mis-indented
// everything after it, etc. This scans a line for *every* block directive
// on it, left to right, so those single-line forms pair up correctly.
//
// NOT used by src/includeGraph.ts: that resolver interleaves directive
// handling with #define/#undefine/INCLUDE on the same pass and pulls the
// name list out of the rest of an #ifdef line, so adopting this needs a
// bigger rework there — tracked in TODO.md. #ELSE is reported here (the
// formatter needs it) even though it neither opens nor closes a block.

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

// Every block directive on `line`, in source order. Pure; callers decide
// what to do about comments/strings (line-level callers already skip a
// whole comment line; the diagnostic additionally re-checks each hit
// against its character-level comment scope).
export function scanBlockDirectives(line: string): BlockDirective[] {
  const out: BlockDirective[] = [];
  directiveRe.lastIndex = 0;
  let m = directiveRe.exec(line);
  while (m !== null) {
    out.push({ kind: classify(m[0]), index: m.index, text: m[0] });
    // Guard against a zero-length match stalling the loop (can't happen
    // with these alternatives, but cheap insurance).
    if (m.index === directiveRe.lastIndex) directiveRe.lastIndex += 1;
    m = directiveRe.exec(line);
  }
  return out;
}
