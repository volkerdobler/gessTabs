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
// Only the standalone "CELLELEMENTS = ...;" assignment form is
// recognized here, not the inline per-table "CELLELEMENTS( ... )" clause
// embedded within a TABLE/OVERCODE statement (e.g. `table = ... by ...
// cellelements( absolute );`) — that form doesn't change the *global*
// default the way the standalone assignment does, so it's out of scope
// for "what's in effect here".

import { ResolvedLine } from './includeGraph';

const tableOrOverviewStatementRe = /\b(table|overview|xoverview)\b[^=]*=/i;
const cellElementsAssignmentRe = /^\s*cellelements\s*=\s*([^;]*);?/i;
const frameElementsAssignmentRe = /^\s*frameelements\s*=\s*([^;]*);?/i;

export function isTableOrOverviewStatement(lineText: string): boolean {
  return tableOrOverviewStatementRe.test(lineText);
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
