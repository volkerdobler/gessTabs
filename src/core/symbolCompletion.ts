// Pure logic for the F1 autocomplete item's variable/table-name half —
// kept vscode-free (unlike src/providers/completionProviders.ts, its thin
// wiring counterpart) so it can be unit-tested directly, same split as
// src/core/macroExpansion.ts/src/providers/macroProviders.ts.
//
// Reuses src/core/semanticTokens.ts's collectSemanticTokens to find
// variable/table NAME tokens — the exact same "which lines define a
// variable" regex-based recognition the document/workspace symbol
// providers and semantic highlighting already share — rather than a
// third reimplementation of that matching.

import { collectSemanticTokens } from './semanticTokens';

const alwaysNotInComment = () => true;

// gessTabs has no forward references: a variable/table name is only ever
// a valid completion once it has already been defined earlier in the
// resolved (INCLUDE/#ifdef-aware) program order relative to the cursor —
// mirrors symbolIndex.ts's findDefinitionLine backward-scan rule.
export function collectDefinedNamesBefore(
  orderTexts: string[],
  beforeLine: number
): string[] {
  const tokens = collectSemanticTokens(orderTexts, alwaysNotInComment);
  const names = new Set<string>();
  tokens.forEach((t) => {
    if (t.type !== 'variable' || t.line >= beforeLine) return;
    names.add(orderTexts[t.line].substr(t.startChar, t.length));
  });
  return Array.from(names);
}
