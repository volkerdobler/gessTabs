// One shared, lazily rebuilt WorkspaceIndex per workspace folder (and per
// #ifdef mode), instead of every hover / go-to-definition / references /
// rename / completion / CodeLens / diagnostics pass resolving the whole
// INCLUDE graph from scratch on its own. Resolving the graph is the
// expensive part of all of those (seconds on a large project before the
// Scope fix, still hundreds of ms after) and it runs synchronously on the
// extension host that every other extension shares.
//
// Invalidation is generation-based, same pattern as
// GesstabsExternalNamesManager: any edit of an open file, closing a file
// (its unsaved buffer stops shadowing the disk copy) or a disk change the
// watcher sees bumps the generation, and the next request rebuilds. A
// burst of typing therefore costs nothing until something actually asks.

import * as vscode from 'vscode';
import * as path from 'path';
import { buildWorkspaceIndex, WorkspaceIndex } from '../core/symbolIndex';
import { fileListCache } from './lru';
import { getAllFilenamesInDirectory } from './fsutils';
import {
  fixDriveCasingInWindows,
  getWorkspaceFolderPath,
  normalizePath,
  workspaceReader,
} from './workspaceFiles';
import * as logger from './logger';

export interface WorkspaceIndexOptions {
  // See IncludeGraphOptions.conditionalsAllActive — the symbol tooling
  // (definition / references / rename / hovers / macro tooling) wants every
  // #ifdef branch, completion and the effective-elements hover the gated
  // "what would run here" view.
  conditionalsAllActive?: boolean;
}

let generation = 0;

const entries = new Map<
  string,
  { generation: number; index: Promise<WorkspaceIndex> }
>();

export function invalidateWorkspaceIndex(): void {
  generation += 1;
}

// Every file some index was ever built from (normalized, lower-cased) —
// lets edits and disk churn in unrelated files (another language's
// sources, GESStabs' own output: .txt/.sav/..., OneDrive sync) leave the
// index alone, while still catching a change to an INCLUDEd file that
// doesn't carry a .tab/.inc/.def extension. Only grows; a stale entry
// merely costs one unneeded rebuild.
const indexedFiles = new Set<string>();
const fileKey = (file: string): string => normalizePath(file).toLowerCase();

const SCRIPT_FILE = /\.(tab|inc|def)$/i;

function affectsIndex(file: string): boolean {
  return SCRIPT_FILE.test(file) || indexedFiles.has(fileKey(file));
}

// Same folder findWorkspaceFiles scans for `document`.
function folderOf(document: vscode.TextDocument): string {
  return (
    getWorkspaceFolderPath(document.uri) ||
    fixDriveCasingInWindows(path.dirname(document.fileName))
  );
}

// The files the index for `folder` is built from — same list, same cache.
export function workspaceScriptFiles(folder: string): Promise<string[]> {
  return getAllFilenamesInDirectory(folder, '(tab|inc|def)');
}

export function getFolderIndex(
  folder: string,
  options: WorkspaceIndexOptions = {}
): Promise<WorkspaceIndex> {
  const allActive = options.conditionalsAllActive ?? false;
  const key = `${folder}|${allActive ? 'all' : 'gated'}`;
  const hit = entries.get(key);
  if (hit && hit.generation === generation) return hit.index;

  // Stamped with the generation seen *before* the async file scan: an edit
  // landing during the scan leaves this entry behind, so the next request
  // rebuilds rather than trusting a build that raced the edit. Concurrent
  // requests in the same generation (two hover providers on one mouse
  // move) share this one build.
  const builtAt = generation;
  const index = (async () => {
    const files = await workspaceScriptFiles(folder);
    const started = Date.now();
    const result = buildWorkspaceIndex(files, workspaceReader(), {
      conditionalsAllActive: allActive,
    });
    result.scopes.forEach((_scope, file) => indexedFiles.add(fileKey(file)));
    logger.debug(
      `gesstabs: workspace index (${allActive ? 'all' : 'gated'}) built in ${
        Date.now() - started
      } ms, ${files.length} files, ${result.order.length} lines`
    );
    return result;
  })();
  entries.set(key, { generation: builtAt, index });
  index.catch(() => {
    if (entries.get(key)?.index === index) entries.delete(key);
  });
  return index;
}

export function getWorkspaceIndex(
  document: vscode.TextDocument,
  options: WorkspaceIndexOptions = {}
): Promise<WorkspaceIndex> {
  return getFolderIndex(folderOf(document), options);
}

export function registerWorkspaceIndexInvalidation(
  context: vscode.ExtensionContext
): void {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (
        e.document.uri.scheme === 'file' &&
        e.contentChanges.length > 0 &&
        affectsIndex(e.document.uri.fsPath)
      ) {
        invalidateWorkspaceIndex();
      }
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      if (document.uri.scheme === 'file' && affectsIndex(document.uri.fsPath)) {
        invalidateWorkspaceIndex();
      }
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      fileListCache.clear();
      invalidateWorkspaceIndex();
    })
  );

  const watcher = vscode.workspace.createFileSystemWatcher('**/*');
  const onDisk = (uri: vscode.Uri, created: boolean): void => {
    // A new/removed script also changes the file list
    // getAllFilenamesInDirectory caches (5 min TTL).
    if (created && SCRIPT_FILE.test(uri.fsPath)) fileListCache.clear();
    if (affectsIndex(uri.fsPath)) invalidateWorkspaceIndex();
  };
  context.subscriptions.push(
    watcher,
    watcher.onDidCreate((uri) => onDisk(uri, true)),
    watcher.onDidDelete((uri) => onDisk(uri, true)),
    watcher.onDidChange((uri) => onDisk(uri, false))
  );
}
