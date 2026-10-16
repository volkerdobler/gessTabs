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
//
// Conditionals and IFBLOCKs fold per branch, like #if/#else/#endif in C/C++
// or if/else in brace languages: `#ifdef … #else` and `#else … #end` are
// two separate ranges, so folding either branch keeps the #else line
// visible. VS Code keeps only one range per start line, so a range for the
// whole construct can't coexist with the first branch's; folding both
// branches leaves just the #ifdef/#else/#end lines. Each branch ends on the
// line before its #else/#end, so the closing line stays visible (as a
// closing brace does).

import { scanBlockDirectives } from './directives';

export type BlockKind = 'macro' | 'conditional' | 'export' | 'block' | 'filter';

export interface FoldRange {
  startLine: number;
  endLine: number;
  kind: BlockKind;
}

// One matched opener/closer pair, e.g. #ifdef…#end. `elseLines` lists the
// #else / ELSEBLOCK lines splitting it into branches (conditionals and
// IFBLOCKs only). Also used by "go to matching directive"
// (matchingDirective.ts), which needs the real closer line — a fold range
// ends one line earlier.
export interface BlockPair {
  startLine: number;
  endLine: number;
  kind: BlockKind;
  elseLines: number[];
}

const ifOrWhileBlockRe = /^\s*(?:ifblock|whileblock)\b/i;
const endblockRe = /^\s*endblock\b/i;
const elseblockRe = /^\s*elseblock\b/i;
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
// stray one would otherwise throw off nesting for everything after it.
// Defaults to "no comments anywhere". A pair whose opener and closer sit on
// the same line (`#ifnempty "&x" &x #else 1:99 #end`) is left out.
export function findBlockPairs(
  lines: string[],
  isNotInComment: (line: number, char: number) => boolean = () => true
): BlockPair[] {
  const pairs: BlockPair[] = [];
  interface Open {
    line: number;
    elseLines: number[];
  }
  const close = (open: Open | undefined, i: number, kind: BlockKind) => {
    if (open && i > open.line) {
      pairs.push({
        startLine: open.line,
        endLine: i,
        kind,
        elseLines: open.elseLines.filter((l) => l > open.line && l < i),
      });
    }
  };
  const addElse = (stack: Open[], i: number) => {
    if (stack.length > 0) stack[stack.length - 1].elseLines.push(i);
  };
  const conditionalStack: Open[] = [];
  // A #MACRO body *can* legally contain another #MACRO (Makros page:
  // "Man kann ein Macro auch innerhalb eines Macros definieren …
  // funktioniert rekursiv") — track opens on a stack and pair each
  // #ENDMACRO with the nearest still-open #MACRO, like the conditionals.
  const macroStack: Open[] = [];
  const exportStack: Open[] = [];

  lines.forEach((text, i) => {
    scanBlockDirectives(text, (col) => isNotInComment(i, col)).forEach((d) => {
      if (d.kind === 'conditional-start') {
        conditionalStack.push({ line: i, elseLines: [] });
      } else if (d.kind === 'conditional-else') {
        addElse(conditionalStack, i);
      } else if (d.kind === 'conditional-end') {
        close(conditionalStack.pop(), i, 'conditional');
      } else if (d.kind === 'macro-start') {
        macroStack.push({ line: i, elseLines: [] });
      } else if (d.kind === 'macro-end') {
        close(macroStack.pop(), i, 'macro');
      } else if (d.kind === 'export-start') {
        exportStack.push({ line: i, elseLines: [] });
      } else if (d.kind === 'export-end') {
        close(exportStack.pop(), i, 'export');
      }
    });
  });

  // --- runtime blocks: IFBLOCK/WHILEBLOCK…ENDBLOCK, SETFILTER…ENDFILTER --
  const blockStack: Open[] = [];
  const filterStack: (Open & { name?: string })[] = [];

  lines.forEach((lineText, i) => {
    const start = lineText.search(/\S/);
    if (start === -1) return;
    if (!isNotInComment(i, start)) return;

    if (ifOrWhileBlockRe.test(lineText)) {
      blockStack.push({ line: i, elseLines: [] });
      return;
    }
    if (elseblockRe.test(lineText)) {
      addElse(blockStack, i);
      return;
    }
    if (endblockRe.test(lineText)) {
      close(blockStack.pop(), i, 'block');
      return;
    }
    if (setfilterStartRe.test(lineText)) {
      const name = lineText.match(setfilterNameRe)?.[1];
      filterStack.push({ line: i, elseLines: [], name });
      return;
    }
    if (endfilterStartRe.test(lineText)) {
      const name = lineText.match(endfilterNameRe)?.[1];
      if (filterStack.length === 0) return;
      if (!name) {
        close(filterStack.pop(), i, 'filter');
        return;
      }
      const matchIdx = [...filterStack]
        .reverse()
        .findIndex((f) => f.name === name);
      if (matchIdx === -1) return;
      // Pop every frame down to and including the matching one, each
      // closed by this same ENDFILTER line.
      filterStack
        .splice(filterStack.length - 1 - matchIdx)
        .forEach((frame) => close(frame, i, 'filter'));
    }
  });

  return pairs;
}

// Conditionals and IFBLOCKs fold per branch, ending on the line before the
// next #else/ELSEBLOCK or the closer (see the file header). #MACRO keeps
// its #ENDMACRO/#MACROEND visible the same way (one branch, no #else).
// #STARTEXPORT and SETFILTER blocks still fold as one range including
// their closer. A branch that would hide no line yields no range.
export function findFoldRanges(
  lines: string[],
  isNotInComment: (line: number, char: number) => boolean = () => true
): FoldRange[] {
  const ranges: FoldRange[] = [];
  findBlockPairs(lines, isNotInComment).forEach((pair) => {
    const { kind } = pair;
    if (kind === 'export' || kind === 'filter') {
      ranges.push({ startLine: pair.startLine, endLine: pair.endLine, kind });
      return;
    }
    const bounds = [pair.startLine, ...pair.elseLines, pair.endLine];
    for (let b = 0; b < bounds.length - 1; b++) {
      const endLine = bounds[b + 1] - 1;
      if (endLine > bounds[b]) {
        ranges.push({ startLine: bounds[b], endLine, kind });
      }
    }
  });
  return ranges;
}
