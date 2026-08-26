// Shared vscode-facing file/path helpers used by every provider that
// needs to read the workspace's .tab/.inc files (definition/reference/
// rename providers in extension.ts, and the macro providers in
// macroProviders.ts) — kept in one place so they stay consistent rather
// than drifting between call sites.

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getAllFilenamesInDirectory } from './fsutils';
import { FileReader, ResolvedLine } from './includeGraph';

// Workaround for issue in https://github.com/Microsoft/vscode/issues/9448#issuecomment-244804026
export function fixDriveCasingInWindows(pathToFix: string): string {
  return process.platform === 'win32' && pathToFix
    ? pathToFix.substr(0, 1).toUpperCase() + pathToFix.substr(1)
    : pathToFix;
}

export function getWorkspaceFolderPath(
  fileUri?: vscode.Uri
): string | undefined {
  if (fileUri) {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    if (workspace) {
      return fixDriveCasingInWindows(workspace.uri.fsPath);
    }
  }

  // fall back to the first workspace
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length) {
    return fixDriveCasingInWindows(folders[0].uri.fsPath);
  }
  return undefined;
}

// getAllFilenamesInDirectory paths all inherit their drive-letter casing
// from a fixDriveCasingInWindows()-normalized root, but vscode.Uri.fsPath
// isn't guaranteed to use the same casing (the very inconsistency
// fixDriveCasingInWindows exists to work around) — so any path used to
// compare against or key into a workspace index must be normalized
// through this first.
export function normalizePath(filePath: string): string {
  return fixDriveCasingInWindows(path.resolve(filePath));
}

// Reads every candidate file from disk, except the currently-open
// document, which is read from its live editor buffer so a user's own
// unsaved edits are always visible to go-to-definition/references/
// rename/macro tooling. Other files reflect their last-saved state — the
// same thing the real gessTabs compiler would see if it ran right now.
export function makeWorkspaceReader(document: vscode.TextDocument): FileReader {
  const currentPath = normalizePath(document.uri.fsPath);
  return (filePath: string): string[] | undefined => {
    if (normalizePath(filePath) === currentPath) {
      return document.getText().split(/\r\n|\r|\n/);
    }
    try {
      return fs.readFileSync(filePath, 'utf8').split(/\r\n|\r|\n/);
    } catch (e) {
      return undefined;
    }
  };
}

export function resolvedLineRange(resolved: ResolvedLine): vscode.Range {
  return new vscode.Range(
    new vscode.Position(resolved.line, 0),
    new vscode.Position(resolved.line, resolved.text.length)
  );
}

// Rekursive, gecachte Dateisuche lebt in src/fsutils.ts
// (getAllFilenamesInDirectory) und nutzt den geteilten TTL-LRU-Cache aus
// src/lru.ts.
export async function findWorkspaceFiles(
  document: vscode.TextDocument
): Promise<string[]> {
  const wsfolder =
    getWorkspaceFolderPath(document.uri) ||
    fixDriveCasingInWindows(path.dirname(document.fileName));
  return getAllFilenamesInDirectory(wsfolder, '(tab|inc)');
}
