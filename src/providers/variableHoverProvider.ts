// "What is this variable" hover: for an identifier under the cursor, shows
// its declaration statement (when the script defines it), its kind, and the
// VARTITLE / VARTEXT / VALUELABELS statements that annotate it.
//
// Built on the variable model (src/core/variableModel.ts) — the same
// program-order symbol table go-to-definition / references / rename move
// onto in phase 3 — so "what is a variable / where is it declared / what
// annotates it / is this quoted token a name" all come from one place
// instead of six disagreeing regex paths.
//
// Three "don't just echo what's on screen" rules are preserved:
//   - hovering the name at the exact spot it is declared shows no
//     declaration echo (hoveringOwnDeclaration);
//   - a quoted token is only treated as a variable when it actually sits in
//     a name position of its statement (the model's classifier decides —
//     the manual's rule: a quoted token is a name iff a variable of that
//     name exists here), otherwise it is label / title text and gets no
//     hover;
//   - COPYTITLE/COPYTEXT/COPYLABELS targets show the *source* variable's
//     annotation (the model aliases it onto the target with `copiedFrom`).
//
// A separate HoverProvider from the macro / keyword / effective-elements
// ones (vscode merges every registered provider's result).

import * as vscode from 'vscode';
import * as path from 'path';
import { Scope } from '../core/scope';
import { constVarName } from '../core/regex';
import {
  buildWorkspaceIndex,
  findMacroProducedDefinition,
} from '../core/symbolIndex';
import { buildVariableModel, ModelAnnotation } from '../core/variableModel';
import { findLogicalStatement } from '../core/statements';
import { classifyStatement } from '../core/variableStatements';
import { keywordData } from '../keywords/keywordData';
import { keywordLookupKey } from '../keywords/keywordDatabaseTypes';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from '../util/workspaceFiles';
import {
  GesstabsExternalNamesManager,
  renderExternalSourceLines,
} from './externalNamesProvider';

const keywordNames = new Set(keywordData.map((k) => keywordLookupKey(k.name)));

// `basename:line` (or a custom `label`) rendered as a link that opens that
// file at that line. Uses the `vscode.open` command (needs the
// MarkdownString's `isTrusted` allow-list) so the line selection is
// honoured — a bare `file:` link doesn't reliably jump to the line.
function jumpLink(file: string, line: number, label?: string): string {
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
  const text = label ?? `${path.basename(file)}:${line + 1}`;
  return `[${text}](command:vscode.open?${args})`;
}

const KIND_LABEL: Record<string, string> = {
  atomic: 'Variable',
  alpha: 'ALPHA-Variable',
  open: 'OPEN-Variable',
  family: 'Variablenfamilie',
  alphafamily: 'AlphaFamily',
  crossvar: 'CrossVar',
  group: 'Variablengruppe',
  spssgroup: 'SPSS-Gruppe',
  indexvar: 'IndexVar',
  invindexvar: 'InvIndexVar',
  assocvar: 'AssocVar',
  unknown: 'Variable',
};

const COPY_KEYWORD: Record<string, string> = {
  vartitle: 'COPYTITLE',
  vartext: 'COPYTEXT',
  valuelabels: 'COPYLABELS',
};

function annotationNote(a: ModelAnnotation): string {
  if (!a.copiedFrom) return '';
  const kw = COPY_KEYWORD[a.kind] ?? 'COPY';
  return `\n_(aus \`${a.copiedFrom}\` übernommen — ${kw})_\n`;
}

export class GesstabsVariableHoverProvider implements vscode.HoverProvider {
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

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
      if (!scope.isNotInComment(position.line, position.character)) return null;

      const wordRange = document.getWordRangeAtPosition(
        position,
        new RegExp(constVarName, 'i')
      );
      if (!wordRange) return null;
      const rawWordText = document.getText(wordRange);
      const word = rawWordText.replace(/["']/g, '');
      if (!word || word.startsWith('#')) return null;

      // A quoted token (or a bare word that the short word-range window
      // returned from *inside* a string literal) is only a variable
      // reference when it sits in a name position — decided below against
      // the classified statement. A bare word outside a string is always a
      // genuine reference in this grammar.
      const isQuoted =
        /^["'][\s\S]*["']$/.test(rawWordText) ||
        scope.isStringScope(position.line, position.character);

      // `#name` / `&name` under the cursor is a macro / #EXPAND / param
      // reference — not a variable.
      const lineText = document.lineAt(position.line).text;
      const charBefore =
        wordRange.start.character > 0
          ? lineText[wordRange.start.character - 1]
          : '';
      if (charBefore === '#' || charBefore === '&') return null;

      // A bare GESStabs keyword under the cursor is the keyword hover's job
      // — bail before the workspace-wide index build.
      if (keywordNames.has(word.toLowerCase())) return null;

      const fileNames = await findWorkspaceFiles(document);
      const index = buildWorkspaceIndex(
        fileNames,
        makeWorkspaceReader(document),
        { conditionalsAllActive: true }
      );
      if (token && token.isCancellationRequested) return null;

      const currentFile = normalizePath(document.uri.fsPath);
      const key = word.toLowerCase();
      const model = buildVariableModel(index);

      const sym =
        model.resolve(word, currentFile, position.line) ??
        model.resolveAnywhere(word);

      // Is `word` used as a name in the statement under the cursor? (Its
      // own `defines`, or a reference slot the grammar accepts a name in.)
      const here = findLogicalStatement(
        model.statements,
        currentFile,
        position.line
      );
      const classifiedHere = here ? classifyStatement(here.text) : undefined;
      const usedAsNameHere =
        !!classifiedHere &&
        (classifiedHere.defines.some((d) => d.name === key) ||
          classifiedHere.references.some(
            (r) => r.span.name === key && r.mode !== 'never'
          ));

      if (isQuoted && !usedAsNameHere) return null;

      const annotationsEnabled =
        config.get<boolean>('hover.variableAnnotations', true) !== false;

      // A declaration to echo — one that isn't the very line under the
      // cursor (that would just repeat what's already on screen).
      const defIdx =
        sym?.definitions.findIndex(
          (d) => !(d.file === currentFile && d.line === position.line)
        ) ?? -1;
      const hasShowableDef = !!sym && defIdx >= 0;
      const hoveringOwnDeclaration =
        !!sym &&
        sym.definitions.length > 0 &&
        sym.definitions.every(
          (d) => d.file === currentFile && d.line === position.line
        );

      // No in-script symbol — `word` might be produced by a #MACRO call
      // passing it as the argument for a body statement (phase 5 will fold
      // this into the model; until then keep the dedicated fallback).
      const macroDef = sym
        ? undefined
        : findMacroProducedDefinition(
            index,
            currentFile,
            position.line,
            word
          ) ?? findMacroProducedDefinition(index, currentFile, -1, word);

      // Still nothing — is it a raw variable from the data source?
      const externalSources =
        !sym && !macroDef && this.externalNames
          ? await this.externalNames.externalSourcesFor(document, word)
          : [];

      // The variable's VARTITLE/VARTEXT/VALUELABELS — including any on a
      // name the script never declares (a dataset variable) — minus the
      // one on the line under the cursor.
      const annotations = annotationsEnabled
        ? model
            .annotationsFor(word)
            .filter(
              (a) => !(a.file === currentFile && a.line === position.line)
            )
        : [];

      const isPredefined = sym?.origin === 'predefined';

      if (
        !hasShowableDef &&
        !isPredefined &&
        !macroDef &&
        annotations.length === 0 &&
        externalSources.length === 0
      ) {
        return null;
      }

      const md = new vscode.MarkdownString();
      md.isTrusted = { enabledCommands: ['vscode.open'] };
      md.appendMarkdown(`**VARIABLE** \`${word}\`\n`);

      if (isPredefined) {
        md.appendMarkdown(`\n_Systemvariable — ${sym?.predefinedDoc ?? ''}_\n`);
      } else if (hasShowableDef && sym) {
        const kindLabel = KIND_LABEL[sym.kind] ?? 'Variable';
        md.appendMarkdown(`\n_${kindLabel}`);
        if (sym.members && sym.members.length) {
          md.appendMarkdown(` (${sym.members.length} Elemente)`);
        }
        md.appendMarkdown('_\n');
        md.appendCodeblock(
          sym.definitionStatements[defIdx] ??
            sym.definitions[defIdx].text.trim(),
          'gesstabs'
        );
        md.appendMarkdown(
          `\n${jumpLink(
            sym.definitions[defIdx].file,
            sym.definitions[defIdx].line
          )}\n`
        );
      } else if (macroDef) {
        const macroNameLink = jumpLink(
          macroDef.macro.file,
          macroDef.macro.defLine,
          `#${macroDef.macro.name}`
        );
        md.appendMarkdown(
          `\n_produced by a ${macroNameLink} macro call — not written literally in the script_\n`
        );
        md.appendCodeblock(macroDef.bodyLine.text.trim(), 'gesstabs');
        md.appendMarkdown(
          `\n${jumpLink(macroDef.bodyLine.file, macroDef.bodyLine.line)}\n`
        );
        md.appendCodeblock(macroDef.callSite.text.trim(), 'gesstabs');
        md.appendMarkdown(
          `\n${jumpLink(macroDef.callSite.file, macroDef.callSite.line)}\n`
        );
      } else if (externalSources.length > 0) {
        md.appendMarkdown(renderExternalSourceLines(word, externalSources));
      } else if (!hoveringOwnDeclaration) {
        md.appendMarkdown(
          '\n_not declared in the script — probably a dataset variable_\n'
        );
      }

      annotations.forEach((a: ModelAnnotation) => {
        md.appendCodeblock(a.statement, 'gesstabs');
        md.appendMarkdown(annotationNote(a));
        md.appendMarkdown(`\n${jumpLink(a.file, a.line)}\n`);
      });

      return new vscode.Hover(md, wordRange);
    } catch (e) {
      printDebugMessage(`gesstabs: variable hover failed: ${e}`);
      return null;
    }
  }
}
