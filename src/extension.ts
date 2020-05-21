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

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GessTabsDocumentSymbolProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GessTabsDefinitionProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerReferenceProvider(
      { language: 'gesstabs', scheme: 'file' },
      new GessTabsReferenceProvider()
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

function adjustWordPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): [boolean, string, vscode.Position] {
  const wordRange = document.getWordRangeAtPosition(position, /(#?[\w\.]+)\b/);
  const word = wordRange ? document.getText(wordRange) : '';
  if (!wordRange) {
    return [false, '', position];
  }
  if (position.isEqual(wordRange.end) && position.isAfter(wordRange.start)) {
    position = position.translate(0, -1);
  }

  return [true, word, position];
}

function getAllFiles(dir: string, fType: string): any[] {
  let results: any[] = [];
  let regEXP = new RegExp('\\.' + fType + '$', 'i');
  let list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '\\' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recursive into a subdirectory */
      results = results.concat(getAllFiles(file, fType));
    } else {
      /* Is a file */
      // results.push(file);
      if (file.match(regEXP)) {
        results.push(file);
      }
    }
  });
  return results;
}

class GessTabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      var symbols: vscode.SymbolInformation[] = [];

      var labelRe = new RegExp(
        /\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels)\b\s*(["']?)([\w\.]*)\2\s*(((["']?)([\w\.]*)\6\s*)*)=/i
      );
      var variableRe = new RegExp(
        /\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\b\s*(["']?)([\w\.]*)\2\s*=/i
      );
      var computeWithRe = new RegExp(
        /\b(compute\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init)\b)\s*([\w\.]+)\b\s*=/i
      );
      var macroRe = new RegExp(/(?:#macro)\s+(#[\w\.]+)\b\s*\(/i);
      var expandRe = new RegExp(/(?:#expand)\s+(#[\w\.]+)\b/i);
      var tableRe = new RegExp(
        /\b(table)\b(?:[^=]*)=\s*([^\s]+(?:\s[^\s]+)*)\s+by\s+([^\s]+(?:\s[^\s]+)*);/i
      );

      let scope = new sc.Scope(document);

      for (let i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (line.text.length === 0) {
          continue;
        }

        if (scope.isNoSpecialScope(i, line.text.search(labelRe))) {
          let lineMatch = line.text.match(labelRe);
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
        if (scope.isNoSpecialScope(i, line.text.search(variableRe))) {
          let lineMatch = line.text.match(variableRe);
          if (lineMatch && lineMatch.length >= 3 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase(),
            });
          }
        }
        if (scope.isNoSpecialScope(i, line.text.search(computeWithRe))) {
          let lineMatch = line.text.match(computeWithRe);
          if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
            symbols.push({
              name: lineMatch[2],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase(),
            });
          }
        }
        if (scope.isNoSpecialScope(i, line.text.search(macroRe))) {
          let lineMatch = line.text.match(macroRe);
          if (lineMatch && lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'macro',
            });
          }
        }
        if (scope.isNoSpecialScope(i, line.text.search(expandRe))) {
          let lineMatch = line.text.match(expandRe);
          if (lineMatch && lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: 'expand',
            });
          }
        }
        if (scope.isNoSpecialScope(i, line.text.search(tableRe))) {
          let lineMatch = line.text.match(tableRe);
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

function getDefLocationInDocument(filename: string, word: string) {
  var variableRe = new RegExp(
    '\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\\b\\s*(["\']?)(' +
      word +
      ')\\2\\s*=',
    'i'
  );
  var computeWithRe = new RegExp(
    '\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*(' +
      word +
      ')\\b\\s*=',
    'i'
  );
  var macroRe = new RegExp(
    '#macro\\s*(' +
      word +
      ')\\b\\s*\\(|#[\\w\\.]+\\b\\s*\\(.*\\b(' +
      word +
      ')\\b',
    'i'
  );
  var expandRe = new RegExp('#expand\\s+(' + word + ')\\b', 'i');

  let locPosition: vscode.Location;

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);

      if (
        scope.isNoSpecialScope(i, line.text.search(variableRe)) ||
        scope.isNoSpecialScope(i, line.text.search(computeWithRe)) ||
        scope.isNoSpecialScope(i, line.text.search(macroRe)) ||
        scope.isNoSpecialScope(i, line.text.search(expandRe))
      ) {
        locPosition = new vscode.Location(content.uri, line.range);
      }
    }
    return locPosition;
  });
}

class GessTabsDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Thenable<vscode.Location> {
    const adjustedPos = adjustWordPosition(document, position);

    return new Promise((resolve) => {
      if (!adjustedPos[0]) {
        return Promise.resolve(null);
      }

      const word = adjustedPos[1];

      let wsfolder =
        getWorkspaceFolderPath(document.uri) ||
        fixDriveCasingInWindows(path.dirname(document.fileName));
      let fileNames: string[] = [];

      fileNames = getAllFiles(wsfolder, '(tab|inc)');

      let locations = fileNames.map((file) =>
        getDefLocationInDocument(file, word)
      );
      Promise.all(locations)
        .then(function (content) {
          content.forEach((loc) => {
            if (loc != null) {
              return loc;
            }
          });
        })
        .then((result: any) => {
          resolve(result);
        });
    });
  }
}

function getAllLocationInDocument(filename: string, word: string) {
  var labelRe = new RegExp(
    '\\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels)\\b\\s*.*(["\']?)(' +
      word +
      ')\\2.*=',
    'i'
  );
  var variableRe = new RegExp(
    '\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance|excludevalues|includevalues)\\b\\s*(["\']?)(' +
      word +
      ')\\2\\s*',
    'i'
  );
  var computeWithRe = new RegExp(
    '\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*(' +
      word +
      ')\\b\\s*',
    'i'
  );
  var macroRe = new RegExp(
    '#macro\\s*(' +
      word +
      ')\\b\\s*\\(|#[\\w\\.]+\\b\\s*\\(.*\\b(' +
      word +
      ')\\b',
    'i'
  );
  var expandRe = new RegExp('#expand\\s+(' + word + ')\\b', 'i');
  var tableRe = new RegExp(
    '\\b(table)\\b(?:[^=]*)=\\s*[\\w\\.\\s]*(' +
      word +
      '[^\\s]*)\\b|\\b(table)\\b(?:[^=]*)=.+by\\s*[\\w\\.\\s]*(' +
      word +
      '[^\\s]*)\\b',
    'i'
  );
  let wordRe = new RegExp(
    '(in)\\s*\\b(' +
      word +
      '[^\\s]*)\\b|\\b(' +
      word +
      '[^\\s]*)\\s*\\b(eq|ne|le|ge|lt|gt)\\b',
    'i'
  );

  let locArray: vscode.Location[] = [];

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);

      if (
        scope.isNoSpecialScope(i, line.text.search(labelRe)) ||
        scope.isNoSpecialScope(i, line.text.search(variableRe)) ||
        scope.isNoSpecialScope(i, line.text.search(computeWithRe)) ||
        scope.isNoSpecialScope(i, line.text.search(macroRe)) ||
        scope.isNoSpecialScope(i, line.text.search(expandRe)) ||
        scope.isNoSpecialScope(i, line.text.search(tableRe)) ||
        scope.isNoSpecialScope(i, line.text.search(wordRe))
      ) {
        locArray.push(new vscode.Location(content.uri, line.range));
      }
    }
    return locArray;
  });
}

class GessTabsReferenceProvider implements vscode.ReferenceProvider {
  public provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: { includeDeclaration: boolean },
    token: vscode.CancellationToken
  ): Thenable<vscode.Location[]> {
    const adjustedPos = adjustWordPosition(document, position);

    return new Promise((resolve) => {
      if (!adjustedPos[0]) {
        return Promise.resolve(null);
      }
      const word = adjustedPos[1];

      let loclist: vscode.Location[] = [];

      let wsfolder =
        getWorkspaceFolderPath(document.uri) ||
        fixDriveCasingInWindows(path.dirname(document.fileName));
      let fileNames: string[] = [];

      fileNames = getAllFiles(wsfolder, '(tab|inc)');

      let locations = fileNames.map((file) =>
        getAllLocationInDocument(file, word)
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
      getAllFiles(wsfolder, '(tab|inc)').forEach((file) => {
        vscode.workspace
          .openTextDocument(wsfolder + '\\' + file)
          .then(function (content) {
            let scope = new sc.Scope(content);

            for (let i = 0; i < content.lineCount; i++) {
              let line: vscode.TextLine = content.lineAt(i);
              if (line.text.search(query) > -1) {
                if (scope.isNoSpecialScope(i, line.text.search(variableRe))) {
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
                if (scope.isNoSpecialScope(i, line.text.search(tableRe))) {
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
                if (scope.isNoSpecialScope(i, line.text.search(wordRe))) {
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
                  scope.isNoSpecialScope(i, line.text.search(computeWithRe)) ||
                  scope.isNoSpecialScope(i, line.text.search(macroRe)) ||
                  scope.isNoSpecialScope(i, line.text.search(expandRe))
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
