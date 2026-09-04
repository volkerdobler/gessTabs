// Pure logic for the F1 autocomplete item's variable/table-name half —
// kept vscode-free (unlike src/providers/completionProviders.ts, its thin
// wiring counterpart) so it can be unit-tested directly, same split as
// src/core/macroExpansion.ts/src/providers/macroProviders.ts.
//
// Built on the variable model (src/core/variableModel.ts): a program
// point's `ProgramPointView.all()` already *is* "every name visible here,
// no forward reference" — exactly what completion needs, natively,
// without a separate regex-based re-scan (the old
// collectSemanticTokens-based version this replaced).

import { VariableModel } from './variableModel';

// gessTabs has no forward references: a variable/table name is only ever
// a valid completion once it has already been defined earlier in the
// resolved (INCLUDE/#ifdef-aware) program order relative to the cursor.
// Queried at `line - 1` (not `line`) — `model.at()` is inclusive of a
// symbol declared *on* the queried line itself (right for hover, which
// wants "resolve what's under the cursor including its own declaration"),
// but completion must not offer a name still being typed on the current
// line as a suggestion for itself. Returns each symbol's first-seen
// display casing, deduplicated by name.
export function collectCompletionNames(
  model: VariableModel,
  file: string,
  line: number
): string[] {
  return model
    .at(file, line - 1)
    .all()
    .map((s) => s.displayName);
}
