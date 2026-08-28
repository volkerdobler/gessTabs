// Thin vscode wiring for src/formatter.ts — same "pure logic module +
// thin provider" split as src/macroExpansion.ts/src/macroProviders.ts.

import * as vscode from 'vscode';
import { Scope } from './scope';
import { formatLines } from './formatter';
import { printDebugMessage } from './workspaceFiles';

export class GesstabsFormattingProvider
  implements vscode.DocumentFormattingEditProvider
{
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    try {
      const scope = new Scope(document);
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
