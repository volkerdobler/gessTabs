// Semantic highlighting (F5): distinguishes variable/macro/table names
// from the surrounding gessTabs keywords, layered on top of the existing
// TextMate grammar rather than replacing it. Reuses the same regex
// factories (src/core/regex.ts) the document/workspace symbol providers
// already use to recognize *which lines* are variable/macro/table
// definitions, and src/core/macroExpansion.ts for macro calls and the
// bare-#name/reserved-keyword rules F3 already established.
//
// Known, deliberate scope limits (documented in docs/HISTORY.md's F5 entry
// and TODO.md's "possible future improvements" too):
// - A multi-name list (`VARIABLES a b c = ...;`, a RECODE/VALUELABELS
//   list, a TABLE head/axis with more than one variable) only gets its
//   LAST name highlighted. The shared regex factories capture the whole
//   list as one blob for these statement kinds (that's what the existing
//   document-symbol provider needs), and several of them (computeDefRe,
//   multiVarDefRe, multiVarRe, tableHeadRe, tableAxisRe) resolve which of
//   their own capture groups actually holds the list through a genuinely
//   ambiguous internal alternation — confirmed by probing them directly:
//   computeDefRe's plain single-variable branch captures the name into
//   *no* group at all. Rather than depend on that, every one of these is
//   read from its whole matched substring (`match[0]`) and the LAST
//   identifier/quoted-string token in it is taken as "the name" — always
//   correct for the (by far most common) single-name case, and a
//   documented simplification for the list case.
// - Only *definitions* are tokenized (matching what the document/
//   workspace symbol providers already collect), not every usage
//   elsewhere in the file — that needs symbolIndex.ts's workspace-wide
//   usage matching, a bigger scope than a per-document token pass.
// - Macro calls and bare #EXPAND references ARE included beyond bare
//   definitions, because macroExpansion.ts already gives their exact
//   position for free (findMacroCalls / the hash-name scan below), unlike
//   variable/table usages.

import {
  singleVarDefRe,
  multiVarDefRe,
  multiVarRe,
  computeDefRe,
  weightcellsRe,
  tableHeadRe,
  tableAxisRe,
  macroDefRe,
  expandDefRe,
} from './regex';
import { findMacroCalls, isReservedDirectiveKeyword } from './macroExpansion';

export type SemanticTokenType = 'variable' | 'macro';

export interface SemanticToken {
  line: number;
  startChar: number;
  length: number;
  type: SemanticTokenType;
}

export type IsNotInComment = (line: number, char: number) => boolean;

const singleVarRegExp = singleVarDefRe('');
const computeRegExp = computeDefRe('');
const weightcellsRegExp = weightcellsRe('');
const multiVarDefRegExp = multiVarDefRe('');
const multiVarRegExp = multiVarRe('');
const tableHeadRegExp = tableHeadRe('');
const tableAxisRegExp = tableAxisRe('');
const macroDefRegExp = macroDefRe('');
const expandDefRegExp = expandDefRe('');
const hashNameGlobalRe = /#([A-Za-z_]\w*)/g;
const trailingByRe = /\s*\bby\b\s*$/i;

// Finds the last identifier/quoted-string token in `text` — used for the
// "last name in a possibly multi-name list" simplification documented
// above. The negative lookahead ("nothing letter/quote-like follows")
// guarantees this only succeeds at the true last token, regardless of
// how many earlier names or keywords precede it.
const lastNameTokenRe = /("[^"]+"|'[^']+'|[\p{L}][\p{L}\d_.]*)(?!.*["'\p{L}])/u;

function lastNameRange(
  text: string,
  offset: number
): { startChar: number; length: number } | undefined {
  const m = text.match(lastNameTokenRe);
  if (!m || m.index === undefined) return undefined;
  return { startChar: offset + m.index, length: m[0].length };
}

function pushVariableToken(
  tokens: SemanticToken[],
  lineIndex: number,
  match: RegExpMatchArray,
  isNotInComment: IsNotInComment,
  stripTrailingBy = false
): void {
  if (match.index === undefined) return;
  const matched = stripTrailingBy
    ? match[0].replace(trailingByRe, '')
    : match[0];
  const range = lastNameRange(matched, match.index);
  if (!range) return;
  if (!isNotInComment(lineIndex, range.startChar)) return;
  tokens.push({
    line: lineIndex,
    startChar: range.startChar,
    length: range.length,
    type: 'variable',
  });
}

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

// The subset of "variable"-shaped statements that actually *declare* a
// new name (VARIABLE-family/COMPUTE-family/VARIABLES), as opposed to
// multiVarRe's family (VARTITLE/VARTEXT/VALUELABELS/...) which only
// *annotates* an already-existing variable, or WEIGHTCELLS which
// *references* one (its <varname> is a variable declared/computed
// earlier, never created here — see weightcellsRe). Exported separately (rather
// than folded silently into collectLineTokens below) because F2's
// duplicate-declaration diagnostic needs exactly this narrower set —
// reusing multiVarRe's matches there would misreport an ordinary
// `VARTITLE x = "...";` re-mentioning an existing `x` as a duplicate
// declaration, which it isn't.
export function collectDeclarationTokens(
  lineText: string,
  lineIndex: number,
  isNotInComment: IsNotInComment
): SemanticToken[] {
  if (lineText.length === 0) return [];
  const tokens: SemanticToken[] = [];
  [singleVarRegExp, computeRegExp, multiVarDefRegExp].forEach((re) => {
    const match = lineText.match(re);
    if (match) pushVariableToken(tokens, lineIndex, match, isNotInComment);
  });
  return tokens;
}

function collectLineTokens(
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

  tokens.push(...collectDeclarationTokens(lineText, lineIndex, isNotInComment));

  const multiVarMatch = lineText.match(multiVarRegExp);
  if (multiVarMatch) {
    pushVariableToken(tokens, lineIndex, multiVarMatch, isNotInComment);
  }

  // WEIGHTCELLS <varname> = … — a reference to an existing variable, not a
  // declaration (so it's here, not in collectDeclarationTokens), but its
  // name is still worth highlighting like a table head/axis usage.
  const weightcellsMatch = lineText.match(weightcellsRegExp);
  if (weightcellsMatch) {
    pushVariableToken(tokens, lineIndex, weightcellsMatch, isNotInComment);
  }

  const headMatch = lineText.match(tableHeadRegExp);
  if (headMatch) {
    pushVariableToken(tokens, lineIndex, headMatch, isNotInComment, true);
  }

  const axisMatch = lineText.match(tableAxisRegExp);
  if (axisMatch) {
    pushVariableToken(tokens, lineIndex, axisMatch, isNotInComment);
  }

  return tokens;
}

export function collectSemanticTokens(
  lines: string[],
  isNotInComment: IsNotInComment
): SemanticToken[] {
  const tokens: SemanticToken[] = [];
  lines.forEach((lineText, i) => {
    tokens.push(...collectLineTokens(lineText, i, isNotInComment));
  });
  return tokens;
}
