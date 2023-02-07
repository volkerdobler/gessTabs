'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as sc from './tools/scope';

import * as helper from './tools/gessHelpers';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "gesstabs" is now active!');

  const volker = vscode.commands.registerCommand(
    'extension.gesstabs.volker',
    () => {
      testCommand();
    }
  );

  context.subscriptions.push(volker);

  // Allow the user to see the definition of variables/functions/methods
  // right where the variables / functions / methods are being used.
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      {
        language: 'gesstabs',
        scheme: 'file',
      },
      new GesstabsDefinitionProvider()
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

type AllLocations = {
  [key: string]: vscode.Location[];
};

const allLocations: AllLocations = {};

function testCommand(): void {
  console.log('Testcommand');

  let keys = helper.getRegexps();

  const document = vscode.window.activeTextEditor?.document;

  if (!document) {
    return;
  }

  const text = document.getText();

  for (let cur = 0; cur < text.length; cur++) {
    const curPosition = document.positionAt(cur);

    const curRange = document.getWordRangeAtPosition(
      curPosition,
      new RegExp('(?:#?[\\p{L}\\p{M}][\\p{L}\\p{M}\\d\\._]*)|\\{|(?://)', 'gu')
    );

    if (curRange) {
      const curWord: string = document.getText(curRange);
      console.log(curWord);

      const curLine = document.lineAt(document.positionAt(cur)).text;
      switch (curWord) {
        case '{':
          const commentFinish = text.indexOf('}', cur + 1);
          if (commentFinish) {
            cur = commentFinish;
          }
          continue;
          break;
        case '//':
          const lineEnd = document.offsetAt(
            document.lineAt(document.positionAt(cur)).range.end
          );
          if (lineEnd) {
            cur = lineEnd + 2;
          }
          continue;
          break;
        default:
          if (curWord in keys) {
            const reg = new RegExp(keys[curWord], 'u');
            const match = text.substring(cur).match(reg);
            cur += helper.splitvarlist(cur, match?.groups, document);
            continue;
          }
      }
      cur += curWord.length;
    }
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
class GesstabsDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Thenable<vscode.Location> {
    const wordAtPosition: [boolean, string, vscode.Position] =
      helper.getWordAtPosition(document, position);

    return new Promise((resolve, reject) => {
      if (!wordAtPosition[0]) {
        return Promise.resolve(null);
      }

      const word = wordAtPosition[1];

      let wsfolder = helper.getCurrentFolderPath(document.uri);

      let fileNames: string[] = helper.getAllFilenamesInDirectory(
        wsfolder,
        '(tab|inc)'
      );

      let locations = fileNames.map((file) =>
        getDefLocationInDocument(file, word)
      );
      // has to be a Promise as the OpenTextDocument is async and we have to
      // wait until it is fullfilled with all filenames.
      Promise.all(locations).then(function (content) {
        let found: boolean = false;
        content.forEach((loc) => {
          if (loc != null) {
            resolve(loc);
            found = true;
          }
        });
        if (!found) {
          reject('No definition found');
        }
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
      const wordAtPosition = helper.getWordAtPosition(document, position);

      if (!wordAtPosition[0]) {
        return Promise.resolve(null);
      }
      const word = wordAtPosition[1];

      let loclist: vscode.Location[] = [];

      let wsfolder = helper.getCurrentFolderPath(document.uri);

      let fileNames: string[] = helper.getAllFilenamesInDirectory(
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

    const wsfolder = helper.getCurrentFolderPath(
      vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.document.uri
    );
    return new Promise((resolve) => {
      helper
        .getAllFilenamesInDirectory(wsfolder, '(tab|inc)')
        .forEach((file) => {
          vscode.workspace
            .openTextDocument(wsfolder + '\\' + file)
            .then(function (content) {
              let scope = new sc.Scope(content);

              for (let i = 0; i < content.lineCount; i++) {
                let line: vscode.TextLine = content.lineAt(i);

                if (line.text.length === 0) {
                  continue;
                }

                if (
                  scope.isNotInComment(i, line.text.search(singleVarRegExp))
                ) {
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
                          location: new vscode.Location(
                            content.uri,
                            line.range
                          ),
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
