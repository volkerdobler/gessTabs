// Thin vscode wiring for src/tableElements.ts — same "pure logic module +
// thin provider" split as src/macroExpansion.ts/src/macroProviders.ts.
// A separate HoverProvider from GesstabsMacroHoverProvider (vscode merges
// results from every registered hover provider for a language), since
// this is an unrelated concern.

import * as vscode from 'vscode';
import * as path from 'path';
import { Scope } from './scope';
import { buildWorkspaceIndex } from './symbolIndex';
import {
  findEffectiveElements,
  extractElementsValue,
  isTableOrOverviewStatement,
} from './tableElements';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from './workspaceFiles';

export class GesstabsEffectiveElementsHoverProvider
  implements vscode.HoverProvider
{
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('hover.enabled', true) === false) return null;
      if (config.get<boolean>('hover.effectiveElements', true) === false) {
        return null;
      }

      const scope = new Scope(document);
      if (!scope.isNotInComment(position.line, position.character)) {
        return null;
      }

      const lineText = document.lineAt(position.line).text;
      if (!isTableOrOverviewStatement(lineText)) return null;

      const fileNames = await findWorkspaceFiles(document);
      const index = buildWorkspaceIndex(
        fileNames,
        makeWorkspaceReader(document)
      );
      if (token && token.isCancellationRequested) return null;

      const currentFile = normalizePath(document.uri.fsPath);
      const { cellElements, frameElements } = findEffectiveElements(
        index.order,
        currentFile,
        position.line
      );

      const md = new vscode.MarkdownString();
      md.appendMarkdown('**Effective at this statement:**\n\n');

      if (cellElements) {
        const value = extractElementsValue(cellElements.text, 'cellelements');
        md.appendMarkdown(
          `- \`CELLELEMENTS\`: \`${
            value || '(none)'
          }\` — set at ${path.basename(cellElements.file)}:${
            cellElements.line + 1
          }\n`
        );
      } else {
        md.appendMarkdown(
          '- `CELLELEMENTS`: not explicitly set — compiler default `ABSOLUTE`\n'
        );
      }

      if (frameElements) {
        const value = extractElementsValue(frameElements.text, 'frameelements');
        md.appendMarkdown(
          `- \`FRAMEELEMENTS\`: \`${
            value || '(none)'
          }\` — set at ${path.basename(frameElements.file)}:${
            frameElements.line + 1
          }\n`
        );
      } else {
        md.appendMarkdown(
          '- `FRAMEELEMENTS`: not explicitly set — compiler default `ABSROW`\n'
        );
      }

      return new vscode.Hover(md);
    } catch (e) {
      printDebugMessage(`gesstabs: effective-elements hover failed: ${e}`);
      return null;
    }
  }
}
