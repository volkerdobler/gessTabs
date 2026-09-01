// Thin vscode wiring for src/core/diagnostics.ts (F2) — manages a
// DiagnosticCollection's lifecycle. Unlike vscode's provider interfaces
// (HoverProvider, CompletionItemProvider, ...) there is no
// "DiagnosticProvider" registration point; diagnostics are pushed
// manually by listening for document open/change/close, which is what
// GesstabsDiagnosticsManager does. GesstabsEmptyVarlistCodeActionProvider
// (F5's quick fix for the empty-varlist diagnostic) lives here too since
// it operates directly on the diagnostics this file produces.

import * as vscode from 'vscode';
import { Scope } from '../core/scope';
import {
  computeDiagnostics,
  findLastDeclaredVariableBefore,
  DiagnosticSeverity,
} from '../core/diagnostics';
import { printDebugMessage } from '../util/workspaceFiles';

function toVscodeSeverity(
  severity: DiagnosticSeverity
): vscode.DiagnosticSeverity {
  return severity === 'error'
    ? vscode.DiagnosticSeverity.Error
    : vscode.DiagnosticSeverity.Warning;
}

export class GesstabsDiagnosticsManager {
  private readonly collection: vscode.DiagnosticCollection;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection('gesstabs');
  }

  public dispose(): void {
    this.collection.dispose();
  }

  public refresh(document: vscode.TextDocument): void {
    if (document.languageId !== 'gesstabs') return;
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('diagnostics.enabled', true) === false) {
        this.collection.delete(document.uri);
        return;
      }

      const scope = new Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      const issues = computeDiagnostics(lines, (line, char) =>
        scope.isNotInComment(line, char)
      );

      const diagnostics = issues.map((issue) => {
        const range = new vscode.Range(
          new vscode.Position(issue.line, issue.startChar),
          new vscode.Position(issue.line, issue.startChar + issue.length)
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          issue.message,
          toVscodeSeverity(issue.severity)
        );
        diagnostic.source = 'gesstabs';
        diagnostic.code = issue.code;
        return diagnostic;
      });

      this.collection.set(document.uri, diagnostics);
    } catch (e) {
      printDebugMessage(`gesstabs: diagnostics failed: ${e}`);
    }
  }

  public clear(document: vscode.TextDocument): void {
    this.collection.delete(document.uri);
  }
}

// F5's quick fix for the empty-varlist diagnostic: "insert
// <lastVariableName> explicitly". Only offered when a prior declaration
// was actually found in this document — with nothing to insert, a
// half-baked placeholder would be more confusing than no quick fix at
// all.
export class GesstabsEmptyVarlistCodeActionProvider
  implements vscode.CodeActionProvider
{
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    try {
      const relevant = context.diagnostics.filter(
        (d) => d.source === 'gesstabs' && d.code === 'empty-varlist'
      );
      if (relevant.length === 0) return [];

      const scope = new Scope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      const actions: vscode.CodeAction[] = [];
      relevant.forEach((diagnostic) => {
        const lastVar = findLastDeclaredVariableBefore(
          lines,
          diagnostic.range.start.line,
          (line, char) => scope.isNotInComment(line, char)
        );
        if (!lastVar) return;

        const action = new vscode.CodeAction(
          `Insert "${lastVar}" explicitly`,
          vscode.CodeActionKind.QuickFix
        );
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new vscode.WorkspaceEdit();
        action.edit.insert(document.uri, diagnostic.range.end, ` ${lastVar}`);
        actions.push(action);
      });

      return actions;
    } catch (e) {
      printDebugMessage(`gesstabs: empty-varlist quick fix failed: ${e}`);
      return [];
    }
  }
}
