// Basic formatter (F5) — deliberately narrow in scope. There's no
// authoritative gessTabs style guide to formalize against, and the two
// "mechanical wins" the TODO item itself floated (aligning "=" in option
// lists, wrapping long TABLEFORMAT/CELLELEMENTS flag lists) are both
// genuinely ambiguous to get right without risking silently reformatting
// a real production script in a way its author didn't want. Rather than
// guess, this only does changes that are safe regardless of a script's
// own style: trim trailing whitespace, collapse runs of 2+ blank lines
// down to 1, and reindent based on #MACRO/#ENDMACRO and #IFDEF-family/
// #END nesting depth (reusing the same directive recognition as
// src/foldingRanges.ts) — the one structural concept this language has
// that maps unambiguously to indentation. Statement content itself
// (TABLE/CELLELEMENTS/etc. bodies, comments) is left completely
// untouched beyond trailing-whitespace trimming.

export interface FormatOptions {
  indentUnit?: string;
}

const macroStartRe = /^\s*#macro\s+#\S+\s*\(/i;
const macroEndRe = /^\s*#(?:endmacro|macroend)\b/i;
const conditionalStartRe =
  /^\s*#(?:ifdef|ifndef|ifempty|ifnempty|ifexist|ifnexist|ifnexists)\b/i;
const conditionalElseRe = /^\s*#else\b/i;
const conditionalEndRe = /^\s*#end\b/i;

// `isCodeLine(lineIndex)` lets a caller exclude a line whose directive-
// looking text is actually inside a comment, same reasoning as
// src/foldingRanges.ts. A comment/string line is trailing-whitespace
// trimmed like any other line, but its own indentation is left untouched
// rather than guessed at.
export function formatLines(
  lines: string[],
  isCodeLine: (lineIndex: number) => boolean = () => true,
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

    if (!isCodeLine(i)) {
      result.push(trimmedEnd);
      return;
    }

    const content = trimmedEnd.replace(/^\s+/, '');
    const isEnd = macroEndRe.test(content) || conditionalEndRe.test(content);
    const isElse = conditionalElseRe.test(content);
    const lineDepth = isEnd || isElse ? Math.max(depth - 1, 0) : depth;

    result.push(indentUnit.repeat(lineDepth) + content);

    if (macroStartRe.test(content) || conditionalStartRe.test(content)) {
      depth += 1;
    } else if (isEnd) {
      depth = Math.max(depth - 1, 0);
    }
  });

  return result;
}
