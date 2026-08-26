import type * as vscode from 'vscode';

export enum ScopeEnum {
  normal, // normaler Scope
  comment, // in einem Kommentar
  string, // in einem String
}

interface Delimiter {
  start: string;
  end: string;
}

export const lineCommentDelimiter = /\/\//;
export const blockCommentDelimiter: Array<Delimiter> = [
  { start: '{', end: '}' },
];
export const stringDelimiter: Array<Delimiter> = [
  { start: '"', end: '"' },
  { start: "'", end: "'" },
];

function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export class Scope {
  private scopeArr: Array<{ start: number; end: number; scope: ScopeEnum }[]> =
    [];

  constructor(
    document: vscode.TextDocument,
    lineComDel?: RegExp,
    BlCoDel?: Array<Delimiter>,
    strReg?: Array<Delimiter>
  ) {
    const localLineCommentDelimiter = lineComDel || lineCommentDelimiter;
    const localBlockCommentDelimiter = BlCoDel || blockCommentDelimiter;
    const localStringDelimiter = strReg || stringDelimiter;

    let currScope: ScopeEnum = ScopeEnum.normal;

    let comIndex = -1;
    let strIndex = -1;
    let lineComment = false;

    function findBlockCommentStartLocal(str: string): [number, number] {
      let result = -1;
      let cType = -1;
      localBlockCommentDelimiter.forEach((value, index) => {
        if (str.search(escapeRegex(value.start)) === 0) {
          result = value.start.length;
          cType = index;
        }
      });
      return [result, cType];
    }

    function findBlockCommentEndLocal(
      str: string,
      activeComIndex: number
    ): number {
      let result = -1;
      localBlockCommentDelimiter.forEach((value, index) => {
        if (
          str.search(escapeRegex(value.end)) === 0 &&
          index === activeComIndex
        ) {
          result = value.end.length;
        }
      });
      return result;
    }

    function findStringStartLocal(str: string): [number, number] {
      let result = -1;
      let sIndex = -1;
      localStringDelimiter.forEach((value, index) => {
        if (str.search(escapeRegex(value.start)) === 0) {
          result = value.start.length;
          sIndex = index;
        }
      });
      return [result, sIndex];
    }

    function findStringEndLocal(str: string, sIndex: number): number {
      let result = -1;
      localStringDelimiter.forEach((value, index) => {
        if (str.search(escapeRegex(value.end)) === 0 && index === sIndex) {
          result = value.end.length;
        }
      });
      return result;
    }

    for (let line = 0; line < document.lineCount; line++) {
      const intervals: { start: number; end: number; scope: ScopeEnum }[] = [];

      const lineStr = document.lineAt(line).text;

      // ensure an entry exists for the line (may be empty)
      if (lineStr.length === 0) {
        this.scopeArr[line] = intervals;
        continue;
      }

      let i = 0;
      let segStart = 0;
      let localCurrScope: ScopeEnum = currScope;

      while (i < lineStr.length) {
        let comStart = -1;
        let comEnde = -1;
        let strStart = -1;
        let strEnde = -1;

        switch (localCurrScope) {
          case ScopeEnum.normal:
            lineComment =
              lineStr.substring(i).search(localLineCommentDelimiter) === 0;
            [strStart, strIndex] = findStringStartLocal(lineStr.substring(i));
            [comStart, comIndex] = findBlockCommentStartLocal(
              lineStr.substring(i)
            );
            break;
          case ScopeEnum.string:
            strEnde = findStringEndLocal(lineStr.substring(i), strIndex);
            break;
          case ScopeEnum.comment:
            comEnde = findBlockCommentEndLocal(lineStr.substring(i), comIndex);
            break;
          default:
            break;
        }

        if (lineComment) {
          if (segStart < i) {
            intervals.push({ start: segStart, end: i, scope: localCurrScope });
          }
          intervals.push({
            start: i,
            end: lineStr.length,
            scope: ScopeEnum.comment,
          });
          localCurrScope = ScopeEnum.normal;
          i = lineStr.length;
          break;
        }

        if (comStart > -1) {
          if (segStart < i) {
            intervals.push({ start: segStart, end: i, scope: localCurrScope });
          }
          const len = localBlockCommentDelimiter[comIndex].start.length;
          intervals.push({ start: i, end: i + len, scope: ScopeEnum.comment });
          i += len;
          localCurrScope = ScopeEnum.comment;
          segStart = i;
          continue;
        }

        if (comEnde > -1) {
          if (segStart < i) {
            intervals.push({ start: segStart, end: i, scope: localCurrScope });
          }
          const len = localBlockCommentDelimiter[comIndex].end.length;
          intervals.push({ start: i, end: i + len, scope: ScopeEnum.comment });
          i += len;
          localCurrScope = ScopeEnum.normal;
          comIndex = -1;
          segStart = i;
          continue;
        }

        if (strStart > -1) {
          if (segStart < i) {
            intervals.push({ start: segStart, end: i, scope: localCurrScope });
          }
          const len = localStringDelimiter[strIndex].start.length;
          intervals.push({ start: i, end: i + len, scope: ScopeEnum.string });
          i += len;
          localCurrScope = ScopeEnum.string;
          segStart = i;
          continue;
        }

        if (strEnde > -1) {
          if (segStart < i) {
            intervals.push({ start: segStart, end: i, scope: localCurrScope });
          }
          const len = localStringDelimiter[strIndex].end.length;
          intervals.push({ start: i, end: i + len, scope: ScopeEnum.string });
          i += len;
          localCurrScope = ScopeEnum.normal;
          strIndex = -1;
          segStart = i;
          continue;
        }

        // nothing changed, advance
        i++;
      }

      if (segStart < lineStr.length) {
        intervals.push({
          start: segStart,
          end: lineStr.length,
          scope: localCurrScope,
        });
      }

      this.scopeArr[line] = intervals;
      currScope = localCurrScope;
    }
  }

  public getScope(x: number, y: number): ScopeEnum | undefined {
    if (!(x >= 0 && x < this.scopeArr.length)) return undefined;
    const intervals = this.scopeArr[x];
    if (!intervals || intervals.length === 0) return undefined;
    for (let i = 0; i < intervals.length; i++) {
      const it = intervals[i];
      if (y >= it.start && y < it.end) return it.scope;
    }
    return undefined;
  }

  public isNormalScope(x: number, y: number): boolean {
    return this.getScope(x, y) === ScopeEnum.normal;
  }

  public isCommentScope(x: number, y: number): boolean {
    return this.getScope(x, y) === ScopeEnum.comment;
  }

  public isNotInComment(x: number, y: number): boolean {
    return this.isNormalScope(x, y) || this.isStringScope(x, y);
  }

  public isStringScope(x: number, y: number): boolean {
    return this.getScope(x, y) === ScopeEnum.string;
  }
}

/*
  function readScopes(document: vscode.TextDocument): string[] {
  const normalScope = '-';
  const commentScope = 'c';
  const stringScope = 's';

  let prevScope: string = normalScope;
  let currScope: string = normalScope;
  let stringStart: string = '';

  let lineComment: boolean = false;

  let scopeArr: string[] = [];

  for (let line = 0; line < document.lineCount; line++) {
    let lineScope: string = '';
    let checkScope: string = '';
    let lineStr = document.lineAt(line).text;

    if (lineComment) {
      lineComment = false;
      prevScope = normalScope;
    }

    for (let char = 0; char < lineStr.length; char++) {
      checkScope = prevScope;
      currScope = prevScope;
      if (
        lineStr[char] === '/' &&
        char + 1 < lineStr.length &&
        lineStr[char + 1] === '/' &&
        prevScope === normalScope
      ) {
        currScope = commentScope;
        checkScope = currScope;
        lineComment = true;
      }
      if (lineStr[char] === '{' && prevScope === normalScope) {
        currScope = commentScope;
        checkScope = currScope;
      }
      if (lineStr[char] === '}' && prevScope === commentScope) {
        checkScope = prevScope;
        currScope = normalScope;
      }
      if (lineStr[char] === stringStart && prevScope === stringScope) {
        checkScope = prevScope;
        currScope = normalScope;
      }
      if (
        (lineStr[char] === "'" || lineStr[char] === '"') &&
        prevScope === normalScope
      ) {
        currScope = stringScope;
        checkScope = currScope;
        stringStart = lineStr[char];
      }
      prevScope = currScope;
      lineScope += checkScope;
    }
    scopeArr.push(lineScope);
  }

  return scopeArr;
}

function getScope(x: number, y: number, scopeArr: string[]): string {
  if (x >= 0 && y >= 0 && x < scopeArr.length && y < scopeArr[x].length) {
    return scopeArr[x].substr(y, 1);
  } else {
    return '';
  }
}

*/
