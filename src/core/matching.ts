// Generic "does this regex match on this line, within the given scope?"
// check, extracted from extension.ts so it can be unit-tested without a
// live vscode instance. The line-specific definition/usage/quoted-
// reference matchers that used to live here (lineMatchesDefinition,
// lineMatchesUsage, lineHasQuotedVariableReference — six regex factories
// OR-ed together per line, one of three disagreeing notions of
// "definition" the variable model replaced) are gone: go-to-definition,
// find-references, rename and the variable hover are built on
// src/core/variableModel.ts now (see docs/variable-model-design.md).
// matchInScope survives as a small generic helper — still used directly
// against src/core/regex.ts's factories by GessTabsWorkspaceSymbolProvider
// (extension.ts) and GesstabsDocumentSymbolProvider's macro/#EXPAND scan.

export type IsNotInComment = (searchIndex: number) => boolean;

export function matchInScope(
  lineText: string,
  regExp: RegExp,
  isInScope: (searchIndex: number) => boolean
): RegExpMatchArray | null {
  return isInScope(lineText.search(regExp)) ? lineText.match(regExp) : null;
}
