// Thin vscode wiring for src/core/semanticTokens.ts — same "pure logic module +
// thin provider" split as src/core/macroExpansion.ts/./macroProviders.ts.

import * as vscode from 'vscode';
import { getCachedScope } from '../core/scope';
import {
  collectModelSemanticTokens,
  SemanticTokenType,
} from '../core/semanticTokens';
import * as logger from '../util/logger';

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
      const scope = getCachedScope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        lines.push(document.lineAt(i).text);
      }

      const tokens = collectModelSemanticTokens(lines, scope);

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
      logger.error(`gesstabs: semantic tokens failed: ${e}`);
    }
    return builder.build();
  }
}
