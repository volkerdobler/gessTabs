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
import {
  findWorkspaceFiles,
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

// Same folder findWorkspaceFiles scans for `document`.
function folderOf(document: vscode.TextDocument): string {
  return (
    getWorkspaceFolderPath(document.uri) ||
    fixDriveCasingInWindows(path.dirname(document.fileName))
  );
}

export function getWorkspaceIndex(
  document: vscode.TextDocument,
  options: WorkspaceIndexOptions = {}
): Promise<WorkspaceIndex> {
  const allActive = options.conditionalsAllActive ?? false;
  const key = `${folderOf(document)}|${allActive ? 'all' : 'gated'}`;
  const hit = entries.get(key);
  if (hit && hit.generation === generation) return hit.index;

  // Stamped with the generation seen *before* the async file scan: an edit
  // landing during the scan leaves this entry behind, so the next request
  // rebuilds rather than trusting a build that raced the edit. Concurrent
  // requests in the same generation (two hover providers on one mouse
  // move) share this one build.
  const builtAt = generation;
  const index = (async () => {
    const files = await findWorkspaceFiles(document);
    const started = Date.now();
    const result = buildWorkspaceIndex(files, workspaceReader(), {
      conditionalsAllActive: allActive,
    });
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

// Whether `file` is one of the files a cached index was built from — lets
// the watcher ignore disk churn in unrelated files (GESStabs' own output:
// .txt/.sav/..., OneDrive sync) while still catching a change to an
// INCLUDEd file that doesn't carry a .tab/.inc/.def extension.
async function isIndexedFile(file: string): Promise<boolean> {
  const needle = normalizePath(file).toLowerCase();
  const indexes = await Promise.all(
    Array.from(entries.values()).map((e) => e.index.catch(() => undefined))
  );
  return indexes.some(
    (idx) =>
      !!idx &&
      Array.from(idx.scopes.keys()).some(
        (f) => normalizePath(f).toLowerCase() === needle
      )
  );
}

const SCRIPT_FILE = /\.(tab|inc|def)$/i;

export function registerWorkspaceIndexInvalidation(
  context: vscode.ExtensionContext
): void {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.scheme === 'file' && e.contentChanges.length > 0) {
        invalidateWorkspaceIndex();
      }
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      if (document.uri.scheme === 'file') invalidateWorkspaceIndex();
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      fileListCache.clear();
      invalidateWorkspaceIndex();
    })
  );

  const watcher = vscode.workspace.createFileSystemWatcher('**/*');
  const onDisk = (uri: vscode.Uri, created: boolean): void => {
    if (SCRIPT_FILE.test(uri.fsPath)) {
      // A new/removed script changes the file list findWorkspaceFiles
      // caches (5 min TTL) as well as the graph itself.
      if (created) fileListCache.clear();
      invalidateWorkspaceIndex();
      return;
    }
    isIndexedFile(uri.fsPath)
      .then((indexed) => {
        if (indexed) invalidateWorkspaceIndex();
      })
      .catch(() => undefined);
  };
  context.subscriptions.push(
    watcher,
    watcher.onDidCreate((uri) => onDisk(uri, true)),
    watcher.onDidDelete((uri) => onDisk(uri, true)),
    watcher.onDidChange((uri) => onDisk(uri, false))
  );
}
