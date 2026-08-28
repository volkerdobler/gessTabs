// Basic formatter (F5) — deliberately narrow in scope. There's no
// authoritative gessTabs style guide to formalize against, and the two
// "mechanical wins" the TODO item itself floated (aligning "=" in option
// lists, wrapping long TABLEFORMAT/CELLELEMENTS flag lists) are both
// genuinely ambiguous to get right without risking silently reformatting
// a real production script in a way its author didn't want. Rather than
// guess, this only does changes that are safe regardless of a script's
// own style: trim trailing whitespace, collapse runs of 2+ blank lines
// down to 1, and reindent based on #MACRO/#ENDMACRO and #IFDEF-family/
// #END nesting depth (directive recognition shared with
// src/foldingRanges.ts / diagnostics.ts via src/directives.ts) — the one
// structural concept this language has that maps unambiguously to
// indentation. Statement content itself (TABLE/CELLELEMENTS/etc. bodies,
// comments) is left completely untouched beyond trailing-whitespace
// trimming.

import { scanBlockDirectives } from './directives';

export interface FormatOptions {
  indentUnit?: string;
}

// `isNotInComment(line, char)` lets a caller exclude directive-looking
// text that's actually inside a comment/string, same reasoning as
// src/foldingRanges.ts (a `#end // #ifdef X` annotation must not count as
// two directives). A line that *starts* inside a comment/string is
// trailing-whitespace trimmed like any other line, but its own
// indentation is left untouched rather than guessed at. Defaults to "no
// comments anywhere".
export function formatLines(
  lines: string[],
  isNotInComment: (line: number, char: number) => boolean = () => true,
  options: FormatOptions = {}
): string[] {
  const indentUnit = options.indentUnit ?? '  ';
  const result: string[] = [];
  let depth = 0;
  let sawBlank = false;

  lines.forEach((rawLine, i) => {
    const trimmedEnd = rawLine.replace(/\s+$/, '');

    if (trimmedEnd.length === 0) {
      if (!sawBlank) result.push('');
      sawBlank = true;
      return;
    }
    sawBlank = false;

    const firstNonWs = trimmedEnd.search(/\S/);
    if (!isNotInComment(i, firstNonWs === -1 ? 0 : firstNonWs)) {
      result.push(trimmedEnd);
      return;
    }

    const indentLen = firstNonWs === -1 ? 0 : firstNonWs;
    const content = trimmedEnd.slice(indentLen);

    // Walk the line's directives once: `delta` is its net effect on
    // nesting depth, `minRunning` the lowest point reached along the way
    // (an #END or #ELSE dedents before the line is printed). A plain line
    // has neither, so it prints at the current depth. A single-line
    // `#ifnempty … #else … #end` nets to 0 and prints where it stands.
    // Columns are mapped back to the raw line for the comment check.
    let delta = 0;
    let minRunning = 0;
    scanBlockDirectives(content, (col) =>
      isNotInComment(i, col + indentLen)
    ).forEach((d) => {
      if (d.kind === 'macro-start' || d.kind === 'conditional-start') {
        delta += 1;
      } else if (d.kind === 'macro-end' || d.kind === 'conditional-end') {
        delta -= 1;
        minRunning = Math.min(minRunning, delta);
      } else if (d.kind === 'conditional-else') {
        minRunning = Math.min(minRunning, delta - 1);
      }
    });

    const lineDepth = Math.max(depth + minRunning, 0);
    result.push(indentUnit.repeat(lineDepth) + content);
    depth = Math.max(depth + delta, 0);
  });

  return result;
}
