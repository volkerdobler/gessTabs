// "What is this variable" hover: for a plain identifier under the cursor,
// shows its declaration line (when the script actually defines it) and,
// optionally, the VARTITLE / VARTEXT / VALUELABELS statements that annotate
// it. A separate HoverProvider from the macro / keyword / effective-
// elements ones (vscode merges every registered provider's result) since
// it's an unrelated concern.
//
// Thin vscode wiring only — the annotation matching lives in
// src/core/variableInfo.ts (pure, unit-tested); the declaration lookup
// reuses src/core/symbolIndex.ts's findDefinitionLine, the same one
// go-to-definition uses, so the two never disagree.

import * as vscode from 'vscode';
import * as path from 'path';
import { Scope } from '../core/scope';
import { constVarName } from '../core/regex';
import { buildWorkspaceIndex, findDefinitionLine } from '../core/symbolIndex';
import {
  findVariableAnnotations,
  collectStatement,
} from '../core/variableInfo';
import { keywordData } from '../keywords/keywordData';
import { keywordLookupKey } from '../keywords/keywordDatabaseTypes';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from '../util/workspaceFiles';

const keywordNames = new Set(keywordData.map((k) => keywordLookupKey(k.name)));

// `basename:line` rendered as a link that opens that file at that line.
// Uses the `vscode.open` command (needs the MarkdownString's `isTrusted`
// allow-list, set on the hover) so the line selection is honoured — a
// bare `file:` link doesn't reliably jump to the line.
function jumpLink(file: string, line: number): string {
  const args = encodeURIComponent(
    JSON.stringify([
      vscode.Uri.file(file).toString(),
      {
        selection: {
          start: { line, character: 0 },
          end: { line, character: 0 },
        },
      },
    ])
  );
  return `[${path.basename(file)}:${line + 1}](command:vscode.open?${args})`;
}

export class GesstabsVariableHoverProvider implements vscode.HoverProvider {
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('hover.enabled', true) === false) return null;
      if (config.get<boolean>('hover.variables', true) === false) return null;

      const scope = new Scope(document);
      if (!scope.isNotInComment(position.line, position.character)) {
        return null;
      }

      const wordRange = document.getWordRangeAtPosition(
        position,
        new RegExp(constVarName, 'i')
      );
      if (!wordRange) return null;
      const word = document.getText(wordRange).replace(/["']/g, '');
      if (!word || word.startsWith('#')) return null;

      // A token written `#name` or `&name` is a macro / #EXPAND reference
      // or a macro parameter — not a variable. vscode's word range (and
      // `constVarName`) never includes the leading '#'/'&', so check the
      // character right before it, the same way keywordLookupKeyAt does.
      const lineText = document.lineAt(position.line).text;
      const charBefore =
        wordRange.start.character > 0
          ? lineText[wordRange.start.character - 1]
          : '';
      if (charBefore === '#' || charBefore === '&') return null;

      // A bare GESStabs keyword under the cursor is the keyword hover's
      // job. Bail before the (workspace-wide) index build — hovers fire
      // often, and a variable deliberately named exactly like a keyword is
      // rare enough not to pay that cost on every keyword hover.
      if (keywordNames.has(word.toLowerCase())) return null;

      const fileNames = await findWorkspaceFiles(document);
      const index = buildWorkspaceIndex(
        fileNames,
        makeWorkspaceReader(document),
        { conditionalsAllActive: true }
      );
      if (token && token.isCancellationRequested) return null;

      const currentFile = normalizePath(document.uri.fsPath);
      // Position-aware first (no-forward-reference, matches Go to
      // Definition), then a position-independent fallback so hovering the
      // variable *on* its own declaration line — which the backward scan
      // excludes — still resolves. `-1` isn't a real line, so
      // findDefinitionLine searches the whole resolved order.
      const def =
        findDefinitionLine(index, currentFile, position.line, word) ??
        findDefinitionLine(index, currentFile, -1, word);

      const annotationsEnabled =
        config.get<boolean>('hover.variableAnnotations', true) !== false;
      const annotations = annotationsEnabled
        ? findVariableAnnotations(index.order, word, (rl, searchIndex) => {
            const s = index.scopes.get(rl.file);
            return !s || s.isNotInComment(rl.line, searchIndex);
          })
        : [];

      // Nothing concrete to say — stay quiet rather than show an empty card.
      if (!def && annotations.length === 0) return null;

      // One header, then the raw statements (each self-identifying via its
      // own `VARTITLE …`/`VALUELABELS …` leading keyword — no separate
      // sub-headings) followed by a jump link. Each statement is gathered
      // whole, start line through the terminating `;`, so a multi-line
      // VALUELABELS list is shown in full rather than just its first line.
      const md = new vscode.MarkdownString();
      md.isTrusted = { enabledCommands: ['vscode.open'] };
      md.appendMarkdown(`**VARIABLE** \`${word}\`\n`);

      if (def) {
        md.appendCodeblock(
          collectStatement(index.order, def.file, def.line) || def.text.trim(),
          'gesstabs'
        );
        md.appendMarkdown(`\n${jumpLink(def.file, def.line)}\n`);
      } else {
        md.appendMarkdown(
          '\n_not declared in the script — probably a dataset variable_\n'
        );
      }

      annotations.forEach((a) => {
        md.appendCodeblock(a.statement, 'gesstabs');
        md.appendMarkdown(`\n${jumpLink(a.file, a.line)}\n`);
      });

      return new vscode.Hover(md, wordRange);
    } catch (e) {
      printDebugMessage(`gesstabs: variable hover failed: ${e}`);
      return null;
    }
  }
}
