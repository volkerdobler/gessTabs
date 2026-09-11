// Parses #MACRO definitions and #name(...) call sites, and performs the
// same textual parameter substitution the gessTabs compiler does, so the
// editor can show "what this macro call actually expands to" — the
// manual concedes this is otherwise hard enough to need its own compiler
// feature (MACROPROTOCOL).
//
// A macro call is only recognized starting in column 1 of a line (after
// optional leading whitespace) — confirmed directly by a gessTabs
// developer: any other "#name" occurrence is an #EXPAND reference, not a
// macro call (see findExpandDefinitions/findHashNameAt below), and at
// most one macro call can start a line.
//
// Call/parameter tokens are plain gessTabs tokens: quoting is purely a
// grouping device for a token that contains whitespace (so
// `#f( Kinder weiblich 2 )` and `#f( "keine kinder" kinder )` both pass
// exactly the tokens they look like) — the quote characters themselves
// are not part of the substituted value and must not appear in the
// expanded body text, also confirmed directly.
//
// Macro names are matched case-insensitively (consistent with
// src/core/regex.ts's existing macroDefRe, and with the language's general
// case-insensitivity — unlike #define/#ifdef/#expand names, which the
// compiler documents as case-sensitive; see src/core/includeGraph.ts).
//
// #DOMACRO/#DOMACRO2 looping expansion (parseDomacroStatement,
// domacroGeneratedCalls) and the indirect-call idiom where a macro body's
// own call target is itself a parameter — the handbook's
// `#call(&index &namepart &macroname)` expanding to
// `#&macroname(&namepart&index)`, which only becomes a literal call once
// substituted — are both handled (flattenMacroCalls resolves the latter by
// re-scanning a macro's already-substituted body for further calls).
//
// Still out of scope, same spirit as the rest of this codebase's documented
// simplifications: #DOMACRO3/#DOMACRO4 (the parameter list comes from a CSV
// file rather than the source text itself — genuine file I/O, which this
// module deliberately stays free of; see the module doc comment above).

export interface MacroDefinition {
  name: string;
  params: string[];
  body: string[];
  file: string;
  defLine: number;
  endLine: number;
}

export interface MacroCall {
  name: string;
  args: string[];
  raw: string;
  index: number;
}

export interface MacroSourceLine {
  file: string;
  line: number;
  text: string;
}

export interface ParamReference {
  def: MacroDefinition;
  paramName: string;
}

const macroStartRe = /#macro\s+#(\S+?)\s*\(([^)]*)\)/i;
const macroEndRe = /^\s*#(?:endmacro|macroend)\b/i;
const callStartRe = /^\s*#([A-Za-z_][\w.]*)\s*\(/;
const paramRefRe = /&([A-Za-z_]\w*)/g;
const hashNameRe = /#([A-Za-z_]\w*)/g;
// `#expand #name value` — the value (everything after the name) is
// optional: `#expand #name` on its own is a real, if unusual, definition
// that expands to nothing, and must still be recognized rather than
// silently ignored (which looked like "#name isn't an #EXPAND at all").
const expandDefinitionRe = /^\s*#expand\s+#(\S+)(?:[ \t]+(.*))?\s*$/i;

// The preprocessor/macro-engine's own directive keywords — #DEFINE,
// #MACRO, #IFDEF, #ENDMACRO, etc. — syntactically look exactly like a
// macro call ("#name(") or a bare #EXPAND reference ("#name"), but are
// neither: they're the engine's own vocabulary, not a user-defined name.
// Confirmed directly by a gessTabs developer as the reserved set to treat
// this way. Matched case-insensitively — this is about recognizing the
// keyword itself, not a user-defined #define/#ifdef *name* (which the
// compiler does document as case-sensitive; see the module doc comment).
// Defined this early in the file (rather than near stripExpandComments,
// where it more naturally reads) purely so flattenMacroCalls below can
// call it without a lexical use-before-define.
const reservedDirectiveKeywords = new Set([
  'define',
  'domacro',
  'domacro2',
  'domacro3',
  'domacro4',
  'else',
  'end',
  'endmacro',
  'expand',
  'expandinc',
  'expandindomacro',
  'expandintoken',
  'ifdef',
  'ifempty',
  'ifexist',
  'ifndef',
  'ifnempty',
  'ifnexist',
  'ifnexists',
  'ignorecase',
  'macro',
  'macroend',
  'undefine',
]);

export function isReservedDirectiveKeyword(name: string): boolean {
  return reservedDirectiveKeywords.has(name.toLowerCase());
}

// Scans forward from `openIndex` (the position of an already-matched "(")
// for its matching ")", tracking nesting depth and skipping over anything
// inside a '...'/"..." string — gessTabs call arguments are routinely
// quoted filter expressions that contain their own parentheses (e.g.
// `#scorecard("Total" "" "(1 eq 1)")`), which a plain `[^)]*` regex
// cannot handle since it can't tell a string's own ")" apart from the
// call's real closing one.
function findMatchingParen(
  text: string,
  openIndex: number
): number | undefined {
  let depth = 1;
  let quote: string | null = null;
  for (let i = openIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return undefined;
}

// Splits a parameter/argument list on whitespace into plain gessTabs
// tokens. Quoting is purely a grouping device for a token that contains
// whitespace itself (a filter expression like "(1 eq 1)", or a phrase
// like "keine kinder") — the quote characters are consumed as delimiters
// and are NOT part of the resulting token value, matching what the
// compiler actually substitutes into a macro body. An empty quoted token
// ("") is a real, deliberate empty argument and must still be kept —
// `hasToken` (rather than `current.length > 0`) tracks that distinction.
export function parseTokenList(raw: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: string | null = null;
  let hasToken = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (hasToken) {
        tokens.push(current);
        current = '';
        hasToken = false;
      }
    } else {
      current += ch;
      hasToken = true;
    }
  }
  if (hasToken) tokens.push(current);

  return tokens.map((s) => s.replace(/^&/, ''));
}

// A single unclosed #MACRO (missing #ENDMACRO — a real authoring mistake,
// or content this parser doesn't recognize as a valid closer) must not be
// allowed to silently swallow every macro that follows it for the rest of
// the workspace. Two guards against that: a macro can never legitimately
// span multiple files, so crossing a file boundary always ends it; and a
// macro body growing implausibly long (no legitimate gessTabs macro is
// this long) is treated as abandoned rather than tracked forever.
const MAX_MACRO_BODY_LINES = 300;

export function findMacroDefinitions(
  lines: MacroSourceLine[]
): MacroDefinition[] {
  const defs: MacroDefinition[] = [];
  let current: {
    name: string;
    params: string[];
    body: string[];
    file: string;
    defLine: number;
  } | null = null;

  lines.forEach((l) => {
    if (current && current.file !== l.file) {
      current = null;
    }
    if (current && current.body.length >= MAX_MACRO_BODY_LINES) {
      current = null;
    }

    if (!current) {
      const m = l.text.match(macroStartRe);
      if (m) {
        current = {
          name: m[1],
          params: parseTokenList(m[2]),
          body: [],
          file: l.file,
          defLine: l.line,
        };
      }
      return;
    }
    if (macroEndRe.test(l.text)) {
      defs.push({ ...current, endLine: l.line });
      current = null;
      return;
    }
    current.body.push(l.text);
  });

  return defs;
}

export function buildMacroIndex(
  defs: MacroDefinition[]
): Map<string, MacroDefinition> {
  const index = new Map<string, MacroDefinition>();
  defs.forEach((d) => index.set(d.name.toLowerCase(), d));
  return index;
}

// A macro call must start in column 1 of the line (only leading
// whitespace before it is allowed) — anything else shaped like
// "#name(...)" or bare "#name" elsewhere on the line is an #EXPAND
// reference, not a call, and there can be at most one macro call per
// line as a result. Returns an array (0 or 1 elements) for API
// consistency with call sites that .find()/.filter() the result.
// Correctly matches the closing paren even when the arguments contain
// quoted strings with their own parentheses.
export function findMacroCalls(text: string): MacroCall[] {
  const match = text.match(callStartRe);
  if (!match || match.index === undefined) return [];

  const openIndex = match.index + match[0].length - 1;
  const closeIndex = findMatchingParen(text, openIndex);
  if (closeIndex === undefined) return [];

  return [
    {
      name: match[1],
      args: parseTokenList(text.slice(openIndex + 1, closeIndex)),
      raw: text.slice(match.index, closeIndex + 1),
      index: match.index,
    },
  ];
}

// A "1:100"-shaped range token in a #DOMACRO/#DOMACRO2 looplist (manual:
// "Solche Zahlenfolgen kann man ... durch die Form 1 : 100 abkürzen") — the
// space around ":" is optional, both "1:100" and "1 : 100" appear in the
// handbook's own examples.
const rangeTokenRe = /^(\d+)\s*:\s*(\d+)$/;

// Splits a #DOMACRO/#DOMACRO2 looplist into its individual items,
// expanding any "a:b" range inline. parseTokenList already tokenizes on
// whitespace (honouring quoted tokens), so "1 : 100" first comes back as
// three separate tokens ("1", ":", "100") — re-merged here before the
// range check. A malformed range (non-numeric, or b < a) is left as a
// literal token rather than silently dropped, same "don't guess" spirit
// as the rest of this module.
export function expandLoopList(raw: string): string[] {
  const rawTokens = parseTokenList(raw);
  const merged: string[] = [];
  for (let i = 0; i < rawTokens.length; i += 1) {
    if (rawTokens[i] === ':' && merged.length > 0 && i + 1 < rawTokens.length) {
      merged[merged.length - 1] = `${merged[merged.length - 1]}:${
        rawTokens[i + 1]
      }`;
      i += 1;
      continue;
    }
    merged.push(rawTokens[i]);
  }

  const out: string[] = [];
  merged.forEach((tok) => {
    const m = tok.match(rangeTokenRe);
    if (!m) {
      out.push(tok);
      return;
    }
    const from = parseInt(m[1], 10);
    const to = parseInt(m[2], 10);
    if (Number.isNaN(from) || Number.isNaN(to) || to < from) {
      out.push(tok);
      return;
    }
    for (let n = from; n <= to; n += 1) out.push(String(n));
  });
  return out;
}

export interface DomacroStatement {
  // 1 for #DOMACRO( macroname looplist ), 2 for
  // #DOMACRO2( macroname looplist ; constparams ).
  variant: 1 | 2;
  macroName: string;
  loopItems: string[];
  // Only ever non-empty for variant 2 — the parameters after the ";",
  // appended to every generated call alongside its own loop item (manual:
  // "danach können weitere 'konstante' Parameter übergeben werden").
  constParams: string[];
}

// #DOMACRO( <macroname> <looplist> ) / #DOMACRO2( <macroname> <looplist> ;
// <constparams> ) — same column-1 "self-terminating at its own balanced
// ')'" call shape as an ordinary macro call (see the module doc comment),
// so this expects to be given one already-isolated statement's text (e.g.
// a LogicalStatement.text from statements.ts, or a single source line for
// the common single-line shape) rather than scanning for it itself.
const domacroRe = /^\s*#domacro\s*\(\s*(\S+)\s+([\s\S]*?)\s*\)\s*$/i;
const domacro2Re = /^\s*#domacro2\s*\(\s*(\S+)\s+([\s\S]*?)\s*\)\s*$/i;

// Splits "<looplist> ; <constparams>" on the first top-level ";" (a
// #DOMACRO2 argument never legitimately contains one otherwise) — a plain
// scan rather than parseTokenList's tokenizer, since ";" isn't whitespace
// and would otherwise end up glued to a neighbouring token.
function splitOnSemicolon(text: string): [string, string | undefined] {
  let quote: string | null = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ';') return [text.slice(0, i), text.slice(i + 1)];
  }
  return [text, undefined];
}

export function parseDomacroStatement(
  text: string
): DomacroStatement | undefined {
  const m2 = text.match(domacro2Re);
  if (m2) {
    const [loopPart, constPart] = splitOnSemicolon(m2[2]);
    return {
      variant: 2,
      macroName: m2[1].replace(/^#/, ''),
      loopItems: expandLoopList(loopPart),
      constParams: constPart !== undefined ? parseTokenList(constPart) : [],
    };
  }
  const m1 = text.match(domacroRe);
  if (m1) {
    return {
      variant: 1,
      macroName: m1[1].replace(/^#/, ''),
      loopItems: expandLoopList(m1[2]),
      constParams: [],
    };
  }
  return undefined;
}

// The individual macro calls a #DOMACRO/#DOMACRO2 statement expands to —
// one per loop item, each with the constant parameters (if any) appended
// (manual §"Makros": "#call( 1 Var mitOC )" for
// "#domacro2( call 1 : 200 ; Var mitOC )"'s first iteration).
export function domacroGeneratedCalls(
  stmt: DomacroStatement
): { name: string; args: string[] }[] {
  return stmt.loopItems.map((item) => ({
    name: stmt.macroName,
    args: [item, ...stmt.constParams],
  }));
}

function substituteParams(
  line: string,
  params: string[],
  args: string[]
): string {
  const pairs = params
    .map((p, i) => ({ token: `&${p}`, value: args[i] ?? '' }))
    .sort((a, b) => b.token.length - a.token.length);
  return pairs.reduce(
    (acc, { token, value }) => acc.split(token).join(value),
    line
  );
}

// Substitutes a call's positional `args` into each body line's `&param`
// tokens — nothing more. A nested `#other(...)` call inside the body is
// left exactly as written (its own `&param` args do get substituted,
// since that's the same per-line token replacement); it is NOT replaced
// with `#other`'s body. The hover this feeds shows one macro's body, not
// a fully-flattened compile — to see what a nested macro does, hover it.
// (The gessTabs compiler does flatten macros-in-macros; a preview
// doesn't need to, and flattening a nested call that resolves to an
// empty, e.g. #ifdef-gated, body just makes it silently vanish.)
//
// `body` is any line array: a MacroDefinition's already-filtered `body`,
// or a raw, unfiltered source slice (blank lines + comments kept) for the
// "normal" preview style.
export function expandLines(
  body: string[],
  params: string[],
  args: string[]
): string[] {
  return body.map((line) => substituteParams(line, params, args));
}

// Fills `macro`'s parameters with `args` in its (already-filtered) body
// lines. See expandLines for what is and isn't done.
export function expandMacro(macro: MacroDefinition, args: string[]): string[] {
  return expandLines(macro.body, macro.params, args);
}

export interface FlattenedCall {
  macro: MacroDefinition;
  args: string[];
  // Macro names from (but not including) the root call down to this one,
  // lower-cased — used as this function's own cycle guard, and available
  // to callers that want to show the chain.
  path: string[];
}

// Expands `macro` with `args` and re-scans the resulting body for further
// calls to a *known* macro — including one whose name only becomes literal
// after this very substitution, the handbook's indirect-call idiom:
// `#macro #call( &index &namepart &macroname )` / `#&macroname( &namepart&index )`
// `#endmacro` — hovering/counting `#call( 1 F mitOC )` alone never shows
// that it also calls `#mitOC`, because "#mitOC(" never appears literally
// anywhere in the source; it only exists once `&macroname` has been
// substituted. `findMacroCalls` doesn't care that its input came from a
// substitution rather than a real document line, so simply re-running it
// against each expanded body line finds these.
//
// A nested *literal* `#other(...)` call written directly in a macro body
// (unrelated to the indirect idiom above) is resolved the same way — see
// the macro hover's own doc comment for why the hover itself deliberately
// does NOT do this (a preview should show one macro's body, not a fully-
// flattened compile); this function is for callers that need the real
// transitive call set (usage counts, macro-produced-name enumeration), not
// a preview.
//
// `path` guards against a macro (directly or transitively) calling itself;
// `maxDepth` backstops any other runaway chain. Neither situation is
// expected in practice — no handbook example nests this deep — but both
// are cheap to guard against.
export function flattenMacroCalls(
  macro: MacroDefinition,
  args: string[],
  macroIndex: Map<string, MacroDefinition>,
  maxDepth = 10,
  path: string[] = []
): FlattenedCall[] {
  const key = macro.name.toLowerCase();
  if (maxDepth <= 0 || path.includes(key)) return [];
  const nextPath = [...path, key];

  const out: FlattenedCall[] = [];
  expandMacro(macro, args).forEach((line) => {
    findMacroCalls(line).forEach((call) => {
      if (isReservedDirectiveKeyword(call.name)) return;
      const target = macroIndex.get(call.name.toLowerCase());
      if (!target) return;
      out.push({ macro: target, args: call.args, path: nextPath });
      out.push(
        ...flattenMacroCalls(
          target,
          call.args,
          macroIndex,
          maxDepth - 1,
          nextPath
        )
      );
    });
  });
  return out;
}

// Resolves a "&paramname" reference at a given character offset back to
// the enclosing #MACRO definition's matching parameter, for go-to-
// definition/hover inside a macro body. `enclosingDefs` only needs to be
// the macro definitions found in the *same file* as the reference — a
// parameter can only ever be resolved within its own macro's body.
export function findParamReferenceAt(
  lineText: string,
  charIndex: number,
  enclosingDefs: MacroDefinition[],
  cursorLine: number
): ParamReference | undefined {
  paramRefRe.lastIndex = 0;
  let found: RegExpExecArray | undefined;
  let m = paramRefRe.exec(lineText);
  while (m !== null) {
    if (charIndex >= m.index && charIndex <= m.index + m[0].length) {
      found = m;
      break;
    }
    m = paramRefRe.exec(lineText);
  }
  if (!found) return undefined;

  const enclosing = enclosingDefs.find(
    (d) => cursorLine > d.defLine && cursorLine < d.endLine
  );
  if (!enclosing) return undefined;

  // Substitution matches &paramname as a literal substring (so
  // "&varname_OC" expands via the "varname" param, see the handbook's
  // own &varname_OC-style examples) — mirror that here with a
  // longest-prefix match against the identifier actually under the
  // cursor, rather than requiring an exact token match.
  const identifier = found[1].toLowerCase();
  const paramName = enclosing.params
    .filter((p) => identifier.startsWith(p.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0];
  if (!paramName) return undefined;

  return { def: enclosing, paramName };
}

// #EXPAND #name value  — defines a plain text substitution: later, a bare
// "#name" anywhere (never with parens/args — that shape is a macro call,
// see the module doc comment) is replaced by `value`. Names are matched
// case-sensitively, per the language's own preprocessor-name convention
// (unlike macro names — see the module doc comment).
export function findExpandDefinitions(
  lines: MacroSourceLine[]
): Map<string, string> {
  const defs = new Map<string, string>();
  lines.forEach((l) => {
    const m = l.text.match(expandDefinitionRe);
    if (m) defs.set(m[1], (m[2] ?? '').trim());
  });
  return defs;
}

// Where each `#expand #name …` / `#expandintoken &name& …` line sits, for
// a hover's "jump to definition" link. Kept separate from the value maps
// above (findExpandDefinitions / findExpandInTokenDefinitions) so those
// stay plain `name → value` for the recursive resolvers that don't care
// where a definition lives. Last write wins, mirroring the value maps:
// the site returned is the one whose value also won.
export interface ExpandDefinitionSite {
  file: string;
  line: number;
}

function findDefinitionSites(
  lines: MacroSourceLine[],
  re: RegExp
): Map<string, ExpandDefinitionSite> {
  const sites = new Map<string, ExpandDefinitionSite>();
  lines.forEach((l) => {
    const m = l.text.match(re);
    if (m) sites.set(m[1], { file: l.file, line: l.line });
  });
  return sites;
}

export function findExpandDefinitionSites(
  lines: MacroSourceLine[]
): Map<string, ExpandDefinitionSite> {
  return findDefinitionSites(lines, expandDefinitionRe);
}

// A "#(\S+)" right after "#expand" — same shape as expandDefinitionRe's
// own first capture, kept separate so callers can ask "is the cursor on
// *this* token" without needing the rest of expandDefinitionRe's
// end-of-line anchor (a definition line's value can run past the name).
const expandDefinitionNameRe = /^\s*#expand\s+#(\S+)/i;

// True when `charIndex` on `lineText` sits on the "#name" that this very
// "#expand #name value" line itself defines — as opposed to a reference to
// that name elsewhere (including inside the same line's own value, e.g. a
// nested "#other" being substituted in). Hovering the name being declared
// would only echo the value the line already says right there, which is
// never useful — even though the same name may also be (re)defined on
// another line elsewhere in the program.
export function isExpandDefinitionNameAt(
  lineText: string,
  charIndex: number
): boolean {
  const m = lineText.match(expandDefinitionNameRe);
  if (!m) return false;
  const nameStart = m[0].length - m[1].length - 1; // position of the '#'
  const nameEnd = m[0].length;
  return charIndex >= nameStart && charIndex <= nameEnd;
}

// Finds a "#name" token at a given character offset, for resolving an
// #EXPAND reference under the cursor. Does not require/consume any
// following "(...)" — a macro call's own "#name(" is recognized
// separately and takes precedence (see findMacroCalls); by the time a
// caller reaches this, it has already ruled that out for this position.
export function findHashNameAt(
  lineText: string,
  charIndex: number
): string | undefined {
  hashNameRe.lastIndex = 0;
  let m = hashNameRe.exec(lineText);
  while (m !== null) {
    if (charIndex >= m.index && charIndex <= m.index + m[0].length) {
      return m[1];
    }
    m = hashNameRe.exec(lineText);
  }
  return undefined;
}

export interface HashNameOccurrence {
  file: string;
  line: number;
  character: number;
  length: number;
  // True for the "#name" this specific line itself declares — the name
  // right after "#macro"/"#expand"/"#expandinc" — as opposed to a call
  // site or #EXPAND/#EXPANDINC reference elsewhere. Mirrors
  // isExpandDefinitionNameAt/isExpandIncDefinitionNameAt's "declaring vs
  // referencing" distinction, generalised to also cover a "#macro #name("
  // declaration and computed for every line up front instead of one
  // position at a time.
  isDeclaration: boolean;
}

// A "#macro #name(" / "#expand #name …" / "#expandinc #name …"
// declaration's own name — same shape as macroStartRe/expandDefinitionRe's
// first capture group, but matched against a caller-supplied `name`
// (rather than any name) so the declaration's exact character offset can
// be compared against findHashNameOccurrences' own per-match offsets
// below.
function hashDeclarationOffset(
  text: string,
  escapedName: string,
  flags: string
): number {
  const re = new RegExp(
    `^\\s*#(?:macro\\s+|expand(?:inc)?\\s+)(#${escapedName})\\b`,
    flags
  );
  const m = text.match(re);
  return m && m.index !== undefined ? m.index + m[0].indexOf(m[1]) : -1;
}

// Every literal "#name" occurrence across `lines` — a macro call's own
// "#name(", the "#macro #name(" declaration itself, a bare #EXPAND/
// #EXPANDINC reference, and the "#expand"/"#expandinc #name" declaration
// line. Used by "Find All References" (extension.ts's
// GesstabsReferenceProvider): the ordinary variable-reference scan
// (variableModel.ts's collectVariableOccurrences, built on
// findAllWordRangesInLine) only knows the COMPUTE/GROUPS/... variable
// grammar — its word regex has no "#" in it at all, and its own lookbehind
// deliberately *excludes* a hit immediately preceded by "#" (a `.`/`#`/`&`-
// qualified name is a different reference shape) — so a macro/#EXPAND
// "#name" never showed up in "Find All References" before this existed.
//
// `caseSensitive` mirrors the language's own convention: a macro name is
// matched case-insensitively (see the module doc comment, buildMacroIndex),
// an #EXPAND/#EXPANDINC name case-sensitively — callers pick by checking
// whether `name` resolves in a macro index first.
export function findHashNameOccurrences(
  lines: MacroSourceLine[],
  name: string,
  caseSensitive: boolean
): HashNameOccurrence[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const occRe = new RegExp(`#${escaped}(?![\\w.])`, caseSensitive ? 'g' : 'gi');
  const declFlags = caseSensitive ? '' : 'i';
  const out: HashNameOccurrence[] = [];

  lines.forEach((l) => {
    const declStart = hashDeclarationOffset(l.text, escaped, declFlags);
    occRe.lastIndex = 0;
    let m = occRe.exec(l.text);
    while (m !== null) {
      out.push({
        file: l.file,
        line: l.line,
        character: m.index,
        length: m[0].length,
        isDeclaration: m.index === declStart,
      });
      if (m.index === occRe.lastIndex) occRe.lastIndex += 1;
      m = occRe.exec(l.text);
    }
  });

  return out;
}

const expandBlockCommentRe = /\{[^{}]*\}/g;
const expandLineCommentRe = /\/\/.*$/;

// Removes GESStabs comments from an #EXPAND value: `{ … }` block comments
// (not nestable in this language — a single non-nesting delimiter pair,
// see src/core/scope.ts) and a trailing `// …` line comment, then collapses
// the whitespace the removal leaves behind. The value of
// `#expand #y #x { def } ghi` is `#x { def } ghi`, which must read as
// `#x ghi`.
export function stripExpandComments(value: string): string {
  let out = value;
  let prev = '';
  while (out !== prev) {
    prev = out;
    out = out.replace(expandBlockCommentRe, ' ');
  }
  return out.replace(expandLineCommentRe, '').replace(/\s+/g, ' ').trim();
}

// Fully resolves an #EXPAND value: strips comments (see stripExpandComments)
// and recursively substitutes every nested `#name` that is itself an
// #EXPAND (case-sensitive, like the language; a reserved directive keyword
// or an unknown `#name` is left as written). Unlike macros — which
// deliberately are NOT flattened inside one another — #EXPAND is plain
// nested text substitution and the compiler does flatten it. A name
// already being expanded is left as-is if it recurs (cycle guard), and a
// depth limit backstops pathological chains.
export function resolveExpandValue(
  name: string,
  defs: Map<string, string>,
  maxDepth = 25
): string | undefined {
  const root = defs.get(name);
  if (root === undefined) return undefined;

  const expand = (text: string, depth: number, stack: Set<string>): string => {
    const stripped = stripExpandComments(text);
    if (depth <= 0) return stripped;
    // A fresh regex per call — a shared /g regex's lastIndex can't survive
    // the reentrancy of String.replace calling back into expand().
    return stripped.replace(/#([A-Za-z_]\w*)/g, (whole, ref: string) => {
      if (isReservedDirectiveKeyword(ref) || stack.has(ref)) return whole;
      const refValue = defs.get(ref);
      if (refValue === undefined) return whole;
      stack.add(ref);
      const resolved = expand(refValue, depth - 1, stack);
      stack.delete(ref);
      return resolved;
    });
  };

  return expand(root, maxDepth, new Set([name]));
}

// #EXPANDINTOKEN &<search>& <replace> — like #EXPAND, but the reference
// delimiter is "&search&" (leading AND trailing "&", unlike a macro
// parameter's own "&param") and it substitutes inside a larger token
// rather than requiring the whole token to match — the handbook's own
// example: `#EXPANDINTOKEN &land& germany` turns
// `DATAFILE = study&land&.dat;` into `DATAFILE = studygermany.dat;`.
// Names are matched case-sensitively, same convention as #EXPAND (see
// findExpandDefinitions above).
const expandInTokenDefinitionRe =
  /^\s*#expandintoken\s+&(\S+?)&(?:[ \t]+(.*))?\s*$/i;

export function findExpandInTokenDefinitions(
  lines: MacroSourceLine[]
): Map<string, string> {
  const defs = new Map<string, string>();
  lines.forEach((l) => {
    const m = l.text.match(expandInTokenDefinitionRe);
    if (m) defs.set(m[1], stripExpandComments(m[2] ?? ''));
  });
  return defs;
}

export function findExpandInTokenDefinitionSites(
  lines: MacroSourceLine[]
): Map<string, ExpandDefinitionSite> {
  return findDefinitionSites(lines, expandInTokenDefinitionRe);
}

// A "&search&" reference — distinct from a macro parameter's "&param"
// (single leading "&" only) precisely because both delimiters are
// required, so the two shapes never collide.
const tokenRefRe = /&([^&\s]+)&/g;

export function findExpandInTokenRefAt(
  lineText: string,
  charIndex: number
): string | undefined {
  tokenRefRe.lastIndex = 0;
  let m = tokenRefRe.exec(lineText);
  while (m !== null) {
    if (charIndex >= m.index && charIndex <= m.index + m[0].length) {
      return m[1];
    }
    m = tokenRefRe.exec(lineText);
  }
  return undefined;
}

// True when `charIndex` sits on the "&name&" that this very
// "#expandintoken &name& replace" line itself declares — mirrors
// isExpandDefinitionNameAt's reasoning for the plain #EXPAND case.
const expandInTokenDefNameRe = /^\s*#expandintoken\s+(&\S+?&)/i;

export function isExpandInTokenDefinitionNameAt(
  lineText: string,
  charIndex: number
): boolean {
  const m = lineText.match(expandInTokenDefNameRe);
  if (!m) return false;
  const nameStart = m[0].length - m[1].length;
  const nameEnd = m[0].length;
  return charIndex >= nameStart && charIndex <= nameEnd;
}

// Resolves every "&search&" occurrence in `text` via `defs` — a plain,
// single-pass substring replace (no recursive nesting; not documented for
// this directive, unlike #EXPAND). An unknown search name is left as
// written, same as an unresolved #EXPAND reference.
export function resolveExpandInTokens(
  text: string,
  defs: Map<string, string>
): string {
  return text.replace(tokenRefRe, (whole, name: string) =>
    defs.has(name) ? (defs.get(name) as string) : whole
  );
}

// #EXPANDINC #<name> <value> — "at its core this is an #EXPAND", but
// <value> must be a whole number, and every later bare "#name" reference
// increments the stored counter by 1 *before* substituting it (manual:
// "#EXPANDINC #keyvalue 1000" then "#keyvalue" reads 1001 the first time,
// 1002 the second, …) — the literal seed itself is never what a reference
// resolves to.
export interface ExpandIncDefinition {
  name: string;
  start: number;
  file: string;
  line: number;
}

const expandIncDefinitionRe = /^\s*#expandinc\s+#(\S+)\s+(-?\d+)\s*$/i;

export function findExpandIncDefinitions(
  lines: MacroSourceLine[]
): Map<string, ExpandIncDefinition> {
  const defs = new Map<string, ExpandIncDefinition>();
  lines.forEach((l) => {
    const m = l.text.match(expandIncDefinitionRe);
    if (m) {
      defs.set(m[1], {
        name: m[1],
        start: parseInt(m[2], 10),
        file: l.file,
        line: l.line,
      });
    }
  });
  return defs;
}

// True when `charIndex` sits on the "#name" that this very "#expandinc
// #name value" line itself declares — mirrors isExpandDefinitionNameAt's
// reasoning for the plain #EXPAND case.
const expandIncDefNameRe = /^\s*#expandinc\s+#(\S+)/i;

export function isExpandIncDefinitionNameAt(
  lineText: string,
  charIndex: number
): boolean {
  const m = lineText.match(expandIncDefNameRe);
  if (!m) return false;
  const nameStart = m[0].length - m[1].length - 1; // position of the '#'
  const nameEnd = m[0].length;
  return charIndex >= nameStart && charIndex <= nameEnd;
}

const hashNameGlobalRe = /#([A-Za-z_]\w*)/g;

// The value #EXPANDINC's counter would hold at one particular "#name"
// occurrence (`atFile`/`atLine`/`atChar`) — every bare reference to `name`
// in program order (skipping the "#expandinc #name start" line itself)
// increments the count by 1 before it, so the Nth reference reads
// `start + N`, never the literal seed (see the module-level doc comment on
// ExpandIncDefinition). `lines` must be in real program order (e.g. a
// WorkspaceIndex's own `order`) for this to mean anything; a reference that
// isn't found by the time `atLine`/`atChar` is reached returns undefined
// (shouldn't happen for a real cursor position, but guards a caller passing
// mismatched inputs).
export function resolveExpandIncValueAt(
  lines: MacroSourceLine[],
  def: ExpandIncDefinition,
  atFile: string,
  atLine: number,
  atChar: number
): number | undefined {
  let count = 0;
  // .some() rather than .forEach() so the scan can stop the moment the
  // target line has been processed — no need to keep counting references
  // past the position being resolved.
  lines.some((l) => {
    if (l.file === def.file && l.line === def.line) return false;
    const isTarget = l.file === atFile && l.line === atLine;

    hashNameGlobalRe.lastIndex = 0;
    let m = hashNameGlobalRe.exec(l.text);
    while (m !== null) {
      if (m[1] === def.name && (!isTarget || m.index <= atChar)) count += 1;
      m = hashNameGlobalRe.exec(l.text);
    }
    return isTarget;
  });
  return count > 0 ? def.start + count : undefined;
}
