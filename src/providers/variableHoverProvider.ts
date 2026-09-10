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
  hoverEnabled,
  hoverShows,
  variableContentShows,
  VariableContentPart,
} from '../util/config';
import {
  GesstabsExternalNamesManager,
  renderExternalSourceLines,
} from './externalNamesProvider';

const keywordNames = new Set(keywordData.map((k) => keywordLookupKey(k.name)));

// `basename:line` (or a custom `label`) rendered as a link that opens that
// file at that line. Uses the `gesstabs.revealLine` command (needs the
// MarkdownString's `isTrusted` allow-list) rather than the built-in
// `vscode.open`, whose `selection` option is ignored when the target file
// is already open — it would just focus the tab without moving the cursor.
function jumpLink(file: string, line: number, label?: string): string {
  const args = encodeURIComponent(
    JSON.stringify([vscode.Uri.file(file).toString(), line])
  );
  const text = label ?? `${path.basename(file)}:${line + 1}`;
  return `[${text}](command:gesstabs.revealLine?${args})`;
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

// The order the annotation blocks are shown in the hover, after the
// definition: VARTEXT, then VARTITLE, then VALUELABELS, then anything
// else (OVERCODE / other). The model hands them back in program order —
// whatever order the statements happen to sit in the script — which the
// user found arbitrary ("starts with labels"). Sorted by this rank, with
// program order kept as the tiebreak within a kind (Array.sort is stable).
const ANNOTATION_ORDER: Record<ModelAnnotation['kind'], number> = {
  vartext: 0,
  vartitle: 1,
  valuelabels: 2,
  overcode: 3,
  other: 4,
};

// Which `gesstabs.hover.variableContent` toggle gates each annotation
// kind. OVERCODE and the catch-all `other` have no dedicated toggle —
// they ride along whenever any annotation is shown at all.
const ANNOTATION_PART: Record<
  ModelAnnotation['kind'],
  VariableContentPart | null
> = {
  vartext: 'text',
  vartitle: 'title',
  valuelabels: 'valueLabels',
  overcode: null,
  other: null,
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
      if (!hoverEnabled()) return null;
      if (!hoverShows('variables')) return null;

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

      // Seed the model with the data-source (CSVINFILE/SPSSINFILE/DATAFILE)
      // column names, exactly as go-to-definition / references do — without
      // this a raw dataset variable that a later `COMPUTE` / `IF … THEN`
      // (re-)assigns would be modelled as a freshly *declared* in-script
      // variable (origin 'declared', kind 'unknown'), so the hover called it
      // a plain "Variable" and its jump link pointed at the assignment line
      // instead of the CSVINFILE statement that really introduces it.
      const externalSourceList = this.externalNames
        ? await this.externalNames.sourcesFor(document)
        : [];
      if (token && token.isCancellationRequested) return null;
      const model = buildVariableModel(index, {
        externalNames: externalSourceList,
      });

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

      // gesstabs.hover.variableContent — which blocks of this hover are on.
      const showDefinition = variableContentShows('definition');

      // "The declaration" is always the *earliest* (program-order first)
      // defining occurrence — never a later re-definition. `definitions`
      // holds every defining statement in order, including COMPUTE/IF-THEN
      // re-assignments of an already-existing variable (defKind
      // 'assignment', §9 Q3): gessTabs never treats those as declaring
      // anything (an IF-THEN body only ever *uses* a variable, which must
      // already exist or it's a compile error), so surfacing one as if it
      // were an alternate "declaration" — which the naive "first entry
      // that isn't the hovered line" used to do whenever you hovered the
      // true first definition and a re-assignment existed elsewhere — is
      // simply wrong. Echoed only when it isn't the line under the cursor.
      const primaryDef = sym?.definitions[0];
      const hoveringOwnDeclaration =
        !!primaryDef &&
        primaryDef.file === currentFile &&
        primaryDef.line === position.line;

      // A raw dataset column the script also (re-)assigns is still
      // fundamentally the data source's own variable (variableModel keeps
      // `origin: 'external'` for a mere COMPUTE / IF … THEN touch, §3.3) —
      // render it through the external-source path below, never as an
      // in-script declaration whose "definition" is the assignment line.
      const isExternal = sym?.origin === 'external';
      const hasShowableDef =
        showDefinition &&
        !!primaryDef &&
        !hoveringOwnDeclaration &&
        !isExternal;

      // `word` has no in-script / dataset symbol of its own — but it may be
      // a name a #MACRO *body* produces once this call's arguments are
      // substituted (e.g. `#mkfam( geschl )` where the body is
      // `makefamily &1 = …`). Only in that case (`!sym`) does the variable
      // hover describe the macro: an argument that is *already* a real
      // variable is shown as itself (its declaration + annotations), never
      // with the macro on top — the macro-call hover, restricted to the
      // `#name` token, is where a caller sees the expansion instead. The
      // position-aware lookup excludes the call's own line, so the second,
      // whole-program call is what catches "hovering the argument on the
      // call line itself".
      const macroDef =
        showDefinition && !sym
          ? findMacroProducedDefinition(
              index,
              currentFile,
              position.line,
              word
            ) ?? findMacroProducedDefinition(index, currentFile, -1, word)
          : undefined;

      // Nothing in-script or macro-produced — is it a raw variable from the
      // data source? Also taken when the model *did* resolve it but as
      // `origin: 'external'` (a raw column the script later assigns): the
      // hover still describes it by its data source, not by that assignment.
      const externalSources =
        showDefinition &&
        !macroDef &&
        (!sym || isExternal) &&
        this.externalNames
          ? await this.externalNames.externalSourcesFor(document, word)
          : [];

      // The variable's VARTEXT / VARTITLE / VALUELABELS — including any on
      // a name the script never declares (a dataset variable) — minus the
      // one on the line under the cursor, minus any kind the user turned
      // off in gesstabs.hover.variableContent, ordered by ANNOTATION_ORDER.
      const annotations = model
        .annotationsFor(word)
        .filter((a) => !(a.file === currentFile && a.line === position.line))
        .filter((a) => {
          const part = ANNOTATION_PART[a.kind];
          return part === null || variableContentShows(part);
        })
        .sort((a, b) => ANNOTATION_ORDER[a.kind] - ANNOTATION_ORDER[b.kind]);

      const isPredefined = showDefinition && sym?.origin === 'predefined';

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
      md.isTrusted = { enabledCommands: ['gesstabs.revealLine'] };
      md.appendMarkdown(`**VARIABLE** \`${word}\`\n`);

      if (isPredefined) {
        md.appendMarkdown(`\n_Systemvariable — ${sym?.predefinedDoc ?? ''}_\n`);
      } else if (hasShowableDef && sym && primaryDef) {
        const kindLabel = KIND_LABEL[sym.kind] ?? 'Variable';
        md.appendMarkdown(`\n_${kindLabel}`);
        if (sym.members && sym.members.length) {
          md.appendMarkdown(` (${sym.members.length} Elemente)`);
        }
        md.appendMarkdown('_\n');
        md.appendCodeblock(
          sym.definitionStatements[0] ?? primaryDef.text.trim(),
          'gesstabs'
        );
        md.appendMarkdown(`\n${jumpLink(primaryDef.file, primaryDef.line)}\n`);
      } else if (macroDef) {
        const macroNameLink = jumpLink(
          macroDef.macro.file,
          macroDef.macro.defLine,
          `#${macroDef.macro.name}`
        );
        md.appendMarkdown(
          `\n_von einem ${macroNameLink}-Makroaufruf erzeugt — nicht wörtlich im Skript_\n`
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
      } else if (showDefinition && !hoveringOwnDeclaration) {
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
