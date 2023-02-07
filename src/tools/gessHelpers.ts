'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Workaround for issue in https://github.com/Microsoft/vscode/issues/9448#issuecomment-244804026
function fixDriveCasingInWindows(pathToFix: string): string {
  return process.platform === 'win32' && pathToFix
    ? pathToFix.substring(0, 1).toUpperCase() + pathToFix.substring(1)
    : pathToFix;
}

// gibt den aktuellen Pfad zurück. Wenn ein Workspace aktiv ist, den Pfad zum Workspace. Wenn ein Pfad übergeben worden ist, aber kein Workspace aktiv, dann den Pfad zu dem Dokument. Und falls auch kein Dokument aktiv ist, dann den Pfad zum vorherigen Workspace
export function getCurrentFolderPath(fileUri?: vscode.Uri): string {
  if (fileUri) {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    if (workspace) {
      return fixDriveCasingInWindows(workspace.uri.fsPath);
    } else {
      return fixDriveCasingInWindows(path.dirname(fileUri.fsPath));
    }
  }

  // fall back to the first workspace
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length) {
    return fixDriveCasingInWindows(folders[0].uri.fsPath);
  } else {
    let curPath = vscode.window.activeTextEditor?.document.fileName || '.';
    return fixDriveCasingInWindows(path.dirname(curPath));
  }
}

// durchsucht rekursiv das aktuelle Verzeichnis und gibt alle Dateinamen inkl.
// Pfad als String zurück, die dem regulären Ausdruck in fType entspricht.
export function getAllFilenamesInDirectory(
  dir: string,
  fType: string
): string[] {
  let results: string[] = [];
  let regEXP: RegExp = new RegExp('\\.' + fType + '$', 'i');
  let list: fs.Dirent[] = fs.readdirSync(dir, {
    encoding: 'utf8',
    withFileTypes: true,
  });

  list.forEach(function (file: fs.Dirent) {
    let fileInclDir = dir + path.sep + file.name;
    if (file.isDirectory()) {
      /* Recursive into a subdirectory */
      results = results.concat(getAllFilenamesInDirectory(fileInclDir, fType));
    } else {
      /* Is a file */
      if (file.isFile() && file.name.match(regEXP)) {
        results.push(fileInclDir);
      }
    }
  });
  return results;
}

const constTokenVarName: string =
  '(?:\\b(?:[A-Za-zÄÖÜßäöü][A-Za-zÄÖÜßäöü\\w\\.]*)\\b)';
const constStringVarName: string = '(?:"[^"]+")|(?:\'[^\']+\')';

const constVarName: string =
  '(?:' + constTokenVarName + '|' + constStringVarName + ')';

// sucht das Wort unter dem Cursor, wobei Zahlen, Buchstaben, Punkte sowie # als
// Wort akzeptiert werden. Gibt dann einen Array zurück, wobei das 1st Element
// true ist, wenn es ein Wort gefunden hat, sonst false. Das eigentliche Wort
// steht dann an zweiter Stelle (wenn true)
export function getWordAtPosition(
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

export type RuleTemplate = {
  [key: string]: string;
};

function hasKey(obj: RuleTemplate, key: string): boolean {
  return key in obj;
}

const ruleTemplate: RuleTemplate = {
  integer: '[1-9]\\d* | 0',
  hexdigits: '[1-9a-fA-F][0-9a-fA-F]*',
  signedint: '[+-]? {{integer}}',
  pointfloat: '({{integer}})? \\. \\d+ | {{integer}} \\.',
  exponentfloat: '{{integer}} | {{pointfloat}} [eE] [+-]? \\d+',
  float: '{{pointfloat}} | {{exponentfloat}}',
  hexNum: '0[xX]{{hexdigits}}',
  numeric: '{{integer}} | {{float}}',
  signedNum: '([+-]? {{numeric}})|{{hexNum}}',
  token: '(?:[\\p{L}\\p{M}][\\p{L}\\p{M}\\d\\._]*)',
  sstring: "(?:\\B'[^(?>\\r\\n|\\n|\\x0b|\\f|\\r|\\x85)]*')",
  dstring: '(?:\\B"[^(?>\\r\\n|\\n|\\x0b|\\f|\\r|\\x85)]*")',
  string: '(?:{{sstring}} | {{dstring}})',
  varname: '(?:{{token}} | {{string}})',
  expandMacro: '(?:#{{varname}}',
  varlist: '(?:{{varname}})(?:\\s+{{varname}})*',
};

const preprocessorTemplate: RuleTemplate = {
  '#expand': '',
  '#macro': '',
};
const keyTemplate: RuleTemplate = {
  vartitle: '\\b(?<before>vartitle\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  title: '\\b(?<before>title\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  vartext: '\\b(?<before>vartext\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  text: '\\b(?<before>text\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  valuelabels:
    '\\b(?<before>valuelabels\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  labels: '\\b(?<before>labels\\s+)(?<varlist>{{varlist}})\\s*=[^;]*;',
  '#expand':
    '\\B(?<before>#expand\\s+)(?<varlist>{{varname}})\\s[^(?>\\r\\n|\\n|\\x0b|\\f|\\r|\\x85)]*',
};

function substituteRegExps(): void {
  function substitute(value: string, rules: RuleTemplate): string {
    while (value.indexOf('{{') > -1) {
      const start: number = value.indexOf('{{');
      const ende: number = value.indexOf('}}', start + 2) + 2;
      const replace: string = value.slice(start, ende);
      const rule: string = replace.slice(2, replace.length - 2);
      if (hasKey(rules, rule)) {
        value = value.replace(replace, rules[rule]); // works fine!
      }
    }
    return value.replace(/\s+/g, '');
  }

  if (ruleTemplate['finish'] === undefined) {
    for (let [key, value] of Object.entries(ruleTemplate)) {
      ruleTemplate[key] = substitute(value, ruleTemplate);
    }
    ruleTemplate['finish'] = '';
  }

  if (keyTemplate['finish'] === undefined) {
    for (let [key, value] of Object.entries(keyTemplate)) {
      keyTemplate[key] = substitute(
        substitute(value, ruleTemplate),
        keyTemplate
      ).replace(/\s+/g, '');
    }
    keyTemplate['finish'] = '';
  }
}

export function getRegexps(): RuleTemplate {
  if (keyTemplate['finish'] === undefined) {
    substituteRegExps();
  }

  return keyTemplate;
}

export const allLocations: { [key: string]: vscode.Location[] } = {};

export function splitvarlist(
  cur: number,
  groups: { [keys: string]: string } | undefined,
  document: vscode.TextDocument
): number {
  if (!groups) return 0;
  if (!groups.varlist) return 0;

  if (ruleTemplate['finish'] === undefined) {
    substituteRegExps();
  }

  let addLength = groups.before?.length || 0;
  const allVars = [
    ...groups.varlist.matchAll(new RegExp(`${ruleTemplate['varname']}`, 'gu')),
  ];

  for (let i = 0; i < allVars.length; i++) {
    const curVar = allVars[i][0];
    const newRange = document.getWordRangeAtPosition(document.positionAt(cur));
    if (newRange) {
      addLength += curVar.length;
      const newLocation = new vscode.Location(document.uri, newRange);
      if (allLocations[curVar] === undefined) {
        allLocations[curVar] = [newLocation];
      } else {
        allLocations[curVar].push(newLocation);
      }
    }
  }
  return addLength;
}
