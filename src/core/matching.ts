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
// Whether a *quoted* occurrence of `word` on this line sits in a position
// gessTabs actually accepts a quoted variable name — a declaration's own
// varlist, an annotation statement's (VARTITLE/VARTEXT/VALUELABELS and
// synonyms) own varlist, or a TABLE head/axis. Used by the variable hover
// to gate showing anything for a quoted token: unlike lineMatchesUsage,
// this deliberately excludes usageRe, which matches `word` as a bare
// substring anywhere on the line regardless of quoting — exactly what
// would also match arbitrary quoted label/title *text* that happens to
// read the same as a real variable name (e.g. `VALUELABELS status = 1
// "region";`, where "region" is also a real variable elsewhere; hovering
// that label text must not show region's declaration). A bare,
// non-quoted `word` is always a genuine reference in this grammar — free
// text must be quoted — so callers only need this check for quoted
// tokens.
export function lineHasQuotedVariableReference(
  lineText: string,
  word: string,
  isNotInComment: IsNotInComment
): boolean {
  const singleVarRegExp = singleVarDefRe(word);
  const multiVarDefRegExp = multiVarDefRe(word);
  const multiVarRegExp = multiVarRe(word);
  const computeRegExp = computeDefRe(word);
  const tableHeadRegExp = tableHeadRe(word);
  const tableAxisRegExp = tableAxisRe(word);

  return (
    isNotInComment(lineText.search(singleVarRegExp)) ||
    isNotInComment(lineText.search(multiVarDefRegExp)) ||
    isNotInComment(lineText.search(multiVarRegExp)) ||
    isNotInComment(lineText.search(computeRegExp)) ||
    isNotInComment(lineText.search(tableHeadRegExp)) ||
    isNotInComment(lineText.search(tableAxisRegExp))
  );
}

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
