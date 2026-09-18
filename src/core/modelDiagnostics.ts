// Model-based diagnostics (P1.6) — checks that need the whole-workspace
// variable model (cross-INCLUDE, external/raw-dataset names, macro-produced
// names), unlike the document-scoped, classifier-only checks in
// diagnostics.ts (which explicitly document cross-INCLUDE scope as a known
// gap — see its own header comment). Reuses that module's DiagnosticIssue
// shape for consistency, though `line`/`startChar`/`length` here are always
// relative to the one `file` the caller asks about — the model itself spans
// every INCLUDEd/entry file, so each check filters its own output down to
// that one document (the caller runs this once per open document, same
// shape as diagnostics.ts's own per-document checks).
//
// Design doc §9's settled judgement calls (2026-09-04):
//   - undefined variable ships under gesstabs.diagnostics.enabled, severity
//     Warning, and must be suppressed entirely for a program while any of
//     its data sources is unresolved (a project whose .sav/.csv isn't on
//     the editing machine must not get false "undefined" noise) — the
//     caller decides that (it owns the external-source resolution) and
//     simply doesn't call checkUndefinedVariables when so.
//   - system-variable redeclaration is severity Error (the manual documents
//     it as a real syntax error).

import * as path from 'path';
import { locateInStatement } from './statements';
import { classifyStatement } from './variableStatements';
import { VariableModel } from './variableModel';
import { DiagnosticIssue } from './diagnostics';
import { WorkspaceIndex, collectAllMacroCalls } from './symbolIndex';
import { ResolvedLine } from './includeGraph';
import { BranchPath, branchKey, branchPathsCompatible } from './branchPaths';
import {
  findMacroDefinitions,
  buildMacroIndex,
  expandLines,
  MacroDefinition,
} from './macroExpansion';

// Manual: Systemvariablen — declaring one of these is a syntax error. Kept
// in sync with variableModel.ts's own PREDEFINED list by hand (small,
// closed, unlikely-to-change set; not worth a shared export for five names).
const SYSTEM_VARIABLE_NAMES = new Set([
  'sysmiss',
  'nil',
  'systemfileno',
  'systemweight',
  'systemcaseno',
]);

// A bare reference the model cannot resolve at its own position — no
// declaration anywhere in scope, no raw dataset column, no macro-produced
// name. `model` must already have been built with `externalNames` and
// `macroExpansion: true` (BuildVariableModelOptions) for this to be
// meaningful; without them, every raw/macro-produced name would falsely
// flag. Skips a quoted `ifKnown`-mode token that never resolves — that's
// simply label text that happens to look like a name (the manual's
// quoted-token rule, already how model.references() treats it), not an
// unresolved reference.
export function checkUndefinedVariables(
  model: VariableModel,
  file: string
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  model.statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls) return;
    cls.references.forEach(({ span, mode }) => {
      if (mode === 'never' || span.synthetic) return;
      const loc = locateInStatement(stmt, span.rawStart);
      if (loc.line.file !== file) return;
      if (model.resolve(span.name, loc.line.file, loc.line.line)) return;
      if (mode === 'ifKnown' && span.quoted) return;
      issues.push({
        line: loc.line.line,
        startChar: loc.character,
        length: span.rawLength,
        severity: 'warning',
        message: `"${span.raw}" ist nirgends definiert (weder im Skript deklariert noch als Rohvariable oder Macro-Ergebnis erkannt).`,
        code: 'undefined-variable',
      });
    });
  });
  return issues;
}

// Manual, verbatim: "Der Versuch, eigene Variablen mit diesen Namen zu
// generieren, führt zu einem Fehler." — generating one's own variable
// under one of these names is the error, not specifically *declaring* one:
// COMPUTE/IF…THEN generates a variable exactly as much as SINGLEQ does
// (gessTabs auto-creates on first COMPUTE, §3.3), so both `defKind`s are
// checked here — a real reported gap, `compute sysmiss = 1;` wasn't
// flagged while `singleq sysmiss = 1;` was. A mere *use* of the name
// (`if sysmiss eq 1 then x = 2;` — a `references` span, not `defines`) is
// completely legal and never touched by this check.
//
// Deliberately reads the classified statements directly rather than the
// model's own symbols: buildVariableModel's main pass never lets anything
// overwrite a `predefined` symbol (`existing.origin !== 'predefined'`
// guards every merge), so a `SINGLEQ SysMiss = 1;` (or `COMPUTE SysMiss =
// 1;`) is silently dropped by the model itself — invisible to any check
// built on `model.all()`/`resolveAnywhere`.
export function checkSystemVariableRedeclaration(
  model: VariableModel,
  file: string
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  model.statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls) return;
    cls.defines.forEach((span) => {
      if (!SYSTEM_VARIABLE_NAMES.has(span.name)) return;
      const loc = locateInStatement(stmt, span.rawStart);
      if (loc.line.file !== file) return;
      issues.push({
        line: loc.line.line,
        startChar: loc.character,
        length: span.rawLength,
        severity: 'error',
        message: `"${span.raw}" ist eine vordefinierte Systemvariable (SysMiss/NIL/SystemFileNo/SystemWeight/SystemCaseNo) — eine eigene Variable mit diesem Namen zu erzeugen (Deklaration oder Zuweisung) führt zu einem Fehler.`,
        code: 'system-variable-redeclaration',
      });
    });
  });
  return issues;
}

// Mirrors compiler error 8: "variable declared twice" — the cross-INCLUDE
// version of diagnostics.ts's former document-scoped
// `checkDuplicateDeclarations` (removed there; this is a strict superset,
// since `model.statements` already spans every INCLUDEd/entry file). Same
// `defKind === 'declaration'` gate (design doc §9 Q3): a COMPUTE/IF…THEN
// re-assignment is never counted, even reusing an existing name — that's
// normal, legal re-assignment.
export function checkDuplicateDeclarations(
  model: VariableModel,
  file: string
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const firstSeenAt = new Map<string, { file: string; line: number }>();

  model.statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls || cls.defKind !== 'declaration') return;
    cls.defines.forEach((span) => {
      const loc = locateInStatement(stmt, span.rawStart);
      const first = firstSeenAt.get(span.name);
      if (!first) {
        firstSeenAt.set(span.name, {
          file: loc.line.file,
          line: loc.line.line,
        });
        return;
      }
      if (loc.line.file !== file) return;
      const elsewhere = first.file !== file;
      issues.push({
        line: loc.line.line,
        startChar: loc.character,
        length: span.rawLength,
        severity: 'warning',
        message: `"${span.raw}" was already declared at ${
          elsewhere ? `${path.basename(first.file)}:` : ''
        }line ${first.line + 1}.`,
        code: 'duplicate-declaration',
      });
    });
  });

  return issues;
}

function firstNonWs(lineText: string): number {
  const idx = lineText.search(/\S/);
  return idx === -1 ? 0 : idx;
}

// A #MACRO body statement that DEFINES a variable (GROUPS/COMPUTE/SINGLEQ/…
// — any statement whose `defines` is non-empty — but deliberately NOT an
// IF…THEN, `kind === 'if-then'`, whose target is itself conditional rather
// than the thing that unconditionally (re-)declares a name on every
// expansion) compiles into one literal statement per call once the macro's
// `&params` are substituted. If that substitution happens to produce the
// *same* name on two or more calls — almost always because the name never
// referenced one of the macro's own parameters to begin with, e.g. `groups
// fixedname = …;` inside `#macro #x( &z )` — the expanded script declares
// that name twice, which the real compiler rejects ("variable declared
// twice"), same failure mode as checkDuplicateDeclarations above, just
// produced indirectly through macro expansion instead of two literal
// source statements. A name that DOES depend on a parameter (`groups
// VAR_&z = …;`) is the documented way to avoid this, and is only flagged
// here if two calls happen to substitute down to the same literal name
// anyway (e.g. called twice with the same argument) — this check is driven
// entirely by the actual substituted result, never by guessing whether the
// raw source text "looks parameterized".
//
// The diagnostic is placed at the *call site* that actually collides, not
// at the #MACRO body line: the body line is where the declaration is
// written once, but it never "crashes" by itself — the compiler only fails
// once two calls happen to expand it to the same name, and that failure is
// only findable/fixable by looking at those specific calls (mirrors
// checkDuplicateDeclarations, which likewise points at the redeclaring
// statement and names where the first one was, not some third, unrelated
// location). Reported per file the way every check here is: only a call
// site that lives in the requested `file` gets an issue, even if the
// #MACRO itself, or the call it collides with, lives elsewhere.
//
// Reuses the same macro-call enumeration as symbolIndex.ts's own
// findAllMacroProducedNames (collectAllMacroCalls — including #DOMACRO/
// #DOMACRO2-generated and indirectly-flattened calls), but needs each call
// grouped by its target macro (not flattened into one big name list) and
// needs `ClassifiedStatement.kind` to exclude IF…THEN, which
// MacroProducedName doesn't carry — so this re-implements the per-call
// expand-and-classify step directly rather than building on top of it.
export function checkMacroDuplicateVariableDefinition(
  index: WorkspaceIndex,
  file: string
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const macroIndex = buildMacroIndex(findMacroDefinitions(index.order));
  if (macroIndex.size === 0) return issues;

  const callsByMacro = new Map<
    string,
    { macro: MacroDefinition; args: string[]; callSite: ResolvedLine }[]
  >();
  collectAllMacroCalls(index, macroIndex).forEach(
    ({ macro, args, callSite }) => {
      const key = `${macro.file}:${macro.defLine}`;
      const list = callsByMacro.get(key);
      if (list) {
        list.push({ macro, args, callSite });
      } else {
        callsByMacro.set(key, [{ macro, args, callSite }]);
      }
    }
  );

  callsByMacro.forEach((macroCalls) => {
    if (macroCalls.length < 2) return;
    const { macro } = macroCalls[0];

    const bodyLines = index.order.filter(
      (l) =>
        l.file === macro.file &&
        l.line > macro.defLine &&
        l.line < macro.endLine
    );

    bodyLines.forEach((bl) => {
      const perCall = macroCalls.map(({ args, callSite }) => ({
        cls: classifyStatement(expandLines([bl.text], macro.params, args)[0]),
        args,
        callSite,
      }));
      const first = perCall[0]?.cls;
      if (!first || first.kind === 'if-then' || first.defines.length === 0) {
        return;
      }

      first.defines.forEach((_, defIdx) => {
        // First, look across *every* call (regardless of file) to tell
        // apart two very different situations: a name that never actually
        // varies with the call (every single call collapses to one name —
        // the declaration was never parameterized to begin with, and
        // *every* later call is a fresh collision), versus a name that
        // does normally vary but a couple of calls happen to coincide
        // (e.g. two calls were given the same argument by mistake).
        const allNames = new Set<string>();
        let consideredCalls = 0;
        perCall.forEach(({ cls }) => {
          const span = cls?.defines[defIdx];
          if (!span) return;
          consideredCalls += 1;
          allNames.add(span.name);
        });
        if (consideredCalls < 2) return;
        const neverVaries = allNames.size === 1;

        const paramHint =
          neverVaries && macro.params.length > 0
            ? ` Make the name depend on one of the macro's own parameters (${macro.params
                .map((p) => `&${p}`)
                .join(', ')}), e.g. "..._&${
                macro.params[0]
              }", so each call produces a distinct name.`
            : '';

        // Walk the calls in program order and, for each name, remember
        // every *branch-path-distinct* occurrence seen so far — not just
        // the first. Two calls inside mutually exclusive #ifdef/#else arms
        // never both run on the same real build (branchPathsCompatible),
        // so they never actually collide, no matter how many times that
        // pair repeats; two calls that CAN run together (same arm, or
        // either one unconditional) do collide the moment a second,
        // path-compatible occurrence of the same name shows up — mirrors
        // variableModel.ts's primaryDefinitions dominance check, just
        // applied per produced name instead of per symbol.
        const occurrencesByName = new Map<
          string,
          {
            raw: string;
            args: string[];
            callSite: ResolvedLine;
            branchPath: BranchPath;
          }[]
        >();
        perCall.forEach(({ cls, args, callSite }) => {
          const span = cls?.defines[defIdx];
          if (!span) return;
          const branchPath =
            index.branchPaths.get(branchKey(callSite.file, callSite.line)) ??
            [];
          const occurrences = occurrencesByName.get(span.name);
          const conflict = occurrences?.find((o) =>
            branchPathsCompatible(o.branchPath, branchPath)
          );
          if (conflict && callSite.file === file) {
            const elsewhere = conflict.callSite.file !== callSite.file;
            const earlierLoc = `${
              elsewhere ? `${path.basename(conflict.callSite.file)}:` : ''
            }line ${conflict.callSite.line + 1}`;
            const sameArgs =
              args.length === conflict.args.length &&
              args.every((a, i) => a === conflict.args[i]);

            const detail = neverVaries
              ? `#${macro.name} is called ${macroCalls.length}× in this program, and this call's "${bl.text.trim()}" always declares "${span.raw}" with the exact same name, just like the call at ${earlierLoc} — once expanded, the compiler will fail with "variable declared twice".${paramHint}`
              : sameArgs
                ? `This #${macro.name} call passes the exact same arguments as the call at ${earlierLoc}, so both expand to declare "${span.raw}" here — once expanded, the compiler will fail with "variable declared twice". Check whether one of these two calls should use different arguments.`
                : `This #${macro.name} call also expands to declare "${span.raw}" here, the same name the call at ${earlierLoc} already produces (with different arguments) — once expanded, the compiler will fail with "variable declared twice".`;

            issues.push({
              line: callSite.line,
              startChar: firstNonWs(callSite.text),
              length: Math.max(callSite.text.trim().length, 1),
              severity: 'error',
              message: detail,
              code: 'macro-duplicate-variable-definition',
            });
          }
          if (occurrences) {
            occurrences.push({ raw: span.raw, args, callSite, branchPath });
          } else {
            occurrencesByName.set(span.name, [
              { raw: span.raw, args, callSite, branchPath },
            ]);
          }
        });
      });
    });
  });

  return issues;
}
