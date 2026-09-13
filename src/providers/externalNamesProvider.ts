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
import {
  FileReader,
  ResolvedLine,
  cleanedDocumentOrder,
} from '../core/includeGraph';
import { getCachedScope } from '../core/scope';
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
  checkDuplicateDeclarations,
  checkMacroDuplicateVariableDefinition,
} from '../core/modelDiagnostics';
import { getAllFilenamesInDirectory } from '../util/fsutils';
import {
  getWorkspaceFolderPath,
  normalizePath,
  findWorkspaceFiles,
  printDebugMessage,
} from '../util/workspaceFiles';
import { resolveWildcardPath } from '../util/glob';

// listFiles for resolveWildcardPath: a plain synchronous directory read,
// same fallback-to-empty-on-error convention as CachingBytesIO.listFiles
// below (a missing/unreadable directory just means "no wildcard match",
// not a thrown error).
function listDirEntries(dirAbsPath: string): string[] {
  try {
    return fs.readdirSync(dirAbsPath);
  } catch {
    return [];
  }
}

// An OS-wildcard character — `*`/`?`, same convention as
// core/externalNames.ts's own (private) WILDCARD_TOKEN.
const WILDCARD_TOKEN = /[*?]/;

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

  // Lists a directory's entries for an OS-wildcard DATAFILE/INFILE/CSVINFILE
  // path (e.g. "WELLE.*", §11.7 "wildcard-path resolution"). Not cached —
  // directory listings are cheap and only hit once per data-source
  // statement per diagnostics/hover pass.
  public listFiles(dirAbsPath: string): string[] {
    try {
      return fs.readdirSync(dirAbsPath);
    } catch {
      return [];
    }
  }
}

// cleanedDocumentOrder (not a bare per-line dump): findDataSourceStatements
// runs on toLogicalStatements, which needs comments already blanked and
// bare directive lines (#ifdef/#else/#end/...) already dropped, exactly as
// resolveIncludeGraph's own `order` is — see that function's doc comment in
// core/includeGraph.ts for the concrete breakage a raw per-line dump caused
// elsewhere (fileReferenceLinkProvider.ts) for the same underlying reason.
function documentOrder(document: vscode.TextDocument): ResolvedLine[] {
  const file = normalizePath(document.uri.fsPath);
  const lines: string[] = [];
  for (let i = 0; i < document.lineCount; i += 1) {
    lines.push(document.lineAt(i).text);
  }
  return cleanedDocumentOrder(file, lines);
}

export class GesstabsExternalNamesManager {
  private readonly collection = vscode.languages.createDiagnosticCollection(
    'gesstabs-datasource'
  );

  // Keyed by workspace-folder path — a multi-root workspace has one
  // independent EntryProgram[] + FileSystemWatcher per folder, so switching
  // the active editor between two open folders never busts the other
  // folder's cache or thrashes rebuilding it (each folder's programs, once
  // built, stay cached until *that* folder's own watcher fires).
  private readonly watchers = new Map<string, vscode.FileSystemWatcher>();

  private readonly programsByRoot = new Map<string, EntryProgram[]>();

  private readonly buildsByRoot = new Map<string, Promise<EntryProgram[]>>();

  // Bumped on every in-editor edit of a gessTabs document (see
  // noteDocumentsChanged / extension.ts's onDidChangeTextDocument). The
  // FileSystemWatcher only fires on *disk* events, so without this a
  // cached EntryProgram[] — and every statement line number in it — went
  // stale the moment the user edited (but hadn't saved) a .tab/.inc in the
  // graph. Every other provider reads live editor buffers via
  // makeWorkspaceReader; go-to-definition on a raw dataset variable then
  // mixed a fresh in-buffer model with a stale CSVINFILE/SPSSINFILE line,
  // jumping "a few lines off" after any unsaved insertion above it.
  // `getPrograms` rebuilds (from live buffers, liveFileReader) whenever the
  // generation moved since the cached build — lazily, only when actually
  // asked, so a burst of typing costs nothing until something queries.
  private changeGeneration = 0;

  private readonly builtGenByRoot = new Map<string, number>();

  private onChangeCb: (() => void) | undefined;

  private readonly bytesIO = new CachingBytesIO();

  public setOnChange(cb: () => void): void {
    this.onChangeCb = cb;
  }

  // Called (cheaply) for every gessTabs onDidChangeTextDocument — marks
  // every folder's cached programs as needing a rebuild on next query.
  public noteDocumentsChanged(): void {
    this.changeGeneration += 1;
  }

  public dispose(): void {
    this.collection.dispose();
    this.watchers.forEach((w) => w.dispose());
    this.watchers.clear();
  }

  // Invalidates every cached folder — used when a setting that affects
  // every folder alike (gesstabs.dataInput.entryScriptPatterns) changes.
  public invalidate(): void {
    this.programsByRoot.clear();
    this.buildsByRoot.clear();
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
    const cached = this.programsByRoot.get(folder);
    if (cached && this.builtGenByRoot.get(folder) === this.changeGeneration) {
      return cached;
    }

    // Two near-simultaneous callers for the same not-yet-cached folder
    // (e.g. two documents opened together) share one in-flight scan+build
    // rather than each kicking off their own.
    const inFlight = this.buildsByRoot.get(folder);
    if (inFlight) return inFlight;

    // Captured now, stamped onto the result after — an edit *during* the
    // async scan leaves builtGen behind changeGeneration, so the next call
    // rebuilds rather than trusting a build that raced the edit.
    const builtAtGen = this.changeGeneration;
    const build = (async (): Promise<EntryProgram[]> => {
      const tabs = (await getAllFilenamesInDirectory(folder, 'tab')).map(
        normalizePath
      );
      const programs = buildEntryPrograms(
        tabs,
        GesstabsExternalNamesManager.patterns(),
        liveFileReader(),
        this.bytesIO
      );
      this.programsByRoot.set(folder, programs);
      this.builtGenByRoot.set(folder, builtAtGen);
      return programs;
    })();
    this.buildsByRoot.set(folder, build);
    try {
      return await build;
    } finally {
      this.buildsByRoot.delete(folder);
    }
  }

  private ensureWatcher(folder: string): void {
    if (this.watchers.has(folder)) return;
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, '**/*.{tab,inc,def,csv,sav,dat,txt}')
    );
    const bust = (): void => {
      this.programsByRoot.delete(folder);
      this.buildsByRoot.delete(folder);
      this.bytesIO.clear();
      this.onChangeCb?.();
    };
    watcher.onDidCreate(bust);
    watcher.onDidChange(bust);
    watcher.onDidDelete(bust);
    this.watchers.set(folder, watcher);
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

      // Model-based diagnostics (P1.6 + the P2 cross-INCLUDE fix) —
      // undefined variable, system-variable redeclaration, cross-INCLUDE
      // duplicate declaration, and (now) a #MACRO body re-declaring the
      // same fixed-name variable on every call. All four need the
      // whole-workspace variable model / macro-call enumeration
      // (cross-INCLUDE, external/raw-dataset names, macro-produced names),
      // so they live here rather than in the document-scoped F2 pass
      // (GesstabsDiagnosticsManager, which only ever saw one document's own
      // lines — see its own header comment for why duplicate-declaration
      // moved here). Undefined-variable is skipped entirely when this
      // document belongs to no known entry program (an orphan .inc, or one
      // of its owning programs' data sources is unresolved (design §9
      // "P1.6 (B)") — a project whose .sav/.csv isn't on the editing
      // machine must not get false "undefined" noise. The other three are
      // pure syntax checks, independent of any of that, so they always run.
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
        modelIssues.push(...checkDuplicateDeclarations(model, file));
        modelIssues.push(
          ...checkMacroDuplicateVariableDefinition(wsIndex, file)
        );

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
      const scope = getCachedScope(document);
      const links: vscode.DocumentLink[] = [];
      findDataSourceStatements(documentOrder(document)).forEach((st) => {
        // The comment-scope guard always checks the statement's own first
        // line — a proxy for "is this statement commented out at all",
        // cheap and correct for the overwhelmingly common single-line
        // shape. The link itself, though, sits on `pathLine`/`pathChar`
        // when the statement wraps across lines (§11.7 "multi-line input
        // statements") — the physical line/column <filepath> is actually
        // written on, which can differ from the statement's start line.
        const { text: startText } = document.lineAt(st.line);
        const scopeCol = startText.search(/\S/);
        if (scopeCol === -1 || !scope.isNotInComment(st.line, scopeCol)) return;
        if (/[#&]/.test(st.rawPath)) return; // not statically resolvable
        const lineNo = st.pathLine ?? st.line;
        const lineText =
          lineNo === st.line ? startText : document.lineAt(lineNo).text;
        const start = st.pathChar ?? lineText.indexOf(st.rawPath);
        if (start === -1) return;
        // An OS-wildcard path ("*cmpl_base.dat") has no single literal file
        // to link to — resolve it against the real directory contents,
        // same match/sort convention resolveWildcard already uses for
        // raw-name extraction (§11.7). No match on disk: no link, same as
        // any other unresolvable path.
        const dir = path.dirname(document.uri.fsPath);
        const absTarget = WILDCARD_TOKEN.test(st.rawPath)
          ? resolveWildcardPath(dir, st.rawPath, listDirEntries)
          : path.resolve(dir, st.rawPath);
        if (!absTarget) return;
        const target = vscode.Uri.file(absTarget);
        const link = new vscode.DocumentLink(
          new vscode.Range(lineNo, start, lineNo, start + st.rawPath.length),
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
      // Land on the physical line the <filepath> token sits on when the
      // statement wraps across lines (§11.7) — the start line is just the
      // bare `csvinfile` keyword, "a few lines too high".
      const jumpLine = src.statement.pathLine ?? src.statement.line;
      const args = encodeURIComponent(
        JSON.stringify([
          vscode.Uri.file(src.statement.file).toString(),
          jumpLine,
        ])
      );
      return `\n_aus \`${base}\` (${kw}${col}) — [${path.basename(
        src.statement.file
      )}:${jumpLine + 1}](command:gesstabs.revealLine?${args})_\n`;
    })
    .join('');
}
