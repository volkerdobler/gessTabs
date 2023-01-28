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

const ruleTemplate: RuleTemplate = {
  integer: '[1-9]\\d* | 0',
  hexdigits: '[1-9a-fA-F][0-9a-fA-F]*',
  signedint: '[+-]? {integer}',
  pointfloat: '({integer})? \\. \\d+ | {integer} \\.',
  exponentfloat: '(?:{integer} | {pointfloat}) [eE] [+-]? \\d+',
  float: '{pointfloat} | {exponentfloat}',
  hexNum: '0[xX]{hexdigits}',
  numeric: '{integer} | {float}',
  signedNum: '([+-]? {numeric})|{hexNum}',
  token: '[A-Za-zÄÖÜßäöü][A-Za-zÄÖÜßäöü\\w\\.]*',
  string: '"{token}(?:\\s+{token})*"|\'{token}(?:\\s+{token})*\'',
  varname: '{token} | {string}',
};

// format:
//   '((?<format_padding> [^}}])? (?<format_align> [<>^=]))? (?<format_sign> [-+ ])? #? (?<format_filled> 0)? (?<format_integer> {integer})? (\\.(?<format_precision> \\d+))? (?<format_type> [bcdeEfFgGnoxX%])?',
// alphastart: '[a-z]+ | [A-Z]+',
// alphaformat:
//   '((?<alphaformat_padding>[^}}])? (?<alphaformat_align>[<>^]))? ((?<alphaformat_integer>{integer}))?',
// cast: '[ifsb]',
// expr: '.+?',
// stopExpr: '.+?',
// exprMode:
//   '^(?<cast> {cast})?\\|(~(?<format> {format})::)? (?<expr> {expr}) (@(?<stopExpr> {stopExpr}))? (?<sort_selections> \\$)? (?<reverse> !)?$',
// insertNum:
//   '^(?<start> {signedNum})? (:(?<step> {signedNum}))? (r(?<random> \\+?\\d+))? (\\*(?<frequency> {integer}))? (#(?<repeat> {integer}))? (~(?<format> {format}))? (::(?<expr> {expr}))? (@(?<stopExpr> {stopExpr}))? (?<sort_selections> \\$)? (?<reverse> !)?$',
// insertAlpha:
//   '^(?<start> {alphastart})(:(?<step> {signedint}))? (\\*(?<frequency> {integer}))? (#(?<repeat> {integer}))? (~(?<format> {alphaformat})(?<wrap> w)?)? (@(?<stopExpr> {stopExpr}))? (?<sort_selections> \\$)? (?<reverse> !)?$',

type RuleTemplate = {
  [key: string]: string;
};

function hasKey(obj: RuleTemplate, key: string): boolean {
  return key in obj;
}

function getRegexps(): any {
  const result: RuleTemplate = {
    varname: '',
  };
  for (let [key, value] of Object.entries(ruleTemplate)) {
    while (value.indexOf('{') > -1) {
      const start: number = value.indexOf('{');
      const ende: number = value.indexOf('}', start + 1) + 1;
      const replace: string = value.slice(start, ende);
      const rule: string = replace.slice(1, replace.length - 1);
      if (hasKey(ruleTemplate, rule)) {
        value = value.replace(replace, ruleTemplate[rule]); // works fine!
      }
    }
    if (hasKey(result, key)) {
      result[key] = value.replace(/\s/gi, '');
    }
  }
  return result;
}
