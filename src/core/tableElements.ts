// "Effective CELLELEMENTS/FRAMEELEMENTS at this line" (F5): these two
// options act as global defaults for TABLE/OVERVIEW/XOVERVIEW statements,
// persisting until the next same-type standalone assignment rather than
// being scoped to one table — confirmed by the OVERVIEW -> TABLE
// STRUCTURE + TABLE ADD desugaring example (GESStabs_Overview.md:141-162),
// which re-issues its own "CELLELEMENTS = ...;" line before every
// generated TABLE statement precisely because the setting doesn't
// otherwise carry over automatically. Easy to misread when a script isn't
// read strictly top-to-bottom.
//
// Deliberately single-line, like this codebase's other statement regexes
// (computeDefRe, tableHeadRe, ...): "CELLELEMENTS = <values>;" is assumed
// to fit on one line, matching every documented example.
//
// `findEffectiveElements` only recognizes the standalone "CELLELEMENTS =
// ...;" assignment form, not the inline per-table "CELLELEMENTS( ... )"
// taboption clause (e.g. `TABLE CELLELEMENTS( ABSOLUTE ) = a BY b;`) —
// that form doesn't change the *global* default the way the standalone
// assignment does, so it's out of scope for "what's in effect here" (a
// later table with no inline clause of its own still falls back to the
// standalone default, not to some other table's inline one). The inline
// form itself is recognized separately by `extractInlineCellElements`,
// for consumers that specifically need *this table's own* CELLELEMENTS
// (e.g. the CALCULATECOLUMN single-CELLELEMENT diagnostic).

import { ResolvedLine } from './includeGraph';

const tableOrOverviewStatementRe = /\b(table|overview|xoverview)\b[^=]*=/i;
const tableOrOverviewKeywordRe = /^(table|overview|xoverview)$/i;
const cellElementsAssignmentRe = /^\s*cellelements\s*=\s*([^;]*);?/i;
const frameElementsAssignmentRe = /^\s*frameelements\s*=\s*([^;]*);?/i;

export function isTableOrOverviewStatement(lineText: string): boolean {
  return tableOrOverviewStatementRe.test(lineText);
}

// True only for the bare statement keyword itself (`TABLE`, `OVERVIEW`,
// `XOVERVIEW`) — used to gate the effective-elements hover to the keyword
// under the cursor, so hovering a *variable* or an *#EXPAND reference* on
// the same `TABLE …` line no longer also pops the elements hover (that
// information is only meaningful for the statement as a whole, not for an
// operand of it). `TABLE STRUCTURE`/`TABLE ADD` still qualify — the word
// under the cursor there is `TABLE`.
export function isTableOrOverviewKeyword(word: string): boolean {
  return tableOrOverviewKeywordRe.test(word.trim());
}

export function extractElementsValue(
  lineText: string,
  kind: 'cellelements' | 'frameelements'
): string {
  const re =
    kind === 'cellelements'
      ? cellElementsAssignmentRe
      : frameElementsAssignmentRe;
  const m = lineText.match(re);
  return m ? m[1].trim() : '';
}

// The *inline* per-table `CELLELEMENTS( <cellelements> )` taboption clause
// (e.g. `TABLE CELLELEMENTS( ABSOLUTE COLUMNPERCENT ) = a BY b;`) — the one
// form `findEffectiveElements` deliberately does not resolve (see the
// header comment above). Single-line, like every other regex here.
// Returns the lowercased element names, or undefined if this line has no
// such clause.
const inlineCellElementsRe = /\bcellelements\s*\(([^)]*)\)/i;

export function extractInlineCellElements(
  lineText: string
): string[] | undefined {
  const m = lineText.match(inlineCellElementsRe);
  if (!m) return undefined;
  return m[1]
    .split(/[\s,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

export interface EffectiveElements {
  cellElements?: ResolvedLine;
  frameElements?: ResolvedLine;
}

// Scans backward from (fromFile, fromLine) — or the whole order, if that
// position isn't part of it — for the nearest preceding standalone
// CELLELEMENTS/FRAMEELEMENTS assignment, mirroring gessTabs' compile
// order (same backward-scan shape as symbolIndex.ts's findDefinitionLine).
export function findEffectiveElements(
  order: ResolvedLine[],
  fromFile: string,
  fromLine: number
): EffectiveElements {
  const pos = order.findIndex(
    (l) => l.file === fromFile && l.line === fromLine
  );
  const searchSpace = pos === -1 ? order : order.slice(0, pos);
  const result: EffectiveElements = {};

  for (let i = searchSpace.length - 1; i >= 0; i -= 1) {
    const rl = searchSpace[i];
    if (!result.cellElements && cellElementsAssignmentRe.test(rl.text)) {
      result.cellElements = rl;
    }
    if (!result.frameElements && frameElementsAssignmentRe.test(rl.text)) {
      result.frameElements = rl;
    }
    if (result.cellElements && result.frameElements) break;
  }

  return result;
}
