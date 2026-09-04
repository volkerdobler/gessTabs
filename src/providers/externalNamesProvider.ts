// vscode wiring for the "raw variables from the data input file" feature
// (docs/variable-model-design.md §11), built on a shared, watcher-backed
// cache of the workspace's entry programs:
//
//   - GesstabsExternalNamesManager   — the cache, the "missing / unreadable
//                                       data source" diagnostic, and
//                                       externalSourcesFor(doc, word) for the
//                                       variable hover ("aus data.csv")
//   - GesstabsDataSourceLinkProvider  — click the <filepath> in a
//                                       CSVINFILE/SPSSINFILE/DATAFILE line
//   - renderExternalSourceLines()     — the markdown the variable hover
//                                       (src/providers/variableHoverProvider.ts)
//                                       appends when a name is a dataset variable
//
// The core logic is pure (src/core/entryScripts.ts + externalNames.ts); this
// file only supplies the filesystem I/O, the FileSystemWatcher and the
// vscode object mapping.

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileReader, ResolvedLine } from '../core/includeGraph';
import { Scope } from '../core/scope';
import {
  ExternalNamesIO,
  ExternalNameSource,
  findDataSourceStatements,
} from '../core/externalNames';
import {
  EntryProgram,
  buildEntryPrograms,
  programsForFile,
  DEFAULT_ENTRY_SCRIPT_PATTERNS,
} from '../core/entryScripts';
import { buildWorkspaceIndex } from '../core/symbolIndex';
import { buildVariableModel } from '../core/variableModel';
import {
  checkUndefinedVariables,
  checkSystemVariableRedeclaration,
} from '../core/modelDiagnostics';
import { getAllFilenamesInDirectory } from '../util/fsutils';
import {
  getWorkspaceFolderPath,
  normalizePath,
  findWorkspaceFiles,
  printDebugMessage,
} from '../util/workspaceFiles';

// Enough to cover any CSV header line and virtually every .sav dictionary
// (the dictionary sits at the front of the file).
const MAX_DATA_BYTES = 4 * 1024 * 1024;

function liveFileReader(): FileReader {
  return (filePath: string): string[] | undefined => {
    const norm = normalizePath(filePath);
    const open = vscode.workspace.textDocuments.find(
      (d) => normalizePath(d.uri.fsPath) === norm
    );
    if (open) return open.getText().split(/\r\n|\r|\n/);
    try {
      return fs.readFileSync(filePath, 'utf8').split(/\r\n|\r|\n/);
    } catch {
      return undefined;
    }
  };
}

// Reads up to MAX_DATA_BYTES from a data file, cached by path + mtime + size
// so the on-typing diagnostic pass never re-hits the disk for an unchanged
// file. The cache is cleared wholesale on any FileSystemWatcher event.
class CachingBytesIO implements ExternalNamesIO {
  private cache = new Map<string, { key: string; bytes?: Uint8Array }>();

  public clear(): void {
    this.cache.clear();
  }

  public readBytes(absPath: string): Uint8Array | undefined {
    let stat: fs.Stats;
    try {
      stat = fs.statSync(absPath);
    } catch {
      this.cache.delete(absPath);
      return undefined;
    }
    const key = `${stat.mtimeMs}:${stat.size}`;
    const hit = this.cache.get(absPath);
    if (hit && hit.key === key) return hit.bytes;

    let fd: number | undefined;
    let bytes: Uint8Array | undefined;
    try {
      fd = fs.openSync(absPath, 'r');
      const len = Math.min(stat.size, MAX_DATA_BYTES);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, 0);
      bytes = buf;
    } catch {
      bytes = undefined;
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch {
          /* nothing to do */
        }
      }
    }
    this.cache.set(absPath, { key, bytes });
    return bytes;
  }
}

function documentOrder(document: vscode.TextDocument): ResolvedLine[] {
  const file = normalizePath(document.uri.fsPath);
  const out: ResolvedLine[] = [];
  for (let i = 0; i < document.lineCount; i += 1) {
    out.push({ file, line: i, text: document.lineAt(i).text });
  }
  return out;
}

export class GesstabsExternalNamesManager {
  private readonly collection = vscode.languages.createDiagnosticCollection(
    'gesstabs-datasource'
  );

  private watcher: vscode.FileSystemWatcher | undefined;

  private programs: EntryProgram[] | undefined;

  private scanRoot: string | undefined;

  private onChangeCb: (() => void) | undefined;

  private readonly bytesIO = new CachingBytesIO();

  public setOnChange(cb: () => void): void {
    this.onChangeCb = cb;
  }

  public dispose(): void {
    this.collection.dispose();
    this.watcher?.dispose();
  }

  public invalidate(): void {
    this.programs = undefined;
    this.bytesIO.clear();
  }

  private static patterns(): string[] {
    const raw = vscode.workspace
      .getConfiguration('gesstabs')
      .get<string[]>(
        'dataInput.entryScriptPatterns',
        DEFAULT_ENTRY_SCRIPT_PATTERNS
      );
    return Array.isArray(raw) && raw.every((s) => typeof s === 'string')
      ? raw
      : DEFAULT_ENTRY_SCRIPT_PATTERNS;
  }

  public async getPrograms(hint?: vscode.Uri): Promise<EntryProgram[]> {
    const folder =
      getWorkspaceFolderPath(hint) ??
      (hint ? path.dirname(hint.fsPath) : undefined);
    if (!folder) return [];
    this.ensureWatcher(folder);
    if (this.programs && this.scanRoot === folder) return this.programs;

    this.scanRoot = folder;
    const tabs = (await getAllFilenamesInDirectory(folder, 'tab')).map(
      normalizePath
    );
    this.programs = buildEntryPrograms(
      tabs,
      GesstabsExternalNamesManager.patterns(),
      liveFileReader(),
      this.bytesIO
    );
    return this.programs;
  }

  private ensureWatcher(folder: string): void {
    if (this.watcher && this.scanRoot === folder) return;
    this.watcher?.dispose();
    this.watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, '**/*.{tab,inc,def,csv,sav,dat,txt}')
    );
    const bust = (): void => {
      this.invalidate();
      this.onChangeCb?.();
    };
    this.watcher.onDidCreate(bust);
    this.watcher.onDidChange(bust);
    this.watcher.onDidDelete(bust);
  }

  // The resolved sources visible from `document` — every source of every
  // entry program whose graph contains this file (union; a shared include
  // can belong to more than one program).
  public async sourcesFor(
    document: vscode.TextDocument
  ): Promise<ExternalNameSource[]> {
    const programs = await this.getPrograms(document.uri);
    const owning = programsForFile(
      programs,
      normalizePath(document.uri.fsPath)
    );
    const seen = new Set<string>();
    const out: ExternalNameSource[] = [];
    owning.forEach((prog) => {
      prog.sources.forEach((src) => {
        const key = `${src.statement.file}:${src.statement.line}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(src);
        }
      });
    });
    return out;
  }

  // The resolved data sources (visible from `document`) that contain a
  // variable literally named `word` — used by the variable hover to say
  // "aus data.csv" instead of guessing "probably a dataset variable".
  public async externalSourcesFor(
    document: vscode.TextDocument,
    word: string
  ): Promise<ExternalNameSource[]> {
    const key = word.toLowerCase();
    return (await this.sourcesFor(document)).filter(
      (s) =>
        s.names !== 'unresolved' && s.names.some((n) => n.toLowerCase() === key)
    );
  }

  // "Missing / unreadable data source" diagnostics for one document:
  //   - a data-source statement in THIS file whose file can't be read
  //   - line 0 of an entry script (with INCLUDEs) that declares no source
  public async refresh(document: vscode.TextDocument): Promise<void> {
    if (document.languageId !== 'gesstabs') return;
    try {
      const cfg = vscode.workspace.getConfiguration('gesstabs');
      if (cfg.get<boolean>('diagnostics.enabled', true) === false) {
        this.collection.delete(document.uri);
        return;
      }

      const file = normalizePath(document.uri.fsPath);
      const diagnostics: vscode.Diagnostic[] = [];

      // `sourcesFor` is built on resolveIncludeGraph's #define/#ifdef-gated
      // `order` (buildEntryPrograms -> resolveIncludeGraph, no
      // conditionalsAllActive — exactly the branch a real build would
      // compile), unlike a raw per-line dump of the document. Using that
      // here (instead of re-scanning documentOrder(document) blind to
      // #ifdef state, as this used to) matters concretely: a data-source
      // statement sitting in an #else arm that #define makes inactive
      // (`#define SPSSfile` / `#ifdef SPSSfile` ... `#else` `datafile =
      // "*cmpl_base.dat";` ... `#end`) must never surface a diagnostic —
      // it plays no role in this build at all. Filtered to `file` since
      // this collection is per-document; `sourcesFor` itself unions every
      // owning program's sources (which can span other included files).
      const externalSources = await this.sourcesFor(document);
      externalSources
        .filter(
          (src) => src.statement.file === file && src.names === 'unresolved'
        )
        .forEach((src) => {
          const { text } = document.lineAt(src.statement.line);
          const from = Math.max(0, text.search(/\S/));
          const d = new vscode.Diagnostic(
            new vscode.Range(
              src.statement.line,
              from,
              src.statement.line,
              text.length
            ),
            src.reason ?? 'Datenquelle nicht lesbar.',
            vscode.DiagnosticSeverity.Warning
          );
          d.source = 'gesstabs';
          d.code = 'data-source-unreadable';
          diagnostics.push(d);
        });

      const programs = await this.getPrograms(document.uri);
      programs.forEach((prog) => {
        if (
          prog.entryFile === file &&
          prog.files.length > 1 &&
          prog.sources.length === 0
        ) {
          const { text } = document.lineAt(0);
          const d = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, Math.max(1, text.length)),
            'Keine Datenquelle (SPSSINFILE / CSVINFILE / DATAFILE) im Skript — die aus dem Datensatz stammenden Variablen bleiben unbekannt.',
            vscode.DiagnosticSeverity.Warning
          );
          d.source = 'gesstabs';
          d.code = 'no-data-source';
          diagnostics.push(d);
        }
      });

      // Model-based diagnostics (P1.6) — undefined variable + system-
      // variable redeclaration. Both need the whole-workspace variable
      // model (cross-INCLUDE, external/raw-dataset names, macro-produced
      // names), so they live here rather than in the document-scoped F2
      // pass (GesstabsDiagnosticsManager). Undefined-variable is skipped
      // entirely when this document belongs to no known entry program
      // (an orphan .inc, or one of its owning programs' data sources is
      // unresolved (design §9 "P1.6 (B)") — a project whose .sav/.csv
      // isn't on the editing machine must not get false "undefined"
      // noise. System-variable redeclaration is a pure syntax check,
      // independent of any of that, so it always runs.
      const owningPrograms = programsForFile(programs, file);
      const hasUnresolvedSource = externalSources.some(
        (s) => s.names === 'unresolved'
      );
      try {
        const fileNames = await findWorkspaceFiles(document);
        const wsIndex = buildWorkspaceIndex(fileNames, liveFileReader(), {
          conditionalsAllActive: true,
        });
        const model = buildVariableModel(wsIndex, {
          externalNames: externalSources,
          macroExpansion: true,
        });

        const modelIssues =
          owningPrograms.length > 0 && !hasUnresolvedSource
            ? checkUndefinedVariables(model, file)
            : [];
        modelIssues.push(...checkSystemVariableRedeclaration(model, file));

        modelIssues.forEach((issue) => {
          const d = new vscode.Diagnostic(
            new vscode.Range(
              issue.line,
              issue.startChar,
              issue.line,
              issue.startChar + issue.length
            ),
            issue.message,
            issue.severity === 'error'
              ? vscode.DiagnosticSeverity.Error
              : vscode.DiagnosticSeverity.Warning
          );
          d.source = 'gesstabs';
          d.code = issue.code;
          diagnostics.push(d);
        });
      } catch (e) {
        printDebugMessage(`gesstabs: model diagnostics failed: ${e}`);
      }

      this.collection.set(document.uri, diagnostics);
    } catch (e) {
      printDebugMessage(`gesstabs: data-source diagnostics failed: ${e}`);
    }
  }

  public clear(document: vscode.TextDocument): void {
    this.collection.delete(document.uri);
  }
}

// Makes the <filepath> of a CSVINFILE/SPSSINFILE/DATAFILE statement a
// clickable link (resolved relative to the containing file).
export class GesstabsDataSourceLinkProvider
  implements vscode.DocumentLinkProvider
{
  public provideDocumentLinks(
    document: vscode.TextDocument
  ): vscode.DocumentLink[] {
    try {
      const scope = new Scope(document);
      const links: vscode.DocumentLink[] = [];
      findDataSourceStatements(documentOrder(document)).forEach((st) => {
        const { text } = document.lineAt(st.line);
        const col = text.search(/\S/);
        if (col === -1 || !scope.isNotInComment(st.line, col)) return;
        if (/[#&*?]/.test(st.rawPath)) return;
        const start = text.indexOf(st.rawPath);
        if (start === -1) return;
        const target = vscode.Uri.file(
          path.resolve(path.dirname(document.uri.fsPath), st.rawPath)
        );
        const link = new vscode.DocumentLink(
          new vscode.Range(st.line, start, st.line, start + st.rawPath.length),
          target
        );
        link.tooltip = 'Datenquelle öffnen';
        links.push(link);
      });
      return links;
    } catch (e) {
      printDebugMessage(`gesstabs: data-source links failed: ${e}`);
      return [];
    }
  }
}

// A markdown fragment for the variable hover: "_aus `data.csv` (CSVINFILE,
// Spalte 3) — [main.tab:54](…)_" per data source `word` was found in. The
// jump link opens the input statement. Empty string when `sources` is empty.
export function renderExternalSourceLines(
  word: string,
  sources: ExternalNameSource[]
): string {
  return sources
    .map((src) => {
      const base = src.absPath
        ? path.basename(src.absPath)
        : src.statement.rawPath;
      const kw = src.statement.kind.toUpperCase();
      const idx = src.columnIndex?.[word.toLowerCase()];
      const col = idx === undefined ? '' : `, Spalte ${idx + 1}`;
      const args = encodeURIComponent(
        JSON.stringify([
          vscode.Uri.file(src.statement.file).toString(),
          {
            selection: {
              start: { line: src.statement.line, character: 0 },
              end: { line: src.statement.line, character: 0 },
            },
          },
        ])
      );
      return `\n_aus \`${base}\` (${kw}${col}) — [${path.basename(
        src.statement.file
      )}:${src.statement.line + 1}](command:vscode.open?${args})_\n`;
    })
    .join('');
}
