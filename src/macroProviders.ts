// vscode-facing macro tooling (F3 of the editor-support roadmap): shows
// what a #name(...) call actually expands to, provides signature help
// while typing a call, and a usage-count CodeLens on #MACRO declarations.
// All the actual parsing/substitution logic lives in src/macroExpansion.ts
// (pure, unit-tested); this file is just the thin vscode wiring, same
// split as extension.ts's own providers.

import * as vscode from 'vscode';
import { buildWorkspaceIndex, WorkspaceIndex } from './symbolIndex';
import {
  findMacroDefinitions,
  findMacroCalls,
  buildMacroIndex,
  expandMacro,
  findExpandDefinitions,
  findHashNameAt,
  MacroDefinition,
} from './macroExpansion';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
  printDebugMessage,
} from './workspaceFiles';

async function buildMacroContext(document: vscode.TextDocument) {
  const fileNames = await findWorkspaceFiles(document);
  const index = buildWorkspaceIndex(fileNames, makeWorkspaceReader(document));
  const defs = findMacroDefinitions(index.order);
  return {
    index,
    defs,
    macroIndex: buildMacroIndex(defs),
    expandDefs: findExpandDefinitions(index.order),
  };
}

function callAtPosition(lineText: string, character: number) {
  return findMacroCalls(lineText).find(
    (c) => character >= c.index && character <= c.index + c.raw.length
  );
}

// A call resolved to no known macro is the confusing case in practice —
// the macro name looks right, but it silently isn't in the resolved
// index. Distinguish the two very different ways that happens: (a) the
// definition's own file/branch never made it into the resolved workspace
// order at all (an INCLUDE-graph/`#ifdef` reachability problem), vs (b)
// the file IS present but the definition line itself wasn't recognized as
// one — most likely an earlier, unclosed #MACRO/#IFDEF block in the same
// file swallowing everything after it as "still inside" that block.
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

  let diagnosis: string;
  if (!rawTextHasDef) {
    diagnosis =
      '  -> The definition text itself was not found verbatim in this document — check for a typo, extra whitespace variant, or that it truly lives in this file.';
  } else if (!resolvedHasDef) {
    diagnosis =
      '  -> The definition exists in the file but was filtered out while resolving INCLUDEs/#ifdef branches, or an earlier unclosed #MACRO/#IFDEF/#IFNDEF block in the same file is swallowing everything after it.';
  } else {
    diagnosis =
      '  -> The line is present in the resolved index but findMacroDefinitions still did not parse it as a macro start — likely an earlier unclosed #MACRO block in the same file.';
  }

  return [
    `gesstabs: no #MACRO named "${macroName}" is defined in the resolved workspace.`,
    `  Root files: ${index.rootFiles.join(', ') || '(none)'}`,
    `  Lines from this document present in the resolved index: ${linesFromCurrentFile} of ${document.lineCount} total.`,
    `  Raw document text contains a "#macro #${macroName}(" line: ${rawTextHasDef}.`,
    `  That line also appears in the *resolved* (INCLUDE/#ifdef-filtered) index: ${resolvedHasDef}.`,
    diagnosis,
    `  Other macros found: ${known || '(none)'}`,
  ].join('\n');
}

// "Show expanded macro": hovering a #name(...) call site shows the
// textually-substituted body, matching what the compiler's own
// MACROPROTOCOL debug feature would dump.
export class GesstabsMacroHoverProvider implements vscode.HoverProvider {
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    try {
      const lineText = document.lineAt(position.line).text;
      const call = callAtPosition(lineText, position.character);

      // Not a column-1 macro call — the cursor might still be on a bare
      // "#name" #EXPAND reference (gessTabs treats every "#name" that
      // isn't a column-1 macro call as an #EXPAND reference).
      if (!call) {
        const hashName = findHashNameAt(lineText, position.character);
        if (!hashName) {
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
        md.appendMarkdown(`\`#${hashName}\` expands to:\n`);
        md.appendCodeblock(value, 'gesstabs');
        return new vscode.Hover(md);
      }

      const { index, macroIndex } = await buildMacroContext(document);
      if (token && token.isCancellationRequested) return null;

      const target = macroIndex.get(call.name.toLowerCase());
      if (!target) {
        printDebugMessage(diagnoseMissingMacro(document, call.name, index));
        return null;
      }

      const expanded = expandMacro(target, call.args, macroIndex);
      const range = new vscode.Range(
        new vscode.Position(position.line, call.index),
        new vscode.Position(position.line, call.index + call.raw.length)
      );
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`Expanded \`${call.raw}\`:\n`);
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
