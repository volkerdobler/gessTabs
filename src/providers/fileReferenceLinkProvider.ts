// DocumentLink provider for the filename references that
// GesstabsDataSourceLinkProvider (src/providers/externalNamesProvider.ts)
// doesn't cover — that one only handles CSVINFILE/SPSSINFILE/DATAFILE/
// INFILE. This file adds the rest of the TODO's P3 list:
//   - INCLUDE = <file>;
//   - VALUELABELS <VarList> = LABELFROMFILE <file>;
//   - #DOMACRO3( <macroname> <file> ) / #DOMACRO4( <file> )
//   - SYNTAX { ... } = <file>;
//   - OPENQFILE [FILEKEY <k>] = <file>; — "the same syntax as the DATAFILE
//     statement" (manual), but not a raw-name-yielding source itself
//     (§11's scope), so it belongs here rather than in the data-source
//     provider.
//
// Same simplification as GesstabsDataSourceLinkProvider: works over this
// document's own raw lines only (a link target is always relative to the
// file that contains the statement, so there's no need to resolve the
// wider INCLUDE graph the way go-to-definition/find-references do), and
// skips a path containing a dynamic token (#EXPAND / &macro-param&) since
// that can't be resolved without running the preprocessor. An OS-wildcard
// path (OPENQFILE's own "*cmpl_base.opn", manual: "Anhang > ... >
// Daten-Input") IS statically resolvable, though — against the real
// directory contents, same as GesstabsDataSourceLinkProvider does for a
// wildcard DATAFILE/CSVINFILE/INFILE.

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getCachedScope } from '../core/scope';
import { ResolvedLine, cleanedDocumentOrder } from '../core/includeGraph';
import {
  toLogicalStatements,
  locateInStatement,
  LogicalStatement,
} from '../core/statements';
import { resolveWildcardPath } from '../util/glob';
import { printDebugMessage } from '../util/workspaceFiles';

const WILDCARD_TOKEN = /[*?]/;

function listDirEntries(dirAbsPath: string): string[] {
  try {
    return fs.readdirSync(dirAbsPath);
  } catch {
    return [];
  }
}

// cleanedDocumentOrder (not a bare per-line dump): toLogicalStatements
// needs comments already blanked and bare directive lines (#ifdef/#else/
// #end/...) already dropped, exactly as resolveIncludeGraph's own `order`
// is — see that function's doc comment in core/includeGraph.ts for the
// concrete breakage a raw per-line dump caused (an INCLUDE right after
// #else/#end, or after any line ending in a trailing comment, silently
// stopped getting a link).
function documentOrder(document: vscode.TextDocument): ResolvedLine[] {
  const file = document.uri.fsPath;
  const lines: string[] = [];
  for (let i = 0; i < document.lineCount; i += 1) {
    lines.push(document.lineAt(i).text);
  }
  return cleanedDocumentOrder(file, lines);
}

// INCLUDE = <path>; — same shape as includeGraph.ts's own includeRe, kept
// independent since that one is internal to graph resolution. The path
// group is greedy (not lazy): for an unquoted path (`\1` then backreferences
// to an empty string, matching immediately) a lazy `+?` would capture
// nothing at all — greedy instead consumes right up to the excluded `"';`
// characters, same fix as externalNames.ts's own statementRe. A greedy
// match can pick up trailing whitespace before `;` when unquoted (`INCLUDE
// = x.inc ;`); findLinkTarget trims it back off.
const includeStatementRe = /^\s*include\s*=\s*(["']?)([^"';]+)\1\s*;/i;

// VALUELABELS <VarList> = LABELFROMFILE <path>; ([VALUE]LABELS is a
// documented synonym for VALUELABELS — manual: "Texte" / "Label-
// Eigenschaften"). `\b` after "labels" keeps this from matching unrelated
// keywords that merely start with "labels" (there are none today, but
// matches the style used for the SYNTAX regex below).
const valuelabelsFromFileRe =
  /^\s*(?:value)?labels\b[^;]*?=\s*labelfromfile\s+(["']?)([^"';]+)\1\s*;?/i;

// SYNTAX { [POSTPONE] [VARIABLES|LABELS|VARTITLE|VALUELABELS|MISSING|
// EXCLUDEVALUES|RESTRICTVALUES|MULTIDEF|FORMAT] }*n = <path>; — `\bsyntax\b`
// (not just a prefix match) so this never matches the unrelated
// SYNTAXVARNAMENOQUOTES keyword.
const syntaxStatementRe = /^\s*syntax\b[^=;]*=\s*(["']?)([^"';]+)\1\s*;?/i;

// OPENQFILE [FILEKEY <k>] = <path>; — "the same syntax as the DATAFILE
// statement" (manual's own OPENQFILE entry), so `[^=]*` tolerates an
// optional leading `FILEKEY <k>` clause the same way the SYNTAX pattern
// above tolerates its own leading option list.
const openqfileStatementRe = /^\s*openqfile\b[^=]*=\s*(["']?)([^"';]+)\1\s*;?/i;

// #DOMACRO3( <macroname> <path> ) / #DOMACRO4( <path> ) — the macro-engine
// looping constructs that read their parameters from a CSV file (manual:
// "Makros" howto). Matched as a whole logical statement (self-terminating
// at its own balanced ")", same as any other column-1 macro/preprocessor
// call — see statements.ts's macroCallStartRe).
const domacro3Re = /^\s*#domacro3\s*\(\s*(\S+)\s+([\s\S]+?)\s*\)\s*$/i;
const domacro4Re = /^\s*#domacro4\s*\(\s*([\s\S]+?)\s*\)\s*$/i;

// Splits a #DOMACRO3/#DOMACRO4 argument list on whitespace, honouring a
// "quoted token" (a path containing spaces) — same grouping convention as
// macroExpansion.ts's parseTokenList, kept independent since only the last
// (or only) token — the filename — is ever needed here.
function lastToken(raw: string): string | undefined {
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let last: string | undefined;
  let m = re.exec(raw);
  while (m !== null) {
    last = m[1] ?? m[2] ?? m[3];
    m = re.exec(raw);
  }
  return last;
}

interface LinkTarget {
  rawPath: string;
  // Offset of `rawPath` within stmt.text — resolved back to a document
  // line/char via locateInStatement.
  offset: number;
  tooltip: string;
}

// Builds a LinkTarget from a match whose group[2] is the (possibly
// greedily-over-matched, see includeStatementRe) raw path: the offset comes
// from the untrimmed capture (its start is unaffected by trimming, since
// the leading `\s*` already sits outside the group), but `rawPath` itself
// is trimmed so the link range and the resolved path don't include a
// greedy match's trailing whitespace.
function target(
  stmt: LogicalStatement,
  m: RegExpMatchArray,
  tooltip: string
): LinkTarget {
  const raw = m[2];
  return {
    rawPath: raw.trim(),
    offset: stmt.text.indexOf(raw, m.index ?? 0),
    tooltip,
  };
}

function findLinkTarget(stmt: LogicalStatement): LinkTarget | undefined {
  let m = stmt.text.match(includeStatementRe);
  if (m) return target(stmt, m, 'INCLUDE-Datei öffnen');

  m = stmt.text.match(valuelabelsFromFileRe);
  if (m) return target(stmt, m, 'LABELFROMFILE-Datei öffnen');

  m = stmt.text.match(syntaxStatementRe);
  if (m) return target(stmt, m, 'SYNTAX-Datei öffnen');

  m = stmt.text.match(openqfileStatementRe);
  if (m) return target(stmt, m, 'OPENQFILE-Datei öffnen');

  m = stmt.text.match(domacro3Re);
  if (m) {
    const file = lastToken(m[2]);
    if (file) {
      return {
        rawPath: file,
        offset: stmt.text.lastIndexOf(file),
        tooltip: '#DOMACRO3-CSV-Datei öffnen',
      };
    }
  }

  m = stmt.text.match(domacro4Re);
  if (m) {
    const file = lastToken(m[1]);
    if (file) {
      return {
        rawPath: file,
        offset: stmt.text.lastIndexOf(file),
        tooltip: '#DOMACRO4-CSV-Datei öffnen',
      };
    }
  }

  return undefined;
}

export class GesstabsFileReferenceLinkProvider
  implements vscode.DocumentLinkProvider
{
  public provideDocumentLinks(
    document: vscode.TextDocument
  ): vscode.DocumentLink[] {
    try {
      const scope = getCachedScope(document);
      const links: vscode.DocumentLink[] = [];

      toLogicalStatements(documentOrder(document)).forEach((stmt) => {
        const linkTarget = findLinkTarget(stmt);
        if (!linkTarget) return;
        if (/[#&]/.test(linkTarget.rawPath)) return; // not statically resolvable

        const { line, character } = locateInStatement(stmt, linkTarget.offset);
        if (!scope.isNotInComment(line.line, character)) return;

        // An OS-wildcard path (OPENQFILE's "*cmpl_base.opn") has no single
        // literal file to link to — resolve it against the real directory
        // contents instead, same match/sort convention
        // GesstabsDataSourceLinkProvider uses for a wildcard DATAFILE. No
        // match on disk: no link, same as any other unresolvable path.
        const dir = path.dirname(document.uri.fsPath);
        const resolved = WILDCARD_TOKEN.test(linkTarget.rawPath)
          ? resolveWildcardPath(dir, linkTarget.rawPath, listDirEntries)
          : path.resolve(dir, linkTarget.rawPath);
        if (!resolved) return;
        const link = new vscode.DocumentLink(
          new vscode.Range(
            line.line,
            character,
            line.line,
            character + linkTarget.rawPath.length
          ),
          vscode.Uri.file(resolved)
        );
        link.tooltip = linkTarget.tooltip;
        links.push(link);
      });

      return links;
    } catch (e) {
      printDebugMessage(`gesstabs: file-reference links failed: ${e}`);
      return [];
    }
  }
}
