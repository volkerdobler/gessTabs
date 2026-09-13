// Thin vscode wiring for src/core/diagnostics.ts (F2) — manages a
// DiagnosticCollection's lifecycle. Unlike vscode's provider interfaces
// (HoverProvider, CompletionItemProvider, ...) there is no
// "DiagnosticProvider" registration point; diagnostics are pushed
// manually by listening for document open/change/close, which is what
// GesstabsDiagnosticsManager does. GesstabsEmptyVarlistCodeActionProvider
// (F5's quick fix for the empty-varlist diagnostic) lives here too since
// it operates directly on the diagnostics this file produces.

import * as vscode from 'vscode';
import { getCachedScope } from '../core/scope';
import {
  computeDiagnostics,
  findLastDeclaredVariableBefore,
  checkEmptyVarlist,
  hasStrictVarlistEnabled,
  findEnclosingBlockCommentGroup,
  DiagnosticSeverity,
} from '../core/diagnostics';
import * as logger from '../util/logger';

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

      const scope = getCachedScope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      const issues = computeDiagnostics(
        lines,
        (line, char) => scope.isNotInComment(line, char),
        (line, char) => scope.isNormalScope(line, char)
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
      logger.error(`gesstabs: diagnostics failed: ${e}`);
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

      const scope = getCachedScope(document);
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
      logger.error(`gesstabs: empty-varlist quick fix failed: ${e}`);
      return [];
    }
  }
}

// The empty-varlist diagnostic's *other* suggested fix: forbid the whole
// error-prone pattern outright by adding STRICTVARLIST = YES; near the top
// of the file, rather than fixing one occurrence at a time. Deliberately
// NOT built on `context.diagnostics` like GesstabsEmptyVarlistCodeActionProvider
// above — that only fires when the cursor/selection is on one specific
// diagnostic's squiggle, which is the wrong trigger for a document-wide
// "turn this off everywhere" suggestion. Registered as a Source action
// instead (shown via the lightbulb regardless of cursor position, and
// under the "Source Action..." command), and decides relevance itself by
// scanning the whole document. One-shot: stops offering itself once
// STRICTVARLIST = YES; is already present anywhere in the file.
export class GesstabsStrictVarlistCodeActionProvider
  implements vscode.CodeActionProvider
{
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Source,
  ];

  public provideCodeActions(
    document: vscode.TextDocument
  ): vscode.CodeAction[] {
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('diagnostics.enabled', true) === false) {
        return [];
      }

      const scope = getCachedScope(document);
      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }
      const isNotInComment = (line: number, char: number) =>
        scope.isNotInComment(line, char);

      if (hasStrictVarlistEnabled(lines, isNotInComment)) return [];
      if (checkEmptyVarlist(lines, isNotInComment).length === 0) return [];

      const action = new vscode.CodeAction(
        'Add STRICTVARLIST = YES; to forbid empty-varlist statements',
        vscode.CodeActionKind.Source
      );
      action.edit = new vscode.WorkspaceEdit();
      action.edit.insert(
        document.uri,
        new vscode.Position(0, 0),
        'STRICTVARLIST = YES;\n'
      );
      return [action];
    } catch (e) {
      logger.error(`gesstabs: STRICTVARLIST source action failed: ${e}`);
      return [];
    }
  }
}

// F5's quick fix for the nested-block-comment diagnostic: rather than try
// to repair the (ambiguous, see core/diagnostics.ts's
// scanBlockCommentGroups) intended "{ … }" range, it sidesteps the whole
// nesting problem the way the user themselves asked for — drop the block
// delimiters and prefix every line of the (best-effort) outer group with
// "//" instead, so each line comments itself out independently.
export class GesstabsNestedBlockCommentCodeActionProvider
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
        (d) => d.source === 'gesstabs' && d.code === 'nested-block-comment'
      );
      if (relevant.length === 0) return [];

      const lines: string[] = [];
      for (let i = 0; i < document.lineCount; i += 1) {
        lines.push(document.lineAt(i).text);
      }

      const actions: vscode.CodeAction[] = [];
      const handledGroups = new Set<number>();
      relevant.forEach((diagnostic) => {
        const group = findEnclosingBlockCommentGroup(
          lines,
          diagnostic.range.start.line,
          diagnostic.range.start.character
        );
        if (!group) return;
        if (handledGroups.has(group.outerStart.line)) return;
        handledGroups.add(group.outerStart.line);

        const action = new vscode.CodeAction(
          'Comment out each line with "//" instead of "{ … }"',
          vscode.CodeActionKind.QuickFix
        );
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new vscode.WorkspaceEdit();
        const { line: startLine } = group.outerStart;
        const { line: endLine } = group.outerEnd;
        for (let line = startLine; line <= endLine; line += 1) {
          action.edit.insert(document.uri, new vscode.Position(line, 0), '//');
        }
        actions.push(action);
      });

      return actions;
    } catch (e) {
      logger.error(`gesstabs: nested-block-comment quick fix failed: ${e}`);
      return [];
    }
  }
}
