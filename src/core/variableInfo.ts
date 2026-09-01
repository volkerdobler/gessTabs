// Pure logic for the variable hover (src/providers/variableHoverProvider.ts): given
// the resolved workspace order, find the annotation statements
// (VARTITLE/VARTEXT/VALUELABELS, and their bare synonyms TITLE/TEXT/LABELS)
// that name a given variable, each gathered as its full statement text
// (start line through the first `;`). The definition line itself is found
// by symbolIndex.ts's findDefinitionLine, reused as-is; collectStatement
// here widens that single line to the whole statement too.
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

// `<keyword> <varlist … word …> = …` — `word` must appear as a whole
// token (or a quoted token) in the varlist part, i.e. before the first
// `=`. `[^=]*` keeps the match on the varlist side of the statement so a
// later `word` inside a quoted label text can't trigger it.
function annotationRe(word: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nameToken = `(?:(?<![\\w.#&])${escaped}(?![\\w.])|"${escaped}"|'${escaped}')`;
  return new RegExp(
    `\\b(vartitle|vartext|valuelabels|title|text|labels)\\b[^=]*${nameToken}[^=]*=`,
    'i'
  );
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
