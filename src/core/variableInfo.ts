// Pure logic for the variable hover (src/providers/variableHoverProvider.ts): given
// the resolved workspace order, find the annotation statements
// (VARTITLE/VARTEXT/VALUELABELS, and their bare synonyms TITLE/TEXT/LABELS)
// that name a given variable, each gathered as its full statement text
// (start line through the first `;`). The definition line itself is found
// by symbolIndex.ts's findDefinitionLine, reused as-is; collectStatement
// here widens that single line to the whole statement too.
//
// matchCopyAnnotationTarget handles the COPYTITLE/COPYTEXT/COPYLABELS
// family separately: those don't create a real VARTITLE/VARTEXT/
// VALUELABELS statement for their target varlist, they alias it to
// another variable's at runtime, so hovering a target name resolves to
// that source variable's actual annotation instead.
//
// Split out (pure, unit-tested — no vscode) like the rest of this
// codebase's "logic module + thin provider" pairs.

import { ResolvedLine } from './includeGraph';

export type VariableAnnotationKind = 'vartitle' | 'vartext' | 'valuelabels';

export interface VariableAnnotation {
  kind: VariableAnnotationKind;
  file: string;
  // 0-based start line of the statement, for a jump-to link.
  line: number;
  // The full statement, from its start line through the line with the
  // terminating `;` (comment/blank lines already filtered out of `order`).
  statement: string;
}

// TITLE/TEXT/LABELS are documented synonyms of VARTITLE/VARTEXT/VALUELABELS
// (see src/core/diagnostics.ts's empty-varlist note).
const annotationKindByKeyword: Record<string, VariableAnnotationKind> = {
  vartitle: 'vartitle',
  title: 'vartitle',
  vartext: 'vartext',
  text: 'vartext',
  valuelabels: 'valuelabels',
  labels: 'valuelabels',
};

// Line-start recognition for every annotation-family statement — VARTITLE/
// VARTEXT/VALUELABELS, their bare synonyms TITLE/TEXT/LABELS, and the
// COPYTITLE/COPYTEXT/COPYLABELS variants. A line starting with one of
// these keywords already shows, right there on screen, whatever a
// variable hover on its own varlist name would add — the variable hover
// provider uses this to gate its declaration-echo suppression.
const annotationStatementLineRe =
  /^\s*(vartitle|vartext|valuelabels|title|text|labels|copytitle|copytext|copylabels)\b/i;

export function isVariableAnnotationStatementLine(lineText: string): boolean {
  return annotationStatementLineRe.test(lineText);
}

// `word` as a whole token — bare, or single/double-quoted — used both to
// spot `word` inside a varlist and, escaped, to build the annotation/
// COPY* statement regexes below.
function nameTokenPattern(word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `(?:(?<![\\w.#&])${escaped}(?![\\w.])|"${escaped}"|'${escaped}')`;
}

function containsNameToken(text: string, word: string): boolean {
  return new RegExp(nameTokenPattern(word), 'i').test(text);
}

// `<keyword> <varlist … word …> = …` — `word` must appear as a whole
// token (or a quoted token) in the varlist part, i.e. before the first
// `=`. `[^=]*` keeps the match on the varlist side of the statement so a
// later `word` inside a quoted label text can't trigger it.
function annotationRe(word: string): RegExp {
  return new RegExp(
    `\\b(vartitle|vartext|valuelabels|title|text|labels)\\b[^=]*${nameTokenPattern(
      word
    )}[^=]*=`,
    'i'
  );
}

const copyAnnotationKindByKeyword: Record<string, VariableAnnotationKind> = {
  copytitle: 'vartitle',
  copytext: 'vartext',
  copylabels: 'valuelabels',
};

// Deliberately single-line, like this codebase's other statement regexes
// (annotationRe, tableOrOverviewStatementRe, ...): `COPYTITLE <varlist> =
// <variable>;` is assumed to fit on one line, matching the documented
// syntax. Group 2 is the target varlist, group 3 the single source
// variable name (optionally quoted).
const copyStatementRe =
  /^\s*(copytitle|copytext|copylabels)\b([^=]*)=\s*([^;]+?)\s*;?\s*$/i;

export interface CopyAnnotationTarget {
  kind: VariableAnnotationKind;
  sourceVar: string;
}

// `COPYTITLE/COPYTEXT/COPYLABELS <varlist> = <variable>;` doesn't create a
// literal VARTITLE/VARTEXT/VALUELABELS statement for the names in
// <varlist> — it aliases them to <variable>'s at runtime. When `word` is
// one of those target names (not <variable> itself, which is handled as
// an ordinary variable reference), returns which annotation kind to look
// up and the source variable's name, so the variable hover can show
// *that* variable's VARTITLE/VARTEXT/VALUELABELS instead of pretending
// `word` has its own.
export function matchCopyAnnotationTarget(
  lineText: string,
  word: string
): CopyAnnotationTarget | undefined {
  const m = lineText.match(copyStatementRe);
  if (!m) return undefined;
  const varlist = m[2];
  if (!containsNameToken(varlist, word)) return undefined;
  const sourceVar = m[3].replace(/^["']|["']$/g, '').trim();
  if (!sourceVar) return undefined;
  return { kind: copyAnnotationKindByKeyword[m[1].toLowerCase()], sourceVar };
}

export type IsNotInCommentAt = (
  line: ResolvedLine,
  searchIndex: number
) => boolean;

// No GESStabs statement runs anywhere near this long; the cap just stops a
// missing `;` from swallowing the rest of the file into one hover.
const MAX_STATEMENT_LINES = 40;

// Joins `order` entries from `startLine` in `file` forward until (and
// including) the first line carrying a `;`. `order` is the INCLUDE-
// resolved, comment/blank-filtered line list, and a file's lines are
// contiguous within it, so this is a straight forward walk.
export function collectStatement(
  order: ResolvedLine[],
  file: string,
  startLine: number
): string {
  const startIdx = order.findIndex(
    (l) => l.file === file && l.line === startLine
  );
  if (startIdx === -1) return '';
  const parts: string[] = [];
  for (
    let i = startIdx;
    i < order.length && parts.length < MAX_STATEMENT_LINES;
    i += 1
  ) {
    const rl = order[i];
    if (rl.file !== file) break;
    parts.push(rl.text);
    if (rl.text.includes(';')) break;
  }
  return parts.join('\n').trim();
}

export function findVariableAnnotations(
  order: ResolvedLine[],
  word: string,
  isNotInComment: IsNotInCommentAt = () => true
): VariableAnnotation[] {
  if (!word) return [];
  const re = annotationRe(word);
  const seen = new Set<string>();
  const out: VariableAnnotation[] = [];

  order.forEach((rl) => {
    const idx = rl.text.search(re);
    if (idx === -1) return;
    if (!isNotInComment(rl, idx)) return;
    const m = rl.text.match(re);
    if (!m) return;
    const kind = annotationKindByKeyword[m[1].toLowerCase()];
    if (!kind) return;
    const key = `${rl.file}:${rl.line}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      kind,
      file: rl.file,
      line: rl.line,
      statement: collectStatement(order, rl.file, rl.line),
    });
  });

  return out;
}
