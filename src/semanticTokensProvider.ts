// Thin vscode wiring for src/semanticTokens.ts — same "pure logic module +
// thin provider" split as src/macroExpansion.ts/src/macroProviders.ts.

import * as vscode from 'vscode';
import { Scope } from './scope';
import { collectSemanticTokens, SemanticTokenType } from './semanticTokens';
import { printDebugMessage } from './workspaceFiles';

export const gesstabsSemanticTokensLegend = new vscode.SemanticTokensLegend([
  'variable',
  'macro',
] as SemanticTokenType[]);

export class GesstabsSemanticTokensProvider
  implements vscode.DocumentSemanticTokensProvider
{
  public provideDocumentSemanticTokens(
    document: vscode.TextDocument
  ): vscode.SemanticTokens {
    const builder = new vscode.SemanticTokensBuilder(
      gesstabsSemanticTokensLegend
    );
    try {
      const scope = new Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        lines.push(document.lineAt(i).text);
      }

      const tokens = collectSemanticTokens(lines, (line, char) =>
        scope.isNotInComment(line, char)
      );

      // SemanticTokensBuilder requires tokens pushed in increasing
      // line/character order.
      tokens
        .slice()
        .sort((a, b) => a.line - b.line || a.startChar - b.startChar)
        .forEach((t) => {
          builder.push(
            t.line,
            t.startChar,
            t.length,
            gesstabsSemanticTokensLegend.tokenTypes.indexOf(t.type)
          );
        });
    } catch (e) {
      printDebugMessage(`gesstabs: semantic tokens failed: ${e}`);
    }
    return builder.build();
  }
}
