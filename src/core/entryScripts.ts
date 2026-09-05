// Locating the data-source-bearing entry scripts of a workspace, and
// mapping any file back to the entry program(s) that include it. See
// docs/variable-model-design.md §11.2.
//
// This does NOT change how the workspace symbol index is built — it is used
// only to decide which CSVINFILE/SPSSINFILE/DATAFILE statements to read and
// which file's data source applies when resolving a name.
//
// Pure: the include graph is resolved through an injected FileReader and
// the data files through an injected ExternalNamesIO.

import * as path from 'path';
import { FileReader, resolveIncludeGraph } from './includeGraph';
import {
  ExternalNamesIO,
  ExternalNameSource,
  readExternalNames,
} from './externalNames';
import { matchesAnyPattern } from '../util/glob';

export const DEFAULT_ENTRY_SCRIPT_PATTERNS = ['main.tab', 'main*.tab', '*.tab'];

// Re-exported for callers that imported it from here before it moved to
// src/util/glob.ts (shared with externalNames.ts's wildcard data paths).
export { matchesAnyPattern };

// Every `.tab` in `tabFiles` whose basename matches any of `patterns`.
export function findEntryScripts(
  tabFiles: string[],
  patterns: string[] = DEFAULT_ENTRY_SCRIPT_PATTERNS
): string[] {
  if (patterns.length === 0) return [];
  return tabFiles.filter((f) => matchesAnyPattern(path.basename(f), patterns));
}

export interface EntryProgram {
  entryFile: string;
  // Every file in the entry script's resolved INCLUDE graph (entry first).
  files: string[];
  // The data sources declared anywhere in that graph.
  sources: ExternalNameSource[];
}

// One EntryProgram per *root* entry script — a matching `.tab` that is not
// itself pulled in via INCLUDE by another matching `.tab` (a shared
// sub-script is not its own program). Uses the real, gated include
// resolution: a CSVINFILE inside an inactive `#ifdef` branch is not a
// source of this build.
export function buildEntryPrograms(
  tabFiles: string[],
  patterns: string[],
  readFile: FileReader,
  io: ExternalNamesIO
): EntryProgram[] {
  const candidates = findEntryScripts(tabFiles, patterns);
  const graphs = new Map(
    candidates.map((c) => [c, resolveIncludeGraph(c, readFile)] as const)
  );

  const includedElsewhere = new Set<string>();
  candidates.forEach((c) => {
    graphs.get(c)?.files.forEach((f) => {
      if (f !== c) includedElsewhere.add(f);
    });
  });

  return candidates
    .filter((c) => !includedElsewhere.has(c))
    .map((entryFile) => {
      const graph = graphs.get(entryFile);
      return {
        entryFile,
        files: graph ? graph.files : [entryFile],
        sources: graph ? readExternalNames(graph.order, io) : [],
      };
    });
}

// The entry programs whose include graph contains `file` — 0 (an orphan
// file), 1 (the common case), or >1 (a shared include).
export function programsForFile(
  programs: EntryProgram[],
  file: string
): EntryProgram[] {
  return programs.filter((prog) => prog.files.includes(file));
}
