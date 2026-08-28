// Resolves the real INCLUDE-file graph and #define/#ifdef preprocessor state
// of a gessTabs entry file into one linear, ordered list of active source
// lines — the actual compile-time program order, rather than an unordered
// scan of every .tab/.inc file in a workspace.
//
// Deliberately out of scope here (left as plain content lines, unexpanded):
// #MACRO/#DOMACRO expansion and #EXPAND substitution — see the F3 entry in
// docs/HISTORY.md, which builds on this module rather than folding into it.
// Also out of scope: evaluating #IFEMPTY/#IFNEMPTY (depends on #EXPAND
// values) and #IFEXIST/#IFNEXIST (depends on variable-definition tracking,
// itself a consumer of this module) — those branches are conservatively
// treated as always active (both sides kept) rather than guessed at.
//
// The `conditionalsAllActive` option turns #IFDEF/#IFNDEF gating off too,
// for consumers (macro / #EXPAND discovery) that want a definition found
// regardless of which branch the current build compiles.

import * as path from 'path';
import { Scope } from './scope';
import { scanBlockDirectives } from './directives';

export type FileReader = (filePath: string) => string[] | undefined;

export interface ResolvedLine {
  file: string;
  line: number;
  text: string;
}

export type IncludeGraphErrorKind =
  | 'include-not-found'
  | 'include-cycle'
  | 'max-depth-exceeded';

export interface IncludeGraphError {
  kind: IncludeGraphErrorKind;
  file: string;
  line: number;
  message: string;
}

export interface IncludeGraphResult {
  // Every line reachable from the entry file, in linear compile order,
  // with inactive #ifdef/#ifndef branches already excluded.
  order: ResolvedLine[];
  // Every file touched, in first-visited order (entry file first).
  files: string[];
  errors: IncludeGraphError[];
  // Per-file comment/string Scope, for callers that need to re-check
  // isNotInComment at a specific character offset within one of the
  // returned lines (line-start comment/string state is already applied
  // when building `order`, but a caller matching a sub-string within a
  // line — e.g. a regex hit — needs the finer-grained check).
  scopes: Map<string, Scope>;
}

export interface IncludeGraphOptions {
  // Names considered #define'd from the start (e.g. what a CLI -D flag
  // would provide). Defaults to none.
  externalDefines?: Iterable<string>;
  // Safety cap on INCLUDE nesting depth. The compiler documents a max
  // macro-nesting depth of 20; reused here as a sane default in the
  // absence of a documented INCLUDE-specific limit.
  maxDepth?: number;
  // Keep *every* branch of *every* conditional. #IFDEF/#IFNDEF stop
  // gating (an inactive branch is no longer dropped), #ELSE stops
  // flipping, and all INCLUDEs are followed regardless of the #ifdef
  // state around them. Used for macro / #EXPAND discovery: a hover /
  // go-to-definition has to work even for a definition that lives in a
  // branch the current build doesn't compile. Comment/string filtering
  // and INCLUDE-cycle/-depth protection still apply. (#IFEMPTY-family
  // branches were already kept regardless.)
  conditionalsAllActive?: boolean;
}

const includeRe = /^\s*include\s*=\s*"?([^";]+?)"?\s*;/i;
const defineRe = /^\s*#define\s+(\S+)/i;
const undefineRe = /^\s*#undefine\s+(\S+)/i;
const ignoreCaseRe = /^\s*#ignorecase\s*=\s*(yes|no)/i;

function parseNameList(raw: string): string[] {
  const trimmed = raw.trim();
  const bracketed = trimmed.match(/^\[\s*(.+?)\s*\]/);
  const body = bracketed ? bracketed[1] : trimmed.split(/\s+/)[0] || '';
  return body.split(/\s+/).filter((s) => s.length > 0);
}

// A line that's entirely inside a comment is already skipped above (its
// first non-whitespace char is in comment scope), but a *mixed* line —
// real code followed by a trailing `// ...` comment, or one that opens a
// multi-line `{ ... }` comment mid-line (e.g. old code commented out
// after a real statement) — still has its comment portion included
// verbatim in what gets pushed to `order`. Blank those characters out
// (replaced with spaces, so offsets/length stay aligned with the real
// document) so a stray "#macro"/"#endmacro"/etc. mentioned only in a
// comment can't be mistaken for a real one by downstream consumers like
// macroExpansion.ts's line-scanning regexes, which — unlike this
// module's own directive regexes — aren't anchored to the start of the
// line and so can't tell a keyword in a trailing comment apart from a
// real one on their own.
function blankComments(scope: Scope, lineIndex: number, text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += scope.isNotInComment(lineIndex, i) ? text[i] : ' ';
  }
  return result;
}

function makeScopeDoc(lines: string[]) {
  return {
    lineCount: lines.length,
    lineAt: (n: number) => ({ text: lines[n] }),
  };
}

class DefineSet {
  private names = new Set<string>();

  private ignoreCase = false;

  setIgnoreCase(value: boolean): void {
    this.ignoreCase = value;
  }

  private key(name: string): string {
    return this.ignoreCase ? name.toLowerCase() : name;
  }

  define(name: string): void {
    this.names.add(this.key(name));
  }

  undefine(name: string): void {
    this.names.delete(this.key(name));
  }

  isDefined(name: string): boolean {
    if (this.ignoreCase) return this.names.has(name.toLowerCase());
    if (this.names.has(name)) return true;
    // Case-insensitive names defined earlier (while ignoreCase was on)
    // stay matchable case-sensitively only against their stored form;
    // nothing further to do here.
    return false;
  }
}

interface ConditionalFrame {
  conditionTrue: boolean;
  inElse: boolean;
  parentActive: boolean;
}

function evaluateActive(stack: ConditionalFrame[]): boolean {
  if (stack.length === 0) return true;
  const top = stack[stack.length - 1];
  const branchActive = top.inElse ? !top.conditionTrue : top.conditionTrue;
  return top.parentActive && branchActive;
}

export function resolveIncludeGraph(
  entryFile: string,
  readFile: FileReader,
  options: IncludeGraphOptions = {}
): IncludeGraphResult {
  const maxDepth = options.maxDepth ?? 20;
  const allActive = options.conditionalsAllActive ?? false;
  const defines = new DefineSet();
  if (options.externalDefines) {
    Array.from(options.externalDefines).forEach((name) => defines.define(name));
  }

  const order: ResolvedLine[] = [];
  const files: string[] = [];
  const errors: IncludeGraphError[] = [];
  const scopes = new Map<string, Scope>();
  const ancestors = new Set<string>();

  function visit(file: string, depth: number): void {
    if (depth > maxDepth) {
      errors.push({
        kind: 'max-depth-exceeded',
        file,
        line: 0,
        message: `INCLUDE nesting exceeded ${maxDepth} levels at "${file}"`,
      });
      return;
    }

    const lines = readFile(file);
    if (lines === undefined) {
      errors.push({
        kind: 'include-not-found',
        file,
        line: 0,
        message: `INCLUDE-file not found: "${file}"`,
      });
      return;
    }

    files.push(file);
    ancestors.add(file);
    const scope = new Scope(makeScopeDoc(lines) as any);
    scopes.set(file, scope);
    const stack: ConditionalFrame[] = [];

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];
      if (text.length === 0) continue;
      if (!scope.isNotInComment(i, text.search(/\S/))) continue;

      const active = allActive || evaluateActive(stack);

      const ignoreCaseMatch = text.match(ignoreCaseRe);
      if (ignoreCaseMatch) {
        if (active) defines.setIgnoreCase(/^yes$/i.test(ignoreCaseMatch[1]));
        continue;
      }

      const defineMatch = text.match(defineRe);
      if (defineMatch) {
        if (active) defines.define(defineMatch[1]);
        continue;
      }

      const undefineMatch = text.match(undefineRe);
      if (undefineMatch) {
        if (active) defines.undefine(undefineMatch[1]);
        continue;
      }

      // #IFDEF/#IFNDEF/#IF[N]EMPTY/#IF[N]EXIST(S), #ELSE and #END can all
      // sit on one line — `#ifnempty "&x" &x #else 1:99 #end` is a common
      // single-line idiom in macro bodies. Walk every conditional
      // directive on the line, in order (shared recognition with the F2
      // diagnostic / folding / formatter via src/directives.ts), so an
      // inline #END isn't dropped — a dropped one would leave a phantom
      // frame open and wrongly gate everything after it in the file,
      // including later #MACRO definitions.
      const conds = scanBlockDirectives(text, (col) =>
        scope.isNormalScope(i, col)
      ).filter((d) => d.kind !== 'macro-start' && d.kind !== 'macro-end');
      if (conds.length > 0) {
        let frameActive = allActive || evaluateActive(stack);
        conds.forEach((d, di) => {
          if (d.kind === 'conditional-end') {
            stack.pop();
          } else if (d.kind === 'conditional-else') {
            if (stack.length > 0) stack[stack.length - 1].inElse = true;
          } else {
            // conditional-start. Its name list is the text up to the next
            // directive on the line (or end of line). parseNameList only
            // takes the first token / bracketed group anyway, so a
            // trailing `#else`/`#end` in that slice is harmless.
            const argEnd = conds[di + 1]?.index ?? text.length;
            const argText = text.slice(d.index + d.text.length, argEnd);
            const tok = d.text.toLowerCase();
            let conditionTrue: boolean;
            if (allActive) {
              // #IFDEF/#IFNDEF stop gating entirely (see options doc).
              conditionTrue = true;
            } else if (tok === '#ifdef') {
              conditionTrue = parseNameList(argText).some((n) =>
                defines.isDefined(n)
              );
            } else if (tok === '#ifndef') {
              conditionTrue = parseNameList(argText).some(
                (n) => !defines.isDefined(n)
              );
            } else {
              // #IF[N]EMPTY / #IF[N]EXIST(S): not statically evaluated
              // (see module doc comment) — keep both branches active so
              // real definitions inside either arm are still found.
              conditionTrue = true;
            }
            stack.push({
              conditionTrue,
              inElse: false,
              parentActive: frameActive,
            });
          }
          frameActive = allActive || evaluateActive(stack);
        });
        continue;
      }

      if (!active) continue;

      const includeMatch = text.match(includeRe);
      if (includeMatch) {
        const target = path.resolve(path.dirname(file), includeMatch[1].trim());
        if (ancestors.has(target)) {
          errors.push({
            kind: 'include-cycle',
            file,
            line: i,
            message: `INCLUDE cycle detected: "${file}" -> "${target}"`,
          });
          continue;
        }
        visit(target, depth + 1);
        continue;
      }

      order.push({ file, line: i, text: blankComments(scope, i, text) });
    }

    ancestors.delete(file);
  }

  visit(entryFile, 0);

  return { order, files, errors, scopes };
}
