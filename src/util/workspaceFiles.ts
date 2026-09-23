// Shared vscode-facing file/path helpers used by every provider that
// needs to read the workspace's .tab/.inc/.def files (definition/
// reference/rename providers in extension.ts, and the macro providers in
// macroProviders.ts) — kept in one place so they stay consistent rather
// than drifting between call sites.

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getAllFilenamesInDirectory } from './fsutils';
import { FileReader, ResolvedLine } from '../core/includeGraph';

// `basename:line` (or a custom `label`) rendered as a markdown link that
// opens `file` at `line` (0-based). Uses the `gesstabs.revealLine`
// command rather than the built-in `vscode.open`, whose `selection`
// option is ignored when the target file is already open. The hover's
// MarkdownString must opt in via
// `md.isTrusted = { enabledCommands: ['gesstabs.revealLine'] }`.
export function jumpLink(file: string, line: number, label?: string): string {
  const args = encodeURIComponent(
    JSON.stringify([vscode.Uri.file(file).toString(), line])
  );
  const text = label ?? `${path.basename(file)}:${line + 1}`;
  return `[${text}](command:gesstabs.revealLine?${args})`;
}

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

const splitLines = (text: string): string[] => text.split(/\r\n|\r|\n/);

// Line arrays handed out by workspaceReader, reused for as long as the
// content they came from is unchanged: an open document's by its version
// (a WeakMap on the TextDocument itself, so closing and reopening a file —
// a new TextDocument, version 1 again — can never hit a stale entry), a
// file on disk by mtime + size. Returning the *same* array for unchanged
// content is what lets includeGraph.ts's per-array Scope cache skip the
// full comment/string scan on every rebuild. The arrays must therefore
// never be mutated by a consumer.
const documentLines = new WeakMap<
  vscode.TextDocument,
  { version: number; lines: string[] }
>();
const diskLines = new Map<
  string,
  { mtimeMs: number; size: number; lines: string[] }
>();

function linesOfDocument(document: vscode.TextDocument): string[] {
  const hit = documentLines.get(document);
  if (hit && hit.version === document.version) return hit.lines;
  const lines = splitLines(document.getText());
  documentLines.set(document, { version: document.version, lines });
  return lines;
}

function linesOnDisk(filePath: string): string[] | undefined {
  const key = normalizePath(filePath);
  let stat: fs.Stats;
  try {
    stat = fs.statSync(filePath);
  } catch (_e) {
    diskLines.delete(key);
    return undefined;
  }
  const hit = diskLines.get(key);
  if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) {
    return hit.lines;
  }
  try {
    const lines = splitLines(fs.readFileSync(filePath, 'utf8'));
    diskLines.set(key, { mtimeMs: stat.mtimeMs, size: stat.size, lines });
    return lines;
  } catch (_e) {
    diskLines.delete(key);
    return undefined;
  }
}

// Reads each file from its live editor buffer when it is open, else from
// disk. Any open file's unsaved edits are visible to go-to-definition /
// references / rename / hover / macro tooling / the model diagnostics —
// not just the focused one: navigating *from* cleaning.inc *to* an
// edited-but-unsaved main.tab must land on the line the user currently
// sees, not the last-saved one. The open-document lookup is built once per
// reader (i.e. per index build), not per file read.
export function workspaceReader(): FileReader {
  const open = new Map<string, vscode.TextDocument>();
  vscode.workspace.textDocuments.forEach((d) => {
    if (d.uri.scheme === 'file') open.set(normalizePath(d.uri.fsPath), d);
  });
  return (filePath: string): string[] | undefined => {
    const document = open.get(normalizePath(filePath));
    return document ? linesOfDocument(document) : linesOnDisk(filePath);
  };
}

// A completion item whose label starts with "#" (a macro name or a "#"
// keyword like #DEFINE/#MACRO) can't rely on vscode's default replace
// range: the language's wordPattern (language-configuration.json)
// deliberately excludes "#" from word characters, so
// document.getWordRangeAtPosition at the cursor only covers the letters
// typed after the "#" (e.g. "zusatz"), never the "#" itself. vscode then
// filters every item's label ("#zusatzAusgaben") against that hash-less
// query — a mismatch that silently empties the suggestion list once
// anything has been typed past the "#" (confirmed: typing "#zusatz" then
// Ctrl+Space shows "No suggestions", even though the same position with
// nothing typed yet lists every macro). Handing the item an explicit
// range that starts at the "#" fixes both the filtering (paired with a
// filterText that also starts with "#") and accepting the item (without
// this, the default range leaves the original "#" untouched and the
// inserted label's own leading "#" duplicates it into "##name").
export function hashPrefixRangeAt(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.Range | undefined {
  const before = document
    .lineAt(position.line)
    .text.slice(0, position.character);
  const m = before.match(/#[A-Za-zÄÖÜßäöü0-9_]*$/);
  if (!m) return undefined;
  return new vscode.Range(
    position.line,
    position.character - m[0].length,
    position.line,
    position.character
  );
}

export function resolvedLineRange(resolved: ResolvedLine): vscode.Range {
  return new vscode.Range(
    new vscode.Position(resolved.line, 0),
    new vscode.Position(resolved.line, resolved.text.length)
  );
}

// Rekursive, gecachte Dateisuche lebt in src/util/fsutils.ts
// (getAllFilenamesInDirectory) und nutzt den geteilten TTL-LRU-Cache aus
// src/util/lru.ts.
//
// .def joined .tab/.inc here 2026-09-05 (design §9 Q6) — the manual's own
// INCLUDE example uses it (`INCLUDE = Labels.def;`, "Arbeit mit GESStabs
// > Das Skript"), and INCLUDE itself never restricted the target's
// extension in the first place (resolveIncludeGraph just reads whatever
// path the statement names) — the workspace-wide file *discovery* this
// feeds was the one place still gate-kept to .tab/.inc.
export async function findWorkspaceFiles(
  document: vscode.TextDocument
): Promise<string[]> {
  const wsfolder =
    getWorkspaceFolderPath(document.uri) ||
    fixDriveCasingInWindows(path.dirname(document.fileName));
  return getAllFilenamesInDirectory(wsfolder, '(tab|inc|def)');
}
