// Thin vscode wiring for src/core/tableElements.ts — same "pure logic
// module + thin provider" split as
// src/core/macroExpansion.ts/src/providers/macroProviders.ts.
// A separate HoverProvider from GesstabsMacroHoverProvider (vscode merges
// results from every registered hover provider for a language), since
// this is an unrelated concern.

import * as vscode from 'vscode';
import * as path from 'path';
import { getCachedScope } from '../core/scope';
import { buildWorkspaceIndex } from '../core/symbolIndex';
import {
  findEffectiveElements,
  extractElementsValue,
  isTableOrOverviewStatement,
  isTableOrOverviewKeyword,
} from '../core/tableElements';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from '../util/workspaceFiles';
import { hoverEnabled, hoverShows } from '../util/config';

export class GesstabsEffectiveElementsHoverProvider
  implements vscode.HoverProvider
{
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    try {
      if (!hoverEnabled()) return null;
      if (!hoverShows('tableDefaults')) return null;

      // The TABLE/OVERVIEW/XOVERVIEW statement keyword this hover reports
      // on is always a bare code token — never legitimately written inside
      // a string literal — so both comment AND string scope are excluded
      // (isNormalScope).
      const scope = getCachedScope(document);
      if (!scope.isNormalScope(position.line, position.character)) {
        return null;
      }

      const lineText = document.lineAt(position.line).text;
      if (!isTableOrOverviewStatement(lineText)) return null;

      // Only when the cursor is actually on the statement keyword itself.
      // Hovering a variable or an `#EXPAND` reference that happens to sit
      // on the same `TABLE …`/`OVERVIEW …` line must not also show the
      // effective CELLELEMENTS/FRAMEELEMENTS — that only makes sense for
      // the TABLE/OVERVIEW statement as a whole.
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) return null;
      if (!isTableOrOverviewKeyword(document.getText(wordRange))) return null;

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
      md.appendMarkdown('**EFFECTIVE ELEMENTS** — at this statement\n\n');

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

      return new vscode.Hover(md, wordRange);
    } catch (e) {
      printDebugMessage(`gesstabs: effective-elements hover failed: ${e}`);
      return null;
    }
  }
}
