// "Go to matching directive" — the #-block analogue of VS Code's built-in
// bracket-match jump (editor.action.jumpToBracket, Ctrl+Shift+\ / on a
// German layout Ctrl+Shift+^). That command only pairs the bracket
// *characters* declared in language-configuration.json; it has no notion
// of keyword pairs, so #MACRO/#ENDMACRO and the other gessTabs block
// delimiters need their own command.
//
// The pairing is exactly what code folding already computes, so this
// reuses findFoldRanges (nesting-aware, comment-aware) and covers every
// block kind it does: #MACRO/#ENDMACRO, the #IFDEF-family/#END,
// #STARTEXPORT/#ENDEXPORT, IFBLOCK|WHILEBLOCK/ENDBLOCK and
// SETFILTER/ENDFILTER.

import { findFoldRanges } from './foldingRanges';

// The line holding the delimiter that pairs with the one on `cursorLine`
// — its #ENDMACRO for a #MACRO line and vice versa — or undefined when
// `cursorLine` is not a block-delimiter line (the caller then falls back
// to the built-in bracket jump). A line that both closes one block and
// opens the next is resolved as the closer, i.e. the jump goes up to the
// opener of the block the cursor sits at the end of.
export function findMatchingDirectiveLine(
  lines: string[],
  cursorLine: number,
  isNotInComment: (line: number, char: number) => boolean = () => true
): number | undefined {
  const ranges = findFoldRanges(lines, isNotInComment);
  const closes = ranges.find((r) => r.endLine === cursorLine);
  if (closes) return closes.startLine;
  const opens = ranges.find((r) => r.startLine === cursorLine);
  if (opens) return opens.endLine;
  return undefined;
}
