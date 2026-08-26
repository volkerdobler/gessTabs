// vscode-facing macro tooling (F3 of the editor-support roadmap): shows
// what a #name(...) call actually expands to, provides signature help
// while typing a call, and a usage-count CodeLens on #MACRO declarations.
// All the actual parsing/substitution logic lives in src/macroExpansion.ts
// (pure, unit-tested); this file is just the thin vscode wiring, same
// split as extension.ts's own providers.

import * as vscode from 'vscode';
import { buildWorkspaceIndex } from './symbolIndex';
import {
  findMacroDefinitions,
  findMacroCalls,
  buildMacroIndex,
  expandMacro,
  MacroDefinition,
} from './macroExpansion';
import {
  makeWorkspaceReader,
  findWorkspaceFiles,
  normalizePath,
} from './workspaceFiles';

async function buildMacroContext(document: vscode.TextDocument) {
  const fileNames = await findWorkspaceFiles(document);
  const index = buildWorkspaceIndex(fileNames, makeWorkspaceReader(document));
  const defs = findMacroDefinitions(index.order);
  return { index, defs, macroIndex: buildMacroIndex(defs) };
}

function callAtPosition(lineText: string, character: number) {
  return findMacroCalls(lineText).find(
    (c) => character >= c.index && character <= c.index + c.raw.length
  );
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
    const lineText = document.lineAt(position.line).text;
    const call = callAtPosition(lineText, position.character);
    if (!call) return null;

    let macroIndex: Map<string, MacroDefinition>;
    try {
      ({ macroIndex } = await buildMacroContext(document));
    } catch (e) {
      return null;
    }
    if (token && token.isCancellationRequested) return null;

    const target = macroIndex.get(call.name.toLowerCase());
    if (!target) return null;

    const expanded = expandMacro(target, call.args, macroIndex);
    const range = new vscode.Range(
      new vscode.Position(position.line, call.index),
      new vscode.Position(position.line, call.index + call.raw.length)
    );
    const md = new vscode.MarkdownString();
    md.appendMarkdown(
      `Expanded \`#${target.name}(${call.args.join(' ')})\`:\n`
    );
    md.appendCodeblock(expanded.join('\n'), 'gesstabs');
    return new vscode.Hover(md, range);
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
    const textBeforeCursor = document
      .lineAt(position.line)
      .text.slice(0, position.character);
    const match = textBeforeCursor.match(/#([A-Za-z_]\w*)\s*\(([^)]*)$/);
    if (!match) return null;

    let macroIndex: Map<string, MacroDefinition>;
    try {
      ({ macroIndex } = await buildMacroContext(document));
    } catch (e) {
      return null;
    }
    if (token && token.isCancellationRequested) return null;

    const target = macroIndex.get(match[1].toLowerCase());
    if (!target) return null;

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
    const typedCount = typedArgs.length > 0 ? typedArgs.split(/\s+/).length : 0;
    help.activeParameter = Math.min(
      typedCount,
      Math.max(target.params.length - 1, 0)
    );
    return help;
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
