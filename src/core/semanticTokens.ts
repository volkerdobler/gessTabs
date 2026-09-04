// Semantic highlighting (F5): distinguishes variable/macro/table names
// from the surrounding gessTabs keywords, layered on top of the existing
// TextMate grammar rather than replacing it.
//
// Two independent halves:
//   - macro / #EXPAND tokens (collectMacroTokensForLine) — pure line
//     scanning via src/core/macroExpansion.ts, unrelated to the variable
//     model.
//   - variable / table-name tokens (collectModelSemanticTokens) — the
//     statement classifier (src/core/variableStatements.ts), which
//     replaced the original regex-based pass (docs/HISTORY.md's F5 entry):
//     that version only coloured the *last* name in a multi-name list
//     (`VARIABLES a b c = ...;`, a VARTITLE/VALUELABELS list, a
//     multi-variable TABLE head/axis) because several of regex.ts's
//     factories can't otherwise separate a whole matched varlist into
//     individual names. The classifier hands back every name with a real
//     offset, so that limitation is gone.
//
// Still curated, not "every reference in the program": a COMPUTE/IF
// expression operand is not highlighted, matching the original pass'
// scope (see collectModelSemanticTokens below for the exact set).

import { macroDefRe, expandDefRe } from './regex';
import { findMacroCalls, isReservedDirectiveKeyword } from './macroExpansion';
import { blankComments, ResolvedLine } from './includeGraph';
import { Scope } from './scope';
import {
  toLogicalStatements,
  locateInStatement,
  LogicalStatement,
} from './statements';
import { classifyStatement, NameSpan } from './variableStatements';

export type SemanticTokenType = 'variable' | 'macro';

export interface SemanticToken {
  line: number;
  startChar: number;
  length: number;
  type: SemanticTokenType;
}

export type IsNotInComment = (line: number, char: number) => boolean;

const macroDefRegExp = macroDefRe('');
const expandDefRegExp = expandDefRe('');
const hashNameGlobalRe = /#([A-Za-z_]\w*)/g;

// Adds a 'macro' token for the identifier following a '#' at `hashIndex`
// (the '#' itself is excluded from the highlighted range, matching how
// the TextMate grammar already treats it as punctuation). `coveredStarts`
// dedupes: a macro call's own name would otherwise also be picked up
// again by the generic bare-#name scan below.
function pushHashToken(
  tokens: SemanticToken[],
  coveredStarts: Set<number>,
  lineIndex: number,
  hashIndex: number,
  name: string,
  isNotInComment: IsNotInComment
): void {
  if (coveredStarts.has(hashIndex) || name.length === 0) return;
  coveredStarts.add(hashIndex);
  if (!isNotInComment(lineIndex, hashIndex)) return;
  tokens.push({
    line: lineIndex,
    startChar: hashIndex + 1,
    length: name.length,
    type: 'macro',
  });
}

// The '#name' family — macro definitions/calls and bare #EXPAND
// references — found on one line. Pure line scanning, unrelated to the
// variable model.
function collectMacroTokensForLine(
  lineText: string,
  lineIndex: number,
  isNotInComment: IsNotInComment
): SemanticToken[] {
  if (lineText.length === 0) return [];
  const tokens: SemanticToken[] = [];
  const coveredStarts = new Set<number>();

  const macroDef = lineText.match(macroDefRegExp);
  if (macroDef && macroDef.index !== undefined && macroDef[2]) {
    const hashIndex = macroDef.index + macroDef[0].indexOf(macroDef[2]);
    pushHashToken(
      tokens,
      coveredStarts,
      lineIndex,
      hashIndex,
      macroDef[2].slice(1),
      isNotInComment
    );
  }

  const expandDef = lineText.match(expandDefRegExp);
  if (expandDef && expandDef.index !== undefined && expandDef[2]) {
    const hashIndex = expandDef.index + expandDef[0].indexOf(expandDef[2]);
    pushHashToken(
      tokens,
      coveredStarts,
      lineIndex,
      hashIndex,
      expandDef[2].slice(1),
      isNotInComment
    );
  }

  findMacroCalls(lineText).forEach((call) => {
    pushHashToken(
      tokens,
      coveredStarts,
      lineIndex,
      call.index,
      call.name,
      isNotInComment
    );
  });

  hashNameGlobalRe.lastIndex = 0;
  let m = hashNameGlobalRe.exec(lineText);
  while (m !== null) {
    if (!isReservedDirectiveKeyword(m[1])) {
      pushHashToken(
        tokens,
        coveredStarts,
        lineIndex,
        m.index,
        m[1],
        isNotInComment
      );
    }
    m = hashNameGlobalRe.exec(lineText);
  }

  return tokens;
}

// Variable/table-name tokens: declarations (`defines` + `virtualDefines`,
// always) plus the classifier's own `always`-mode references for
// annotation statements (VARTITLE/VARTEXT/VALUELABELS/COPY*), TABLE
// heads/axes, and the reference-only statements (WEIGHTCELLS/FILTER/
// FACTOR) — the same curated set the original regex-based pass covered,
// minus its "last name only" limitation.
const REF_HIGHLIGHT_KEYWORDS = new Set(['weightcells', 'filter', 'factor']);

export function collectModelSemanticTokens(
  lines: string[],
  scope: Scope
): SemanticToken[] {
  const isNotInComment: IsNotInComment = (line, char) =>
    scope.isNotInComment(line, char);

  const tokens: SemanticToken[] = [];
  lines.forEach((lineText, i) => {
    tokens.push(...collectMacroTokensForLine(lineText, i, isNotInComment));
  });

  // Comments are blanked to spaces first (matching how includeGraph.ts
  // builds `order`) so a `;` inside a comment can't split a statement, and
  // so no token can ever land inside one — no per-span comment check
  // needed below.
  const order: ResolvedLine[] = lines.map((text, i) => ({
    file: 'document',
    line: i,
    text: blankComments(scope, i, text),
  }));
  const statements = toLogicalStatements(order);

  const emit = (stmt: LogicalStatement, span: NameSpan) => {
    const { line, character } = locateInStatement(stmt, span.rawStart);
    tokens.push({
      line: line.line,
      startChar: character,
      length: span.rawLength,
      type: 'variable',
    });
  };

  statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls) return;
    cls.defines.forEach((span) => emit(stmt, span));
    (cls.virtualDefines ?? []).forEach((span) => emit(stmt, span));
    if (
      cls.kind === 'annotation' ||
      cls.kind === 'table' ||
      REF_HIGHLIGHT_KEYWORDS.has(cls.keyword)
    ) {
      cls.references
        .filter((r) => r.mode === 'always')
        .forEach((r) => emit(stmt, r.span));
    }
  });

  return tokens;
}
