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
    '\\b(f?compute\\s+(?:add|alpha|ascend|copy|descend|eliminate|init|load|replace|shuffle|sort|swap)?|weightcells\\s+(?:autoalign)?)\\b';

  const pattern =
    word.length > 0
      ? `${defWithOptions}\\s+(?:${getWordDefinition(word)}\\b).*=`
      : `${defWithOptions}(?:\\s+(?:${constVarName})|(?:${constVarListSeq}))\\s*=`;
  return buildRe('computeDefRe', word, pattern);
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

  multiMacros.forEach((value, index) => {
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
