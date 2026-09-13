// Thin vscode wiring for the F1 keyword database (src/keywords/keywordData.ts):
// a hover showing syntax + description for the keyword under the cursor, and
// completion items for every known keyword. Same "pure data/logic + thin
// provider" split as the rest of this codebase's providers.

import * as vscode from 'vscode';
import { getCachedScope } from '../core/scope';
import { keywordData } from '../keywords/keywordData';
import {
  ResolvedKeyword,
  buildResolvedIndex,
  resolveKeywordLanguage,
  keywordLookupKeyAt,
} from '../keywords/keywordDatabaseTypes';
import { printDebugMessage } from '../util/workspaceFiles';
import { hoverEnabled, hoverShows } from '../util/config';

// Picks the effective keyword-doc language from gesstabs.hover.language
// (falling back to vscode.env.language for "auto") and returns an index of
// each keyword flattened to that language, with the other language's doc
// filling any gap — see resolveKeywordLanguage/buildResolvedIndex for the
// reasoning. Rebuilt per call because the setting can change at any time;
// it's a cheap pass over an in-memory array.
function resolvedKeywordIndex(): Map<string, ResolvedKeyword> {
  const config = vscode.workspace.getConfiguration('gesstabs');
  const setting = config.get<string>('hover.language', 'auto');
  const language = resolveKeywordLanguage(
    setting ?? 'auto',
    vscode.env.language
  );
  return buildResolvedIndex(keywordData, language);
}

function renderHover(entry: ResolvedKeyword): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  const title = entry.argsHint ? `${entry.name}${entry.argsHint}` : entry.name;
  // A "**KEYWORD** `name`" header, so every symbol hover leads with the
  // same upper-case category label: KEYWORD here, MACRO / EXPAND in
  // ./macroProviders.ts.
  md.appendMarkdown(`**KEYWORD** \`${title}\`\n`);
  if (entry.syntax) {
    md.appendCodeblock(entry.syntax, 'gesstabs');
  }
  if (entry.description) {
    md.appendMarkdown(`\n${entry.description}`);
  }
  return md;
}

// "Show syntax + description for the keyword under the cursor" — cheapest
// -to-ship, highest-visibility win the F1 TODO item called for once the
// database exists.
export class GesstabsKeywordHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | null {
    try {
      if (!hoverEnabled()) return null;
      if (!hoverShows('keywords')) return null;

      // A keyword is always a bare code token — never legitimately written
      // inside a string literal — so both comment AND string scope are
      // excluded (isNormalScope), unlike the variable hover where a
      // quoted token can be a genuine reference.
      const scope = getCachedScope(document);
      if (!scope.isNormalScope(position.line, position.character)) {
        return null;
      }

      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) return null;
      const word = document.getText(wordRange);
      const lineText = document.lineAt(position.line).text;
      const key = keywordLookupKeyAt(lineText, wordRange.start.character, word);

      const entry = resolvedKeywordIndex().get(key);
      if (!entry) return null;

      return new vscode.Hover(renderHover(entry), wordRange);
    } catch (e) {
      printDebugMessage(`gesstabs: keyword hover failed: ${e}`);
      return null;
    }
  }
}

// Suggests every known gessTabs keyword, with its description as the
// completion item's documentation and its syntax (when known) as the
// detail shown alongside the label.
export class GesstabsKeywordCompletionProvider
  implements vscode.CompletionItemProvider
{
  public provideCompletionItems(): vscode.CompletionItem[] {
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('autocomplete.enabled', true) === false) {
        return [];
      }

      return Array.from(resolvedKeywordIndex().values()).map((entry) => {
        const item = new vscode.CompletionItem(
          entry.name,
          vscode.CompletionItemKind.Keyword
        );
        if (entry.syntax) {
          const [firstLine] = entry.syntax.split('\n');
          item.detail = firstLine;
        }
        if (entry.description) {
          item.documentation = new vscode.MarkdownString(entry.description);
        }
        return item;
      });
    } catch (e) {
      printDebugMessage(`gesstabs: keyword completion failed: ${e}`);
      return [];
    }
  }
}
