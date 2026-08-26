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
import { getAllFilenamesInDirectory } from './fsutils';
import {
  lineMatchesDefinition,
  lineMatchesUsage,
  matchInScope,
} from './matching';

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
}

// this method is called when your extension is deactivated
// eslint-disable-next-line no-empty-function
export function deactivate() {}

// Workaround for issue in https://github.com/Microsoft/vscode/issues/9448#issuecomment-244804026
function fixDriveCasingInWindows(pathToFix: string): string {
  return process.platform === 'win32' && pathToFix
    ? pathToFix.substr(0, 1).toUpperCase() + pathToFix.substr(1)
    : pathToFix;
}

function getWorkspaceFolderPath(fileUri?: vscode.Uri): string | undefined {
  if (fileUri) {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    if (workspace) {
      return fixDriveCasingInWindows(workspace.uri.fsPath);
    }
  }

  // fall back to the first workspace
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length) {
    return fixDriveCasingInWindows(folders[0].uri.fsPath);
  }
  return undefined;
}

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

// Rekursive, gecachte Dateisuche lebt in src/fsutils.ts (getAllFilenamesInDirectory,
// oben importiert) und nutzt den geteilten TTL-LRU-Cache aus src/lru.ts.

// sucht alle Stellen, an denen eine Definition von "word" im Dokument "filename" vorkommt
// wobei hier die Definitionen wichtig sind, also sprachenspezifisch für gesstabs
// d.h. es wird nur dann "word" gefunden, wenn es ein Variablenname, ein compute,
// ein #macro oder eine #expand Definition ist.
async function getDefLocationInDocument(
  filename: string,
  word: string
): Promise<vscode.Location | undefined> {
  let locPosition: vscode.Location | undefined;

  return vscode.workspace.openTextDocument(filename).then((content) => {
    const scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      const line = content.lineAt(i);
      if (line.text.length === 0) {
        continue;
      }

      if (
        lineMatchesDefinition(line.text, word, (searchIndex) =>
          scope.isNotInComment(i, searchIndex)
        )
      ) {
        locPosition = new vscode.Location(content.uri, line.range);
      }
    }
    return locPosition;
  });
}

// sucht alle Stellen, an denen die Variable genutzt wird, also nicht nur, wo
// sie definiert wird, sondern auch in tables.
async function getAllLocationsInDocument(filename: string, word: string) {
  const locArray: vscode.Location[] = [];

  return vscode.workspace.openTextDocument(filename).then((content) => {
    const scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      const line = content.lineAt(i);
      if (line.text.length === 0) {
        continue;
      }

      if (
        lineMatchesUsage(line.text, word, (searchIndex) =>
          scope.isNotInComment(i, searchIndex)
        )
      ) {
        locArray.push(new vscode.Location(content.uri, line.range));
      }
    }
    return locArray;
  });
}

// Allow the user to see the definition of variables/functions/methods
// right where the variables / functions / methods are being used.
class GesstabsDefintionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | null> {
    const wordAtPosition: [boolean, string, vscode.Position] =
      getWordAtPosition(document, position);

    return new Promise<vscode.Location | null>((resolve) => {
      if (!wordAtPosition[0]) {
        resolve(null);
        return;
      }

      const word = wordAtPosition[1];

      const wsfolder =
        getWorkspaceFolderPath(document.uri) ||
        fixDriveCasingInWindows(path.dirname(document.fileName));

      getAllFilenamesInDirectory(wsfolder, '(tab|inc)')
        .then((fileNames): Promise<Array<vscode.Location | undefined>> => {
          if (token && token.isCancellationRequested) {
            resolve(null);
            return Promise.resolve([]);
          }
          const locations = fileNames.map((file) =>
            getDefLocationInDocument(file, word)
          );
          return Promise.all(locations);
        })
        .then((contents) => {
          if (token && token.isCancellationRequested) {
            resolve(null);
            return;
          }
          resolve(contents.find((loc) => loc) || null);
        })
        .catch((e) => {
          printDebugMessage(`gesstabs: provideDefinition failed: ${e}`);
          resolve(null);
        });
    });
  }
}

// Allow the user to see all the source code locations where a certain
// variable / function/ method / symbol is being used.
class GesstabsReferenceProvider implements vscode.ReferenceProvider {
  // Temporarily disabled: the previous implementation could hang indefinitely
  // (it never called `resolve()` on some paths). Needs a rewrite before
  // re-enabling — see git history for the earlier logic.
  public provideReferences(): Promise<vscode.Location[] | null> {
    return Promise.resolve(null);
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
