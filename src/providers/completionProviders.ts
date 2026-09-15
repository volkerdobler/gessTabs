// Thin vscode wiring for the F1 autocomplete item: suggests variable/
// table names already defined earlier in the resolved program order (see
// src/symbolCompletion.ts for that pure logic), and macro names with
// their declared parameter lists. Registered alongside (not merged with)
// GesstabsKeywordCompletionProvider — vscode merges completion results
// from every registered provider for a language, and this one needs an
// async workspace resolve while the keyword list is free, so keeping them
// separate avoids paying that cost for every keystroke when only the
// static list is needed.

import * as vscode from 'vscode';
import { buildWorkspaceIndex } from '../core/symbolIndex';
import { buildVariableModel } from '../core/variableModel';
import { collectCompletionNames } from '../core/symbolCompletion';
import { findMacroDefinitions } from '../core/macroExpansion';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  hashPrefixRangeAt,
} from '../util/workspaceFiles';
import * as logger from '../util/logger';
import { autocompleteEnabled } from '../util/config';

export class GesstabsSymbolCompletionProvider
  implements vscode.CompletionItemProvider
{
  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.CompletionItem[]> {
    try {
      if (!autocompleteEnabled()) {
        return [];
      }

      const fileNames = await findWorkspaceFiles(document);
      const index = buildWorkspaceIndex(
        fileNames,
        makeWorkspaceReader(document)
      );
      if (token && token.isCancellationRequested) return [];

      const hashRange = hashPrefixRangeAt(document, position);

      // A bare variable name is never valid right after "#" (only a macro
      // call or a "#" keyword can follow it) — skip building these
      // entirely rather than rely on vscode's own fuzzy filter to exclude
      // them via the explicit range/filterText below.
      const currentFile = normalizePath(document.uri.fsPath);
      const variableItems = hashRange
        ? []
        : collectCompletionNames(
            buildVariableModel(index),
            currentFile,
            position.line
          ).map(
            (name) =>
              new vscode.CompletionItem(
                name,
                vscode.CompletionItemKind.Variable
              )
          );

      const macroItems = findMacroDefinitions(index.order).map((def) => {
        const label = `#${def.name}`;
        const item = new vscode.CompletionItem(
          label,
          vscode.CompletionItemKind.Function
        );
        item.detail = `#${def.name}(${def.params
          .map((p) => `&${p}`)
          .join(' ')})`;
        if (def.params.length > 0) {
          item.insertText = new vscode.SnippetString(
            `#${def.name}(${def.params
              .map((p, i) => `\${${i + 1}:${p}}`)
              .join(' ')})`
          );
        }
        if (hashRange) {
          item.range = hashRange;
          item.filterText = label;
        }
        return item;
      });

      return [...variableItems, ...macroItems];
    } catch (e) {
      logger.error(`gesstabs: symbol completion failed: ${e}`);
      return [];
    }
  }
}
