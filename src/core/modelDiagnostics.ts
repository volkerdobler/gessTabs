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

import { locateInStatement } from './statements';
import { classifyStatement } from './variableStatements';
import { VariableModel } from './variableModel';
import { DiagnosticIssue } from './diagnostics';

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

// Declaring SysMiss/NIL/SystemFileNo/SystemWeight/SystemCaseNo is a syntax
// error — these can never be (re-)declared, only used. Deliberately reads
// the classified statements directly rather than the model's own symbols:
// buildVariableModel's main pass never lets anything overwrite a
// `predefined` symbol (`existing.origin !== 'predefined'` guards every
// merge), so a `SINGLEQ SysMiss = 1;` is silently dropped by the model
// itself — invisible to any check built on `model.all()`/`resolveAnywhere`.
export function checkSystemVariableRedeclaration(
  model: VariableModel,
  file: string
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  model.statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls || cls.defKind !== 'declaration') return;
    cls.defines.forEach((span) => {
      if (!SYSTEM_VARIABLE_NAMES.has(span.name)) return;
      const loc = locateInStatement(stmt, span.rawStart);
      if (loc.line.file !== file) return;
      issues.push({
        line: loc.line.line,
        startChar: loc.character,
        length: span.rawLength,
        severity: 'error',
        message: `"${span.raw}" ist eine vordefinierte Systemvariable (SysMiss/NIL/SystemFileNo/SystemWeight/SystemCaseNo) und darf nicht neu deklariert werden.`,
        code: 'system-variable-redeclaration',
      });
    });
  });
  return issues;
}
