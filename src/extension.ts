'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import vsctm = require('vscode-textmate');
import oniguruma = require('vscode-oniguruma');

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
      const regions: {
        start: RegExp;
        end: RegExp;
        kind: vscode.FoldingRangeKind;
        skip?: RegExp;
        len: number;
      }[] = [
        {
          start: /\B#macro\b/i,
          end: /\B#(endmacro|macroend)\b/i,
          kind: vscode.FoldingRangeKind.Region,
          len: 6,
        },
        {
          start: /\B#ifn?(def|exist|empty)\b/i,
          end: /\B#end\b/i,
          kind: vscode.FoldingRangeKind.Region,
          skip: /\B#else\b/i,
          len: 4,
        },
        {
          start: /\{/i,
          end: /\}/,
          kind: vscode.FoldingRangeKind.Comment,
          len: 1,
        },
      ];

      const foldingCollection: {
        start: number;
        end: number;
        kind: vscode.FoldingRangeKind;
      }[] = [];

      let foldingCounter: number = 0;
      let inComment = false;

      for (let l = 0; l < document.lineCount; l++) {
        let curLine = document.lineAt(l).text;

        let posLineComment = curLine.search(/\/\//);
        if (posLineComment > -1) {
          curLine = curLine.slice(0, posLineComment);
          if (curLine.length === 0) {
            continue;
          }
        }
        for (let loop = 0; loop < regions.length; loop++) {
          if (curLine.length === 0) {
            break;
          }

          if (
            regions[loop].skip &&
            regions[loop].skip instanceof RegExp &&
            curLine.search(regions[loop].skip!) > -1
          ) {
            break;
          }

          let posRegionComplete = curLine.search(
            new RegExp(
              regions[loop].start.source + '.+?' + regions[loop].end.source,
              'i'
            )
          );

          // Wenn Start & End in einer Zeile, dann einfach ignorieren
          while (posRegionComplete > -1) {
            curLine =
              curLine.slice(0, curLine.search(regions[loop].start)) +
              curLine.slice(
                curLine.search(regions[loop].end) + regions[loop].len
              );
            posRegionComplete = curLine.search(
              new RegExp(
                regions[loop].start.source + '.+?' + regions[loop].end.source,
                'i'
              )
            );
          }
          let posStart = curLine.search(regions[loop].start);
          if (posStart > -1 && !inComment) {
            foldingCollection.push({
              start: l,
              end: -1,
              kind: regions[loop].kind,
            });
            foldingCounter = foldingCollection.length;
            curLine = curLine.slice(posStart + regions[loop].len);
            inComment = regions[loop].kind === vscode.FoldingRangeKind.Comment;
          }
          let posEnd = curLine.search(regions[loop].end);
          if (
            posEnd > -1 &&
            (regions[loop].kind === vscode.FoldingRangeKind.Comment ||
              !inComment)
          ) {
            while (
              foldingCounter > 0 &&
              foldingCollection[foldingCounter - 1].end > -1
            ) {
              foldingCounter--;
            }
            if (foldingCounter > 0) {
              let endLine =
                l - 1 > foldingCollection[foldingCounter - 1].start ? l - 1 : l;
              foldingCollection[--foldingCounter].end = endLine;
            }
            curLine = curLine.slice(posEnd + regions[loop].len + 1);
            inComment = false;
          }
        }
      }
      resolve(foldingCollection);
    });
  }
}
