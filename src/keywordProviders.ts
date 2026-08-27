// Thin vscode wiring for the F1 keyword database
// (src/keywordDatabase.de.ts / src/keywordDatabase.en.ts): a hover
// showing syntax + description for the keyword under the cursor, and
// completion items for every known keyword. Same "pure data/logic + thin
// provider" split as the rest of this codebase's providers.

import * as vscode from 'vscode';
import { Scope } from './scope';
import { keywordDatabase as keywordDatabaseDe } from './keywordDatabase.de';
import { keywordDatabase as keywordDatabaseEn } from './keywordDatabase.en';
import { keywordDatabaseOverridesDe } from './keywordDatabaseOverrides.de';
import { keywordDatabaseOverridesEn } from './keywordDatabaseOverrides.en';
import {
  KeywordEntry,
  applyKeywordOverrides,
  buildIndexWithFallback,
  resolveKeywordLanguage,
  keywordLookupKeyAt,
} from './keywordDatabaseTypes';
import { printDebugMessage } from './workspaceFiles';

// Hand-written corrections/additions/removals
// (src/keywordDatabaseOverrides.<lang>.ts) are merged in here, once per
// language, rather than baked into the generated
// src/keywordDatabase.<lang>.ts files — so re-running the extraction
// script never touches, and never needs to preserve, anything edited by
// hand. This part doesn't depend on the language *setting*, so it's
// computed once at module load; only the fallback combination below
// (which does depend on the setting, and the setting can change at any
// time) is resolved per call.
const mergedDe = applyKeywordOverrides(
  keywordDatabaseDe,
  keywordDatabaseOverridesDe
);
const mergedEn = applyKeywordOverrides(
  keywordDatabaseEn,
  keywordDatabaseOverridesEn
);

// Picks the effective keyword-doc language from gesstabs.hover.language
// (falling back to vscode.env.language for "auto") and returns an index
// with the other language's entries filling in any gap — see
// resolveKeywordLanguage/buildIndexWithFallback for the reasoning.
function resolvedKeywordIndex(): Map<string, KeywordEntry> {
  const config = vscode.workspace.getConfiguration('gesstabs');
  const setting = config.get<string>('hover.language', 'auto');
  const language = resolveKeywordLanguage(
    setting ?? 'auto',
    vscode.env.language
  );
  return language === 'de'
    ? buildIndexWithFallback(mergedDe, mergedEn)
    : buildIndexWithFallback(mergedEn, mergedDe);
}

function renderHover(entry: KeywordEntry): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  const title = entry.argsHint ? `${entry.name}${entry.argsHint}` : entry.name;
  md.appendMarkdown(`**${title}**\n`);
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
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('hover.enabled', true) === false) return null;
      if (config.get<boolean>('hover.keywords', true) === false) return null;

      const scope = new Scope(document);
      if (!scope.isNotInComment(position.line, position.character)) {
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
