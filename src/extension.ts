// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import * as sc from './core/scope';
import * as logger from './util/logger';
import { constVarName, macroDefRe, expandDefRe } from './core/regex';
import { matchInScope } from './core/matching';
import { findMatchingDirectiveLine } from './core/matchingDirective';
import {
  findMacroProducedDefinition,
  programIndexFor,
  WorkspaceIndex,
} from './core/symbolIndex';
import {
  buildVariableModel,
  collectVariableOccurrences,
  primaryDefinitions,
} from './core/variableModel';
import {
  blankComments,
  ResolvedLine,
  scopeForLines,
} from './core/includeGraph';
import { ExternalNameSource } from './core/externalNames';
import { toLogicalStatements } from './core/statements';
import { classifyStatement } from './core/variableStatements';
import {
  fixDriveCasingInWindows,
  getWorkspaceFolderPath,
  normalizePath,
  resolvedLineRange,
  workspaceReader,
} from './util/workspaceFiles';
import {
  getFolderIndex,
  getWorkspaceIndex,
  registerWorkspaceIndexInvalidation,
  workspaceScriptFiles,
} from './util/workspaceIndexCache';
import {
  GesstabsMacroHoverProvider,
  GesstabsMacroSignatureHelpProvider,
  GesstabsMacroCodeLensProvider,
} from './providers/macroProviders';
import {
  findMacroDefinitions,
  findParamReferenceAt,
  findMacroCalls,
  findHashNameAt,
  findHashNameOccurrences,
  findExpandDefinitionSites,
  findExpandIncDefinitions,
  isExpandDefinitionNameAt,
  isExpandIncDefinitionNameAt,
  buildMacroIndex,
  isReservedDirectiveKeyword,
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
import { activateReleaseNotes } from './providers/releaseNotesProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('GESStabs');
  context.subscriptions.push(outputChannel);
  logger.setOutputChannel(outputChannel);
  logger.refreshLogLevelFromConfig();
  logger.debug('gesstabs: extension activated');

  activateReleaseNotes(context);

  // Registered before every other listener below, so an edit has already
  // invalidated the shared workspace index by the time anything that
  // reacts to the same edit (the debounced diagnostics) asks for it.
  registerWorkspaceIndexInvalidation(context);

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

  // The #-block analogue of the built-in "Go to Bracket"
  // (editor.action.jumpToBracket, Ctrl+Shift+\), which only pairs bracket
  // characters: on a #MACRO/#ENDMACRO line — or #IFDEF-family/#END,
  // #STARTEXPORT/#ENDEXPORT, IFBLOCK|WHILEBLOCK/ENDBLOCK,
  // SETFILTER/ENDFILTER — it jumps to the matching delimiter; anywhere
  // else it defers to the built-in, so the same keystroke still does
  // normal bracket matching everywhere it used to.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'gesstabs.jumpToMatchingDirective',
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'gesstabs') {
          await vscode.commands.executeCommand('editor.action.jumpToBracket');
          return;
        }
        const scope = sc.getCachedScope(editor.document);
        const lines: string[] = [];
        for (let i = 0; i < editor.document.lineCount; i += 1) {
          lines.push(editor.document.lineAt(i).text);
        }
        const target = findMatchingDirectiveLine(
          lines,
          editor.selection.active.line,
          (line, char) => scope.isNotInComment(line, char)
        );
        if (target === undefined) {
          await vscode.commands.executeCommand('editor.action.jumpToBracket');
          return;
        }
        const indent = editor.document.lineAt(target).text.search(/\S/);
        const pos = new vscode.Position(target, Math.max(indent, 0));
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos));
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

  // Two tiers. The document-local checks (GesstabsDiagnosticsManager) only
  // read the one document and run per document shortly after typing
  // stops. The workspace-wide ones (GesstabsExternalNamesManager: data
  // sources, undefined / duplicate variables, macro collisions) depend on
  // every file of the program — an edit in one file can change any open
  // document's result — and cost a full model build, so they run once for
  // every open gessTabs document together, after a longer pause, sharing
  // one workspace index and model. A newer edit abandons a pass that is
  // still working through the documents.
  const LOCAL_DIAGNOSTICS_DELAY_MS = 300;
  const WORKSPACE_DIAGNOSTICS_DELAY_MS = 1000;
  const isGesstabs = (document: vscode.TextDocument): boolean =>
    document.languageId === 'gesstabs';
  const localTimers = new Map<string, ReturnType<typeof setTimeout>>();
  let workspaceTimer: ReturnType<typeof setTimeout> | undefined;
  let workspacePass = 0;

  const scheduleWorkspaceDiagnostics = (): void => {
    if (workspaceTimer) clearTimeout(workspaceTimer);
    workspacePass += 1;
    const pass = workspacePass;
    workspaceTimer = setTimeout(() => {
      workspaceTimer = undefined;
      // One document after the other, yielding to the event loop in
      // between (setImmediate, not just a microtask): each refresh is
      // mostly synchronous work, and this lets queued requests — other
      // extensions' included — run between documents.
      const yieldToEventLoop = (): Promise<void> =>
        new Promise((resolve) => {
          setImmediate(resolve);
        });
      vscode.workspace.textDocuments
        .filter(isGesstabs)
        .reduce(
          (previous, document) =>
            previous
              .then(yieldToEventLoop)
              .then(() =>
                pass === workspacePass
                  ? externalNamesManager
                      .refresh(document)
                      .catch(() => undefined)
                  : undefined
              ),
          Promise.resolve()
        );
    }, WORKSPACE_DIAGNOSTICS_DELAY_MS);
  };

  const scheduleDiagnostics = (document: vscode.TextDocument): void => {
    if (!isGesstabs(document)) return;
    const key = document.uri.toString();
    const existing = localTimers.get(key);
    if (existing) clearTimeout(existing);
    localTimers.set(
      key,
      setTimeout(() => {
        localTimers.delete(key);
        diagnosticsManager.refresh(document);
      }, LOCAL_DIAGNOSTICS_DELAY_MS)
    );
    scheduleWorkspaceDiagnostics();
  };

  context.subscriptions.push({
    dispose: () => {
      localTimers.forEach((timer) => clearTimeout(timer));
      localTimers.clear();
      if (workspaceTimer) clearTimeout(workspaceTimer);
      workspacePass += 1;
    },
  });

  externalNamesManager.setOnChange(scheduleWorkspaceDiagnostics);

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
    vscode.workspace.onDidChangeTextDocument((e) => {
      // A gessTabs edit can move the CSVINFILE/SPSSINFILE/DATAFILE line (or
      // an INCLUDE), so the entry-program cache — and every statement line
      // number go-to-definition / hover read out of it for a raw dataset
      // variable — must not be trusted until it is rebuilt from the live
      // buffer. Cheap: just marks it stale, the rebuild is lazy.
      if (e.document.languageId === 'gesstabs') {
        externalNamesManager.noteDocumentsChanged();
      }
      sc.clearScopeCache(e.document);
      // Only real content changes: a save / dirty-state flip fires this
      // too, with no contentChanges, and must not restart the diagnostics.
      if (e.contentChanges.length > 0) scheduleDiagnostics(e.document);
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      sc.clearScopeCache(document);
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      const key = document.uri.toString();
      const pending = localTimers.get(key);
      if (pending) clearTimeout(pending);
      localTimers.delete(key);
      diagnosticsManager.clear(document);
      externalNamesManager.clear(document);
      sc.clearScopeCache(document);
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration('gesstabs.logLevel') ||
        e.affectsConfiguration('gesstabs.debugMode')
      ) {
        logger.refreshLogLevelFromConfig();
      }
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
  // Scheduled rather than run inline: activation itself stays quick, and
  // the documents already open at startup share one workspace pass.
  vscode.workspace.textDocuments.forEach(scheduleDiagnostics);

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
export function deactivate() {
  sc.clearScopeCache();
}

// fixDriveCasingInWindows/getWorkspaceFolderPath/normalizePath/
// workspaceReader/resolvedLineRange/findWorkspaceFiles live in
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

    // A "#name" (macro call or #EXPAND/#EXPANDINC reference) is a
    // different symbol grammar from the ordinary COMPUTE/GROUPS/...
    // variable one below — same reasoning as GesstabsReferenceProvider's
    // own hash-name branch (see its comment). Before this, F12 on a macro
    // call found nothing at all (word/model both miss the "#"), even
    // though hovering the very same call already showed a jump link to
    // the definition — GesstabsMacroHoverProvider resolves this itself,
    // go-to-definition never did. `hashNameDefinition` returns `undefined`
    // (not `null`) when the cursor isn't on a "#" token at all, so that
    // case — and only that case — falls through to the ordinary word path
    // below; a "#" token that resolves to no known macro/#EXPAND name
    // stops here with `null`, rather than falling through and resolving
    // the de-hashed bare word as an unrelated ordinary variable.
    const lineText = document.lineAt(position.line).text;
    if (
      sc
        .getCachedScope(document)
        .isNormalScope(position.line, position.character)
    ) {
      const hashDef = await this.hashNameDefinition(
        document,
        lineText,
        position
      );
      if (hashDef !== undefined) return hashDef;
    }
    if (token && token.isCancellationRequested) return null;

    const wordAtPosition = getWordAtPosition(document, position);
    if (!wordAtPosition[0]) return null;
    const word = wordAtPosition[1];

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: provideDefinition failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;
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
        const locations = primary.map((d) => {
          // A raw dataset column's only "declaration" is the
          // CSVINFILE/SPSSINFILE/DATAFILE statement, whose synthetic
          // ResolvedLine is anchored to the statement's *start* line. When
          // that statement wraps across physical lines (§11.7 "multi-line
          // input statements") the start line is the bare `csvinfile`
          // keyword — jumping there lands "a few lines too high". Prefer
          // the physical line/column the <filepath> token actually sits
          // on, exactly as the data-source DocumentLink already does.
          if (sym.origin === 'external') {
            const src = externalSources.find(
              (s) =>
                s.statement.file === d.line.file &&
                s.statement.line === d.line.line
            );
            if (src && src.statement.pathLine !== undefined) {
              const ch = src.statement.pathChar ?? 0;
              return new vscode.Location(
                vscode.Uri.file(d.line.file),
                new vscode.Range(
                  new vscode.Position(src.statement.pathLine, ch),
                  new vscode.Position(
                    src.statement.pathLine,
                    ch + src.statement.rawPath.length
                  )
                )
              );
            }
          }
          return new vscode.Location(
            vscode.Uri.file(d.line.file),
            resolvedLineRange(d.line)
          );
        });
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

  // Resolves a "#name" (macro call or #EXPAND/#EXPANDINC reference) under
  // the cursor to its declaration — the exact detection
  // GesstabsMacroHoverProvider (providers/macroProviders.ts) already uses
  // for its own "jump to definition" hover link; go-to-definition never
  // had an equivalent until now. Returns `undefined` when the cursor isn't
  // on a "#" token at all (the caller falls through to the ordinary word
  // path below); `null` when it is one but resolves to nothing (a reserved
  // directive keyword, the name's own declaring line, or an unknown name)
  // — deliberately NOT falling through in that case, since the de-hashed
  // bare word could otherwise spuriously resolve as an unrelated ordinary
  // variable.
  private async hashNameDefinition(
    document: vscode.TextDocument,
    lineText: string,
    position: vscode.Position
  ): Promise<vscode.Location | null | undefined> {
    const call = findMacroCalls(lineText).find((c) => {
      const hashPos = c.index + c.raw.indexOf('#');
      const nameEnd = hashPos + 1 + c.name.length;
      return position.character >= hashPos && position.character <= nameEnd;
    });
    const name = call?.name ?? findHashNameAt(lineText, position.character);
    if (!name) return undefined; // not on a "#" token at all

    if (isReservedDirectiveKeyword(name)) return null;

    if (
      !call &&
      (isExpandDefinitionNameAt(lineText, position.character) ||
        isExpandIncDefinitionNameAt(lineText, position.character))
    ) {
      return null; // already on the declaring name itself
    }

    // conditionalsAllActive: a definition in an #ifdef/#ifndef branch this
    // build doesn't compile is still a real definition — same reasoning as
    // the ordinary variable path above.
    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: provideDefinition (hash-name) failed: ${e}`);
      return null;
    }
    const lineAt = (file: string, line: number): ResolvedLine =>
      index.order.find((rl) => rl.file === file && rl.line === line) ?? {
        file,
        line,
        text: '',
      };

    if (call) {
      const macroIndex = buildMacroIndex(findMacroDefinitions(index.order));
      const target = macroIndex.get(call.name.toLowerCase());
      if (!target) return null;
      return new vscode.Location(
        vscode.Uri.file(target.file),
        resolvedLineRange(lineAt(target.file, target.defLine))
      );
    }

    // #EXPANDINC takes precedence over a same-named plain #EXPAND — same
    // convention as the hover's own resolution order.
    const incDef = findExpandIncDefinitions(index.order).get(name);
    if (incDef) {
      return new vscode.Location(
        vscode.Uri.file(incDef.file),
        resolvedLineRange(lineAt(incDef.file, incDef.line))
      );
    }

    const site = findExpandDefinitionSites(index.order).get(name);
    if (!site) return null;
    return new vscode.Location(
      vscode.Uri.file(site.file),
      resolvedLineRange(lineAt(site.file, site.line))
    );
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
    // A "#name" (macro call/declaration, #EXPAND/#EXPANDINC reference or
    // declaration) is a different symbol grammar from the ordinary
    // COMPUTE/GROUPS/... variable one below — constVarName (used by
    // getWordAtPosition) has no "#" in it at all, and the variable-model
    // scan that the word-based path falls through to deliberately excludes
    // a "#"-prefixed hit (see findHashNameOccurrences' own doc comment in
    // core/macroExpansion.ts) — so a macro/#EXPAND name never turned up in
    // "Find All References" without this. Checked first and independently
    // of getWordAtPosition, which would otherwise either drop the leading
    // "#" (cursor inside the name itself) or find no word at all (cursor
    // right on the "#").
    const lineText = document.lineAt(position.line).text;
    const scope = sc.getCachedScope(document);
    const hashName = scope.isNormalScope(position.line, position.character)
      ? findHashNameAt(lineText, position.character)
      : undefined;
    if (hashName && !isReservedDirectiveKeyword(hashName)) {
      return this.hashNameReferences(document, hashName, context, token);
    }

    const wordAtPosition = getWordAtPosition(document, position);
    if (!wordAtPosition[0]) return null;
    const word = wordAtPosition[1];

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: provideReferences failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;
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

  // Every literal "#hashName" occurrence across the resolved workspace —
  // see provideReferences' own comment for why this is a separate path
  // from the ordinary variable-model scan above.
  private async hashNameReferences(
    document: vscode.TextDocument,
    hashName: string,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[] | null> {
    // conditionalsAllActive: same reasoning as the ordinary variable path —
    // a macro/#EXPAND definition or usage in a branch this build doesn't
    // compile is still real.
    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: provideReferences (hash-name) failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;
    // Macro names are matched case-insensitively, #EXPAND/#EXPANDINC names
    // case-sensitively (the language's own documented convention — see
    // macroExpansion.ts's module doc comment): `hashName` resolving in the
    // macro index picks the former, anything else the latter.
    const macroIndex = buildMacroIndex(findMacroDefinitions(index.order));
    const caseSensitive = !macroIndex.has(hashName.toLowerCase());

    return findHashNameOccurrences(index.order, hashName, caseSensitive)
      .filter((occ) => context.includeDeclaration || !occ.isDeclaration)
      .map(
        (occ) =>
          new vscode.Location(
            vscode.Uri.file(occ.file),
            new vscode.Range(
              new vscode.Position(occ.line, occ.character),
              new vscode.Position(occ.line, occ.character + occ.length)
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

    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: prepareRename failed: ${e}`);
      return wordRange;
    }
    if (token && token.isCancellationRequested) return wordRange;
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

    // conditionalsAllActive: a definition/usage in an #ifdef/#ifndef
    // branch this build doesn't compile is still a real definition/usage —
    // go-to-definition, references and rename must see it (same reasoning
    // as the macro hover). #ifdef gating decides what runs, not what a
    // symbol is.
    let index: WorkspaceIndex;
    try {
      index = programIndexFor(
        await getWorkspaceIndex(document, { conditionalsAllActive: true }),
        normalizePath(document.uri.fsPath)
      );
    } catch (e) {
      logger.error(`gesstabs: provideRenameEdits failed: ${e}`);
      return null;
    }
    if (token && token.isCancellationRequested) return null;

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
      const scope = sc.getCachedScope(document);
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

// Every workspace symbol Ctrl+T can list, unfiltered — see
// GessTabsWorkspaceSymbolProvider below, which caches this per index.
function collectWorkspaceSymbols(
  files: string[],
  index: WorkspaceIndex,
  externalSources: ExternalNameSource[]
): vscode.SymbolInformation[] {
  const reader = workspaceReader();
  const symbols: vscode.SymbolInformation[] = [];
  const rangeFor = (file: string, line: number): vscode.Range => {
    const lines = reader(file);
    if (lines && line >= 0 && line < lines.length)
      return new vscode.Range(line, 0, line, lines[line].length);
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
  files.forEach((file) => {
    const lines = reader(file);
    if (!lines) return;
    const scope = scopeForLines(lines);

    lines.forEach((lineText, i) => {
      if (lineText.length === 0) return;
      const normalScope = (searchIndex: number) =>
        scope.isNormalScope(i, searchIndex);

      const macroMatch = matchInScope(lineText, macroRegExp, normalScope);
      if (macroMatch && macroMatch[2]) {
        push(vscode.SymbolKind.Function, 'macro', macroMatch[2], file, i);
      }
      const expandMatch = matchInScope(lineText, expandRegExp, normalScope);
      if (expandMatch && expandMatch[2]) {
        push(vscode.SymbolKind.Function, 'expand', expandMatch[2], file, i);
      }
    });

    const order: ResolvedLine[] = lines.map((text, i) => ({
      file,
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
            file,
            stmt.startLine
          );
        });
    });
  });

  return symbols;
}

// Allow the user to quickly navigate to symbol definitions anywhere in the folder (workspace) opened in VS
class GessTabsWorkspaceSymbolProvider
  implements vscode.WorkspaceSymbolProvider
{
  constructor(private readonly externalNames?: GesstabsExternalNamesManager) {}

  // The full, unfiltered symbol list for the index + data sources it was
  // built from: VS Code asks again on every keystroke in the Ctrl+T box,
  // and the list only changes with the (shared, cached) workspace index.
  private cached:
    | {
        index: WorkspaceIndex;
        sources: ExternalNameSource[];
        symbols: vscode.SymbolInformation[];
      }
    | undefined;

  public async provideWorkspaceSymbols(
    query: string,
    token: vscode.CancellationToken
  ): Promise<vscode.SymbolInformation[]> {
    const activeUri = vscode.window.activeTextEditor?.document.uri;
    const wsfolder =
      getWorkspaceFolderPath(activeUri) ||
      (activeUri
        ? fixDriveCasingInWindows(path.dirname(activeUri.fsPath))
        : undefined);
    if (!wsfolder) return [];

    // The shared workspace index and the files it was built from, read
    // through the same live-buffer-else-disk reader — this used to open
    // every script via openTextDocument, which fired onDidOpenTextDocument
    // (and with it a diagnostics pass) for every file in the folder.
    let files: string[];
    let index: WorkspaceIndex;
    try {
      files = await workspaceScriptFiles(wsfolder);
      index = await getFolderIndex(wsfolder, { conditionalsAllActive: true });
    } catch (e) {
      logger.error(`gesstabs: provideWorkspaceSymbols failed: ${e}`);
      return [];
    }
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

    const hit = this.cached;
    let symbols: vscode.SymbolInformation[];
    if (
      hit &&
      hit.index === index &&
      hit.sources.length === externalSources.length &&
      hit.sources.every((src, i) => src === externalSources[i])
    ) {
      ({ symbols } = hit);
    } else {
      symbols = collectWorkspaceSymbols(files, index, externalSources);
      this.cached = { index, sources: externalSources, symbols };
    }

    if (!query) return symbols;
    const q = query.toLowerCase();
    return symbols.filter((s) => s.name.toLowerCase().includes(q));
  }
}
