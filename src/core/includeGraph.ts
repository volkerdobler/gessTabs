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
import { BranchArm, BranchPath, branchKey } from './branchPaths';

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
  // Which #ifdef/#ifndef/... arm each `order` entry sits in, keyed by
  // branchKey(file, line) — captured straight from the #ifdef/#else/#end
  // stack this resolver already walks to decide line activity, so it's
  // exact even under `conditionalsAllActive` (both arms kept, but a
  // caller — variableModel.ts's primaryDefinitions() — can still tell
  // "two locations that could both run on some real build" apart from
  // "two mutually exclusive branches of the same conditional"). A line
  // outside any conditional maps to an empty path. Note: the #ifdef/
  // #else/#end directive line itself is consumed by this resolver and
  // never reaches `order` — branchPaths only has entries for lines that
  // do.
  branchPaths: Map<string, BranchPath>;
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
export function blankComments(
  scope: Scope,
  lineIndex: number,
  text: string
): string {
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

// Cleans one document's own raw lines the same way `resolveIncludeGraph`
// cleans the `order` it builds by walking the wider INCLUDE graph — comments
// blanked out (blankComments), and any line that is only a preprocessor
// directive (#ifdef/#ifndef/#if[n]empty/#if[n]exist(s)/#else/#end/#define/
// #undefine/#ignorecase) dropped entirely — WITHOUT evaluating #ifdef/
// #define state: both branches always show through, same spirit as
// `conditionalsAllActive`. #macro/#endmacro lines are deliberately kept
// as-is (blanked, not dropped) — `toLogicalStatements` (statements.ts) has
// its own dedicated handling for those.
//
// For a single-document consumer that has no wider INCLUDE graph to
// resolve (a DocumentLink provider resolving a link relative to the file
// that contains the statement, e.g. GesstabsFileReferenceLinkProvider /
// GesstabsDataSourceLinkProvider) and so builds its `ResolvedLine[]`
// straight from `document.lineAt` instead of `resolveIncludeGraph`. Left
// unfixed, an unterminated directive line (no `;`) glues onto the next
// line's own statement as a leading fragment in `toLogicalStatements` —
// as does an ordinary line's own trailing `// …` comment, when it isn't
// blanked first — defeating every `^\s*...`-anchored statement regex that
// follows it (confirmed: an INCLUDE right after #else/#end, or after any
// line ending in a trailing comment, silently stopped getting a link).
export function cleanedDocumentOrder(
  file: string,
  lines: string[]
): ResolvedLine[] {
  const scope = new Scope(makeScopeDoc(lines) as any);
  const out: ResolvedLine[] = [];
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    if (text.length === 0) {
      out.push({ file, line: i, text });
      continue;
    }
    if (!scope.isNotInComment(i, text.search(/\S/))) continue;
    if (
      defineRe.test(text) ||
      undefineRe.test(text) ||
      ignoreCaseRe.test(text)
    ) {
      continue;
    }
    const conds = scanBlockDirectives(text, (col) =>
      scope.isNormalScope(i, col)
    ).filter((d) => d.kind !== 'macro-start' && d.kind !== 'macro-end');
    if (conds.length > 0) continue;

    out.push({ file, line: i, text: blankComments(scope, i, text) });
  }
  return out;
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
  // unique per #ifdef/#ifndef/... opening — shared by its #else arm, so
  // branchPaths can tell "different arms of the same conditional" apart
  // from "two unrelated conditionals".
  groupId: number;
  // True when this conditional could not be statically decided —
  // #IF[N]EMPTY/#IF[N]EXIST(S) (never evaluated, see the module doc
  // comment) or a plain #ifdef/#ifndef whose name(s) are never touched by
  // any #define/#undefine anywhere in the reachable graph (TODO.md P1 —
  // such a switch is routinely set from outside the analyzed script: a
  // CLI -D flag, a different main*.tab variant, …). evaluateActive then
  // keeps BOTH arms active regardless of #else, unlike the fixed-
  // `conditionTrue: true` trick this replaced, which only ever kept the
  // `#ifdef` arm — once `#else` flipped `inElse`, `!conditionTrue` made
  // the `#else` arm inactive, silently dropping real content on that
  // side (confirmed: `#ifempty "&x"` `a;` `#else` `b;` `#end` used to
  // resolve to just `a;`).
  uncertain?: boolean;
}

function evaluateActive(stack: ConditionalFrame[]): boolean {
  if (stack.length === 0) return true;
  const top = stack[stack.length - 1];
  if (top.uncertain) return top.parentActive;
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
  // Skipped when this call already IS the all-active pass — collectKnownDefineNames
  // (declared below — genuinely mutually recursive with this function, not
  // just an ordering nit) makes exactly one such call itself with
  // conditionalsAllActive forced on, which is the recursion's base case.
  const knownSwitchNames = allActive
    ? undefined
    : new Set([
        // eslint-disable-next-line no-use-before-define
        ...collectKnownDefineNames(entryFile, readFile, options),
        ...Array.from(options.externalDefines ?? []).map((n) =>
          n.toLowerCase()
        ),
      ]);

  const order: ResolvedLine[] = [];
  const files: string[] = [];
  const errors: IncludeGraphError[] = [];
  const scopes = new Map<string, Scope>();
  const branchPaths = new Map<string, BranchPath>();
  const ancestors = new Set<string>();
  // A plain mutable-property counter rather than a reassigned `let` — the
  // group-id assignment below sits inside a callback nested in the line
  // loop, and eslint's no-loop-func rightly distrusts a closure over a
  // *reassigned* outer binding there (even though this one is only ever
  // read synchronously, never stashed for later).
  const groupIdCounter = { next: 0 };

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
      // diagnostic / folding / formatter via src/core/directives.ts), so an
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
            let conditionTrue = true;
            let uncertain = false;
            if (allActive) {
              // #IFDEF/#IFNDEF stop gating entirely (see options doc).
            } else if (tok === '#ifdef' || tok === '#ifndef') {
              const names = parseNameList(argText);
              if (
                knownSwitchNames &&
                names.every((n) => !knownSwitchNames.has(n.toLowerCase()))
              ) {
                // None of these names is ever #define'd/#undefine'd
                // anywhere in the reachable graph — nothing here can say
                // whether the switch is set (see ConditionalFrame.uncertain).
                uncertain = true;
              } else {
                conditionTrue =
                  tok === '#ifdef'
                    ? names.some((n) => defines.isDefined(n))
                    : names.some((n) => !defines.isDefined(n));
              }
            } else {
              // #IF[N]EMPTY / #IF[N]EXIST(S): not statically evaluated
              // (see module doc comment) — keep both branches active so
              // real definitions inside either arm are still found.
              uncertain = true;
            }
            stack.push({
              conditionTrue,
              inElse: false,
              parentActive: frameActive,
              groupId: groupIdCounter.next,
              uncertain,
            });
            groupIdCounter.next += 1;
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
      branchPaths.set(
        branchKey(file, i),
        stack.map(
          (f): BranchArm => ({
            group: f.groupId,
            arm: f.inElse ? 'else' : 'if',
          })
        )
      );
    }

    ancestors.delete(file);
  }

  visit(entryFile, 0);

  return { order, files, errors, scopes, branchPaths };
}

interface DefineDirectiveMatch {
  file: string;
  line: number;
  // exactly as written — callers that want the coarser lower-cased
  // "known at all" signal (collectKnownDefineNames below) lower-case at
  // their own call site.
  name: string;
}

// Every `#define`/`#undefine` directive anywhere in the reachable graph,
// ignoring #ifdef gating entirely (the same "everything, regardless of
// branch" traversal `conditionalsAllActive` already does). Shared walk
// behind both collectKnownDefineNames and collectAllDefineNames below —
// see the former's own comment for why re-reading raw file lines (rather
// than scanning `order`) is what's needed here: a `#define`/`#undefine`
// line is consumed by the resolver the same way an `#ifdef`/`#else`/`#end`
// directive line is and never reaches `order` at all (see
// IncludeGraphResult.branchPaths' doc comment).
function collectDefineDirectives(
  entryFile: string,
  readFile: FileReader,
  options: IncludeGraphOptions
): DefineDirectiveMatch[] {
  const matches: DefineDirectiveMatch[] = [];
  const full = resolveIncludeGraph(entryFile, readFile, {
    ...options,
    conditionalsAllActive: true,
  });
  full.files.forEach((file) => {
    const lines = readFile(file);
    if (!lines) return;
    const scope = new Scope(makeScopeDoc(lines) as any);
    lines.forEach((text, i) => {
      if (text.length === 0) return;
      if (!scope.isNotInComment(i, text.search(/\S/))) return;
      const d = text.match(defineRe);
      if (d) matches.push({ file, line: i, name: d[1] });
      const u = text.match(undefineRe);
      if (u) matches.push({ file, line: i, name: u[1] });
    });
  });
  return matches;
}

// Every name ever named in a `#define`/`#undefine` directive anywhere in
// the reachable graph — used to tell "this #ifdef's name is a real switch
// this script's authors use, just not set on this path" (confident) apart
// from "nothing here ever touches this name at all" (uncertain — see
// ConditionalFrame.uncertain). A conservative first cut: a name only ever
// `#define`'d inside a branch whose own activity depends on that same name
// is (rare, self-referential) still counted as known, since this pass
// itself never gates on #ifdef state.
function collectKnownDefineNames(
  entryFile: string,
  readFile: FileReader,
  options: IncludeGraphOptions
): Set<string> {
  const names = new Set<string>();
  // Lower-cased: this is a "is some real switch spelled anything like this
  // known at all" signal, not the real (default case-sensitive,
  // #ignorecase-aware) match `DefineSet.isDefined` performs — without
  // this, a `#define xyz` + later `#ifdef XYZ` (case mismatch, real
  // gessTabs: confidently NOT the same switch) would wrongly read as "xyz
  // is a total unknown", not "known, just doesn't match here".
  collectDefineDirectives(entryFile, readFile, options).forEach((m) =>
    names.add(m.name.toLowerCase())
  );
  return names;
}

// Same traversal as collectKnownDefineNames, but keeping each name's
// original casing — the set that check's own lower-casing throws away.
// Feeds checkDefineCaseMismatch's cross-INCLUDE half (diagnostics.ts): that
// check only ever saw the current document's own `#define` lines, so a
// `#define FOO;` sitting in an INCLUDEd file (or vice versa) was invisible
// to a case-mismatched `#ifdef foo` elsewhere in the graph. `options`
// defaults to `{}` (no `externalDefines`), unlike collectKnownDefineNames
// which is always called with the caller's own options — this is exported
// for a standalone caller that doesn't necessarily have any to pass.
export function collectAllDefineNames(
  entryFile: string,
  readFile: FileReader,
  options: IncludeGraphOptions = {}
): Set<string> {
  const names = new Set<string>();
  collectDefineDirectives(entryFile, readFile, options).forEach((m) =>
    names.add(m.name)
  );
  return names;
}
