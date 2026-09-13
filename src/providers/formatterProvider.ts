// Thin vscode wiring for src/core/formatter.ts — same "pure logic module +
// thin provider" split as src/core/macroExpansion.ts/./macroProviders.ts.

import * as vscode from 'vscode';
import { getCachedScope } from '../core/scope';
import { formatLines } from '../core/formatter';
import { printDebugMessage } from '../util/workspaceFiles';

export class GesstabsFormattingProvider
  implements vscode.DocumentFormattingEditProvider
{
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    try {
      const scope = getCachedScope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        lines.push(document.lineAt(i).text);
      }

      const formatted = formatLines(lines, (line, char) =>
        scope.isNotInComment(line, char)
      );
      if (
        formatted.length === lines.length &&
        formatted.every((l, i) => l === lines[i])
      ) {
        return [];
      }

      const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
      const fullRange = new vscode.Range(
        new vscode.Position(0, 0),
        document.lineAt(document.lineCount - 1).range.end
      );
      return [vscode.TextEdit.replace(fullRange, formatted.join(eol))];
    } catch (e) {
      printDebugMessage(`gesstabs: format failed: ${e}`);
      return [];
    }
  }
}
