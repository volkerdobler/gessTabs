'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import * as sc from './scope';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "gesstabs" is now active!');

  // Allow the user to see the definition of variables/functions/methods
  // right where the variables / functions / methods are being used.
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
}

const variableDefRe = function (word: string): RegExp {
  return new RegExp(
    '\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\\b\\s*(["\']?)(' +
      word +
      ')\\2\\s*=',
    'i'
  );
};

const computeDefRe = function (word: string): RegExp {
  return new RegExp(
    '\\b(f?compute)\\s+.*\\b(["\']?)(' + word + ')\\2\\s*=',
    'i'
  );
};

const macroDefRe = function (word: string): RegExp {
  return new RegExp('#macro\\s+(' + word + ')\\b\\s*\\(', 'i');
};

const expandDefRe = function (word: string): RegExp {
  return new RegExp('#expand\\s+(' + word + ')\\b', 'i');
};

const labelDefRe = function (word: string): RegExp {
  return new RegExp(
    '\\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels|excludevalues|includevalues)\\b\\s*.*(["\']?)(' +
      word +
      ')\\2.*=',
    'i'
  );
};

const labelAllRe = function (): RegExp {
  return new RegExp(
    '\\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels|excludevalues|includevalues)\\b\\s*(["\']?)([\\w\\.]*)\\2\\s*(((["\']?)([\\w\\.]*)\\6\\s*)*)=',
    'i'
  );
};

const varRangeDefRe = function (word: string): RegExp {
  const wordOhneZahl = word.split(/(.*[^\d])(\d+$)/);
  let suchWort = wordOhneZahl.length > 1 ? wordOhneZahl[1] : wordOhneZahl[0];
  return new RegExp(
    '\\b(variables)\\s+(["\']?)(' +
      suchWort +
      '\\d+)\\2\\s*\\bto\\s+(["\']?)(' +
      suchWort +
      '\\d+)\\4\\b\\s*=',
    'i'
  );
};

const varListDefRe = function (): RegExp {
  return new RegExp(
    '\\b(variables)\\s+(["\']?)([\\w\\.]*)\\2\\s*(((["\']?)([\\w\\.]*)\\6\\s*)*)=',
    'i'
  );
};

const wordDefRe = function (word: string): RegExp {
  return new RegExp('\\b(["\']?)' + word + '\\1\\b', 'i');
};

const tableDefRe = function (): RegExp {
  return new RegExp(
    '\\b(table)\\b(?:[^=]*)=\\s*([^\\s]+(?:\\s[^\\s]+)*)\\s+by\\s+([^\\s]+(?:\\s[^\\s]+)*);',
    'i'
  );
};
// sucht das Wort unter dem Cursor, wobei Zahlen, Buchstaben, Punkte sowie # als
// Wort akzeptiert werden. Gibt dann einen Array zurück, wobei das 1st Element
// true ist, wenn es ein Wort gefunden hat, sonst false. Das eigentliche Wort
// steht dann an zweiter Stelle (wenn true)
function getWordAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): [boolean, string, vscode.Position] {
  const wordRange = document.getWordRangeAtPosition(
    position,
    /\b(#?[\w\.]+)\b/
  );
  const word = wordRange ? document.getText(wordRange) : '';
  if (!wordRange) {
    return [false, '', position];
  }
  if (position.isEqual(wordRange.end) && position.isAfter(wordRange.start)) {
    position = position.translate(0, -1);
  }

  return [true, word, position];
}

// durchsucht rekursiv das aktuelle Verzeichnis und gibt alle Dateinamen inkl.
// Pfad als String zurück, die dem regulären Ausdruck in fType entspricht.
function getAllFilenamesInDirectory(dir: string, fType: string): string[] {
  let results: string[] = [];
  let regEXP: RegExp = new RegExp('\\.' + fType + '$', 'i');
  let list: fs.Dirent[] = fs.readdirSync(dir, {
    encoding: 'utf8',
    withFileTypes: true,
  });

  list.forEach(function (file: fs.Dirent) {
    let fileInclDir = dir + '\\' + file.name;
    if (file.isDirectory()) {
      /* Recursive into a subdirectory */
      results = results.concat(getAllFilenamesInDirectory(fileInclDir, fType));
    } else {
      /* Is a file */
      // results.push(file);
      if (file.isFile() && file.name.match(regEXP)) {
        results.push(fileInclDir);
      }
    }
  });
  return results;
}

// sucht alle Stellen, an denen eine Definition von "word" im Dokument "filename" vorkommt
// wobei hier die Definitionen wichtig sind, also sprachenspezifisch für gesstabs
// d.h. es wird nur dann "word" gefunden, wenn es ein Variablenname, ein compute,
// ein #macro oder eine #expand Definition ist.
async function getDefLocationInDocument(
  filename: string,
  word: string
): Promise<vscode.Location> {
  let locPosition: vscode.Location;

  const varRegExp = variableDefRe(word);
  const computeRegExp = computeDefRe(word);
  const macroRegExp = macroDefRe(word);
  const expandRegExp = expandDefRe(word);

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);

      if (
        scope.isNotInComment(i, line.text.search(varRegExp)) ||
        scope.isNotInComment(i, line.text.search(computeRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroRegExp)) ||
        scope.isNotInComment(i, line.text.search(expandRegExp))
      ) {
        locPosition = new vscode.Location(content.uri, line.range);
      }
    }
    return locPosition;
  });
}

async function getAllLocationsInDocument(filename: string, word: string) {
  let locArray: vscode.Location[] = [];

  const varRangeRegExp: RegExp = varRangeDefRe(word);
  const wordRegExp: RegExp = wordDefRe(word);

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);

      if (
        scope.isNotInComment(i, line.text.search(varRangeRegExp)) ||
        scope.isNotInComment(i, line.text.search(wordRegExp))
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
  ): Thenable<vscode.Location> {
    const wordAtPosition: [
      boolean,
      string,
      vscode.Position
    ] = getWordAtPosition(document, position);

    return new Promise((resolve) => {
      if (!wordAtPosition[0]) {
        return Promise.resolve(null);
      }

      const word = wordAtPosition[1];

      let wsfolder =
        getWorkspaceFolderPath(document.uri) ||
        fixDriveCasingInWindows(path.dirname(document.fileName));

      let fileNames: string[] = getAllFilenamesInDirectory(
        wsfolder,
        '(tab|inc)'
      );

      let locations = fileNames.map((file) =>
        getDefLocationInDocument(file, word)
      );
      // has to be a Promise as the OpenTextDocument is async and we have to
      // wait until it is fullfilled with all filenames.
      Promise.all(locations).then(function (content) {
        resolve(content.find((loc) => loc));
      });
    });
  }
}

// Allow the user to see all the source code locations where a certain
// variable / function/ method / symbol is being used.
class GesstabsReferenceProvider implements vscode.ReferenceProvider {
  public provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: { includeDeclaration: boolean },
    token: vscode.CancellationToken
  ): Thenable<vscode.Location[]> {
    return new Promise((resolve) => {
      const wordAtPosition = getWordAtPosition(document, position);

      if (!wordAtPosition[0]) {
        return Promise.resolve(null);
      }
      const word = wordAtPosition[1];

      let loclist: vscode.Location[] = [];

      let wsfolder =
        getWorkspaceFolderPath(document.uri) ||
        fixDriveCasingInWindows(path.dirname(document.fileName));

      let fileNames: string[] = getAllFilenamesInDirectory(
        wsfolder,
        '(tab|inc)'
      );

      let locations = fileNames.map((file) =>
        getAllLocationsInDocument(file, word)
      );
      Promise.all(locations)
        .then(function (content) {
          content.forEach((loc) => {
            if (loc != null && loc[0] != null) {
              loc.forEach((arr) => {
                loclist.push(arr);
              });
            }
          });
          return loclist;
        })
        .then((result) => {
          resolve(result);
        })
        .catch((e) => {
          resolve(undefined);
        });
    });
  }
}

class GesstabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      var symbols: vscode.SymbolInformation[] = [];

      const labelRegExp: RegExp = labelAllRe();
      const varRegExp: RegExp = variableDefRe('[\\w\\.]+');
      const computeRegExp: RegExp = computeDefRe('[\\w\\.]+');
      const macroRegExp: RegExp = macroDefRe('[\\w\\.]+');
      const expandRegExp: RegExp = expandDefRe('[\\w\\.]+');
      const tableRegExp: RegExp = tableDefRe();
      const varRangeRegExp: RegExp = varRangeDefRe('[\\w\\.]+');
      const varListRegExp: RegExp = varListDefRe();

      // var labelRe = new RegExp(
      //   /\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels)\b\s*(["']?)([\w\.]*)\2\s*(((["']?)([\w\.]*)\6\s*)*)=/i
      // );
      // var variableRe = new RegExp(
      //   /\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\b\s*(["']?)([\w\.]*)\2\s*=/i
      // );
      // var computeWithRe = new RegExp(
      //   /\b(compute\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init)\b)\s*([\w\.]+)\b\s*=/i
      // );
      // var macroRe = new RegExp(/(?:#macro)\s+(#[\w\.]+)\b\s*\(/i);
      // var expandRe = new RegExp(/(?:#expand)\s+(#[\w\.]+)\b/i);
      // var tableRe = new RegExp(
      //   /\b(table)\b(?:[^=]*)=\s*([^\s]+(?:\s[^\s]+)*)\s+by\s+([^\s]+(?:\s[^\s]+)*);/i
      // );

      let scope = new sc.Scope(document);

      for (let i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (line.text.length === 0) {
          continue;
        }

        if (scope.isNotInComment(i, line.text.search(labelRegExp))) {
          let lineMatch = line.text.match(labelRegExp);
          if (lineMatch && lineMatch.length > 2 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.String,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase(),
            });
          }
          if (lineMatch && lineMatch.length >= 4 && lineMatch[4].length > 0) {
            lineMatch[4]
              .replace(/\"/g, '')
              .split(' ')
              .forEach(function (elem, index) {
                if (elem.length > 0) {
                  symbols.push({
                    name: elem,
                    kind: vscode.SymbolKind.String,
                    location: new vscode.Location(document.uri, line.range),
                    containerName: lineMatch
                      ? lineMatch[1].toLocaleLowerCase()
                      : '',
                  });
                }
              });
          }
        }
        if (scope.isNotInComment(i, line.text.search(varRangeRegExp))) {
          let lineMatch = line.text.match(varRangeRegExp);
          if (lineMatch) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'variables',
            });
            symbols.push({
              name: lineMatch[5],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'variables',
            });
          }
        } else {
          if (scope.isNotInComment(i, line.text.search(varListRegExp))) {
            let lineMatch = line.text.match(varListRegExp);
            if (lineMatch && lineMatch[3].length > 0) {
              symbols.push({
                name: lineMatch[3],
                kind: vscode.SymbolKind.Variable,
                location: new vscode.Location(document.uri, line.range),
                containerName: 'variables',
              });
              let re: RegExp;
              if (lineMatch[4].search(/"/) > -1) {
                re = /\s*"\s*/;
              } else {
                re = /\s+/;
              }
              lineMatch[4].split(re).forEach(function (value) {
                if (value.length > 0 && value.search(/[\s"]*&/) !== 0) {
                  symbols.push({
                    name: value,
                    kind: vscode.SymbolKind.Variable,
                    location: new vscode.Location(document.uri, line.range),
                    containerName: 'variables',
                  });
                }
              });
            }
          }
        }
        if (scope.isNotInComment(i, line.text.search(varRegExp))) {
          let lineMatch = line.text.match(varRegExp);
          if (lineMatch && lineMatch.length >= 3 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase(),
            });
          }
        }
        if (scope.isNormalScope(i, line.text.search(computeRegExp))) {
          let lineMatch = line.text.match(computeRegExp);
          if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
            symbols.push({
              name: lineMatch[2],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase(),
            });
          }
        }
        if (scope.isNormalScope(i, line.text.search(macroRegExp))) {
          let lineMatch = line.text.match(macroRegExp);
          if (lineMatch && lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'macro',
            });
          }
        }
        if (scope.isNormalScope(i, line.text.search(expandRegExp))) {
          let lineMatch = line.text.match(expandRegExp);
          if (lineMatch && lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'expand',
            });
          }
        }
        if (scope.isNormalScope(i, line.text.search(tableRegExp))) {
          let lineMatch = line.text.match(tableRegExp);
          if (lineMatch && lineMatch.length === 4) {
            let re: RegExp;
            if (lineMatch[2].search(/"/) > -1) {
              re = /\s*"\s*/;
            } else {
              re = /\s+/;
            }
            lineMatch[2].split(re).forEach(function (value) {
              if (value.search(/[\s"]*&/) !== 0) {
                symbols.push({
                  name: value,
                  kind: vscode.SymbolKind.Variable,
                  location: new vscode.Location(document.uri, line.range),
                  containerName: 'head',
                });
              }
            });
            if (lineMatch[3].search(/"/) > -1) {
              re = /\s*"\s*/;
            } else {
              re = /\s+/;
            }
            lineMatch[3].split(re).forEach(function (value) {
              symbols.push({
                name: value,
                kind: vscode.SymbolKind.Variable,
                location: new vscode.Location(document.uri, line.range),
                containerName: 'axis',
              });
            });
          }
        }
      }

      resolve(symbols);
    });
  }
}

class GessTabsWorkspaceSymbolProvider
  implements vscode.WorkspaceSymbolProvider {
  public provideWorkspaceSymbols(
    query: string,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    let symbols: vscode.SymbolInformation[] = [];
    var variableRe = new RegExp(
      '\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\\b\\s*(["\']?)(' +
        query +
        ')\\2\\s*=',
      'i'
    );
    var computeWithRe = new RegExp(
      '\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*(' +
        query +
        ')\\b\\s*=',
      'i'
    );
    var macroRe = new RegExp('#macro\\s+(#' + query + ')\\b\\s*\\(', 'i');
    var expandRe = new RegExp('#expand\\s+(#' + query + ')\\b', 'i');
    var tableRe = new RegExp(
      '\\b(table)\\b(?:[^=]*)=\\s*[\\w\\.\\s]*\\b(' +
        query +
        '[^\\s]*)\\b|\\b(table)\\b(?:[^=]*)=.+by\\s*[\\w\\.\\s]*\\b(' +
        query +
        '[^\\s]*)\\b',
      'i'
    );
    let wordRe = new RegExp(
      '(in)\\s*\\b(' +
        query +
        '[^\\s]*)\\b|\\b(' +
        query +
        '[^\\s]*)\\s*\\b(eq|ne|le|ge|lt|gt)\\b',
      'i'
    );
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
    return new Promise((resolve) => {
      getAllFilenamesInDirectory(wsfolder, '(tab|inc)').forEach((file) => {
        vscode.workspace
          .openTextDocument(wsfolder + '\\' + file)
          .then(function (content) {
            let scope = new sc.Scope(content);

            for (let i = 0; i < content.lineCount; i++) {
              let line: vscode.TextLine = content.lineAt(i);
              if (line.text.search(query) > -1) {
                if (scope.isNormalScope(i, line.text.search(variableRe))) {
                  let lineMatch = line.text.match(variableRe);
                  let lineMatch1 = lineMatch != null ? lineMatch[1] : '';
                  let lineMatch3 = lineMatch != null ? lineMatch[3] : '';
                  symbols.push({
                    name: lineMatch3,
                    kind: vscode.SymbolKind.Function,
                    location: new vscode.Location(content.uri, line.range),
                    containerName: lineMatch1,
                  });
                }
                if (scope.isNormalScope(i, line.text.search(tableRe))) {
                  let nameStr: string;
                  let commandStr: string;
                  let lineMatch = line.text.match(tableRe);
                  let lineMatch1 = lineMatch != null ? lineMatch[1] : '';
                  let lineMatch2 = lineMatch != null ? lineMatch[2] : '';
                  let lineMatch3 = lineMatch != null ? lineMatch[3] : '';
                  let lineMatch4 = lineMatch != null ? lineMatch[4] : '';
                  if (lineMatch3 == null) {
                    nameStr = lineMatch2;
                    commandStr = lineMatch1;
                  } else {
                    nameStr = lineMatch4;
                    commandStr = lineMatch3;
                  }
                  symbols.push({
                    name: nameStr,
                    kind: vscode.SymbolKind.Function,
                    location: new vscode.Location(content.uri, line.range),
                    containerName: commandStr,
                  });
                }
                if (scope.isNormalScope(i, line.text.search(wordRe))) {
                  let nameStr: string;
                  let commandStr: string;
                  let lineMatch = line.text.match(wordRe);
                  let lineMatch1 = lineMatch != null ? lineMatch[1] : '';
                  let lineMatch2 = lineMatch != null ? lineMatch[2] : '';
                  let lineMatch3 = lineMatch != null ? lineMatch[3] : '';
                  let lineMatch4 = lineMatch != null ? lineMatch[4] : '';
                  if (lineMatch3 == null) {
                    nameStr = lineMatch2;
                    commandStr = lineMatch1;
                  } else {
                    nameStr = lineMatch3;
                    commandStr = lineMatch4;
                  }
                  symbols.push({
                    name: nameStr,
                    kind: vscode.SymbolKind.Function,
                    location: new vscode.Location(content.uri, line.range),
                    containerName: commandStr,
                  });
                }
                if (
                  scope.isNormalScope(i, line.text.search(computeWithRe)) ||
                  scope.isNormalScope(i, line.text.search(macroRe)) ||
                  scope.isNormalScope(i, line.text.search(expandRe))
                ) {
                  let lineMatch = line.text.match(computeWithRe);
                  let lineMatch1 = lineMatch != null ? lineMatch[1] : '';
                  let lineMatch2 = lineMatch != null ? lineMatch[2] : '';
                  symbols.push({
                    name: lineMatch2,
                    kind: vscode.SymbolKind.Function,
                    location: new vscode.Location(content.uri, line.range),
                    containerName: lineMatch1,
                  });
                }
              }
            }
            return symbols;
          })
          .then((result) => {
            resolve(result);
          });
      });
    });
  }
}
