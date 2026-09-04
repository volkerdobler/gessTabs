// RegExp factories extracted from extension.ts.
//
// This file used to hold a dozen statement-shape-specific factories
// (singleVarDefRe/multiVarDefRe/multiVarRe/computeDefRe/weightcellsRe/
// wordDefRe/usageRe/macroOwnDefRe/tableHeadRe/tableAxisRe) from the
// pre-variable-model era, when "what defines/references a name" was
// spread across per-consumer regexes. All of that is now the model
// (variableStatements.ts + variableModel.ts, see docs/variable-model-
// design.md) — those factories had no callers left anywhere outside their
// own tests and were deleted 2026-09-05 (TODO.md P1's "dead regex exports"
// item). What's left is genuinely still live: `constVarName` (a couple of
// call sites in extension.ts) and the `#MACRO`/`#EXPAND` definition
// matchers (semanticTokens.ts, extension.ts) — macro/#expand definition
// *highlighting* was never migrated onto the model and doesn't need to be,
// it's a much simpler, self-contained shape than the variable grammar.

const constTokenVarName: string = '(?:\\b[a-zßäöü][a-zßäöü\\w\\.]*\\b)';
const constStringVarName: string = `(?:"[^"]+")|(?:'[^']+')`;
const constVarName: string = `(?:${constTokenVarName}|${constStringVarName})`;

function getWordDefinition(word: string): string {
  if (word.split(/\s+/).length > 1) {
    return `(?:.*(?:"${word}")|(?:'${word}'))`;
  }
  return `(?:.*(?:\\b${word}\\b)|(?:"${word}")|(?:'${word}'))`;
}

// Simple cache local to regex module
const regexCache: Map<string, RegExp> = new Map();
function getCachedRegex(key: string, builder: () => RegExp): RegExp {
  const cached = regexCache.get(key);
  if (cached) return cached;
  const r = builder();
  regexCache.set(key, r);
  return r;
}

// Shared cache-key-building + getCachedRegex boilerplate used by every
// factory below: builds a RegExp from `pattern` (case-insensitive), keyed
// by factory name + the input word + the built pattern itself.
function buildRe(name: string, word: string, pattern: string): RegExp {
  const key = `${name}|${word}|${pattern}`;
  return getCachedRegex(key, () => new RegExp(pattern, 'i'));
}

export { constVarName };

export function macroDefRe(word: string): RegExp {
  const tempWord: string =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const pattern = `(?:(#macro)\\s+(#${tempWord})\\s*\\()`;
  return buildRe('macroDefRe', word, pattern);
}

export function expandDefRe(word: string): RegExp {
  const tempWord =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const pattern = `(?:(#expand)\\s+(#${tempWord}))`;
  return buildRe('expandDefRe', word, pattern);
}
