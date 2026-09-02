// "What is this variable" hover: for a plain identifier under the cursor,
// shows its declaration line (when the script actually defines it) and,
// optionally, the VARTITLE / VARTEXT / VALUELABELS statements that annotate
// it. Three "don't just echo what's already on screen" rules: hovering the
// variable name at the exact spot it's declared shows no declaration echo
// (see hoveringOwnDeclaration below); hovering it inside one of its own
// VARTITLE/VARTEXT/VALUELABELS (& synonyms) statements shows no hover at
// all unless the variable has a real declaration elsewhere to point to;
// and hovering a COPYTITLE/COPYTEXT/COPYLABELS target name shows only the
// one corresponding annotation copied from the source variable — see
// matchCopyAnnotationTarget. A separate HoverProvider from the macro /
// keyword / effective-elements ones (vscode merges every registered
// provider's result) since it's an unrelated concern.
//
// Thin vscode wiring only — the annotation matching lives in
// src/core/variableInfo.ts (pure, unit-tested); the declaration lookup
// reuses src/core/symbolIndex.ts's findDefinitionLine, the same one
// go-to-definition uses, so the two never disagree.

import * as vscode from 'vscode';
import * as path from 'path';
import { Scope } from '../core/scope';
import { constVarName } from '../core/regex';
import { lineHasQuotedVariableReference } from '../core/matching';
import {
  buildWorkspaceIndex,
  findDefinitionLine,
  findMacroProducedDefinition,
} from '../core/symbolIndex';
import {
  findVariableAnnotations,
  collectStatement,
  isVariableAnnotationStatementLine,
  matchCopyAnnotationTarget,
  IsNotInCommentAt,
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
      const rawWordText = document.getText(wordRange);
      const isQuoted = /^["'][\s\S]*["']$/.test(rawWordText);
      const word = rawWordText.replace(/["']/g, '');
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
      const annotationsEnabled =
        config.get<boolean>('hover.variableAnnotations', true) !== false;
      const isNotInCommentAt: IsNotInCommentAt = (rl, searchIndex) => {
        const s = index.scopes.get(rl.file);
        return !s || s.isNotInComment(rl.line, searchIndex);
      };

      // COPYTITLE/COPYTEXT/COPYLABELS <varlist> = <variable>; doesn't give
      // `word` its own VARTITLE/VARTEXT/VALUELABELS — it aliases it to
      // <variable>'s. Hovering a target name shows only that one copied
      // piece (nothing about `word` itself), so this is handled entirely
      // separately from the declaration/annotation logic below.
      const copyTarget = matchCopyAnnotationTarget(lineText, word);
      if (copyTarget) {
        if (!annotationsEnabled) return null;
        const sourceAnnotations = findVariableAnnotations(
          index.order,
          copyTarget.sourceVar,
          isNotInCommentAt
        ).filter((a) => a.kind === copyTarget.kind);
        if (sourceAnnotations.length === 0) return null;

        const md = new vscode.MarkdownString();
        md.isTrusted = { enabledCommands: ['vscode.open'] };
        md.appendMarkdown(`**VARIABLE** \`${word}\`\n`);
        sourceAnnotations.forEach((a) => {
          md.appendCodeblock(a.statement, 'gesstabs');
          md.appendMarkdown(`\n${jumpLink(a.file, a.line)}\n`);
        });
        return new vscode.Hover(md, wordRange);
      }

      // A hover over a quoted string only makes sense when the string is
      // itself a variable-name reference — never for arbitrary quoted
      // label/title text, even when that text happens to read the same as
      // a real variable name elsewhere in the script (e.g. `VALUELABELS
      // status = 1 "region";`, where "region" is also declared as a real
      // variable — hovering that label text must not show region's
      // declaration). A bare, unquoted word is always a genuine reference
      // in this grammar, so this only gates quoted tokens.
      if (
        isQuoted &&
        !lineHasQuotedVariableReference(lineText, word, (searchIndex) =>
          scope.isNotInComment(position.line, searchIndex)
        )
      ) {
        return null;
      }

      // Position-aware first (no-forward-reference, matches Go to
      // Definition), then a position-independent fallback (`-1` isn't a
      // real line, so findDefinitionLine searches the whole resolved
      // order) to also find a declaration on the very line under the
      // cursor — the backward scan alone excludes the current line.
      const rawDef =
        findDefinitionLine(index, currentFile, position.line, word) ??
        findDefinitionLine(index, currentFile, -1, word);

      // Hovering the variable name at the exact spot it's declared (e.g.
      // `groups foo = ...;`, cursor on `foo`) would just echo that same
      // statement back in the hover — already right there on screen — so
      // treat it as "no declaration to show" rather than repeat it.
      const hoveringOwnDeclaration =
        rawDef !== undefined &&
        rawDef.file === currentFile &&
        rawDef.line === position.line;
      const def = hoveringOwnDeclaration ? undefined : rawDef;

      // No literal declaration — `word` might still be produced by a
      // #MACRO call passing it as the argument for a body statement like
      // `compute &fr = 2;`. Same position-aware-then-whole-index fallback
      // shape as rawDef above.
      const macroDef = def
        ? undefined
        : findMacroProducedDefinition(
            index,
            currentFile,
            position.line,
            word
          ) ?? findMacroProducedDefinition(index, currentFile, -1, word);

      // Hovering the variable name inside one of its own annotation
      // statements (VARTITLE/VARTEXT/VALUELABELS & synonyms, or
      // COPYTITLE/COPYTEXT/COPYLABELS) is only useful when it can point to
      // where the variable is actually declared elsewhere — genuinely new
      // information. With no declaration anywhere in the document, there's
      // nothing left to add beyond what's already on screen.
      if (isVariableAnnotationStatementLine(lineText) && !def && !macroDef) {
        return null;
      }

      const annotations = annotationsEnabled
        ? findVariableAnnotations(index.order, word, isNotInCommentAt).filter(
            (a) => !(a.file === currentFile && a.line === position.line)
          )
        : [];

      // Nothing concrete to say — stay quiet rather than show an empty card.
      if (!def && !macroDef && annotations.length === 0) return null;

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
      } else if (macroDef) {
        md.appendMarkdown(
          `\n_produced by a \`#${macroDef.macro.name}\` macro call — not written literally in the script_\n`
        );
        md.appendCodeblock(macroDef.bodyLine.text.trim(), 'gesstabs');
        md.appendMarkdown(
          `\n${jumpLink(macroDef.bodyLine.file, macroDef.bodyLine.line)}\n`
        );
        md.appendCodeblock(macroDef.callSite.text.trim(), 'gesstabs');
        md.appendMarkdown(
          `\n${jumpLink(macroDef.callSite.file, macroDef.callSite.line)}\n`
        );
      } else if (!hoveringOwnDeclaration) {
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
