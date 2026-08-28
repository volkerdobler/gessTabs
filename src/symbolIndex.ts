// Builds a single, program-order-correct view across a whole workspace's
// .tab/.inc files, by resolving the INCLUDE graph (src/includeGraph.ts)
// from every "root" file (a file never reached via another file's
// INCLUDE) and merging their resolved line orders. This replaces treating
// every file found on disk as independently valid: a file that exists but
// is never actually INCLUDE'd from any real entry point no longer
// contributes definitions/references, and inactive #ifdef/#ifndef
// branches are excluded by resolveIncludeGraph — unless
// `conditionalsAllActive` is passed. All the symbol tooling that answers
// "where is this / who uses this" (macro & #EXPAND hover, go-to-
// definition, find-references, rename) passes it: an #ifdef branch the
// current build skips still contains real definitions and uses.
// Autocomplete and the effective-CELLELEMENTS hover keep the gated
// resolution (they answer "what would run here").

import {
  resolveIncludeGraph,
  FileReader,
  ResolvedLine,
  IncludeGraphOptions,
} from './includeGraph';
import { Scope } from './scope';
import { lineMatchesDefinition, lineMatchesUsage } from './matching';

export interface WorkspaceIndex {
  // Every active line, across every root's resolved include graph.
  order: ResolvedLine[];
  // Per-file Scope, for precise isNotInComment checks against `order`.
  scopes: Map<string, Scope>;
  // The subset of `files` that were treated as entry points.
  rootFiles: string[];
}

export function buildWorkspaceIndex(
  files: string[],
  readFile: FileReader,
  options: Pick<IncludeGraphOptions, 'conditionalsAllActive'> = {}
): WorkspaceIndex {
  const graphs = new Map<string, ReturnType<typeof resolveIncludeGraph>>();
  const everIncluded = new Set<string>();

  files.forEach((file) => {
    const graph = resolveIncludeGraph(file, readFile, options);
    graphs.set(file, graph);
    graph.files.forEach((f) => {
      if (f !== file) everIncluded.add(f);
    });
  });

  let rootFiles = files.filter((f) => !everIncluded.has(f));
  if (rootFiles.length === 0 && files.length > 0) {
    // Every file is reachable from some other file (e.g. a workspace-wide
    // INCLUDE cycle across otherwise-unrelated files) — fall back to
    // treating every file as its own root rather than indexing nothing.
    rootFiles = files;
  }

  const order: ResolvedLine[] = [];
  const scopes = new Map<string, Scope>();

  rootFiles.forEach((root) => {
    const graph = graphs.get(root);
    if (!graph) return;
    order.push(...graph.order);
    graph.scopes.forEach((scope, file) => scopes.set(file, scope));
  });

  return { order, scopes, rootFiles };
}

function isNotInCommentAt(
  index: WorkspaceIndex,
  rl: ResolvedLine
): (searchIndex: number) => boolean {
  const scope = index.scopes.get(rl.file);
  return (searchIndex: number) =>
    !scope || scope.isNotInComment(rl.line, searchIndex);
}

// Scans backward from (fromFile, fromLine) — or, if that position isn't
// part of the index, the whole index — for the nearest matching
// definition, mirroring gessTabs' no-forward-reference compile order.
export function findDefinitionLine(
  index: WorkspaceIndex,
  fromFile: string,
  fromLine: number,
  word: string
): ResolvedLine | undefined {
  const pos = index.order.findIndex(
    (l) => l.file === fromFile && l.line === fromLine
  );
  const searchSpace = pos === -1 ? index.order : index.order.slice(0, pos);
  for (let i = searchSpace.length - 1; i >= 0; i--) {
    const rl = searchSpace[i];
    if (lineMatchesDefinition(rl.text, word, isNotInCommentAt(index, rl))) {
      return rl;
    }
  }
  return undefined;
}

export function findAllUsages(
  index: WorkspaceIndex,
  word: string
): ResolvedLine[] {
  return index.order.filter((rl) =>
    lineMatchesUsage(rl.text, word, isNotInCommentAt(index, rl))
  );
}

// Locates the first word-boundary occurrence of `word` within `text`,
// for turning a matched line into a precise, renameable character range.
export function findWordRangeInLine(
  text: string,
  word: string
): [number, number] | undefined {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp(`\\b${escaped}\\b`, 'i'));
  if (!match || match.index === undefined) return undefined;
  return [match.index, match.index + match[0].length];
}
