// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import * as sc from './core/scope';
import { constVarName, macroDefRe, expandDefRe } from './core/regex';
import { matchInScope } from './core/matching';
import { getAllFilenamesInDirectory } from './util/fsutils';
import {
  buildWorkspaceIndex,
  findMacroProducedDefinition,
} from './core/symbolIndex';
import {
  buildVariableModel,
  collectVariableOccurrences,
  primaryDefinitions,
} from './core/variableModel';
import { blankComments, FileReader, ResolvedLine } from './core/includeGraph';
import { ExternalNameSource } from './core/externalNames';
import { toLogicalStatements } from './core/statements';
import { classifyStatement } from './core/variableStatements';
import {
  fixDriveCasingInWindows,
  getWorkspaceFolderPath,
  normalizePath,
  makeWorkspaceReader,
  resolvedLineRange,
  findWorkspaceFiles,
  printDebugMessage,
} from './util/workspaceFiles';
import {
  GesstabsMacroHoverProvider,
  GesstabsMacroSignatureHelpProvider,
  GesstabsMacroCodeLensProvider,
} from './providers/macroProviders';
import {
  findMacroDefinitions,
  findParamReferenceAt,
  MacroSourceLine,
} from './core/macroExpansion';
import { GesstabsEffectiveElementsHoverProvider } from './providers/tableElementsProvider';
import { GesstabsVariableHoverProvider } from './providers/variableHoverProvider';
import { GesstabsFoldingRangeProvider } from './providers/foldingProvider';
import {
  GesstabsSemanticTokensProvider,
  gesstabsSemanticTokensLegend,
} from './providers/semanticTokensProvider';
import { GesstabsFormattingProvider } from './providers/formatterProvider';
import {
  GesstabsKeywordHoverProvider,
  GesstabsKeywordCompletionProvider,
} from './providers/keywordProviders';
import { GesstabsSymbolCompletionProvider } from './providers/completionProviders';
import {
  GesstabsDiagnosticsManager,
  GesstabsEmptyVarlistCodeActionProvider,
  GesstabsStrictVarlistCodeActionProvider,
  GesstabsNestedBlockCommentCodeActionProvider,
} from './providers/diagnosticsProvider';
import {
  GesstabsExternalNamesManager,
  GesstabsDataSourceLinkProvider,
} from './providers/externalNamesProvider';
import { GesstabsFileReferenceLinkProvider } from './providers/fileReferenceLinkProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  printDebugMessage(
    'Congratulations, your extension "gesstabs" is now active!'
  );

  const externalNamesManager = new GesstabsExternalNamesManager();
  context.subscriptions.push(externalNamesManager);

  // Used by the variable-hover jump links (src/providers/variableHoverProvider.ts,
  // src/providers/externalNamesProvider.ts) instead of the built-in `vscode.open`
  // command: `vscode.open`'s `selection` option is unreliably applied when the
  // target file is already open in an editor — it just focuses the existing tab
  // without moving the cursor. `showTextDocument`'s `selection` option doesn't
  // have that problem, open or not.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'gesstabs.revealLine',
      async (uriString: string, line: number) => {
        const uri = vscode.Uri.parse(uriString);
        const document = await vscode.workspace.openTextDocument(uri);
        const position = new vscode.Position(line, 0);
        await vscode.window.showTextDocument(document, {
          selection: new vscode.Range(position, position),
        });
      }
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsDefintionProvider(externalNamesManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsDocumentSymbolProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerReferenceProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsReferenceProvider(externalNamesManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerWorkspaceSymbolProvider(
      new GessTabsWorkspaceSymbolProvider(externalNamesManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerRenameProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsRenameProvider(externalNamesManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsMacroHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsMacroSignatureHelpProvider(),
      '(',
      ' '
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsMacroCodeLensProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsEffectiveElementsHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsVariableHoverProvider(externalNamesManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsFoldingRangeProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsSemanticTokensProvider(),
      gesstabsSemanticTokensLegend
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsFormattingProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsKeywordHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsKeywordCompletionProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsSymbolCompletionProvider()
    )
  );

  const diagnosticsManager = new GesstabsDiagnosticsManager();
  context.subscriptions.push(diagnosticsManager);

  const diagnosticsTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const scheduleDiagnostics = (document: vscode.TextDocument): void => {
    const key = document.uri.toString();
    const existing = diagnosticsTimers.get(key);
    if (existing) clearTimeout(existing);
    diagnosticsTimers.set(
      key,
      setTimeout(() => {
        diagnosticsManager.refresh(document);
        externalNamesManager.refresh(document).catch(() => undefined);
      }, 300)
    );
  };

  externalNamesManager.setOnChange(() => {
    vscode.workspace.textDocuments.forEach((document) => {
      if (document.languageId === 'gesstabs') scheduleDiagnostics(document);
    });
  });

  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsDataSourceLinkProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsFileReferenceLinkProvider()
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(scheduleDiagnostics)
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      scheduleDiagnostics(e.document)
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnosticsManager.clear(document);
      externalNamesManager.clear(document);
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('gesstabs.dataInput.entryScriptPatterns')) {
        externalNamesManager.invalidate();
      }
      if (
        !e.affectsConfiguration('gesstabs.diagnostics.enabled') &&
        !e.affectsConfiguration('gesstabs.dataInput.entryScriptPatterns')
      ) {
        return;
      }
      vscode.workspace.textDocuments.forEach(scheduleDiagnostics);
    })
  );
  vscode.workspace.textDocuments.forEach((document) => {
    diagnosticsManager.refresh(document);
    externalNamesManager.refresh(document).catch(() => undefined);
  });

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsEmptyVarlistCodeActionProvider(),
      {
        providedCodeActionKinds:
          GesstabsEmptyVarlistCodeActionProvider.providedCodeActionKinds,
      }
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsStrictVarlistCodeActionProvider(),
      {
        providedCodeActionKinds:
          GesstabsStrictVarlistCodeActionProvider.providedCodeActionKinds,
      }
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GesstabsNestedBlockCommentCodeActionProvider(),
      {
        providedCodeActionKinds:
          GesstabsNestedBlockCommentCodeActionProvider.providedCodeActionKinds,
      }
    )
  );
}

// this method is called when your extension is deactivated
// eslint-disable-next-line no-empty-function
export function deactivate() {}

// fixDriveCasingInWindows/getWorkspaceFolderPath/normalizePath/
// makeWorkspaceReader/resolvedLineRange/findWorkspaceFiles live in
// src/util/workspaceFiles.ts (shared with src/providers/macroProviders.ts).

// regex factories have been moved to src/core/regex.ts
// (spush, the old workspace-symbol-provider name-splitting helper it fed,
// is gone — GessTabsWorkspaceSymbolProvider builds symbols straight from
// the variable model now, see below)

// sucht das Wort unter dem Cursor, wobei Zahlen, Buchstaben, Punkte sowie # als
// Wort akzeptiert werden. Gibt dann einen Array zurück, wobei das 1st Element
// true ist, wenn es ein Wort gefunden hat, sonst false. Das eigentliche Wort
// steht dann an zweiter Stelle (wenn true)
function getWordAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): [boolean, string, vscode.Position] {
  const wordLimits: RegExp = new RegExp(constVarName, 'i');
  const wordRange = document.getWordRangeAtPosition(position, wordLimits);
  const word = wordRange
    ? document.getText(wordRange).replace(/"/g, '').replace(/'/g, '')
    : '';
  if (!wordRange) {
    return [false, '', position];
  }
  const resultPosition =
    position.isEqual(wordRange.end) && position.isAfter(wordRange.start)
      ? position.translate(0, -1)
      : position;

  return [true, word, resultPosition];
}

// The header-cell Location(s) for a raw dataset column named `word` —
// every resolved data source that positively knows its exact character
// range (a delimited CSVINFILE/DATAFILE/INFILE source; SPSSINFILE has no
// per-column range in v1, see savDictionary.ts). §11.7 "CSV-header-cell
// go-to-definition".
function headerCellLocations(
  word: string,
  sources: ExternalNameSource[]
): vscode.Location[] {
  const key = word.toLowerCase();
  const out: vscode.Location[] = [];
  sources.forEach((src) => {
    const range = src.columnRanges?.[key];
    if (!src.absPath || !range) return;
    out.push(
      new vscode.Location(
        vscode.Uri.file(src.absPath),
        new vscode.Range(
          new vscode.Position(0, range.start),
          new vscode.Position(0, range.end)
        )
      )
    );
  });
  return out;
}

// Allow the user to see the definition of variables/functions/methods
// right where the variables / functions / methods are being used.
class GesstabsDefintionProvider implements vscode.DefinitionProvider {
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | vscode.Location[] | null> {
    const paramRef = this.findParamReference(document, position);
    if (paramRef) return paramRef;

    const wordAtPosition = getWordAtPosition(document, position);
    if (!wordAtPosition[0]) return null;
    const word = wordAtPosition[1];

    let fileNames: string[];
    try {
      fileNames = await findWorkspaceFiles(document);
    } catch (e) {
      printDebugMessage(`gesstabs: provideDefinition failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    const index = buildWorkspaceIndex(
      fileNames,
      makeWorkspaceReader(document),
      { conditionalsAllActive: true }
    );
    const currentFile = normalizePath(document.uri.fsPath);

    // The variable model resolves the whole §3 definition inventory —
    // COMPUTE without a sub-keyword, MAKESINGLE, VARGROUP/GROUPS/INTERVALS,
    // DATA <method>, the statistical creators, IF … THEN <var> = … — none
    // of which findDefinitionLine's regexes cover. Position-aware first
    // (no forward reference), then a whole-program fallback.
    //
    // externalNames (P1.4): a raw dataset column never named by any
    // in-script statement still resolves — to the CSVINFILE/SPSSINFILE/
    // DATAFILE line that names it, the only "declaration" a raw column
    // has. sourcesFor already unions every entry program whose graph
    // contains this document.
    const externalSources = this.externalNames
      ? await this.externalNames.sourcesFor(document)
      : [];
    if (token && token.isCancellationRequested) return null;
    const model = buildVariableModel(index, { externalNames: externalSources });
    const sym =
      model.resolve(word, currentFile, position.line) ??
      model.resolveAnywhere(word);
    if (sym) {
      // Only the real declaration(s) (§3.3) — a COMPUTE/IF…THEN
      // reassignment elsewhere must never show up as an alternate
      // go-to-definition target just because it also touches `sym`.
      const primary = primaryDefinitions(sym);
      if (primary.length > 0) {
        const locations = primary.map(
          (d) =>
            new vscode.Location(
              vscode.Uri.file(d.line.file),
              resolvedLineRange(d.line)
            )
        );
        // A raw dataset column additionally jumps straight to its own
        // header cell in the CSV/DATAFILE itself (§11.7 "CSV-header-cell
        // go-to-definition"), alongside the CSVINFILE/DATAFILE statement
        // location above — not instead of it, since the statement is
        // still the "real" declaration and the only target for a source
        // (e.g. SPSSINFILE) with no per-column character range.
        if (sym.origin === 'external') {
          locations.push(...headerCellLocations(word, externalSources));
        }
        return locations;
      }
    }

    // No modelled declaration — `word` might still be produced by a #MACRO
    // call site passing it as the argument for a body statement like
    // `compute &fr = 2;`. Point at both: the macro body line that actually
    // declares it, and the call site that supplied the name.
    const macroDef = findMacroProducedDefinition(
      index,
      currentFile,
      position.line,
      word
    );
    if (!macroDef) return null;

    return [
      new vscode.Location(
        vscode.Uri.file(macroDef.bodyLine.file),
        resolvedLineRange(macroDef.bodyLine)
      ),
      new vscode.Location(
        vscode.Uri.file(macroDef.callSite.file),
        resolvedLineRange(macroDef.callSite)
      ),
    ];
  }

  // Resolves a "&paramname" reference inside a macro body back to its
  // position in the enclosing #MACRO's own parameter list.
  private findParamReference(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Location | null {
    const file = normalizePath(document.uri.fsPath);
    const lines: MacroSourceLine[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      lines.push({ file, line: i, text: document.lineAt(i).text });
    }
    const defs = findMacroDefinitions(lines);
    const lineText = document.lineAt(position.line).text;
    const ref = findParamReferenceAt(
      lineText,
      position.character,
      defs,
      position.line
    );
    if (!ref) return null;

    const defLineText = document.lineAt(ref.def.defLine).text;
    const token = `&${ref.paramName}`;
    const idx = defLineText.toLowerCase().indexOf(token.toLowerCase());
    if (idx === -1) return null;

    return new vscode.Location(
      document.uri,
      new vscode.Range(
        new vscode.Position(ref.def.defLine, idx),
        new vscode.Position(ref.def.defLine, idx + token.length)
      )
    );
  }
}

// Allow the user to see all the source code locations where a certain
// variable / function/ method / symbol is being used.
class GesstabsReferenceProvider implements vscode.ReferenceProvider {
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

  public async provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[] | null> {
    const wordAtPosition = getWordAtPosition(document, position);
    if (!wordAtPosition[0]) return null;
    const word = wordAtPosition[1];

    let fileNames: string[];
    try {
      fileNames = await findWorkspaceFiles(document);
    } catch (e) {
      printDebugMessage(`gesstabs: provideReferences failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    const index = buildWorkspaceIndex(
      fileNames,
      makeWorkspaceReader(document),
      { conditionalsAllActive: true }
    );
    // externalNames (P1.4): finds every literal usage of a raw dataset
    // column too, plus (with includeDeclaration) the CSVINFILE/SPSSINFILE/
    // DATAFILE line that names it, same as go-to-definition.
    const externalSources = this.externalNames
      ? await this.externalNames.sourcesFor(document)
      : [];
    if (token && token.isCancellationRequested) return null;
    // Unlike rename, "Find All References" keeps non-literal occurrences too
    // (§9 Q2: a numeric-suffix `‹a› TO ‹b›` range member with no text of its
    // own) — pointing at the range phrase is still a genuine, useful usage
    // location, it just isn't a text substitution target.
    return collectVariableOccurrences(
      index,
      word,
      !context.includeDeclaration,
      { externalNames: externalSources }
    ).map(
      ({ line, character, length }) =>
        new vscode.Location(
          vscode.Uri.file(line.file),
          new vscode.Range(
            new vscode.Position(line.line, character),
            new vscode.Position(line.line, character + length)
          )
        )
    );
  }
}

// Allow the user to rename a variable everywhere it's used across the
// workspace's resolved INCLUDE graph.
class GesstabsRenameProvider implements vscode.RenameProvider {
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

  // Runs the moment F2 is pressed, before VS Code ever opens the rename
  // input box. Rejecting here — same check provideRenameEdits does — shows
  // the reason immediately, inline, with no input box/rename-suggestions
  // popup to open and then get replaced a few seconds later once
  // provideRenameEdits itself finally rejects (the reported UX: the error
  // was there, then another window covered it — that "other window" was
  // this very rename box, which VS Code opens unconditionally when a
  // provider has no prepareRename). GesstabsExternalNamesManager's own
  // program/bytes caches make this basically free the second time
  // provideRenameEdits repeats the same lookup.
  public async prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Range> {
    const wordAtPosition = getWordAtPosition(document, position);
    const wordRange = document.getWordRangeAtPosition(
      position,
      new RegExp(constVarName, 'i')
    );
    if (!wordAtPosition[0] || !wordRange) {
      throw new Error('Hier befindet sich kein umbenennbares Element.');
    }
    const word = wordAtPosition[1];

    let fileNames: string[];
    try {
      fileNames = await findWorkspaceFiles(document);
    } catch (e) {
      printDebugMessage(`gesstabs: prepareRename failed: ${e}`);
      return wordRange;
    }
    if (token && token.isCancellationRequested) return wordRange;

    const index = buildWorkspaceIndex(
      fileNames,
      makeWorkspaceReader(document),
      { conditionalsAllActive: true }
    );
    const externalSources = this.externalNames
      ? await this.externalNames.sourcesFor(document)
      : [];
    if (token && token.isCancellationRequested) return wordRange;
    const model = buildVariableModel(index, { externalNames: externalSources });
    if (model.resolveAnywhere(word)?.origin === 'external') {
      throw new Error(
        `"${word}" ist eine Rohvariable aus der Datenquelle (CSVINFILE/SPSSINFILE/DATAFILE) — sie kann hier nicht umbenannt werden, da der Name in der Datendatei selbst nicht mit geändert wird.`
      );
    }
    return wordRange;
  }

  public async provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    token: vscode.CancellationToken
  ): Promise<vscode.WorkspaceEdit | null> {
    const wordAtPosition = getWordAtPosition(document, position);
    if (!wordAtPosition[0]) return null;
    const word = wordAtPosition[1];

    let fileNames: string[];
    try {
      fileNames = await findWorkspaceFiles(document);
    } catch (e) {
      printDebugMessage(`gesstabs: provideRenameEdits failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    const index = buildWorkspaceIndex(
      fileNames,
      makeWorkspaceReader(document),
      { conditionalsAllActive: true }
    );

    // externalNames (P1.4): a raw dataset column is never a rename
    // target — the name lives in the data file itself, and this
    // extension has no way to rename an actual column there. Renaming
    // only its script occurrences would silently leave the script
    // referring to a name no real column matches, so refuse outright
    // rather than produce a half-correct edit. (An already-`declared`
    // symbol — one a real in-script declaration has re-defined, see
    // primaryDefinitions — renames normally; only a still-purely-
    // `external` one is blocked.)
    const externalSources = this.externalNames
      ? await this.externalNames.sourcesFor(document)
      : [];
    if (token && token.isCancellationRequested) return null;
    const model = buildVariableModel(index, { externalNames: externalSources });
    if (model.resolveAnywhere(word)?.origin === 'external') {
      throw new Error(
        `"${word}" ist eine Rohvariable aus der Datenquelle (CSVINFILE/SPSSINFILE/DATAFILE) — sie kann hier nicht umbenannt werden, da der Name in der Datendatei selbst nicht mit geändert wird.`
      );
    }

    // Non-literal occurrences (§9 Q2: a numeric-suffix `‹a› TO ‹b›` range
    // member with no text of its own — `character`/`length` span the whole
    // range phrase) must never be rename targets: there is no safe
    // substitution that wouldn't also corrupt the range's other endpoint.
    const occurrences = collectVariableOccurrences(index, word, false, {
      externalNames: externalSources,
    }).filter((o) => o.literal);
    if (occurrences.length === 0) return null;

    const edit = new vscode.WorkspaceEdit();
    occurrences.forEach(({ line, character, length }) => {
      edit.replace(
        vscode.Uri.file(line.file),
        new vscode.Range(
          new vscode.Position(line.line, character),
          new vscode.Position(line.line, character + length)
        ),
        newName
      );
    });
    return edit;
  }
}

// Allow the user to quickly navigate to any symbol definition in the open editor.
// CTRL-SHIFT o is default keybinding
class GesstabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.SymbolInformation[]> {
    return new Promise<vscode.SymbolInformation[]>((resolve) => {
      if (token && token.isCancellationRequested) {
        resolve([]);
        return;
      }
      const symbols: vscode.SymbolInformation[] = [];
      const push = (
        kind: vscode.SymbolKind,
        container: string,
        name: string,
        range: vscode.Range
      ): void => {
        if (!name) return;
        symbols.push({
          name,
          kind,
          location: new vscode.Location(document.uri, range),
          containerName: container,
        });
      };

      const macroRegExp: RegExp = macroDefRe('');
      const expandRegExp: RegExp = expandDefRe('');
      const scope = new sc.Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      // Macro / #EXPAND definitions — unrelated to the variable model,
      // unchanged line-based regex scan.
      lines.forEach((lineText, i) => {
        if (token && token.isCancellationRequested) return;
        if (lineText.length === 0) return;
        const normalScope = (searchIndex: number) =>
          scope.isNormalScope(i, searchIndex);
        const { range } = document.lineAt(i);

        const macroMatch = matchInScope(lineText, macroRegExp, normalScope);
        if (macroMatch && macroMatch[2]) {
          push(
            vscode.SymbolKind.Function,
            'definition',
            `${macroMatch[2]} [macro]`,
            range
          );
        }
        const expandMatch = matchInScope(lineText, expandRegExp, normalScope);
        if (expandMatch && expandMatch[2]) {
          push(
            vscode.SymbolKind.Function,
            'definition',
            `${expandMatch[2]} [expand]`,
            range
          );
        }
      });
      if (token && token.isCancellationRequested) {
        resolve([]);
        return;
      }

      // Variable / table names — the statement classifier, one entry per
      // name (replacing the old regex pass' "only the last name in a
      // multi-name list" / "whole varlist crammed into one blob" gaps, and
      // now covering the full §3 declaration inventory — COMPUTE without a
      // sub-keyword, MAKESINGLE's no-`=` form, VARFAMILY/VARGROUP/GROUPS/
      // INTERVALS/INDEXVAR/the statistical creators/DATA, … — none of
      // which the old singleVarDefRe/computeDefRe/multiVarDefRe set
      // actually matched). Document-scoped, like the rest of this
      // provider — no workspace/INCLUDE resolution.
      const order: ResolvedLine[] = lines.map((text, i) => ({
        file: 'document',
        line: i,
        text: blankComments(scope, i, text),
      }));
      toLogicalStatements(order).forEach((stmt) => {
        const cls = classifyStatement(stmt.text);
        if (!cls) return;
        const { range } = document.lineAt(stmt.startLine);

        cls.defines.forEach((span) => {
          push(
            vscode.SymbolKind.Variable,
            'variable',
            `${span.raw} [${cls.keyword}]`,
            range
          );
        });

        // VARTITLE/VARTEXT/VALUELABELS (& synonyms)/COPY* re-mentioning an
        // existing variable — not a declaration, but a meaningful Outline
        // landmark, same as the old multiVarRe-based entries.
        if (cls.kind === 'annotation') {
          cls.references
            .filter((r) => r.mode === 'always')
            .forEach((r) => {
              push(
                vscode.SymbolKind.Variable,
                'variable',
                `${r.span.raw} [${cls.keyword}]`,
                range
              );
            });
        }

        // TABLE/OVERVIEW head + axis names.
        if (cls.kind === 'table') {
          cls.references
            .filter((r) => r.mode === 'always')
            .forEach((r) => {
              push(vscode.SymbolKind.Variable, 'table', r.span.raw, range);
            });
        }
      });

      resolve(symbols);
    });
  }
}

// Allow the user to quickly navigate to symbol definitions anywhere in the folder (workspace) opened in VS
class GessTabsWorkspaceSymbolProvider
  implements vscode.WorkspaceSymbolProvider
{
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

  public async provideWorkspaceSymbols(
    query: string,
    token: vscode.CancellationToken
  ): Promise<vscode.SymbolInformation[]> {
    const wsfolder =
      getWorkspaceFolderPath(
        vscode.window.activeTextEditor &&
          vscode.window.activeTextEditor.document.uri
      ) ||
      fixDriveCasingInWindows(
        path.dirname(
          vscode &&
            vscode.window &&
            vscode.window.activeTextEditor &&
            vscode.window.activeTextEditor.document
            ? vscode.window.activeTextEditor.document.fileName
            : ''
        )
      );

    let files: string[];
    try {
      files = await getAllFilenamesInDirectory(wsfolder, '(tab|inc|def)');
    } catch (e) {
      printDebugMessage(`gesstabs: provideWorkspaceSymbols failed: ${e}`);
      return [];
    }
    if (token && token.isCancellationRequested) return [];

    const docs = await Promise.all(
      files.map((file) => vscode.workspace.openTextDocument(file))
    );
    if (token && token.isCancellationRequested) return [];

    const symbols: vscode.SymbolInformation[] = [];
    const docByPath = new Map<string, vscode.TextDocument>();
    docs.forEach((d) => docByPath.set(normalizePath(d.uri.fsPath), d));
    const rangeFor = (file: string, line: number): vscode.Range => {
      const doc = docByPath.get(normalizePath(file));
      if (doc && line >= 0 && line < doc.lineCount)
        return doc.lineAt(line).range;
      return new vscode.Range(line, 0, line, 0);
    };
    const push = (
      kind: vscode.SymbolKind,
      container: string,
      name: string,
      file: string,
      line: number
    ): void => {
      if (!name) return;
      symbols.push({
        name,
        kind,
        location: new vscode.Location(
          vscode.Uri.file(file),
          rangeFor(file, line)
        ),
        containerName: container,
      });
    };

    // Variables — the whole workspace's .tab/.inc/.def set feeds one symbol
    // table (buildWorkspaceIndex treats a file no other file INCLUDEs as
    // its own root, so every independent entry program is covered, not
    // just whichever one is currently open — entry scripts are
    // independent programs, see TODO.md), then only the real
    // declaration(s) per symbol: §3.3 — a COMPUTE/IF…THEN reassignment is
    // never a declaration, the same rule go-to-definition now enforces
    // via primaryDefinitions() — so Ctrl+T doesn't drown a name in every
    // place it's later reassigned, only where it's actually declared
    // (still every branch of a genuine double declaration, e.g. one per
    // #ifdef/#else).
    const readFile: FileReader = (filePath) => {
      const doc = docByPath.get(normalizePath(filePath));
      return doc ? doc.getText().split(/\r\n|\r|\n/) : undefined;
    };
    const index = buildWorkspaceIndex(files, readFile, {
      conditionalsAllActive: true,
    });
    if (token && token.isCancellationRequested) return [];

    // externalNames (P1.4): every entry program's data sources, unioned —
    // a raw dataset column belongs in Ctrl+T too (workspace-wide, so
    // there's no single "current document" to scope sourcesFor() to;
    // getPrograms() covers every independent entry program instead, same
    // reasoning as the file scan above).
    let externalSources: ExternalNameSource[] = [];
    if (this.externalNames) {
      const programs = await this.externalNames.getPrograms(
        vscode.window.activeTextEditor?.document.uri
      );
      const seen = new Set<string>();
      externalSources = programs
        .flatMap((prog) => prog.sources)
        .filter((src) => {
          const key = `${src.statement.file}:${src.statement.line}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    }
    if (token && token.isCancellationRequested) return [];

    const model = buildVariableModel(index, { externalNames: externalSources });
    model.all().forEach((sym) => {
      if (
        sym.origin !== 'declared' &&
        sym.origin !== 'virtual' &&
        sym.origin !== 'external'
      )
        return;
      primaryDefinitions(sym).forEach((d) => {
        // The declaring statement's own keyword (compute/singleq/
        // varfamily/…) rather than sym.kind: a bare COMPUTE's targetKind
        // is 'unknown' until something narrows it (design §3 — COMPUTE
        // doesn't say ALPHA/OPEN up front), which read as a bare
        // "unknown" container in the Ctrl+T list with nothing more
        // useful to show. An external symbol's "statement" is the
        // CSVINFILE/SPSSINFILE/DATAFILE line — classifyStatement doesn't
        // recognise it at all (it's not part of the §3 grammar), so name
        // the container 'external' outright instead of falling through
        // to the generic 'atomic'.
        const declKeyword =
          sym.origin === 'external'
            ? 'external'
            : classifyStatement(d.statement)?.keyword;
        push(
          vscode.SymbolKind.Variable,
          declKeyword ?? sym.kind,
          sym.displayName,
          d.line.file,
          d.line.line
        );
      });
    });

    // Macro / #EXPAND definitions + TABLE head/axis names — unrelated to
    // the variable model (§3), same per-document regex/classifier scan
    // GesstabsDocumentSymbolProvider already uses, just looped over every
    // file in the workspace instead of one open document.
    const macroRegExp: RegExp = macroDefRe('');
    const expandRegExp: RegExp = expandDefRe('');
    docs.forEach((document) => {
      if (token && token.isCancellationRequested) return;
      const scope = new sc.Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      lines.forEach((lineText, i) => {
        if (lineText.length === 0) return;
        const normalScope = (searchIndex: number) =>
          scope.isNormalScope(i, searchIndex);

        const macroMatch = matchInScope(lineText, macroRegExp, normalScope);
        if (macroMatch && macroMatch[2]) {
          push(
            vscode.SymbolKind.Function,
            'macro',
            macroMatch[2],
            document.uri.fsPath,
            i
          );
        }
        const expandMatch = matchInScope(lineText, expandRegExp, normalScope);
        if (expandMatch && expandMatch[2]) {
          push(
            vscode.SymbolKind.Function,
            'expand',
            expandMatch[2],
            document.uri.fsPath,
            i
          );
        }
      });

      const order: ResolvedLine[] = lines.map((text, i) => ({
        file: document.uri.fsPath,
        line: i,
        text: blankComments(scope, i, text),
      }));
      toLogicalStatements(order).forEach((stmt) => {
        const cls = classifyStatement(stmt.text);
        if (!cls || cls.kind !== 'table') return;
        cls.references
          .filter((r) => r.mode === 'always')
          .forEach((r) => {
            push(
              vscode.SymbolKind.Variable,
              'table',
              r.span.raw,
              document.uri.fsPath,
              stmt.startLine
            );
          });
      });
    });

    if (!query) return symbols;
    const q = query.toLowerCase();
    return symbols.filter((s) => s.name.toLowerCase().includes(q));
  }
}
