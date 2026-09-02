// RegExp factories extracted from extension.ts

const constTokenVarName: string = '(?:\\b[a-zßäöü][a-zßäöü\\w\\.]*\\b)';
const constStringVarName: string = `(?:"[^"]+")|(?:'[^']+')`;
const constVarName: string = `(?:${constTokenVarName}|${constStringVarName})`;
const constVarListSeq: string = `(${constVarName}(?:\\s+(?:${constVarName}))*)`;
const constVarListTo: string = `(?:${constVarListSeq}\\s*to\\s*${constVarListSeq})`;
const constVarList: string = `(?:${constVarListTo}|${constVarListSeq})`;

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

export {
  constTokenVarName,
  constStringVarName,
  constVarName,
  constVarList,
  constVarListSeq,
};
export function wordDefRe(word: string): RegExp {
  return buildRe('wordDefRe', word, getWordDefinition(word));
}

// A bare occurrence of `word` used as a token anywhere on a line — the
// generic "reference" case that the definition-/table-specific factories
// above don't cover (conditions, `IF … THEN <var> = …` assignments,
// expression operands, argument lists, …). Deliberately excludes:
//   - a longer identifier that merely contains `word` (`f24` in `f240`)
//   - a `.`-qualified member (`region.f24`)
//   - a `#macro` / `#expand` call (`#f24`) — handled by expandRe
//   - a `&param` reference inside a macro body (`&f24`)
export function usageRe(word: string): RegExp {
  const escaped =
    word.length > 0
      ? word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      : constTokenVarName;
  const pattern = `(?<![\\w.#&])(${escaped})(?![\\w.])`;
  return buildRe('usageRe', word, pattern);
}

export function singleVarDefRe(word: string): RegExp {
  const singleVarConst =
    '(alphafamily|assocvar|bcdvar|bitgroup|clonevar|combinedvar|count|dichoq|familyvar|groups|groupvar|indexvar|init|invindexvar|makefamily|makegroup|makesingle|max|mean|min|multiq|simplevar|singleq|spssgroup|static|stddev|sum|varfamily|vargroup|variable|variance)';

  const pattern =
    word.length > 0
      ? `\\b${singleVarConst}\\s*(${getWordDefinition(word)})\\s*=`
      : `\\b${singleVarConst}\\s+(${constVarName})\\s*=`;
  return buildRe('singleVarDefRe', word, pattern);
}

export function multiVarDefRe(word: string): RegExp {
  const multiVarConst = '(variables)';

  const pattern =
    word.length > 0
      ? `\\b${multiVarConst}\\s+(${getWordDefinition(word)}\\s*).*=`
      : `\\b${multiVarConst}\\s+(${constVarList})\\s*=`;
  return buildRe('multiVarDefRe', word, pattern);
}

export function multiVarRe(word: string): RegExp {
  const multiVarConst =
    '(copylabels|excludevalues|includevalues|labels|text|title|uselabels|valuelabels|vartext|vartitle)';

  const pattern =
    word.length > 0
      ? `\\b${multiVarConst}\\s+(?:${getWordDefinition(word)}\\b).*=`
      : `\\b${multiVarConst}\\s+(${constVarList})\\s*=`;
  return buildRe('multiVarRe', word, pattern);
}

export function computeDefRe(word: string): RegExp {
  const defWithOptions =
    '\\b(f?compute\\s+(?:add|alpha|ascend|copy|descend|eliminate|init|load|replace|shuffle|sort|swap)?)\\b';

  const pattern =
    word.length > 0
      ? `${defWithOptions}\\s+(?:${getWordDefinition(word)}\\b).*=`
      : `${defWithOptions}(?:\\s+(?:${constVarName})|(?:${constVarListSeq}))\\s*=`;
  return buildRe('computeDefRe', word, pattern);
}

// WEIGHTCELLS <varname> = { <code> : <target>% }*n; — unlike COMPUTE this
// does NOT create a variable: <varname> is an existing variable whose
// marginal distribution the weighting targets (handbook "WEIGHTCELLS":
// `WEIGHTCELLS [ AUTOALIGN ] <varname> = …`, always a variable declared/
// computed earlier). So it's kept out of computeDefRe (whose matches every
// caller treats as a *declaration* — go-to-definition target, semantic
// "this line declares a name", F2's duplicate-declaration check) and given
// its own factory, wired only into the *usage* matchers.
export function weightcellsRe(word: string): RegExp {
  // `WEIGHTCELLS [ AUTOALIGN ] <varname> = …` — AUTOALIGN and its trailing
  // whitespace are one optional group, so the bare (no-AUTOALIGN) form
  // matches too (unlike computeDefRe, whose two chained `\s+` deliberately
  // require an option keyword).
  const verb = '\\b(weightcells)\\s+(?:autoalign\\s+)?';

  const pattern =
    word.length > 0
      ? `${verb}(?:${getWordDefinition(word)}\\b).*=`
      : `${verb}(${constVarList})\\s*=`;
  return buildRe('weightcellsRe', word, pattern);
}

export function macroDefRe(word: string): RegExp {
  const tempWord: string =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const pattern = `(?:(#macro)\\s+(#${tempWord})\\s*\\()`;
  return buildRe('macroDefRe', word, pattern);
}

export function macroOwnDefRe(word: string): RegExp {
  const multiMacros = ['makemulti', 'makemulti2'];

  const tempWord: string = word.length > 0 ? getWordDefinition(word) : '\\0';

  let regExpStr = '';

  multiMacros.forEach((value) => {
    regExpStr += `(?:#${value}\\s*\\(\\s*(${tempWord}))|`;
  });

  regExpStr += `(?:(#makeskalavar)\\s*\\(\\s*(${tempWord.replace(
    '_skala',
    ''
  )}))|`;
  regExpStr += `(?:(#skalatab)\\s*\\(\\s*(${tempWord.replace('_t_b', '')}))|`;

  if (regExpStr.endsWith('|')) {
    regExpStr = regExpStr.substring(0, regExpStr.length - 1);
  }
  if (regExpStr.length === 0) {
    regExpStr = '\\0';
  }

  return buildRe('macroOwnDefRe', word, regExpStr);
}

export function expandDefRe(word: string): RegExp {
  const tempWord =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const pattern = `(?:(#expand)\\s+(#${tempWord}))`;
  return buildRe('expandDefRe', word, pattern);
}

export function expandRe(word: string): RegExp {
  const tempWord =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const pattern = `(#${tempWord})\\b`;
  return buildRe('expandRe', word, pattern);
}

export function tableHeadRe(word: string): RegExp {
  const tableVarConst = '(table)';

  const pattern =
    word.length > 0
      ? `\\b${tableVarConst}\\b[^=]*=\\s*(?:${getWordDefinition(
          word
        )}.*\\bby\\b)`
      : `\\b${tableVarConst}\\b[^=]*=\\s*(?:${constVarList})\\s*\\bby\\b`;
  return buildRe('tableHeadRe', word, pattern);
}

export function tableAxisRe(word: string): RegExp {
  const tableVarConst = '(table)';

  const pattern =
    word.length > 0
      ? `\\b${tableVarConst}\\b[^=]*=\\s*(?:.*\\s*\\bby\\b\\s*${getWordDefinition(
          word
        )})`
      : `\\b${tableVarConst}\\b[^=]*=\\s*.+\\s*\\bby\\b\\s*(?:${constVarList})`;
  return buildRe('tableAxisRe', word, pattern);
}
