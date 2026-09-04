// The statement classifier — one authoritative parser per gessTabs
// statement shape, replacing the definition/reference knowledge currently
// spread across the eleven regex factories in src/core/regex.ts (see
// docs/variable-model-design.md §7.1).
//
// Input is one whole logical statement (src/core/statements.ts'
// `toLogicalStatements`), not a line. Output says, for that statement:
//   - which names it creates / re-defines (`defines`), and whether that is
//     a `declaration` (SINGLEQ/VARFAMILY/… — a second one is a duplicate)
//     or an `assignment` (COMPUTE/IF-THEN — re-assignment is normal);
//   - which names it references, each tagged with a `NameMode` saying how
//     to treat a quoted token there (§4);
//   - whether it re-points / consumes "die aktuelle Variable" (the
//     empty-varlist trap);
//   - whether it opens or closes a runtime block (for Tier 2 folding).
//
// This module is PURE and has NO consumer wired yet (design doc §8 phase
// 1). Phase 2+ builds the symbol table on top of it and migrates
// go-to-definition / references / rename / hover / the F2 diagnostics.

export type NameMode = 'always' | 'ifKnown' | 'never';

export type VariableKind =
  | 'atomic'
  | 'alpha'
  | 'open'
  | 'family'
  | 'alphafamily'
  | 'crossvar'
  | 'group'
  | 'spssgroup'
  | 'indexvar'
  | 'invindexvar'
  | 'assocvar'
  | 'unknown';

export type StatementKind =
  | 'singleq'
  | 'makesingle'
  | 'variables-block'
  | 'makesingles'
  | 'assocvar'
  | 'clonevar'
  | 'compute'
  | 'if-then'
  | 'varfamily'
  | 'makefamily'
  | 'alphafamily'
  | 'crossvar'
  | 'multifromstring'
  | 'vargroup'
  | 'groups'
  | 'makegroup'
  | 'spssgroup'
  | 'intervals'
  | 'indexvar'
  | 'stat-creator'
  | 'count'
  | 'data'
  | 'overcode'
  | 'annotation'
  | 'table'
  | 'block'
  | 'other';

export interface NameSpan {
  // unquoted, lower-cased — the lookup key.
  name: string;
  // exactly as written, including any quotes.
  raw: string;
  // offset of `raw` within the statement text.
  rawStart: number;
  rawLength: number;
  quoted: boolean;
  // true for a member `expandNameRange` synthesised from an `‹a› TO ‹b›`
  // pair (§9 Q2) — `raw`/`rawStart`/`rawLength` then describe the whole
  // range phrase (no literal token of this name exists), not a real
  // occurrence of `raw` itself. Consumers that need an editable text range
  // (rename) must skip these; consumers that just need "where does this
  // apply" (find-references) can still use the phrase's position.
  synthetic?: boolean;
}

export interface StatementReference {
  span: NameSpan;
  mode: NameMode;
}

export interface ClassifiedStatement {
  kind: StatementKind;
  // leading keyword(s) that were matched, lower-cased and space-joined
  // (`compute copy`, `data mean`).
  keyword: string;
  defines: NameSpan[];
  // only set when `defines` is non-empty.
  defKind?: 'declaration' | 'assignment';
  // kind of the names in `defines`, when statically knowable.
  targetKind?: VariableKind;
  references: StatementReference[];
  // names of virtual codes this statement introduces — OVERCODE / OVEROVERCODE
  // `‹ocname›` (§3.6). Kept apart from `defines` because they are `virtual`
  // origin and scoped to the enclosing variable's label list.
  virtualDefines?: NameSpan[];
  bindsCurrentVariable: boolean;
  usesCurrentVariable: boolean;
  // at least one name list in the statement used an `‹a› TO ‹b›` range;
  // the model expands numeric-suffix ranges via `expandNameRange`.
  hasNameRange?: boolean;
  // runtime-block boundary, for Tier 2 folding / unmatched-block checks.
  // 'mid' is ELSEBLOCK / ELSE-style (closes one region, opens the next).
  block?: 'open' | 'close' | 'mid';
  // a recognised keyword whose operands did not parse (design §9 Q1: a
  // no-name VARFAMILY/VARGROUP lands here rather than inventing a symbol).
  malformed?: string;
}

// ---------------------------------------------------------------------------
// Tokeniser
// ---------------------------------------------------------------------------

interface Token {
  type: 'word' | 'string' | 'number' | 'op';
  value: string; // raw text (strings keep their quotes)
  start: number;
  end: number;
}

// A gessTabs name token: a letter (incl. the German set) or `_`, then
// name characters — `.` is a plain name character here (`region.f24` is
// ONE name), matching regex.ts' `constTokenVarName`. `#name` / `&name` /
// `&1` are kept whole so a macro call / macro param isn't mis-split.
const NAME_START = /[A-Za-zßäöüÄÖÜ_]/;
const NAME_CHAR = /[A-Za-zßäöüÄÖÜ0-9_.]/;

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const close = text.indexOf(ch, i + 1);
      const end = close === -1 ? text.length : close + 1;
      tokens.push({ type: 'string', value: text.slice(i, end), start: i, end });
      i = end;
      continue;
    }
    if ((ch === '#' || ch === '&') && i + 1 < text.length) {
      let j = i + 1;
      while (j < text.length && NAME_CHAR.test(text[j])) j += 1;
      if (j > i + 1) {
        tokens.push({
          type: 'word',
          value: text.slice(i, j),
          start: i,
          end: j,
        });
        i = j;
        continue;
      }
    }
    if (NAME_START.test(ch)) {
      let j = i + 1;
      while (j < text.length && NAME_CHAR.test(text[j])) j += 1;
      // trailing `.` is punctuation, not part of the name
      while (j > i + 1 && text[j - 1] === '.') j -= 1;
      tokens.push({ type: 'word', value: text.slice(i, j), start: i, end: j });
      i = j;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < text.length && /[0-9.]/.test(text[j])) j += 1;
      tokens.push({
        type: 'number',
        value: text.slice(i, j),
        start: i,
        end: j,
      });
      i = j;
      continue;
    }
    tokens.push({ type: 'op', value: ch, start: i, end: i + 1 });
    i += 1;
  }
  return tokens;
}

const unquote = (s: string): string =>
  s.length >= 2 && (s[0] === '"' || s[0] === "'") && s[s.length - 1] === s[0]
    ? s.slice(1, -1)
    : s;

function spanOf(tok: Token): NameSpan {
  const quoted = tok.type === 'string';
  const raw = tok.value;
  return {
    name: unquote(raw).toLowerCase(),
    raw,
    rawStart: tok.start,
    rawLength: raw.length,
    quoted,
  };
}

// ---------------------------------------------------------------------------
// Keyword tables
// ---------------------------------------------------------------------------

const ATOMIC_DECL = new Set(['singleq', 'variable', 'simplevar', 'bcdvar']);
const FAMILY_DECL = new Set(['varfamily', 'familyvar']);
const GROUP_DECL = new Set(['vargroup', 'groupvar', 'dichoq', 'bitgroup']);
const STAT_CREATORS = new Set([
  'mean',
  'sum',
  'min',
  'max',
  'stddev',
  'variance',
  'minindex',
  'maxindex',
]);
const COMPUTE_SUBS = new Set([
  'add',
  'alpha',
  'ascend',
  'descend',
  'concat',
  'copy',
  'eliminate',
  'init',
  'load',
  'replace',
  'shuffle',
  'sort',
  'substr',
  'swap',
]);
const DATA_METHODS = new Set([
  'absolute',
  'validn',
  'physicalrecords',
  'sum',
  'mean',
  'variance',
  'stddev',
  'median',
  'pcntl1',
  'pcntl2',
  'min',
  'max',
]);
// Statements that annotate / operate on an existing variable. With a
// varlist before `=` those names are `always`-mode references; with none,
// the statement binds to "die aktuelle Variable".
const ANNOTATION_KW = new Set([
  'vartitle',
  'title',
  'vartext',
  'text',
  'valuelabels',
  'labels',
  'copylabels',
  'copytitle',
  'copytext',
  'uselabels',
  'excludevalues',
  'includevalues',
  'recode',
  'ranges',
  'missing',
  'nomissing',
  'printall',
  'normalize',
  'generatelabels',
]);
const COPY_SOURCE_KW = new Set([
  'copylabels',
  'copytitle',
  'copytext',
  'uselabels',
]);
const TABLE_KW = new Set(['table', 'overview', 'xoverview', 'gtable']);

// Statements that only reference existing variables (no target, no
// annotation): the varlist before `=` is `always`-mode, anything after is
// an `ifKnown` condition/expression.
const REF_STATEMENT_KW = new Set(['weightcells', 'filter', 'factor']);

const BLOCK_OPEN = new Set(['ifblock', 'whileblock', 'setfilter']);
const BLOCK_CLOSE = new Set(['endblock', 'endfilter']);
const BLOCK_MID = new Set(['elseblock']);
const BLOCK_OPEN_DIR = new Set(['#macro', '#startexport']);
const BLOCK_CLOSE_DIR = new Set(['#endmacro', '#endexport']);

// ---------------------------------------------------------------------------
// Small parse helpers
// ---------------------------------------------------------------------------

const isWordOrString = (t: Token | undefined): t is Token =>
  !!t && (t.type === 'word' || t.type === 'string');

const kw = (t: Token | undefined): string =>
  t && t.type === 'word' ? t.value.toLowerCase() : '';

// Index of the first top-level `=` (paren depth 0). -1 if none.
function topLevelEq(tokens: Token[], from = 0): number {
  let depth = 0;
  for (let i = from; i < tokens.length; i++) {
    const v = tokens[i].value;
    if (v === '(' || v === '[') depth += 1;
    else if (v === ')' || v === ']') depth -= 1;
    else if (v === '=' && depth === 0) return i;
  }
  return -1;
}

// Expands an `‹a› TO ‹b›` range whose endpoints share a non-numeric prefix
// and differ only in a trailing integer (`v1 TO v4` → v1 v2 v3 v4; `q08 TO
// q11` → q08 q09 q10 q11, zero-padding preserved from `from`; a dotted
// prefix works the same way, `f.1 TO f.3` → f.1 f.2 f.3). Returns undefined
// when the two names don't fit that shape — design doc §9 Q2: gessTabs has
// a *second*, unrelated `‹a› TO ‹b›` meaning at a reference position (never
// at a definition position — a new name always needs this numeric-suffix
// shape) — "every variable declared between `‹a›` and `‹b›`, in program
// order", names need not match at all. That form can't be resolved here
// (needs the symbol table); `collectNames` below leaves such a pair as just
// its two endpoints, and the model resolves the rest on demand. Exported
// for the model's own use in that fallback path.
export function expandNameRange(
  from: string,
  to: string
): string[] | undefined {
  const m1 = /^(.*?)(\d+)$/.exec(from);
  const m2 = /^(.*?)(\d+)$/.exec(to);
  if (!m1 || !m2 || m1[1].toLowerCase() !== m2[1].toLowerCase())
    return undefined;
  const start = parseInt(m1[2], 10);
  const end = parseInt(m2[2], 10);
  if (end < start || end - start > 10000) return undefined;
  const width = m1[2].length;
  const out: string[] = [];
  for (let n = start; n <= end; n += 1) {
    out.push(m1[1] + String(n).padStart(width, '0'));
  }
  return out;
}

// A range member synthesised by expandNameRange rather than read literally
// off one token — there's no single source position for it, so it's
// anchored to the whole `‹a› TO ‹b›` phrase (from `‹a›`'s start through
// `‹b›`'s end): a real, correct line for a jump link, just not a precise
// column, matching this codebase's existing "line-accurate, column-
// approximate" tradeoff for anything without a literal token of its own.
function syntheticSpan(
  name: string,
  rangeStart: Token,
  rangeEnd: Token
): NameSpan {
  return {
    name: name.toLowerCase(),
    raw: name,
    rawStart: rangeStart.start,
    rawLength: rangeEnd.end - rangeStart.start,
    quoted: false,
    synthetic: true,
  };
}

// Collect a whitespace/comma-separated name list from tokens[from..to).
// An `‹a› TO ‹b›` pair whose endpoints fit expandNameRange's numeric-suffix
// shape is expanded in place (every member becomes its own span, in
// order); one that doesn't (§9 Q2's reference-position form) keeps just
// its two endpoints and sets `hasRange` so the model knows to resolve the
// rest itself.
function collectNames(
  tokens: Token[],
  from: number,
  to: number
): { spans: NameSpan[]; hasRange: boolean } {
  const spans: NameSpan[] = [];
  let hasRange = false;
  let lastNameTok: Token | undefined;
  let pendingRangeStart: Token | undefined;
  for (let i = from; i < to; i++) {
    const t = tokens[i];
    if (
      t.type === 'op' &&
      (t.value === ',' || t.value === '(' || t.value === ')')
    ) {
      continue;
    }
    if (t.type === 'word' && t.value.toLowerCase() === 'to') {
      hasRange = true;
      pendingRangeStart = lastNameTok;
      continue;
    }
    // `BY` separates the varlist from the index var in INDEXVAR /
    // INVINDEXVAR — a structural keyword, not a name.
    if (t.type === 'word' && t.value.toLowerCase() === 'by') continue;
    if (isWordOrString(t)) {
      if (pendingRangeStart) {
        const rangeStart = pendingRangeStart;
        const members = expandNameRange(
          spanOf(rangeStart).name,
          spanOf(t).name
        );
        if (members && members.length > 2) {
          members
            .slice(1, -1)
            .forEach((name) => spans.push(syntheticSpan(name, rangeStart, t)));
        }
        pendingRangeStart = undefined;
      }
      // stop at an obvious non-name operator
      spans.push(spanOf(t));
      lastNameTok = t;
    } else {
      // number / other op — end of the list
      break;
    }
  }
  return { spans, hasRange };
}

// Name-like tokens in an expression / condition — every `word` token that
// is not immediately a function call `name(` and not a bare keyword we
// know is an operator. Numbers and strings-as-text are dropped.
const EXPR_OPERATORS = new Set([
  'and',
  'or',
  'not',
  'eq',
  'ne',
  'lt',
  'le',
  'gt',
  'ge',
  'in',
  'is',
  'then',
  'else',
  'to',
  'by',
  'mod',
  'div',
]);

function collectExprRefs(
  tokens: Token[],
  from: number,
  to: number,
  mode: NameMode
): StatementReference[] {
  const refs: StatementReference[] = [];
  for (let i = from; i < to; i++) {
    const t = tokens[i];
    if (t.type !== 'word' && t.type !== 'string') continue;
    if (t.type === 'word') {
      const low = t.value.toLowerCase();
      if (EXPR_OPERATORS.has(low)) continue;
      if (t.value.startsWith('#') || t.value.startsWith('&')) continue;
      const next = tokens[i + 1];
      if (next && next.value === '(') continue; // function call
    }
    refs.push({ span: spanOf(t), mode });
  }
  return refs;
}

// ---------------------------------------------------------------------------

function base(kind: StatementKind, keyword: string): ClassifiedStatement {
  return {
    kind,
    keyword,
    defines: [],
    references: [],
    bindsCurrentVariable: false,
    usesCurrentVariable: false,
  };
}

// Records `defines` on `cls` (in place, via Object.assign so `cls` is not
// directly reassigned) and, when non-empty, the derived `defKind` /
// `targetKind` / `bindsCurrentVariable`.
function withDefines(
  cls: ClassifiedStatement,
  defines: NameSpan[],
  defKind: 'declaration' | 'assignment',
  targetKind?: VariableKind
): ClassifiedStatement {
  const patch: Partial<ClassifiedStatement> =
    defines.length > 0
      ? { defines, defKind, bindsCurrentVariable: true }
      : { defines };
  if (defines.length > 0 && targetKind) patch.targetKind = targetKind;
  return Object.assign(cls, patch);
}

// Generic `<KEYWORD> [subs] <targetlist> = <sources>` — targets are
// `always`-mode defines, sources are `always`-mode references (the RHS of
// a declaration grammar only accepts names).
function classifyTargetEqSources(
  tokens: Token[],
  kind: StatementKind,
  keyword: string,
  defKind: 'declaration' | 'assignment',
  targetKind: VariableKind,
  sourceMode: NameMode = 'always'
): ClassifiedStatement {
  const cls = base(kind, keyword);
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = `${keyword}: no '='`;
    return cls;
  }
  const { spans } = collectNames(tokens, 1, eq);
  if (spans.length === 0) {
    cls.malformed = `${keyword}: no target name`;
    return cls;
  }
  withDefines(cls, spans, defKind, targetKind);
  cls.references =
    sourceMode === 'always'
      ? collectNames(tokens, eq + 1, tokens.length).spans.map((span) => ({
          span,
          mode: 'always' as NameMode,
        }))
      : collectExprRefs(tokens, eq + 1, tokens.length, sourceMode);
  return cls;
}

// `<KEYWORD> <targetlist> = <non-name RHS>` (MAKEFAMILY x = 10; — RHS is a
// count, not names).
function classifyLeftOfEq(
  tokens: Token[],
  kind: StatementKind,
  keyword: string,
  defKind: 'declaration' | 'assignment',
  targetKind: VariableKind
): ClassifiedStatement {
  const cls = base(kind, keyword);
  const eq = topLevelEq(tokens);
  const end = eq === -1 ? tokens.length : eq;
  const { spans } = collectNames(tokens, 1, end);
  if (spans.length === 0) {
    cls.malformed = `${keyword}: no target name`;
    return cls;
  }
  return withDefines(cls, spans, defKind, targetKind);
}

function classifyAtomicDecl(
  tokens: Token[],
  keyword: string
): ClassifiedStatement {
  const cls = base('singleq', keyword);
  const eq = topLevelEq(tokens);
  // target is the first name after the keyword (SINGLEQ v = …  /
  // SINGLEQ v 0 VARTEXT … — the no-`=` column-position form).
  const target = tokens[1];
  if (!isWordOrString(target)) {
    cls.malformed = `${keyword}: no target name`;
    return cls;
  }
  let targetKind: VariableKind = 'atomic';
  const rhsStart = eq === -1 ? tokens.length : eq + 1;
  const rhsKw = kw(tokens[rhsStart]);
  if (rhsKw === 'alpha') targetKind = 'alpha';
  else if (rhsKw === 'open' || rhsKw === 'openasalpha') targetKind = 'open';
  withDefines(cls, [spanOf(target)], 'declaration', targetKind);
  if (eq !== -1) {
    // OPENASALPHA DATA <src> carries a ref; a plain `= <expr>` does too
    cls.references = collectExprRefs(tokens, eq + 1, tokens.length, 'ifKnown');
  }
  return cls;
}

function classifyMakeSingle(tokens: Token[]): ClassifiedStatement {
  const cls = base('makesingle', 'makesingle');
  const target = tokens[1];
  if (!isWordOrString(target)) {
    cls.malformed = 'makesingle: no target name';
    return cls;
  }
  const eq = topLevelEq(tokens);
  let targetKind: VariableKind = 'atomic';
  if (eq !== -1 && kw(tokens[eq + 1]) === 'alpha') targetKind = 'alpha';
  withDefines(cls, [spanOf(target)], 'declaration', targetKind);
  if (eq !== -1) {
    cls.references = collectExprRefs(tokens, eq + 1, tokens.length, 'ifKnown');
  }
  return cls;
}

function classifyVariablesBlock(tokens: Token[]): ClassifiedStatement {
  // VARIABLES a b c = …;  /  VARIABLES v1 TO v9 = <start> <width>;
  const cls = base('variables-block', 'variables');
  const eq = topLevelEq(tokens);
  const end = eq === -1 ? tokens.length : eq;
  const { spans } = collectNames(tokens, 1, end);
  if (spans.length === 0) {
    cls.malformed = 'variables: no target name';
    return cls;
  }
  return withDefines(cls, spans, 'declaration', 'atomic');
}

function classifyMultiFromString(tokens: Token[]): ClassifiedStatement {
  // MULTIFROMSTRING [DELIMITED d] [DECIMALS c] v = alfavar;
  // target must pre-exist as a FAMILYVAR → an assignment, not a new decl.
  const cls = base('multifromstring', 'multifromstring');
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = 'multifromstring: no =';
    return cls;
  }
  // the target is the last name token before `=`
  let ti = eq - 1;
  while (ti > 0 && !isWordOrString(tokens[ti])) ti -= 1;
  if (ti <= 0) {
    cls.malformed = 'multifromstring: no target name';
    return cls;
  }
  withDefines(cls, [spanOf(tokens[ti])], 'assignment', 'family');
  cls.references = collectNames(tokens, eq + 1, tokens.length).spans.map(
    (span) => ({ span, mode: 'always' as NameMode })
  );
  return cls;
}

function classifyVarGroup(
  tokens: Token[],
  keyword: string
): ClassifiedStatement {
  // VARGROUP v = ( a b c ) EQ <valuelist>;
  const cls = base('vargroup', keyword);
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = `${keyword}: no =`;
    return cls;
  }
  const { spans: targets } = collectNames(tokens, 1, eq);
  if (targets.length === 0) {
    cls.malformed = `${keyword}: no target name`;
    return cls;
  }
  withDefines(cls, targets, 'declaration', 'group');
  // member vars live inside the first ( … ) after `=`
  const open = tokens.findIndex((t, i) => i > eq && t.value === '(');
  if (open !== -1) {
    let close = open + 1;
    let depth = 1;
    while (close < tokens.length && depth > 0) {
      if (tokens[close].value === '(') depth += 1;
      else if (tokens[close].value === ')') depth -= 1;
      if (depth === 0) break;
      close += 1;
    }
    cls.references = collectNames(tokens, open + 1, close).spans.map(
      (span) => ({
        span,
        mode: 'always' as NameMode,
      })
    );
  }
  return cls;
}

function classifyGroups(tokens: Token[]): ClassifiedStatement {
  // GROUPS v = | "label" [opts] : <cond> | "label" : <cond> … ;
  const cls = base('groups', 'groups');
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = 'groups: no =';
    return cls;
  }
  const { spans: targets } = collectNames(tokens, 1, eq);
  if (targets.length === 0) {
    cls.malformed = 'groups: no target name';
    return cls;
  }
  withDefines(cls, targets, 'declaration', 'group');
  // references: names appearing after each `:` (the condition parts)
  const refs: StatementReference[] = [];
  for (let i = eq + 1; i < tokens.length; i++) {
    if (tokens[i].value === ':') {
      // to the next `|` or end
      let j = i + 1;
      while (j < tokens.length && tokens[j].value !== '|') j += 1;
      refs.push(...collectExprRefs(tokens, i + 1, j, 'ifKnown'));
      i = j;
    }
  }
  cls.references = refs;
  return cls;
}

function classifyIntervals(tokens: Token[]): ClassifiedStatement {
  // INTERVALS v = <sourcevar> | "label" : <cmp> <val> … ;
  const cls = base('intervals', 'intervals');
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = 'intervals: no =';
    return cls;
  }
  const { spans: targets } = collectNames(tokens, 1, eq);
  if (targets.length === 0) {
    cls.malformed = 'intervals: no target name';
    return cls;
  }
  withDefines(cls, targets, 'declaration', 'atomic');
  // the source var is the first name token after `=` (once, not per row)
  const src = tokens.slice(eq + 1).find((t) => isWordOrString(t));
  if (src) cls.references = [{ span: spanOf(src), mode: 'always' }];
  return cls;
}

function classifyIndexVar(
  tokens: Token[],
  keyword: string
): ClassifiedStatement {
  // INDEXVAR v = a b c BY idx;
  const cls = base('indexvar', keyword);
  const eq = topLevelEq(tokens);
  if (eq === -1) {
    cls.malformed = `${keyword}: no =`;
    return cls;
  }
  const { spans: targets } = collectNames(tokens, 1, eq);
  if (targets.length === 0) {
    cls.malformed = `${keyword}: no target name`;
    return cls;
  }
  withDefines(
    cls,
    targets,
    'declaration',
    keyword === 'invindexvar' ? 'invindexvar' : 'indexvar'
  );
  cls.references = collectNames(tokens, eq + 1, tokens.length).spans.map(
    (span) => ({ span, mode: 'always' as NameMode })
  );
  return cls;
}

function classifyCompute(
  tokens: Token[],
  keyword: string,
  from: number
): ClassifiedStatement {
  const cls = base('compute', keyword);
  let i = from;
  const subs: string[] = [];
  while (i < tokens.length && COMPUTE_SUBS.has(kw(tokens[i]))) {
    subs.push(kw(tokens[i]));
    i += 1;
  }
  const sub = subs[subs.length - 1];
  if (subs.length) cls.keyword = `${keyword} ${subs.join(' ')}`;

  const eq = topLevelEq(tokens, i);
  if (eq === -1) {
    cls.malformed = `${keyword}: no =`;
    return cls;
  }

  // target(s) between the (sub-)keyword(s) and `=`. SORT ( … ) v / REPLACE
  // <value> v — the target is the last name token before `=`; otherwise
  // every name before `=` is a target (`compute a b c = 0`).
  let targetFrom = i;
  if (sub === 'sort' || sub === 'replace') {
    let ti = eq - 1;
    while (ti >= i && !isWordOrString(tokens[ti])) ti -= 1;
    targetFrom = ti;
  }
  const targets = collectNames(tokens, Math.max(targetFrom, i), eq).spans;

  const copyLike =
    sub === 'copy' ||
    sub === 'load' ||
    sub === 'swap' ||
    sub === 'shuffle' ||
    sub === 'ascend' ||
    sub === 'descend' ||
    sub === 'add' ||
    sub === 'substr';

  let targetKind: VariableKind = 'unknown';
  if (sub === 'alpha' || sub === 'concat' || sub === 'substr')
    targetKind = 'alpha';

  if (targets.length === 0) {
    // empty-varlist COMPUTE — binds/uses the current variable
    cls.usesCurrentVariable = true;
    cls.bindsCurrentVariable = true;
  } else {
    withDefines(cls, targets, 'assignment', targetKind);
  }

  if (copyLike) {
    cls.references = collectNames(tokens, eq + 1, tokens.length).spans.map(
      (span) => ({ span, mode: 'always' as NameMode })
    );
    if (sub === 'swap') {
      // SWAP is bidirectional: RHS names are also (re-)defined
      cls.defines = [
        ...cls.defines,
        ...collectNames(tokens, eq + 1, tokens.length).spans,
      ];
    }
  } else {
    cls.references = collectExprRefs(tokens, eq + 1, tokens.length, 'ifKnown');
  }
  return cls;
}

function classifyData(tokens: Token[]): ClassifiedStatement {
  const cls = base('data', 'data');
  let i = 1;
  if (kw(tokens[i]) === 'useweight') {
    i += 1;
    if (isWordOrString(tokens[i])) {
      cls.references.push({ span: spanOf(tokens[i]), mode: 'always' });
      i += 1;
    }
  }
  if (DATA_METHODS.has(kw(tokens[i]))) {
    cls.keyword = `data ${kw(tokens[i])}`;
    i += 1;
  }
  const eq = topLevelEq(tokens, i);
  if (eq === -1) {
    cls.malformed = 'data: no =';
    return cls;
  }
  const { spans: targets } = collectNames(tokens, i, eq);
  if (targets.length === 0) {
    cls.malformed = 'data: no target name';
    return cls;
  }
  withDefines(cls, targets, 'declaration', 'atomic');
  // RHS: <basevar> [BY <groupvar>]
  for (let j = eq + 1; j < tokens.length; j++) {
    if (isWordOrString(tokens[j]) && kw(tokens[j]) !== 'by') {
      cls.references.push({ span: spanOf(tokens[j]), mode: 'always' });
    }
  }
  return cls;
}

function classifyIf(tokens: Token[], keyword: string): ClassifiedStatement {
  // IF <cond> THEN <stmt> [ELSE <stmt>];  — <stmt> is a COMPUTE without
  // the keyword. Condition names are ifKnown; the THEN/ELSE targets are
  // assignments.
  const cls = base('if-then', keyword);
  const thenIdx = tokens.findIndex((t) => kw(t) === 'then');
  if (thenIdx === -1) {
    cls.references = collectExprRefs(tokens, 1, tokens.length, 'ifKnown');
    return cls;
  }
  cls.references = collectExprRefs(tokens, 1, thenIdx, 'ifKnown');

  const elseIdx = tokens.findIndex((t, i) => i > thenIdx && kw(t) === 'else');
  const branchStarts =
    elseIdx === -1 ? [thenIdx + 1] : [thenIdx + 1, elseIdx + 1];
  const branchEnds =
    elseIdx === -1 ? [tokens.length] : [elseIdx, tokens.length];
  const defs: NameSpan[] = [];
  branchStarts.forEach((start, b) => {
    const inner = classifyCompute(
      [
        { type: 'word' as const, value: 'compute', start: 0, end: 7 },
        ...tokens.slice(start, branchEnds[b]),
      ],
      'compute',
      1
    );
    defs.push(...inner.defines);
    cls.references.push(...inner.references);
    if (inner.usesCurrentVariable) cls.usesCurrentVariable = true;
  });
  if (defs.length) withDefines(cls, defs, 'assignment');
  return cls;
}

function classifyAnnotation(
  tokens: Token[],
  keyword: string
): ClassifiedStatement {
  const cls = base('annotation', keyword);
  const eq = topLevelEq(tokens);
  const end = eq === -1 ? tokens.length : eq;
  const { spans } = collectNames(tokens, 1, end);
  if (spans.length === 0) {
    // no varlist before `=` → binds to "die aktuelle Variable"
    cls.usesCurrentVariable = true;
  } else {
    cls.references = spans.map((span) => ({
      span,
      mode: 'always' as NameMode,
    }));
  }
  // COPY*/USELABELS carry a source name on the RHS (always a name)
  if (eq !== -1 && COPY_SOURCE_KW.has(keyword)) {
    const src = tokens.slice(eq + 1).find((t) => isWordOrString(t));
    if (src) cls.references.push({ span: spanOf(src), mode: 'always' });
  }
  return cls;
}

function classifyRefStatement(
  tokens: Token[],
  keyword: string
): ClassifiedStatement {
  // WEIGHTCELLS [AUTOALIGN] ‹v› = …;  FILTER ‹vl› [= ‹cond›] [AS ‹name›];
  // — the varlist before `=` names existing variables; a `=` RHS is a
  // condition (ifKnown). No target, no annotation.
  const cls = base('other', keyword);
  const eq = topLevelEq(tokens);
  const end = eq === -1 ? tokens.length : eq;
  let from = 1;
  if (keyword === 'weightcells' && kw(tokens[1]) === 'autoalign') from = 2;
  const { spans } = collectNames(tokens, from, end);
  cls.references = spans.map((span) => ({ span, mode: 'always' as NameMode }));
  if (eq !== -1) {
    cls.references.push(
      ...collectExprRefs(tokens, eq + 1, tokens.length, 'ifKnown')
    );
  }
  return cls;
}

function classifyTable(tokens: Token[], keyword: string): ClassifiedStatement {
  // TABLE = <head> BY <axis> [BY …];  — every name is `always`.
  const cls = base('table', keyword);
  const eq = topLevelEq(tokens);
  if (eq === -1) return cls;
  for (let i = eq + 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (kw(t) === 'by') continue;
    if (isWordOrString(t))
      cls.references.push({ span: spanOf(t), mode: 'always' });
  }
  return cls;
}

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

function classifyDispatch(
  statementText: string
): ClassifiedStatement | undefined {
  const tokens = tokenize(statementText);
  if (tokens.length === 0) return undefined;

  const head = tokens[0];
  const keyword = kw(head);
  if (!keyword) return undefined;

  // --- runtime blocks --------------------------------------------------
  if (BLOCK_OPEN.has(keyword) || BLOCK_OPEN_DIR.has(keyword)) {
    const cls = base('block', keyword);
    cls.block = 'open';
    // SETFILTER <name> … / IFBLOCK <cond> … / WHILEBLOCK <cond> DO …
    if (keyword === 'ifblock' || keyword === 'whileblock') {
      cls.references = collectExprRefs(tokens, 1, tokens.length, 'ifKnown');
    }
    return cls;
  }
  if (BLOCK_CLOSE.has(keyword) || BLOCK_CLOSE_DIR.has(keyword)) {
    const cls = base('block', keyword);
    cls.block = 'close';
    return cls;
  }
  if (BLOCK_MID.has(keyword)) {
    const cls = base('block', keyword);
    cls.block = 'mid';
    return cls;
  }

  // --- IF … THEN <stmt> ----------------------------------------------
  if (keyword === 'if' || keyword === 'fif') {
    return classifyIf(tokens, keyword);
  }

  // --- COMPUTE / FCOMPUTE -------------------------------------------
  if (keyword === 'compute' || keyword === 'fcompute') {
    return classifyCompute(tokens, keyword, 1);
  }

  // --- DATA [USEWEIGHT w] <method> v = base [BY grp] ----------------
  if (keyword === 'data') {
    return classifyData(tokens);
  }

  // --- statistical creators / COUNT --------------------------------
  if (STAT_CREATORS.has(keyword)) {
    return classifyTargetEqSources(
      tokens,
      'stat-creator',
      keyword,
      'declaration',
      'atomic'
    );
  }
  if (keyword === 'count') {
    // COUNT v = <cond>;  — RHS is a condition, refs are ifKnown
    return classifyTargetEqSources(
      tokens,
      'count',
      keyword,
      'declaration',
      'atomic',
      'ifKnown'
    );
  }

  // --- atomic declarations ---------------------------------------
  if (ATOMIC_DECL.has(keyword)) {
    return classifyAtomicDecl(tokens, keyword);
  }
  if (keyword === 'makesingle') {
    return classifyMakeSingle(tokens);
  }
  if (keyword === 'variables') {
    return classifyVariablesBlock(tokens);
  }
  if (keyword === 'makesingles') {
    return classifyTargetEqSources(
      tokens,
      'makesingles',
      keyword,
      'declaration',
      'atomic'
    );
  }
  if (keyword === 'assocvar') {
    const cls = classifyLeftOfEq(
      tokens,
      'assocvar',
      keyword,
      'declaration',
      'assocvar'
    );
    return cls;
  }
  if (keyword === 'clonevar') {
    return classifyTargetEqSources(
      tokens,
      'clonevar',
      keyword,
      'declaration',
      'unknown'
    );
  }

  // --- multi-response constructs -------------------------------
  if (FAMILY_DECL.has(keyword)) {
    return classifyTargetEqSources(
      tokens,
      'varfamily',
      keyword,
      'declaration',
      'family'
    );
  }
  if (keyword === 'makefamily') {
    return classifyLeftOfEq(
      tokens,
      'makefamily',
      keyword,
      'declaration',
      'family'
    );
  }
  if (keyword === 'alphafamily') {
    return classifyTargetEqSources(
      tokens,
      'alphafamily',
      keyword,
      'declaration',
      'alphafamily'
    );
  }
  if (keyword === 'crossvar' || keyword === 'combinedvar') {
    return classifyTargetEqSources(
      tokens,
      'crossvar',
      keyword,
      'declaration',
      'crossvar'
    );
  }
  if (keyword === 'multifromstring') {
    return classifyMultiFromString(tokens);
  }
  if (GROUP_DECL.has(keyword)) {
    return classifyVarGroup(tokens, keyword);
  }
  if (keyword === 'groups') {
    return classifyGroups(tokens);
  }
  if (keyword === 'makegroup') {
    return classifyLeftOfEq(
      tokens,
      'makegroup',
      keyword,
      'declaration',
      'group'
    );
  }
  if (keyword === 'spssgroup') {
    return classifyTargetEqSources(
      tokens,
      'spssgroup',
      keyword,
      'declaration',
      'spssgroup'
    );
  }
  if (keyword === 'intervals') {
    return classifyIntervals(tokens);
  }
  if (keyword === 'indexvar' || keyword === 'invindexvar') {
    return classifyIndexVar(tokens, keyword);
  }

  // --- annotations / operations on existing variables ----------
  if (ANNOTATION_KW.has(keyword)) {
    return classifyAnnotation(tokens, keyword);
  }

  // --- TABLE / OVERVIEW head & axis ---------------------------
  if (TABLE_KW.has(keyword)) {
    return classifyTable(tokens, keyword);
  }

  // --- reference-only statements (WEIGHTCELLS / FILTER / …) ---
  if (REF_STATEMENT_KW.has(keyword)) {
    return classifyRefStatement(tokens, keyword);
  }

  // --- standalone OVERCODE / OVEROVERCODE (§3.6) --------------
  if (keyword === 'overcode' || keyword === 'overovercode') {
    const cls = base('overcode', keyword);
    cls.usesCurrentVariable = true;
    return cls;
  }

  return base('other', keyword);
}

// Post-pass over `classifyDispatch`: the two cross-cutting facts that are
// easier to read straight off the token stream than to thread through
// every per-shape parser — an `‹a› TO ‹b›` name range anywhere in the
// statement, and OVERCODE/OVEROVERCODE `‹ocname›` virtual codes (§3.6),
// which can appear standalone or embedded in a VALUELABELS body.
export function classifyStatement(
  statementText: string
): ClassifiedStatement | undefined {
  const cls = classifyDispatch(statementText);
  if (!cls) return undefined;
  const tokens = tokenize(statementText);

  for (let i = 1; i < tokens.length - 1; i += 1) {
    if (
      kw(tokens[i]) === 'to' &&
      isWordOrString(tokens[i - 1]) &&
      isWordOrString(tokens[i + 1])
    ) {
      cls.hasNameRange = true;
      break;
    }
  }

  const virtual: NameSpan[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const k = kw(tokens[i]);
    if (k !== 'overcode' && k !== 'overovercode') continue;
    let j = i + 1;
    if (kw(tokens[j]) === 'sum') j += 1;
    const n = tokens[j];
    // a bare word here is the ocname; a number / quoted token is the
    // value list or label text, i.e. an anonymous overcode.
    if (n && n.type === 'word' && !EXPR_OPERATORS.has(n.value.toLowerCase())) {
      virtual.push(spanOf(n));
    }
  }
  if (virtual.length) cls.virtualDefines = virtual;

  return cls;
}
