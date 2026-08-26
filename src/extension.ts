// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import * as sc from './scope';
import {
  constTokenVarName,
  constStringVarName,
  constVarName,
  constVarList,
  singleVarDefRe,
  multiVarDefRe,
  multiVarRe,
  computeDefRe,
  macroDefRe,
  expandDefRe,
  tableHeadRe,
  tableAxisRe,
} from './regex';
import { matchInScope } from './matching';
import { getAllFilenamesInDirectory } from './fsutils';
import {
  buildWorkspaceIndex,
  findDefinitionLine,
  findAllUsages,
  findWordRangeInLine,
} from './symbolIndex';
import {
  fixDriveCasingInWindows,
  getWorkspaceFolderPath,
  normalizePath,
  makeWorkspaceReader,
  resolvedLineRange,
  findWorkspaceFiles,
} from './workspaceFiles';
import {
  GesstabsMacroHoverProvider,
  GesstabsMacroSignatureHelpProvider,
  GesstabsMacroCodeLensProvider,
} from './macroProviders';
import {
  findMacroDefinitions,
  findParamReferenceAt,
  MacroSourceLine,
} from './macroExpansion';

function printDebugMessage(message: string) {
  if (vscode.workspace.getConfiguration('gesstabs').get('debugMode')) {
    console.log(message);
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  printDebugMessage(
    'Congratulations, your extension "gesstabs" is now active!'
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsDefintionProvider()
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
      new GesstabsReferenceProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerWorkspaceSymbolProvider(
      new GessTabsWorkspaceSymbolProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerRenameProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsRenameProvider()
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
}

// this method is called when your extension is deactivated
// eslint-disable-next-line no-empty-function
export function deactivate() {}

// fixDriveCasingInWindows/getWorkspaceFolderPath/normalizePath/
// makeWorkspaceReader/resolvedLineRange/findWorkspaceFiles live in
// src/workspaceFiles.ts (shared with src/macroProviders.ts).

// regex factories have been moved to src/regex.ts

function spush(
  kind: vscode.SymbolKind,
  container: string,
  m1: string,
  m2: string,
  m3: string,
  uri: vscode.Uri,
  range: vscode.Range,
  symbols: vscode.SymbolInformation[]
) {
  const varName = new RegExp(
    `(${constTokenVarName})|(${constStringVarName})|(.+)`,
    'i'
  );
  function lpush(input: string) {
    let remaining = input;
    while (remaining && remaining.length > 0) {
      remaining = remaining.trim();
      const xname = remaining.match(varName);
      if (xname) {
        let pname = xname[3];
        if (xname[2]) {
          pname = xname[2].substring(1, xname[2].length - 1);
        } else if (xname[1]) {
          [, pname] = xname;
        }
        symbols.push({
          name: pname,
          kind,
          location: new vscode.Location(uri, range),
          containerName: container,
        });
        remaining = remaining.replace(xname[0], '');
      }
    }
  }

  lpush(m1);
  lpush(m2);
  lpush(m3);
}

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

// Allow the user to see the definition of variables/functions/methods
// right where the variables / functions / methods are being used.
class GesstabsDefintionProvider implements vscode.DefinitionProvider {
  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | null> {
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

    const index = buildWorkspaceIndex(fileNames, makeWorkspaceReader(document));
    const currentFile = normalizePath(document.uri.fsPath);
    const def = findDefinitionLine(index, currentFile, position.line, word);
    if (!def) return null;

    return new vscode.Location(
      vscode.Uri.file(def.file),
      resolvedLineRange(def)
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

    const index = buildWorkspaceIndex(fileNames, makeWorkspaceReader(document));
    const usages = findAllUsages(index, word);
    return usages.map(
      (usage) =>
        new vscode.Location(
          vscode.Uri.file(usage.file),
          resolvedLineRange(usage)
        )
    );
  }
}

// Allow the user to rename a variable everywhere it's used across the
// workspace's resolved INCLUDE graph.
class GesstabsRenameProvider implements vscode.RenameProvider {
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

    const index = buildWorkspaceIndex(fileNames, makeWorkspaceReader(document));
    const usages = findAllUsages(index, word);
    if (usages.length === 0) return null;

    const edit = new vscode.WorkspaceEdit();
    usages.forEach((usage) => {
      const wordRange = findWordRangeInLine(usage.text, word);
      if (!wordRange) return;
      const [start, end] = wordRange;
      edit.replace(
        vscode.Uri.file(usage.file),
        new vscode.Range(
          new vscode.Position(usage.line, start),
          new vscode.Position(usage.line, end)
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

      function pushDocSymbol(
        kind: vscode.SymbolKind,
        container: string,
        m1: string,
        m2: string,
        m3: string,
        uri: vscode.Uri,
        range: vscode.Range
      ): void {
        const varName = new RegExp(
          `(${constTokenVarName})|(${constStringVarName})|(.+)`
        );
        function lpush(input: string): void {
          if (input && input.length > 0) {
            symbols.push({
              name: input.trim(),
              kind,
              location: new vscode.Location(uri, range),
              containerName: container,
            });
          }
        }

        lpush(m1);
        lpush(m2);
        lpush(m3);
      }

      const singleVarRegExp: RegExp = singleVarDefRe('');
      const multiVarRegExp: RegExp = multiVarRe('');
      const multiVarDefRegExp: RegExp = multiVarDefRe('');
      const computeRegExp: RegExp = computeDefRe('');
      const macroRegExp: RegExp = macroDefRe('');
      const expandRegExp: RegExp = expandDefRe('');
      const tableHeadRegExp: RegExp = tableHeadRe('');
      const tableAxisRegExp: RegExp = tableAxisRe('');

      const scope = new sc.Scope(document);

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);

        if (token && token.isCancellationRequested) {
          resolve([]);
          return;
        }

        if (line.text.length === 0) {
          continue;
        }

        const notInComment = (searchIndex: number) =>
          scope.isNotInComment(i, searchIndex);
        const normalScope = (searchIndex: number) =>
          scope.isNormalScope(i, searchIndex);
        const groups234 = (lineMatch: RegExpMatchArray) =>
          (lineMatch[2] || '') + (lineMatch[3] || '') + (lineMatch[4] || '');

        let lineMatch = matchInScope(line.text, singleVarRegExp, notInComment);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'variable',
            `${lineMatch[2]} [${lineMatch[1].toLocaleLowerCase()}]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, multiVarRegExp, notInComment);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'variable',
            `${groups234(lineMatch)} [${lineMatch[1].toLocaleLowerCase()}]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, multiVarDefRegExp, notInComment);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'variable',
            `${groups234(lineMatch)} [${lineMatch[1].toLocaleLowerCase()}]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, computeRegExp, normalScope);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'variable',
            `${groups234(lineMatch)} [${lineMatch[1].toLocaleLowerCase()}]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, macroRegExp, normalScope);
        if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
          pushDocSymbol(
            vscode.SymbolKind.Function,
            'definition',
            `${lineMatch[2]} [macro]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, expandRegExp, normalScope);
        if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
          pushDocSymbol(
            vscode.SymbolKind.Function,
            'definition',
            `${lineMatch[2]} [expand]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, tableHeadRegExp, normalScope);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'table',
            `${groups234(lineMatch)} [head]`,
            '',
            '',
            document.uri,
            line.range
          );
        }

        lineMatch = matchInScope(line.text, tableAxisRegExp, normalScope);
        if (lineMatch) {
          pushDocSymbol(
            vscode.SymbolKind.Variable,
            'table',
            `${groups234(lineMatch)} [axis]`,
            '',
            '',
            document.uri,
            line.range
          );
        }
      }

      resolve(symbols);
    });
  }
}

// Allow the user to quickly navigate to symbol definitions anywhere in the folder (workspace) opened in VS
class GessTabsWorkspaceSymbolProvider
  implements vscode.WorkspaceSymbolProvider
{
  public provideWorkspaceSymbols(
    query: string,
    token: vscode.CancellationToken
  ): Promise<vscode.SymbolInformation[]> {
    const symbols: vscode.SymbolInformation[] = [];

    const singleVarRegExp: RegExp = singleVarDefRe(query);
    const multiVarRegExp: RegExp = multiVarDefRe(query);
    const computeRegExp: RegExp = computeDefRe(query);
    const macroRegExp: RegExp = macroDefRe(query);
    const expandRegExp: RegExp = expandDefRe(query);
    const tableHeadRegExp: RegExp = tableHeadRe(query);

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
    return new Promise<vscode.SymbolInformation[]>((resolve) => {
      getAllFilenamesInDirectory(wsfolder, '(tab|inc)')
        .then((files): Promise<vscode.TextDocument[]> => {
          if (token && token.isCancellationRequested) {
            return Promise.resolve([]);
          }
          return Promise.all(
            files.map((file) => vscode.workspace.openTextDocument(file))
          );
        })
        .then((docs) => {
          if (token && token.isCancellationRequested) return symbols;
          docs.forEach((content: vscode.TextDocument) => {
            const scope = new sc.Scope(content);

            for (let i = 0; i < content.lineCount; i++) {
              const line: vscode.TextLine = content.lineAt(i);

              if (line.text.length === 0) {
                continue;
              }

              const notInComment = (searchIndex: number) =>
                scope.isNotInComment(i, searchIndex);
              const normalScope = (searchIndex: number) =>
                scope.isNormalScope(i, searchIndex);

              let lineMatch = matchInScope(
                line.text,
                singleVarRegExp,
                notInComment
              );
              if (lineMatch) {
                spush(
                  vscode.SymbolKind.Variable,
                  lineMatch[1].toLocaleLowerCase(),
                  lineMatch[2],
                  '',
                  '',
                  content.uri,
                  line.range,
                  symbols
                );
              }

              lineMatch = matchInScope(line.text, multiVarRegExp, notInComment);
              if (lineMatch) {
                spush(
                  vscode.SymbolKind.Variable,
                  lineMatch[1].toLocaleLowerCase(),
                  lineMatch[2],
                  lineMatch[3],
                  lineMatch[4],
                  content.uri,
                  line.range,
                  symbols
                );
              }

              lineMatch = matchInScope(line.text, computeRegExp, normalScope);
              if (lineMatch) {
                spush(
                  vscode.SymbolKind.Variable,
                  lineMatch[1].toLocaleLowerCase(),
                  lineMatch[2],
                  lineMatch[3],
                  '',
                  content.uri,
                  line.range,
                  symbols
                );
              }

              lineMatch = matchInScope(line.text, macroRegExp, normalScope);
              if (
                lineMatch &&
                lineMatch.length >= 2 &&
                lineMatch[2].length > 0
              ) {
                spush(
                  vscode.SymbolKind.Function,
                  'macro',
                  lineMatch[2],
                  '',
                  '',
                  content.uri,
                  line.range,
                  symbols
                );
              }

              lineMatch = matchInScope(line.text, expandRegExp, normalScope);
              if (
                lineMatch &&
                lineMatch.length >= 2 &&
                lineMatch[2].length > 0
              ) {
                spush(
                  vscode.SymbolKind.Function,
                  'expand',
                  lineMatch[2],
                  '',
                  '',
                  content.uri,
                  line.range,
                  symbols
                );
              }

              lineMatch = matchInScope(line.text, tableHeadRegExp, normalScope);
              if (lineMatch && lineMatch.length === 5) {
                let re: RegExp;
                if (lineMatch[3].search(/"/) > -1) {
                  re = /\s*"\s*/;
                } else {
                  re = /\s+/;
                }
                lineMatch[3].split(re).forEach((value) => {
                  if (value.search(/[\s"]*&/) !== 0) {
                    symbols.push({
                      name: value,
                      kind: vscode.SymbolKind.Variable,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: 'head',
                    });
                  }
                });
                if (lineMatch[4].search(/"/) > -1) {
                  re = /\s*"\s*/;
                } else {
                  re = /\s+/;
                }
                lineMatch[4].split(re).forEach((value) => {
                  symbols.push({
                    name: value,
                    kind: vscode.SymbolKind.Variable,
                    location: new vscode.Location(content.uri, line.range),
                    containerName: 'axis',
                  });
                });
              }
            }
          });
          return symbols;
        })
        .then((result) => {
          resolve(result);
        });
    });
  }
}
