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
    { macro: MacroDefinition; args: string[] }[]
  >();
  collectAllMacroCalls(index, macroIndex).forEach(({ macro, args }) => {
    const key = `${macro.file}:${macro.defLine}`;
    const list = callsByMacro.get(key);
    if (list) {
      list.push({ macro, args });
    } else {
      callsByMacro.set(key, [{ macro, args }]);
    }
  });

  callsByMacro.forEach((macroCalls) => {
    if (macroCalls.length < 2) return;
    const { macro } = macroCalls[0];
    if (macro.file !== file) return;

    const bodyLines = index.order.filter(
      (l) =>
        l.file === macro.file &&
        l.line > macro.defLine &&
        l.line < macro.endLine
    );

    bodyLines.forEach((bl) => {
      const perCall = macroCalls.map(({ args }) =>
        classifyStatement(expandLines([bl.text], macro.params, args)[0])
      );
      const first = perCall[0];
      if (!first || first.kind === 'if-then' || first.defines.length === 0) {
        return;
      }

      first.defines.forEach((_, defIdx) => {
        const seen = new Set<string>();
        let duplicateName: string | undefined;
        perCall.forEach((cls) => {
          const span = cls?.defines[defIdx];
          if (!span) return;
          if (seen.has(span.name)) {
            duplicateName = span.raw;
          } else {
            seen.add(span.name);
          }
        });
        if (!duplicateName) return;

        const paramHint =
          macro.params.length > 0
            ? ` Make the name depend on one of the macro's own parameters (${macro.params
                .map((p) => `&${p}`)
                .join(', ')}), e.g. "..._&${
                macro.params[0]
              }", so each call produces a distinct name.`
            : '';
        issues.push({
          line: bl.line,
          startChar: firstNonWs(bl.text),
          length: Math.max(bl.text.trim().length, 1),
          severity: 'error',
          message: `#${macro.name} is called ${macroCalls.length}× in this program, and this statement always declares "${duplicateName}" with the exact same name — once expanded, the compiler will fail with "variable declared twice".${paramHint}`,
          code: 'macro-duplicate-variable-definition',
        });
      });
    });
  });

  return issues;
}
