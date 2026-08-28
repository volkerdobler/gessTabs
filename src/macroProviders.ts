// vscode-facing macro tooling (F3 of the editor-support roadmap): shows
// what a #name(...) call actually expands to, provides signature help
// while typing a call, and a usage-count CodeLens on #MACRO declarations.
// All the actual parsing/substitution logic lives in src/macroExpansion.ts
// (pure, unit-tested); this file is just the thin vscode wiring, same
// split as extension.ts's own providers.

import * as vscode from 'vscode';
import { Scope } from './scope';
import { buildWorkspaceIndex, WorkspaceIndex } from './symbolIndex';
import {
  findMacroDefinitions,
  findMacroCalls,
  buildMacroIndex,
  expandMacro,
  expandLines,
  findExpandDefinitions,
  findHashNameAt,
  isReservedDirectiveKeyword,
  MacroDefinition,
} from './macroExpansion';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from './workspaceFiles';
import { FileReader } from './includeGraph';

async function buildMacroContext(document: vscode.TextDocument) {
  const fileNames = await findWorkspaceFiles(document);
  const reader = makeWorkspaceReader(document);
  // `conditionalsAllActive`: a #MACRO / #EXPAND may be defined inside an
  // #ifdef/#ifndef branch the current build doesn't compile — the hover,
  // signature help and go-to-definition are still wanted there. #ifdef
  // gating only decides what *runs*, not what a definition *is*.
  const index = buildWorkspaceIndex(fileNames, reader, {
    conditionalsAllActive: true,
  });
  const defs = findMacroDefinitions(index.order);
  return {
    index,
    defs,
    macroIndex: buildMacroIndex(defs),
    expandDefs: findExpandDefinitions(index.order),
    reader,
  };
}

// "short" (the default) shows the macro's already-filtered `body` — blank
// lines and comment-only lines never made it in, because resolveIncludeGraph
// dropped them while building the resolved workspace order that
// findMacroDefinitions parsed. "normal" instead re-reads the macro's own
// line range straight from its source file (its own live editor buffer if
// it's the current document, last-saved disk content otherwise, exactly
// like the rest of this module's file access), preserving blank lines and
// comments as they actually appear in the source. A macro body containing
// its own nested #ifdef/#end block is a known, accepted edge case here —
// the raw slice can't distinguish an active branch from an inactive one
// the way resolveIncludeGraph's filtered order does.
function macroPreviewBody(
  macro: MacroDefinition,
  reader: FileReader
): string[] {
  const lines = reader(macro.file);
  if (!lines) return macro.body;
  return lines.slice(macro.defLine + 1, macro.endLine);
}

function macroExpansionStyleIsNormal(): boolean {
  return (
    vscode.workspace
      .getConfiguration('gesstabs')
      .get<string>('hover.macroExpansionStyle', 'short') === 'normal'
  );
}

function callAtPosition(lineText: string, character: number) {
  return findMacroCalls(lineText).find(
    (c) => character >= c.index && character <= c.index + c.raw.length
  );
}

// A call resolved to no known macro is the confusing case in practice —
// the macro name looks right, but it silently isn't in the index. The
// macro index is built with conditionalsAllActive, so an inactive
// #ifdef/#ifndef branch is NOT a cause here; what's left is: (a) the
// definition's file is never actually INCLUDE'd from any root, (b) the
// definition sits inside a `{ ... }` block comment, (c) an earlier
// unclosed #MACRO in the same file swallowed it, or (d) the `#macro
// #name( ... )` line itself doesn't parse (multi-line parameter list, or
// a `)` inside the parameters).
function diagnoseMissingMacro(
  document: vscode.TextDocument,
  macroName: string,
  index: WorkspaceIndex
): string {
  const known = Array.from(
    new Set(
      index.order
        .map((rl) => rl.text.match(/#macro\s+#(\S+)/i)?.[1])
        .filter((n): n is string => !!n)
    )
  ).join(', ');
  const currentFile = normalizePath(document.uri.fsPath);
  const linesFromCurrentFile = index.order.filter(
    (rl) => rl.file === currentFile
  ).length;
  const defPattern = new RegExp(`#macro\\s+#${macroName}\\b`, 'i');
  const rawTextHasDef = defPattern.test(document.getText());
  const resolvedHasDef = index.order.some((rl) => defPattern.test(rl.text));

  const lines: string[] = [
    `gesstabs: no #MACRO named "${macroName}" is defined in the resolved workspace.`,
    `  Root files: ${index.rootFiles.join(', ') || '(none)'}`,
    `  Lines from this document present in the resolved index: ${linesFromCurrentFile} of ${document.lineCount} total.`,
    `  Raw document text contains a "#macro #${macroName}(" line: ${rawTextHasDef}.`,
    `  That line also appears in the resolved index (INCLUDE- and comment-filtered; #ifdef branches are kept): ${resolvedHasDef}.`,
  ];

  if (!rawTextHasDef) {
    lines.push(
      '  -> The definition text itself was not found verbatim in this document — check for a typo, extra whitespace variant, or that it truly lives in this file.'
    );
  } else if (!resolvedHasDef) {
    // Pin down the filtered-out span: the raw def line, and the nearest
    // resolved lines of this file on either side of it. A gap that starts
    // several lines before the definition means a `{ ... }` block comment
    // is covering it; a gap that starts *at* the definition points at the
    // definition's own first line.
    const rawLines = document.getText().split(/\r?\n/);
    const rawDefLine = rawLines.findIndex((l) => defPattern.test(l));
    const sameFile = index.order
      .filter((rl) => rl.file === currentFile)
      .sort((a, b) => a.line - b.line);
    const before = [...sameFile].reverse().find((rl) => rl.line < rawDefLine);
    const after = sameFile.find((rl) => rl.line > rawDefLine);
    const snip = (rl?: { line: number; text: string }): string =>
      rl ? `line ${rl.line + 1} "${rl.text.trim().slice(0, 60)}"` : '(none)';
    lines.push(
      `  Raw "#macro #${macroName}" is at line ${rawDefLine + 1}.`,
      `  Nearest resolved line of this file before it: ${snip(before)}`,
      `  Nearest resolved line of this file after it:  ${snip(after)}`
    );
    if (before && after && after.line - before.line > 2) {
      lines.push(
        `  -> Lines ${before.line + 2}-${
          after.line
        } of this file are all filtered out — a "{ ... }" block comment covers the definition. Check for an unclosed (or extra) "{" just before line ${
          before.line + 2
        }.`
      );
    } else {
      lines.push(
        '  -> Only the definition itself is filtered — a "{" block comment on/just above the line, or an earlier unclosed #MACRO in this file has swallowed it.'
      );
    }
  } else {
    lines.push(
      '  -> The line is present in the resolved index but findMacroDefinitions still did not parse it as a macro start — likely an earlier unclosed #MACRO block in the same file, or its `( ... )` parameter list is split across lines / contains a `)`.'
    );
  }

  lines.push(`  Other macros found: ${known || '(none)'}`);
  return lines.join('\n');
}

// Master on/off switch plus independent per-kind toggles, mirroring how
// printDebugMessage already reads gesstabs.debugMode.
function hoverSettingEnabled(kind: 'macros' | 'expands'): boolean {
  const config = vscode.workspace.getConfiguration('gesstabs');
  if (config.get<boolean>('hover.enabled', true) === false) return false;
  return config.get<boolean>(`hover.${kind}`, true) !== false;
}

// "Show expanded macro": hovering a #name(...) call site shows this one
// macro's body with the call's arguments substituted into its &params.
// Nested #other(...) calls in the body are left as literal calls (hover
// those to see them) — unlike the compiler's MACROPROTOCOL, which fully
// flattens; a preview doesn't need to, and flattening a nested call whose
// body is empty (e.g. #ifdef-gated off) would just make it vanish.
export class GesstabsMacroHoverProvider implements vscode.HoverProvider {
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    try {
      const config = vscode.workspace.getConfiguration('gesstabs');
      if (config.get<boolean>('hover.enabled', true) === false) return null;

      // Something that merely *looks* like a macro call or #expand
      // reference inside a comment/string isn't one — check the scope at
      // the cursor position itself before treating the text as real code.
      const scope = new Scope(document);
      if (!scope.isNotInComment(position.line, position.character)) {
        printDebugMessage(
          `gesstabs: hover - ${position.line}:${position.character} is inside a comment, skipping`
        );
        return null;
      }

      const lineText = document.lineAt(position.line).text;
      const call = callAtPosition(lineText, position.character);

      // A directive keyword (#DEFINE, #MACRO, #ENDMACRO, ...) syntactically
      // looks exactly like a macro call or #EXPAND reference, but is
      // neither — it's the preprocessor's own vocabulary.
      if (call && isReservedDirectiveKeyword(call.name)) {
        printDebugMessage(
          `gesstabs: hover - "#${call.name}" is a gessTabs directive keyword, not a macro call, skipping`
        );
        return null;
      }

      // Not a column-1 macro call — the cursor might still be on a bare
      // "#name" #EXPAND reference (gessTabs treats every "#name" that
      // isn't a column-1 macro call as an #EXPAND reference).
      if (!call) {
        if (!hoverSettingEnabled('expands')) return null;

        const hashName = findHashNameAt(lineText, position.character);
        if (!hashName || isReservedDirectiveKeyword(hashName)) {
          printDebugMessage(
            `gesstabs: hover - no "#name(...)" call or "#name" reference found at ${position.line}:${position.character} on line "${lineText}"`
          );
          return null;
        }

        const { expandDefs } = await buildMacroContext(document);
        if (token && token.isCancellationRequested) return null;

        const value = expandDefs.get(hashName);
        if (value === undefined) {
          printDebugMessage(
            `gesstabs: hover - "#${hashName}" is not a column-1 macro call, and no "#expand #${hashName} ..." definition was found (names are case-sensitive). Known #expand names: ${
              Array.from(expandDefs.keys()).join(', ') || '(none)'
            }`
          );
          return null;
        }

        const md = new vscode.MarkdownString();
        md.appendMarkdown(`**EXPAND** \`#${hashName}\`\n`);
        md.appendCodeblock(value, 'gesstabs');
        return new vscode.Hover(md);
      }

      if (!hoverSettingEnabled('macros')) return null;

      const { index, macroIndex, reader } = await buildMacroContext(document);
      if (token && token.isCancellationRequested) return null;

      const target = macroIndex.get(call.name.toLowerCase());
      if (!target) {
        printDebugMessage(diagnoseMissingMacro(document, call.name, index));
        return null;
      }

      const expanded = macroExpansionStyleIsNormal()
        ? expandLines(
            macroPreviewBody(target, reader),
            target.params,
            call.args
          )
        : expandMacro(target, call.args);
      const range = new vscode.Range(
        new vscode.Position(position.line, call.index),
        new vscode.Position(position.line, call.index + call.raw.length)
      );
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`**MACRO** \`${call.raw}\`\n`);
      md.appendCodeblock(expanded.join('\n'), 'gesstabs');
      return new vscode.Hover(md, range);
    } catch (e) {
      printDebugMessage(`gesstabs: hover failed: ${e}`);
      return null;
    }
  }
}

// Signature help while typing "#macroname(" — shows the declared
// parameter list from the matching #MACRO definition.
export class GesstabsMacroSignatureHelpProvider
  implements vscode.SignatureHelpProvider
{
  public async provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.SignatureHelp | null> {
    try {
      const textBeforeCursor = document
        .lineAt(position.line)
        .text.slice(0, position.character);
      const match = textBeforeCursor.match(/#([A-Za-z_]\w*)\s*\(([^)]*)$/);
      if (!match) return null;

      const scope = new Scope(document);
      if (!scope.isNotInComment(position.line, position.character)) {
        printDebugMessage(
          `gesstabs: signature help - ${position.line}:${position.character} is inside a comment, skipping`
        );
        return null;
      }

      const { index, macroIndex } = await buildMacroContext(document);
      if (token && token.isCancellationRequested) return null;

      const target = macroIndex.get(match[1].toLowerCase());
      if (!target) {
        printDebugMessage(diagnoseMissingMacro(document, match[1], index));
        return null;
      }

      const signature = new vscode.SignatureInformation(
        `#${target.name}(${target.params.map((p) => `&${p}`).join(' ')})`
      );
      signature.parameters = target.params.map(
        (p) => new vscode.ParameterInformation(`&${p}`)
      );

      const help = new vscode.SignatureHelp();
      help.signatures = [signature];
      help.activeSignature = 0;

      const typedArgs = match[2].trim();
      const typedCount =
        typedArgs.length > 0 ? typedArgs.split(/\s+/).length : 0;
      help.activeParameter = Math.min(
        typedCount,
        Math.max(target.params.length - 1, 0)
      );
      return help;
    } catch (e) {
      printDebugMessage(`gesstabs: signature help failed: ${e}`);
      return null;
    }
  }
}

// CodeLens on each #MACRO declaration showing how many call sites it has
// across the resolved workspace (built on F0's include graph, so counts
// reflect files actually INCLUDE'd, not just any .tab/.inc on disk).
// Includes call sites in currently-inactive #ifdef/#ifndef branches —
// buildMacroContext resolves with conditionalsAllActive (a macro used
// only in a branch this build skips is still a usage worth showing).
export class GesstabsMacroCodeLensProvider implements vscode.CodeLensProvider {
  public async provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.CodeLens[]> {
    let context: Awaited<ReturnType<typeof buildMacroContext>>;
    try {
      context = await buildMacroContext(document);
    } catch (e) {
      printDebugMessage(`gesstabs: macro CodeLens failed: ${e}`);
      return [];
    }
    if (token && token.isCancellationRequested) return [];

    const currentFile = normalizePath(document.uri.fsPath);
    const ownDefs = context.defs.filter((d) => d.file === currentFile);
    if (ownDefs.length === 0) return [];

    return ownDefs.map((def) => {
      const count = context.index.order.reduce((total, rl) => {
        const calls = findMacroCalls(rl.text).filter(
          (c) => c.name.toLowerCase() === def.name.toLowerCase()
        );
        return total + calls.length;
      }, 0);
      const range = new vscode.Range(
        new vscode.Position(def.defLine, 0),
        new vscode.Position(def.defLine, 0)
      );
      return new vscode.CodeLens(range, {
        title: count === 1 ? '1 usage' : `${count} usages`,
        command: '',
      });
    });
  }
}
