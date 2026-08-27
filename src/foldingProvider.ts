// Thin vscode wiring for src/foldingRanges.ts — same "pure logic module +
// thin provider" split as src/macroExpansion.ts/src/macroProviders.ts.

import * as vscode from 'vscode';
import { Scope } from './scope';
import { findFoldRanges } from './foldingRanges';
import { printDebugMessage } from './workspaceFiles';

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

      const isCodeLine = (i: number): boolean => {
        const firstNonWs = lines[i].search(/\S/);
        return firstNonWs === -1 || scope.isNotInComment(i, firstNonWs);
      };

      return findFoldRanges(lines, isCodeLine).map(
        (r) => new vscode.FoldingRange(r.startLine, r.endLine)
      );
    } catch (e) {
      printDebugMessage(`gesstabs: folding failed: ${e}`);
      return [];
    }
  }
}
