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
// src/regex.ts's existing macroDefRe, and with the language's general
// case-insensitivity — unlike #define/#ifdef/#expand names, which the
// compiler documents as case-sensitive; see src/includeGraph.ts).
//
// Deliberately out of scope, same spirit as the rest of this codebase's
// documented simplifications:
// - #DOMACRO/#DOMACRO2/#DOMACRO3/#DOMACRO4 looping expansion (repeats a
//   call over a range/list/CSV file) — only plain #name(args) direct
//   calls are handled.
// - A macro whose own name is itself a parameter (e.g. the handbook's
//   `#call(&index &namepart &macroname)` expanding to
//   `#&macroname(&namepart&index)`) — the callee name doesn't appear
//   literally in the source, so it can't be resolved without a full
//   expansion engine tracking argument bindings across calls. Calls like
//   this are simply not recognized as calls to a *known* macro.

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
const expandDefinitionRe = /^\s*#expand\s+#(\S+)\s+(.*)$/i;

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
function parseTokenList(raw: string): string[] {
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

// Expands `macro` called with `args` into its substituted body lines,
// recursively expanding any nested calls to other *known* macros within
// that body (matching real compiler behavior — macros can call macros).
export function expandMacro(
  macro: MacroDefinition,
  args: string[],
  allMacros: Map<string, MacroDefinition>,
  maxDepth = 20
): string[] {
  // eslint-disable-next-line no-use-before-define -- mutual recursion with expandNestedCalls
  return expandMacroAtDepth(macro, args, allMacros, 0, maxDepth);
}

function expandMacroAtDepth(
  macro: MacroDefinition,
  args: string[],
  allMacros: Map<string, MacroDefinition>,
  depth: number,
  maxDepth: number
): string[] {
  const substituted = macro.body.map((line) =>
    substituteParams(line, macro.params, args)
  );
  if (depth >= maxDepth) return substituted;

  return substituted.map((line) =>
    // eslint-disable-next-line no-use-before-define -- mutual recursion with expandMacroAtDepth
    expandNestedCalls(line, allMacros, depth, maxDepth)
  );
}

function expandNestedCalls(
  line: string,
  allMacros: Map<string, MacroDefinition>,
  depth: number,
  maxDepth: number
): string {
  const calls = findMacroCalls(line);
  return calls.reduce((result, call) => {
    const target = allMacros.get(call.name.toLowerCase());
    if (!target) return result;
    const expandedLines = expandMacroAtDepth(
      target,
      call.args,
      allMacros,
      depth + 1,
      maxDepth
    );
    return result.split(call.raw).join(expandedLines.join(' '));
  }, line);
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
    if (m) defs.set(m[1], m[2].trim());
  });
  return defs;
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
