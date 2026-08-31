// Per-line regex matching used to locate definitions/usages of a gessTabs
// word. Extracted from extension.ts so it can be unit-tested without a live
// vscode instance: it takes plain strings and a scope-check callback instead
// of vscode.TextDocument/Scope directly.

import {
  singleVarDefRe,
  multiVarDefRe,
  multiVarRe,
  computeDefRe,
  macroDefRe,
  macroOwnDefRe,
  expandDefRe,
  expandRe,
  tableHeadRe,
  tableAxisRe,
  usageRe,
} from './regex';

export type IsNotInComment = (searchIndex: number) => boolean;

// Shared "does this regex match on this line, within the given scope?"
// check used by the symbol-provider loops in extension.ts: searches once,
// and only re-runs match() if the search hit falls inside the allowed
// scope. Kept here (rather than inline in extension.ts) so it can be
// unit-tested without a live vscode.TextDocument/Scope.
export function matchInScope(
  lineText: string,
  regExp: RegExp,
  isInScope: (searchIndex: number) => boolean
): RegExpMatchArray | null {
  return isInScope(lineText.search(regExp)) ? lineText.match(regExp) : null;
}

// mirrors the definition-only matching used by getDefLocationInDocument:
// a variable, compute, #macro or #expand definition of "word".
export function lineMatchesDefinition(
  lineText: string,
  word: string,
  isNotInComment: IsNotInComment
): boolean {
  const singleVarRegExp = singleVarDefRe(word);
  const multiVarRegExp = multiVarDefRe(word);
  const computeRegExp = computeDefRe(word);
  const macroRegExp = macroDefRe(word);
  const macroOwnRegExp = macroOwnDefRe(word);
  const expandRegExp = expandDefRe(word);

  return (
    isNotInComment(lineText.search(singleVarRegExp)) ||
    isNotInComment(lineText.search(multiVarRegExp)) ||
    isNotInComment(lineText.search(computeRegExp)) ||
    isNotInComment(lineText.search(macroRegExp)) ||
    isNotInComment(lineText.search(macroOwnRegExp)) ||
    isNotInComment(lineText.search(expandRegExp))
  );
}

// mirrors the broader usage matching used by getAllLocationsInDocument:
// every real reference to "word" — its definitions, its use on a table
// head/axis, a `#name` expand reference, and (usageRe) any bare token
// occurrence in a condition, an `IF … THEN <var> = …` assignment or an
// arbitrary expression. The specific factories are still consulted first
// so a line that only matches, say, `multiVarRe` (`text word = …`, where
// usageRe would also fire) is unaffected; usageRe just widens the net to
// the plain-reference lines none of them cover.
export function lineMatchesUsage(
  lineText: string,
  word: string,
  isNotInComment: IsNotInComment
): boolean {
  const singleVarRegExp = singleVarDefRe(word);
  const multiVarRegExp = multiVarRe(word);
  const multiVarDefRegExp = multiVarDefRe(word);
  const computeRegExp = computeDefRe(word);
  const macroDefRegExp = macroDefRe(word);
  const macroOwnRegExp = macroOwnDefRe(word);
  const expandDefRegExp = expandDefRe(word);
  const expandRegExp = expandRe(word);
  const tableHeadRegExp = tableHeadRe(word);
  const tableAxisRegExp = tableAxisRe(word);
  const usageRegExp = usageRe(word);

  return (
    isNotInComment(lineText.search(singleVarRegExp)) ||
    isNotInComment(lineText.search(multiVarRegExp)) ||
    isNotInComment(lineText.search(computeRegExp)) ||
    isNotInComment(lineText.search(macroDefRegExp)) ||
    isNotInComment(lineText.search(macroOwnRegExp)) ||
    isNotInComment(lineText.search(expandDefRegExp)) ||
    isNotInComment(lineText.search(expandRegExp)) ||
    isNotInComment(lineText.search(tableHeadRegExp)) ||
    isNotInComment(lineText.search(tableAxisRegExp)) ||
    isNotInComment(lineText.search(multiVarDefRegExp)) ||
    isNotInComment(lineText.search(usageRegExp))
  );
}
