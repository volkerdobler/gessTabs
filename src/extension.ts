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

  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GessTabsFoldingRangeProvider()
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

const constTokenVarName: string =
  '(?:\\b(?:[A-Za-zÄÖÜßäöü][A-Za-zÄÖÜßäöü\\w\\.]*)\\b)';
const constStringVarName: string = '(?:"[^"]+")|(?:\'[^\']+\')';

const constVarName: string =
  '(?:' + constTokenVarName + '|' + constStringVarName + ')';

const constVarList: string =
  '(' + constVarName + '(?:\\s+(?:' + constVarName + '))*)';
const constVarToList: string =
  '(?:' + constVarList + '\\s*\\bto\\b\\s*' + constVarList + ')';

const constAllVarList: string =
  '(?:' + constVarToList + '|' + constVarList + ')';

function getWordDefinition(word: string): string {
  return '(?:(?:\\b' + word + '\\b)|(?:"' + word + '")|(?:\'' + word + "'))";
}

// {
//   let tempWord =
//     word.length > 0
//       ? '(?:.*"' + word + '".*)|(?:.*\'' + word + "'.*)"
//       : ;
//   return ;
// }

const wordDefRe = function (word: string): RegExp {
  return new RegExp(getWordDefinition(word), 'i');
};

const singleVarDefRe = function (word: string): RegExp {
  const singleVarConst =
    '(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|assocvar|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance|static)';

  let retVal: string = '';
  if (word && word.length > 0) {
    retVal =
      '\\b' + singleVarConst + '\\b\\s*' + getWordDefinition(word) + '\\s*=';
  } else {
    retVal = '\\b' + singleVarConst + '\\b\\s*(' + constVarName + ')\\s*=';
  }
  return new RegExp(retVal, 'i');
};

const multiVarDefRe = function (word: string): RegExp {
  const multiVarConst = '(variables)';

  let retVal: string = '';
  if (word && word.length > 0) {
    retVal =
      '\\b' +
      multiVarConst +
      '\\b\\s*' +
      '(?:' +
      '(?:' +
      constVarList +
      '*\\s*' +
      getWordDefinition(word) +
      ')|' +
      '(?:.*\\bto\\b\\s*' +
      constVarList +
      '*\\s*\\b' +
      getWordDefinition(word) +
      '\\b)' +
      ').*=';
  } else {
    retVal = '\\b' + multiVarConst + '\\b\\s*(?:' + constAllVarList + ')\\s*=';
  }
  return new RegExp(retVal, 'i');
};

const computeDefRe = function (word: string): RegExp {
  const varDefWithOptions = '\\b(f?compute|weightcells)\\b';
  const optionStr =
    '\\b(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init|replace|sort|alpha|autoalign)\\b';

  if (word && word.length > 0) {
    return new RegExp(
      varDefWithOptions +
        '\\s+(?:' +
        optionStr +
        '\\s*)?' +
        '(?:' +
        constVarList +
        '*\\s*\\b' +
        getWordDefinition(word) +
        '\\b).*=',
      'i'
    );
  } else {
    return new RegExp(
      varDefWithOptions +
        '\\s+(?:(?:' +
        optionStr +
        '\\s*(' +
        constVarName +
        '))|(?:' +
        constVarList +
        '))\\s*=',
      'i'
    );
  }
};

const macroDefRe = function (word: string): RegExp {
  let tempWord: string =
    word && word.length > 0 ? getWordDefinition(word) : constTokenVarName;

  return new RegExp('(?:(#macro)\\s+(#' + tempWord + ')\\s*\\()', 'i');
};

const macroRe = function (word: string): RegExp {
  let tempWord: string =
    word && word.length > 0 ? getWordDefinition(word) : constTokenVarName;

  return new RegExp(
    '#' + constTokenVarName + '\\s*\\(.*(' + tempWord + ').*',
    'i'
  );
};

const macroOwnDefRe = function (word: string): RegExp {
  const multiMacros = ['makemulti', 'makemulti2'];

  let tempWord: string =
    word && word.length > 0 ? getWordDefinition(word) : '\\0';

  let regExpStr = '';

  multiMacros.forEach(function (value, index) {
    regExpStr += '(?:#' + value + '\\s*\\(\\s*(' + tempWord + '))|';
  });

  regExpStr +=
    '(?:(#makeskalavar)\\s*\\(\\s*(' + tempWord.replace('_skala', '') + '))|';
  regExpStr +=
    '(?:(#skalatab)\\s*\\(\\s*(' + tempWord.replace('_t_b', '') + '))|';

  if (regExpStr.endsWith('|')) {
    regExpStr = regExpStr.substring(0, regExpStr.length - 1);
  }
  if (regExpStr.length === 0) {
    regExpStr = '\\0';
  }

  return new RegExp(regExpStr);
};

const expandDefRe = function (word: string): RegExp {
  let tempWord =
    word && word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  return new RegExp('(?:(#expand)\\s+(#' + tempWord + '))', 'i');
};

const expandRe = function (word: string): RegExp {
  let tempWord =
    word && word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  return new RegExp('(#' + tempWord + ')\\b', 'i');
};

const multiVarRe = function (word: string): RegExp {
  const multiVarConst =
    '(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels|excludevalues|includevalues)';

  let retVal: string = '';
  if (word && word.length > 0) {
    retVal =
      '\\b' +
      multiVarConst +
      '\\b\\s*' +
      '(?:' +
      '(?:' +
      constVarList +
      '*\\s*' +
      getWordDefinition(word) +
      ')|' +
      '(?:.*\\s*\\bto\\b\\s*' +
      constVarList +
      '*\\s*\\b' +
      getWordDefinition(word) +
      '\\b)' +
      ').*=';
  } else {
    retVal = '\\b' + multiVarConst + '\\b\\s*(?:' + constAllVarList + ')\\s*=';
  }
  return new RegExp(retVal, 'i');
};

const tableHeadRe = function (word: string): RegExp {
  const tableVarConst = '(table)';

  let retVal: string = '';
  if (word && word.length > 0) {
    retVal =
      '\\b' +
      tableVarConst +
      '\\b[^=]*=\\s*' +
      '(?:' +
      constAllVarList +
      '*\\s*' +
      getWordDefinition(word) +
      '.*\\bby\\b)';
  } else {
    retVal =
      '\\b' +
      tableVarConst +
      '\\b[^=]*=\\s*(?:' +
      constAllVarList +
      ')\\s*\\bby\\b';
  }
  return new RegExp(retVal, 'i');
};

const tableAxisRe = function (word: string): RegExp {
  const tableVarConst = '(table)';

  let retVal: string = '';
  if (word && word.length > 0) {
    retVal =
      '\\b' +
      tableVarConst +
      '\\b[^=]*=\\s*' +
      '(?:.*\\s*\\bby\\b\\s*' +
      constAllVarList +
      '*\\s*' +
      getWordDefinition(word) +
      ')';
  } else {
    retVal =
      '\\b' +
      tableVarConst +
      '\\b[^=]*=\\s*.+\\s*\\bby\\b\\s*' +
      '(?:' +
      constAllVarList +
      ')';
  }
  return new RegExp(retVal, 'i');
};

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
    '(' + constTokenVarName + ')|(' + constStringVarName + ')|(.+)'
  );
  function lpush(teststring: string) {
    while (teststring && teststring.length > 0) {
      teststring = teststring.trim();
      let xname = teststring.match(varName);
      if (xname) {
        let pname = xname[2]
          ? xname[2].substring(1, xname[2].length - 1)
          : xname[1]
          ? xname[1]
          : xname[3];
        symbols.push({
          name: pname,
          kind: kind,
          location: new vscode.Location(uri, range),
          containerName: container,
        });
        teststring = teststring.replace(xname[0], '');
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

  const singleVarRegExp = singleVarDefRe(word);
  const multiVarRegExp = multiVarDefRe(word);
  const computeRegExp = computeDefRe(word);
  const macroRegExp = macroDefRe(word);
  const macroOwnRegExp = macroOwnDefRe(word);
  const expandRegExp = expandDefRe(word);

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);
      if (line.text.length === 0) {
        continue;
      }

      if (
        scope.isNotInComment(i, line.text.search(singleVarRegExp)) ||
        scope.isNotInComment(i, line.text.search(multiVarRegExp)) ||
        scope.isNotInComment(i, line.text.search(computeRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroOwnRegExp)) ||
        scope.isNotInComment(i, line.text.search(expandRegExp))
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
  let locArray: vscode.Location[] = [];

  //  const wordRegExp: RegExp = wordDefRe(word);
  const singleVarRegExp = singleVarDefRe(word);
  const multiVarRegExp = multiVarRe(word);
  const multiVarDefRegExp = multiVarDefRe(word);
  const computeRegExp = computeDefRe(word);
  const macroDefRegExp = macroDefRe(word);
  const macroRegExp = macroRe(word);
  const macroOwnRegExp = macroOwnDefRe(word);
  const expandDefRegExp = expandDefRe(word);
  const expandRegExp = expandRe(word);
  const tableHeadRegExp = tableHeadRe(word);
  const tableAxisRegExp = tableAxisRe(word);

  return vscode.workspace.openTextDocument(filename).then((content) => {
    let scope = new sc.Scope(content);

    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);
      if (line.text.length === 0) {
        continue;
      }

      if (
        scope.isNotInComment(i, line.text.search(singleVarRegExp)) ||
        scope.isNotInComment(i, line.text.search(multiVarRegExp)) ||
        scope.isNotInComment(i, line.text.search(computeRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroDefRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroRegExp)) ||
        scope.isNotInComment(i, line.text.search(macroOwnRegExp)) ||
        scope.isNotInComment(i, line.text.search(expandDefRegExp)) ||
        scope.isNotInComment(i, line.text.search(expandRegExp)) ||
        scope.isNotInComment(i, line.text.search(tableHeadRegExp)) ||
        scope.isNotInComment(i, line.text.search(tableAxisRegExp)) ||
        scope.isNotInComment(i, line.text.search(multiVarDefRegExp))
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
    const wordAtPosition: [boolean, string, vscode.Position] =
      getWordAtPosition(document, position);

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
        content.forEach((loc) => {
          if (loc != null) {
            return loc;
          }
        });
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
        .catch((e) => {
          throw 'Error: ' + e;
        });
      // .catch((e) => {
      // resolve(undefined);
      // });
    });
  }
}

// Allow the user to quickly navigate to any symbol definition in the open editor.
// CTRL-SHIFT o is default keybinding
class GesstabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      let symbols: vscode.SymbolInformation[] = [];

      const singleVarRegExp: RegExp = singleVarDefRe('');
      const multiVarRegExp: RegExp = multiVarRe('');
      const multiVarDefRegExp: RegExp = multiVarDefRe('');
      const computeRegExp: RegExp = computeDefRe('');
      const macroRegExp: RegExp = macroDefRe('');
      const expandRegExp: RegExp = expandDefRe('');
      const tableHeadRegExp: RegExp = tableHeadRe('');
      const tableAxisRegExp: RegExp = tableAxisRe('');

      let scope = new sc.Scope(document);

      for (let i = 0; i < document.lineCount; i++) {
        let line = document.lineAt(i);

        if (line.text.length === 0) {
          continue;
        }

        if (scope.isNotInComment(i, line.text.search(singleVarRegExp))) {
          let lineMatch = line.text.match(singleVarRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              lineMatch[1].toLocaleLowerCase(),
              lineMatch[2],
              '',
              '',
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNotInComment(i, line.text.search(multiVarRegExp))) {
          let lineMatch = line.text.match(multiVarRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              lineMatch[1].toLocaleLowerCase(),
              lineMatch[2],
              lineMatch[3],
              lineMatch[4],
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNotInComment(i, line.text.search(multiVarDefRegExp))) {
          let lineMatch = line.text.match(multiVarDefRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              lineMatch[1].toLocaleLowerCase(),
              lineMatch[2],
              lineMatch[3],
              lineMatch[4],
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNormalScope(i, line.text.search(computeRegExp))) {
          let lineMatch = line.text.match(computeRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              lineMatch[1].toLocaleLowerCase(),
              lineMatch[2],
              lineMatch[3],
              '',
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNormalScope(i, line.text.search(macroRegExp))) {
          let lineMatch = line.text.match(macroRegExp);
          if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
            spush(
              vscode.SymbolKind.Function,
              'macro',
              lineMatch[2],
              '',
              '',
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNormalScope(i, line.text.search(expandRegExp))) {
          let lineMatch = line.text.match(expandRegExp);
          if (lineMatch && lineMatch.length >= 2 && lineMatch[2].length > 0) {
            spush(
              vscode.SymbolKind.Function,
              'expand',
              lineMatch[2],
              '',
              '',
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNormalScope(i, line.text.search(tableHeadRegExp))) {
          let lineMatch = line.text.match(tableHeadRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              'head',
              lineMatch[2],
              lineMatch[3],
              lineMatch[4],
              document.uri,
              line.range,
              symbols
            );
          }
        }
        if (scope.isNormalScope(i, line.text.search(tableAxisRegExp))) {
          let lineMatch = line.text.match(tableAxisRegExp);
          if (lineMatch) {
            spush(
              vscode.SymbolKind.Variable,
              'axis',
              lineMatch[2],
              lineMatch[3],
              lineMatch[4],
              document.uri,
              line.range,
              symbols
            );
          }
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
  ): Thenable<vscode.SymbolInformation[]> {
    let symbols: vscode.SymbolInformation[] = [];

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
    return new Promise((resolve) => {
      getAllFilenamesInDirectory(wsfolder, '(tab|inc)').forEach((file) => {
        vscode.workspace
          .openTextDocument(wsfolder + '\\' + file)
          .then(function (content) {
            let scope = new sc.Scope(content);

            for (let i = 0; i < content.lineCount; i++) {
              let line: vscode.TextLine = content.lineAt(i);

              if (line.text.length === 0) {
                continue;
              }

              if (scope.isNotInComment(i, line.text.search(singleVarRegExp))) {
                let lineMatch = line.text.match(singleVarRegExp);
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
              }
              if (scope.isNotInComment(i, line.text.search(multiVarRegExp))) {
                let lineMatch = line.text.match(multiVarRegExp);
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
              }
              if (scope.isNormalScope(i, line.text.search(computeRegExp))) {
                let lineMatch = line.text.match(computeRegExp);
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
              }
              if (scope.isNormalScope(i, line.text.search(macroRegExp))) {
                let lineMatch = line.text.match(macroRegExp);
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
              }
              if (scope.isNormalScope(i, line.text.search(expandRegExp))) {
                let lineMatch = line.text.match(expandRegExp);
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
              }
              if (scope.isNormalScope(i, line.text.search(tableHeadRegExp))) {
                let lineMatch = line.text.match(tableHeadRegExp);
                if (lineMatch && lineMatch.length === 5) {
                  let re: RegExp;
                  if (lineMatch[3].search(/"/) > -1) {
                    re = /\s*"\s*/;
                  } else {
                    re = /\s+/;
                  }
                  lineMatch[3].split(re).forEach(function (value) {
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
                  lineMatch[4].split(re).forEach(function (value) {
                    symbols.push({
                      name: value,
                      kind: vscode.SymbolKind.Variable,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: 'axis',
                    });
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

class GessTabsFoldingRangeProvider implements vscode.FoldingRangeProvider {
  public provideFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken
  ): Thenable<vscode.FoldingRange[]> {
    return new Promise((resolve) => {
      const macroCollection: {
        start: number;
        end: number;
        kind: vscode.FoldingRangeKind;
      }[] = [];
      const ifCollection: {
        start: number;
        end: number;
        kind: vscode.FoldingRangeKind;
      }[] = [];
      const commentCollection: {
        start: number;
        end: number;
        kind: vscode.FoldingRangeKind;
      }[] = [];

      let ifCounter: number = 0;
      let macroCounter: number = 0;
      let commentCounter: number = 0;

      for (let l = 0; l < document.lineCount; l++) {
        let curLine = document.lineAt(l).text;

        do {
          let posCommentComplete = curLine.search(/\B{\B.+?\B}\B/);
          let posCommentStart = curLine.search(/\B{\B/);
          let posCommentEnd = curLine.search(/\B}\B/);

          // Block-Kommentar, aber auf einer Zeile, dann einfach ignorieren
          while (posCommentComplete > -1) {
            curLine =
              curLine.slice(0, posCommentStart) +
              curLine.slice(posCommentEnd + 1);
            posCommentComplete = curLine.search(/\B{\B.+?\B}\B/);
            posCommentStart = curLine.search(/\B{\B/);
            posCommentEnd = curLine.search(/\B}\B/);
          }

          posCommentStart = curLine.search(/\B{\B/);
          posCommentEnd = curLine.search(/\B}\B/);

          let posMacroComplete = curLine.search(
            /\B#macro\b.+?\B(#macroend|#endmacro)\b/
          );
          let posMacroStart = curLine.search(/\B#macro\b/);
          let posMacroEnd = curLine.search(/\B#macroend|#endmacro\b/);
          let posIfComplete = curLine.search(
            /\B#ifn?(def|exist|empty)\b.+?\B#end\b/
          );
          let posIfStart = curLine.search(/\B#ifn?(def|exist|empty)\b/);
          let posIfEnd = curLine.search(/\B#end\b/);
          if (
            posMacroStart < 0 &&
            posMacroEnd < 0 &&
            posIfStart < 0 &&
            posIfEnd < 0 &&
            posCommentStart < 0 &&
            posCommentEnd < 0
          ) {
            curLine = '';
          } else {
            switch (true) {
              // #macro, #endmacro, #if.. und #end in einer Zeile
              case posMacroComplete > -1 && posIfComplete > -1:
                if (posMacroEnd > posIfEnd) {
                  curLine = curLine.slice(posMacroEnd + 9);
                } else {
                  curLine = curLine.slice(posIfEnd + 4);
                }
                break;
              // #macro, #endmacro aber kein #if.. und #end in einer Zeile
              case posMacroComplete > -1:
                curLine = curLine.slice(posMacroEnd + 9);
                break;
              // #if.. und #end aber kein #macro, #endmacro in einer Zeile
              case posIfComplete > -1:
                curLine = curLine.slice(posIfEnd + 4);
                break;
              // #endmacro und dann #macro in einer Zeile
              case posMacroStart > -1 && posMacroEnd > -1:
                // #endmacro nicht in einem Kommentar
                if (
                  (posCommentStart === -1 || posCommentStart > posMacroEnd) &&
                  (posCommentEnd === -1 || posCommentEnd < posMacroEnd)
                ) {
                  if (macroCounter > 0) {
                    macroCollection[--macroCounter].end = l;
                  }
                }
                if (
                  (posCommentStart === -1 || posCommentStart > posMacroStart) &&
                  (posCommentEnd === -1 || posCommentEnd < posMacroStart)
                ) {
                  macroCollection.push({
                    start: l,
                    end: -1,
                    kind: vscode.FoldingRangeKind.Region,
                  });
                  macroCounter = macroCollection.length;
                }
                curLine = curLine.slice(posMacroStart + 6);
                break;
              // nur #macro in einer Zeile
              case posMacroStart > -1:
                if (
                  (posCommentStart === -1 || posCommentStart > posMacroStart) &&
                  (posCommentEnd === -1 || posCommentEnd < posMacroStart)
                ) {
                  macroCollection.push({
                    start: l,
                    end: -1,
                    kind: vscode.FoldingRangeKind.Region,
                  });
                  macroCounter = macroCollection.length;
                }
                curLine = curLine.slice(posMacroStart + 6);
                break;
              // nur #endmacro in einer Zeile
              case posMacroEnd > -1:
                if (
                  (posCommentStart === -1 || posCommentStart > posMacroEnd) &&
                  (posCommentEnd === -1 || posCommentEnd < posMacroEnd)
                ) {
                  if (macroCounter > 0) {
                    macroCollection[--macroCounter].end = l;
                  }
                }
                curLine = curLine.slice(posMacroStart + 9);
                break;
              // zuerst #end und dann #if... in einer Zeile
              case posIfStart > -1 && posIfEnd > -1:
                if (
                  (posCommentStart === -1 || posCommentStart > posIfEnd) &&
                  (posCommentEnd === -1 || posCommentEnd < posIfEnd)
                ) {
                  if (ifCounter > 0) {
                    ifCollection[--ifCounter].end = l;
                  }
                }
                if (
                  (posCommentStart === -1 || posCommentStart > posIfStart) &&
                  (posCommentEnd === -1 || posCommentEnd < posIfStart)
                ) {
                  ifCollection.push({
                    start: l,
                    end: -1,
                    kind: vscode.FoldingRangeKind.Region,
                  });
                  ifCounter = ifCollection.length;
                }
                curLine = curLine.slice(posIfStart + 6);
                break;
              // nur #if... in einer Zeile
              case posIfStart > -1:
                if (
                  (posCommentStart === -1 || posCommentStart > posIfStart) &&
                  (posCommentEnd === -1 || posCommentEnd < posIfStart)
                ) {
                  ifCollection.push({
                    start: l,
                    end: -1,
                    kind: vscode.FoldingRangeKind.Region,
                  });
                  ifCounter = ifCollection.length;
                }
                curLine = curLine.slice(posIfStart + 6);
                break;
              // nur #end in einer Zeile
              case posIfEnd > -1:
                if (
                  (posCommentStart === -1 || posCommentStart > posIfEnd) &&
                  (posCommentEnd === -1 || posCommentEnd < posIfEnd)
                ) {
                  if (ifCounter > 0) {
                    ifCollection[--ifCounter].end = l;
                  }
                }
                curLine = curLine.slice(posIfEnd + 4);
                break;
              case posCommentStart > -1:
                commentCollection.push({
                  start: l,
                  end: -1,
                  kind: vscode.FoldingRangeKind.Comment,
                });
                commentCounter = commentCollection.length;
                curLine = '';
                break;
              case posCommentEnd > -1:
                if (commentCounter > 0) {
                  commentCollection[--commentCounter].end = l;
                  curLine = curLine.slice(posCommentEnd + 1);
                }
                break;
              // rest
              default:
                curLine = '';
            }
          }
        } while (curLine.length > 0);
      }
      resolve(macroCollection.concat(ifCollection).concat(commentCollection));
    });
  }
}
