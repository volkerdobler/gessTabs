// Thin vscode wiring for src/core/foldingRanges.ts — same "pure logic module +
// thin provider" split as src/core/macroExpansion.ts/./macroProviders.ts.

import * as vscode from 'vscode';
import { Scope } from '../core/scope';
import { findFoldRanges } from '../core/foldingRanges';
import { printDebugMessage } from '../util/workspaceFiles';

export class GesstabsFoldingRangeProvider
  implements vscode.FoldingRangeProvider
{
  public provideFoldingRanges(
    document: vscode.TextDocument
  ): vscode.FoldingRange[] {
    try {
      const scope = new Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        lines.push(document.lineAt(i).text);
      }

      return findFoldRanges(lines, (line, char) =>
        scope.isNotInComment(line, char)
      ).map((r) => new vscode.FoldingRange(r.startLine, r.endLine));
    } catch (e) {
      printDebugMessage(`gesstabs: folding failed: ${e}`);
      return [];
    }
  }
}
