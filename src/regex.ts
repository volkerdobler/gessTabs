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

export {
  constTokenVarName,
  constStringVarName,
  constVarName,
  constVarList,
  constVarListSeq,
};
export function wordDefRe(word: string): RegExp {
  const key = `wordDefRe|${word}`;
  return getCachedRegex(key, () => new RegExp(getWordDefinition(word), 'i'));
}

export function singleVarDefRe(word: string): RegExp {
  const singleVarConst =
    '(alphafamily|assocvar|bcdvar|bitgroup|clonevar|combinedvar|count|dichoq|familyvar|groups|groupvar|indexvar|init|invindexvar|makefamily|makegroup|makesingle|max|mean|min|multiq|simplevar|singleq|spssgroup|static|stddev|sum|varfamily|vargroup|variable|variance)';

  let retVal: string = '';
  if (word.length > 0) {
    retVal = `\\b${singleVarConst}\\s*(${getWordDefinition(word)})\\s*=`;
  } else {
    retVal = `\\b${singleVarConst}\\s+(${constVarName})\\s*=`;
  }
  const key = `singleVarDefRe|${word}|${retVal}`;
  return getCachedRegex(key, () => new RegExp(retVal, 'i'));
}

export function multiVarDefRe(word: string): RegExp {
  const multiVarConst = '(variables)';

  let retVal: string = '';
  if (word.length > 0) {
    retVal = `\\b${multiVarConst}\\s+(${getWordDefinition(word)}\\s*).*=`;
  } else {
    retVal = `\\b${multiVarConst}\\s+(${constVarList})\\s*=`;
  }
  const key = `multiVarDefRe|${word}|${retVal}`;
  return getCachedRegex(key, () => new RegExp(retVal, 'i'));
}

export function multiVarRe(word: string): RegExp {
  const multiVarConst =
    '(copylabels|excludevalues|includevalues|labels|text|title|uselabels|valuelabels|vartext|vartitle)';

  let retVal: string = '';
  if (word.length > 0) {
    retVal = `\\b${multiVarConst}\\s+(?:${getWordDefinition(word)}\\b).*=`;
  } else {
    retVal = `\\b${multiVarConst}\\s+(${constVarList})\\s*=`;
  }
  const key = `multiVarRe|${word}|${retVal}`;
  return getCachedRegex(key, () => new RegExp(retVal, 'i'));
}

export function computeDefRe(word: string): RegExp {
  const defWithOptions =
    '\\b(f?compute\\s+(?:add|alpha|ascend|copy|descend|eliminate|init|load|replace|shuffle|sort|swap)?|weightcells\\s+(?:autoalign)?)\\b';

  if (word.length > 0) {
    const ret = `${defWithOptions}\\s+(?:${getWordDefinition(word)}\\b).*=`;
    const key = `computeDefRe|${word}|${ret}`;
    return getCachedRegex(key, () => new RegExp(ret, 'i'));
  }
  const ret = `${defWithOptions}(?:\\s+(?:${constVarName})|(?:${constVarListSeq}))\\s*=`;
  const key = `computeDefRe|empty|${ret}`;
  return getCachedRegex(key, () => new RegExp(ret, 'i'));
}

export function macroDefRe(word: string): RegExp {
  const tempWord: string =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const key = `macroDefRe|${word}|${tempWord}`;
  return getCachedRegex(
    key,
    () => new RegExp(`(?:(#macro)\\s+(#${tempWord})\\s*\\()`, 'i')
  );
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

  const key = `macroOwnDefRe|${word}|${regExpStr}`;
  return getCachedRegex(key, () => new RegExp(regExpStr, 'i'));
}

export function expandDefRe(word: string): RegExp {
  const tempWord =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const key = `expandDefRe|${word}|${tempWord}`;
  return getCachedRegex(
    key,
    () => new RegExp(`(?:(#expand)\\s+(#${tempWord}))`, 'i')
  );
}

export function expandRe(word: string): RegExp {
  const tempWord =
    word.length > 0 ? getWordDefinition(word) : constTokenVarName;
  const key = `expandRe|${word}|${tempWord}`;
  return getCachedRegex(key, () => new RegExp(`(#${tempWord})\\b`, 'i'));
}

export function tableHeadRe(word: string): RegExp {
  const tableVarConst = '(table)';

  let retVal: string = '';
  if (word.length > 0) {
    retVal =
      `\\b${tableVarConst}\\b[^=]*=\\s*` +
      `(?:${getWordDefinition(word)}.*\\bby\\b)`;
  } else {
    retVal = `\\b${tableVarConst}\\b[^=]*=\\s*(?:${constVarList})\\s*\\bby\\b`;
  }
  const key = `tableHeadRe|${word}|${retVal}`;
  return getCachedRegex(key, () => new RegExp(retVal, 'i'));
}

export function tableAxisRe(word: string): RegExp {
  const tableVarConst = '(table)';

  let retVal: string = '';
  if (word.length > 0) {
    retVal =
      `\\b${tableVarConst}\\b[^=]*=\\s*` +
      `(?:.*\\s*\\bby\\b\\s*${getWordDefinition(word)})`;
  } else {
    retVal =
      `\\b${tableVarConst}\\b[^=]*=\\s*.+\\s*\\bby\\b\\s*` +
      `(?:${constVarList})`;
  }
  const key = `tableAxisRe|${word}|${retVal}`;
  return getCachedRegex(key, () => new RegExp(retVal, 'i'));
}
