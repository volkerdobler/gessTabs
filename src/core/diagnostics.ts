// F2 diagnostics: each check below mirrors a failure mode the manual
// itself calls out (often with its own compiler-level mitigation flag),
// not a speculative lint rule. Pure, per-document, unit-tested — same
// split as the rest of this codebase's checks. Deliberately scoped to the
// *current document only* for this first pass (like the document symbol/
// semantic-token providers), not the full resolved INCLUDE/#ifdef
// workspace — a real script's variables/#defines can span files, but
// resolving the whole workspace on every keystroke for eight independent
// checks is a bigger design (and performance) undertaking than this pass
// attempts; a duplicate declaration or #define reference across an
// INCLUDE boundary is a known, accepted gap.

import { collectDeclarationTokens } from './semanticTokens';
import { scanBlockDirectives } from './directives';

export type DiagnosticSeverity = 'error' | 'warning';

export interface DiagnosticIssue {
  line: number;
  startChar: number;
  length: number;
  severity: DiagnosticSeverity;
  message: string;
  code: string;
}

export type IsNotInComment = (line: number, char: number) => boolean;

function firstNonWs(lineText: string): number {
  const idx = lineText.search(/\S/);
  return idx === -1 ? 0 : idx;
}

// --- 1. "Empty varlist binds to last-created variable" trap ---------------
// Section 3.1: RECODE/VARTITLE/VARTEXT/VALUELABELS (and their synonyms
// TITLE/TEXT/LABELS) silently apply to "die zuletzt erzeugte Variable"
// when no variable list is given. STRICTVARLIST = YES; exists purely to
// outlaw this. VARTITLE/VARTEXT/VALUELABELS all share the same "keyword
// directly followed by =" shape when the (optional, bracketed in their
// own syntax) varlist is omitted. RECODE is different — it has no
// optional-bracket varlist at all; instead its own "empty" form is a pure
// value list (`RECODE 1 2 3 = 3;`) where a real varlist form always has
// at least one non-numeric variable-name token before the first `=`
// (`RECODE item1 item2 1 = 4;`) — confirmed directly against the
// handbook's own worked examples (line ~6505-6511).
const emptyVarlistPropertyRe =
  /^\s*(vartitle|title|vartext|text|valuelabels|labels)\s*=/i;
const recodeEmptyVarlistRe = /^\s*(recode)\s+[\d\s,:]+=/i;

export function checkEmptyVarlist(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;

    const propMatch = lineText.match(emptyVarlistPropertyRe);
    if (propMatch && propMatch.index !== undefined) {
      issues.push({
        line: i,
        startChar: propMatch.index,
        length: propMatch[1].length,
        severity: 'warning',
        message: `${propMatch[1]} without an explicit variable name applies to the last-created variable, not necessarily the one you mean — a highly error-prone GESStabs convention (see STRICTVARLIST = YES; to forbid it). Name the variable explicitly.`,
        code: 'empty-varlist',
      });
      return;
    }

    const recodeMatch = lineText.match(recodeEmptyVarlistRe);
    if (recodeMatch && recodeMatch.index !== undefined) {
      issues.push({
        line: i,
        startChar: recodeMatch.index,
        length: recodeMatch[1].length,
        severity: 'warning',
        message:
          'RECODE without an explicit variable name applies to the last-created variable, not necessarily the one you mean — a highly error-prone GESStabs convention (see STRICTVARLIST = YES; to forbid it). Name the variable explicitly.',
        code: 'empty-varlist',
      });
    }
  });

  return issues;
}

// F5's quick fix for the empty-varlist diagnostic: "insert
// <lastVariableName> explicitly". Reuses the same collectDeclarationTokens
// checkDuplicateDeclarations is built on to find the actual variable
// gessTabs would silently apply the statement to — i.e. the fix inserts
// exactly what the compiler would otherwise have guessed, made explicit.
// Scans strictly *before* `beforeLine` (never the diagnostic's own line),
// matching the no-forward-reference/backward-scan shape used everywhere
// else in this codebase (symbolIndex.ts's findDefinitionLine).
export function findLastDeclaredVariableBefore(
  lines: string[],
  beforeLine: number,
  isNotInComment: IsNotInComment
): string | undefined {
  let lastName: string | undefined;
  const limit = Math.min(beforeLine, lines.length);
  for (let i = 0; i < limit; i += 1) {
    const tokens = collectDeclarationTokens(lines[i], i, isNotInComment);
    if (tokens.length > 0) {
      const lastToken = tokens[tokens.length - 1];
      lastName = lines[i].substr(lastToken.startChar, lastToken.length);
    }
  }
  return lastName;
}

// --- 2. Unmatched #MACRO/#ENDMACRO and #IFDEF-family/#END blocks ---------
// Directive recognition (single-line `#ifnempty … #else … #end`, and
// directives sitting in a trailing `// …` comment / string) lives in
// src/core/directives.ts, shared with foldingRanges.ts / formatter.ts.
export function checkUnmatchedBlocks(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const conditionalStack: number[] = [];
  let macroStart: number | undefined;

  const issueAt = (
    line: number,
    severity: DiagnosticSeverity,
    message: string,
    code: string
  ): void => {
    const start = firstNonWs(lines[line]);
    issues.push({
      line,
      startChar: start,
      length: Math.max(lines[line].trim().length, 1),
      severity,
      message,
      code,
    });
  };

  lines.forEach((text, i) => {
    scanBlockDirectives(text, (col) => isNotInComment(i, col)).forEach((d) => {
      switch (d.kind) {
        case 'conditional-start':
          conditionalStack.push(i);
          break;
        case 'conditional-end':
          if (conditionalStack.length === 0) {
            issueAt(
              i,
              'error',
              '#END with no matching #IFDEF/#IFNDEF/#IFEMPTY/#IFNEMPTY/#IFEXIST/#IFNEXIST before it.',
              'unmatched-end'
            );
          } else {
            conditionalStack.pop();
          }
          break;
        case 'macro-start':
          // A #MACRO body can't legally nest another #MACRO; a second
          // start while one is open is left for the macro engine to
          // reject rather than double-counted here.
          if (macroStart === undefined) macroStart = i;
          break;
        case 'macro-end':
          if (macroStart === undefined) {
            issueAt(
              i,
              'error',
              '#ENDMACRO/#MACROEND with no matching #MACRO before it.',
              'unmatched-endmacro'
            );
          } else {
            macroStart = undefined;
          }
          break;
        case 'conditional-else':
          break;
        default:
          break;
      }
    });
  });

  conditionalStack.forEach((line) =>
    issueAt(
      line,
      'error',
      'Unclosed conditional block — no matching #END found before the end of the file.',
      'unclosed-conditional'
    )
  );
  if (macroStart !== undefined) {
    issueAt(
      macroStart,
      'error',
      'Unclosed #MACRO block — no matching #ENDMACRO/#MACROEND found before the end of the file.',
      'unclosed-macro'
    );
  }

  return issues;
}

// --- 3. Duplicate variable declaration ------------------------------------
// Mirrors compiler error 8: "variable declared twice". Reuses
// src/core/semanticTokens.ts's collectDeclarationTokens — the VARIABLE-family/
// COMPUTE-family/VARIABLES statements that actually create a new name, as
// opposed to a VARTITLE/VARTEXT/VALUELABELS statement that only
// *annotates* an existing one (using the full "variable" token set from
// collectSemanticTokens here would misreport an ordinary re-mention as a
// duplicate declaration).
export function checkDuplicateDeclarations(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const firstSeenAt = new Map<string, number>();

  lines.forEach((lineText, i) => {
    collectDeclarationTokens(lineText, i, isNotInComment).forEach((token) => {
      const name = lineText.substr(token.startChar, token.length);
      const key = name.toLowerCase();
      const firstLine = firstSeenAt.get(key);
      if (firstLine === undefined) {
        firstSeenAt.set(key, i);
        return;
      }
      issues.push({
        line: i,
        startChar: token.startChar,
        length: token.length,
        severity: 'warning',
        message: `"${name}" was already declared at line ${firstLine + 1}.`,
        code: 'duplicate-declaration',
      });
    });
  });

  return issues;
}

// --- 4. RECODE bound sanity checks ----------------------------------------
// CHECKRECODES = YES; exists specifically to catch inverted lower/upper
// bounds. Overlapping ranges are *intentionally* legal (first-match-wins
// by default, RECODELASTWINS to flip it) — this only flags a
// structurally inverted <lower>:<upper> pair, never overlap. A RECODE
// statement can span multiple lines (varlist on one line, value groups
// separated by "/" on the next ones), so this tracks "currently inside a
// RECODE statement" from the line starting with RECODE through to its
// terminating ";".
const recodeStartRe = /^\s*recode\b/i;
const rangeRe = /(\d+)\s*:\s*(\d+)/g;

export function checkRecodeBounds(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let inRecode = false;

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (!inRecode && recodeStartRe.test(lineText)) inRecode = true;
    if (!inRecode) return;

    rangeRe.lastIndex = 0;
    let m = rangeRe.exec(lineText);
    while (m !== null) {
      const lower = Number(m[1]);
      const upper = Number(m[2]);
      if (lower > upper && isNotInComment(i, m.index)) {
        issues.push({
          line: i,
          startChar: m.index,
          length: m[0].length,
          severity: 'warning',
          message: `RECODE range ${m[1]}:${m[2]} has a lower bound greater than its upper bound — did you mean ${m[2]}:${m[1]}?`,
          code: 'recode-inverted-bounds',
        });
      }
      m = rangeRe.exec(lineText);
    }

    if (lineText.includes(';')) inRecode = false;
  });

  return issues;
}

// --- 5. CARD/CARDS ordering -----------------------------------------------
// Mirrors compiler error 25: "CARD-value must not be greater than
// CARDS-value". Both are global settings (default CARDS=1/CARD=1, per the
// handbook) that stay in effect until reassigned, same shape as the
// existing CELLELEMENTS/FRAMEELEMENTS effective-value hover.
const cardsAssignmentRe = /^\s*cards\s*=\s*(\d+)\s*;/i;
const cardAssignmentRe = /^\s*card\s*=\s*(\d+)\s*;/i;

export function checkCardOrdering(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let currentCards = 1;

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;

    const cardsMatch = lineText.match(cardsAssignmentRe);
    if (cardsMatch) {
      currentCards = Number(cardsMatch[1]);
      return;
    }

    const cardMatch = lineText.match(cardAssignmentRe);
    if (cardMatch) {
      const cardValue = Number(cardMatch[1]);
      if (cardValue > currentCards) {
        const start = firstNonWs(lineText);
        issues.push({
          line: i,
          startChar: start,
          length: lineText.trim().length,
          severity: 'error',
          message: `CARD = ${cardValue} exceeds the current CARDS = ${currentCards} — CARD must not be greater than CARDS.`,
          code: 'card-exceeds-cards',
        });
      }
    }
  });

  return issues;
}

// --- 6. WEIGHTCELLS target percentages summing to 100% -------------------
// A cheap, purely-arithmetic static check on the statement's own
// operands. The MISSING clause has separate semantics (it doesn't count
// toward the 100%) and is excluded before summing. Same multi-line
// statement tracking as the RECODE check above.
const weightcellsStartRe = /^\s*weightcells\b/i;
const missingClauseRe = /missing\s*:\s*\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?\s*%/gi;
const percentValueRe = /:\s*(\d+(?:\.\d+)?)\s*%/g;

export function checkWeightcellsPercentages(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let startLine: number | undefined;
  let buffer = '';

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (startLine === undefined) {
      if (!weightcellsStartRe.test(lineText)) return;
      startLine = i;
    }
    buffer += ` ${lineText}`;
    if (!lineText.includes(';')) return;

    const withoutMissing = buffer.replace(missingClauseRe, '');
    const values: number[] = [];
    percentValueRe.lastIndex = 0;
    let m = percentValueRe.exec(withoutMissing);
    while (m !== null) {
      values.push(Number(m[1]));
      m = percentValueRe.exec(withoutMissing);
    }
    const total = values.reduce((a, b) => a + b, 0);
    if (values.length > 0 && Math.abs(total - 100) > 0.01) {
      issues.push({
        line: startLine,
        startChar: firstNonWs(lines[startLine]),
        length: 'WEIGHTCELLS'.length,
        severity: 'warning',
        message: `WEIGHTCELLS target percentages sum to ${total}%, not 100%.`,
        code: 'weightcells-not-100',
      });
    }
    startLine = undefined;
    buffer = '';
  });

  return issues;
}

// --- 7. Mutually-exclusive table/cell-option diagnostics ------------------
// Scoped down from the full TODO item to the pairs that are objectively,
// syntactically checkable without workspace-wide semantic classification
// (e.g. "is this a multi-response variable" needs tracking every MULTIQ
// declaration across the resolved workspace — a bigger scope than a
// per-document pass): CELLSET's own fixed allow-list of element types
// (handbook line ~11453-11460, an exhaustive enumeration) and the
// INVERTOUT/UPDATEINVERT combination (GESStabs_InvertierteDateien.md:195,
// "nicht erlaubt"). The HARMONICMEAN/GEOMETRICMEAN/MEDIAN/COLUMNPERCENT100
// combinations from the TODO item are NOT implemented here for that
// reason.
const cellsetStartRe = /^\s*cellset\b/i;
const cellsetAllowedElements = new Set([
  'absolute',
  'physicalrecords',
  'columnpercent',
  'rowpercent',
  'physcolpercent',
  'physrowpercent',
  'mean',
  'physmean',
  'meancut',
  'median',
  'pcntl1',
  'pcntl2',
  'pcntl3',
  'pcntl4',
  'sum',
  'stddev',
  'variance',
]);
const elementCallRe = /([A-Za-z_]\w*)\s*\(/g;

export function checkCellsetElements(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let startLine: number | undefined;
  let buffer = '';

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (startLine === undefined) {
      if (!cellsetStartRe.test(lineText)) return;
      startLine = i;
    }
    buffer += ` ${lineText}`;
    if (!lineText.includes(';')) return;

    const eqIndex = buffer.indexOf('=');
    const body = eqIndex === -1 ? '' : buffer.slice(eqIndex + 1);
    elementCallRe.lastIndex = 0;
    let m = elementCallRe.exec(body);
    const seen = new Set<string>();
    while (m !== null) {
      const name = m[1].toLowerCase();
      if (!cellsetAllowedElements.has(name) && !seen.has(name)) {
        seen.add(name);
        issues.push({
          line: startLine,
          startChar: firstNonWs(lines[startLine]),
          length: 'CELLSET'.length,
          severity: 'warning',
          message: `"${m[1]}" is not one of the CELLELEMENTS allowed inside CELLSET (ABSOLUTE, PHYSICALRECORDS, COLUMNPERCENT, ROWPERCENT, PHYSCOLPERCENT, PHYSROWPERCENT, MEAN, PHYSMEAN, MEANCUT, MEDIAN, PCNTL1-4, SUM, STDDEV, VARIANCE).`,
          code: 'cellset-invalid-element',
        });
      }
      m = elementCallRe.exec(body);
    }
    startLine = undefined;
    buffer = '';
  });

  return issues;
}

const invertoutRe = /^\s*invertout\s*=/i;
const updateinvertRe = /^\s*updateinvert\s*;/i;

export function checkInvertoutUpdateinvert(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const invertoutLines: number[] = [];
  const updateinvertLines: number[] = [];

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (invertoutRe.test(lineText)) invertoutLines.push(i);
    if (updateinvertRe.test(lineText)) updateinvertLines.push(i);
  });

  if (invertoutLines.length === 0 || updateinvertLines.length === 0) return [];

  return updateinvertLines.map((line) => ({
    line,
    startChar: firstNonWs(lines[line]),
    length: 'UPDATEINVERT'.length,
    severity: 'error' as const,
    message: `UPDATEINVERT is not allowed together with INVERTOUT in the same pass (INVERTOUT at line ${
      invertoutLines[0] + 1
    }).`,
    code: 'invertout-updateinvert',
  }));
}

// --- 8. #define/#ifdef case-sensitivity gotcha ----------------------------
// Unlike the rest of the case-insensitive language, preprocessor names
// are case-sensitive by default (#define xyz; #ifdef XYZ is false)
// unless #IGNORECASE = YES; is set. Flags an #ifdef/#ifndef reference
// whose name doesn't exactly match any #define seen so far in this
// document but *does* match case-insensitively — almost certainly the
// bug, not an intentionally-undefined flag. Suppressed entirely once
// #IGNORECASE = YES; is in effect, since case differences are then
// intentional. Document-scoped (see this module's own header comment) —
// a #define from an INCLUDEd file isn't seen here.
const defineRe = /^\s*#define\s+(\S+)/i;
const ignoreCaseRe = /^\s*#ignorecase\s*=\s*(yes|no)/i;
const ifdefRe = /^\s*#ifn?def\b\s*(.*)$/i;

function parseDefineNameList(raw: string): string[] {
  const trimmed = raw.trim();
  const bracketed = trimmed.match(/^\[\s*(.+?)\s*\]/);
  const body = bracketed ? bracketed[1] : trimmed.split(/\s+/)[0] || '';
  return body.split(/\s+/).filter((s) => s.length > 0);
}

export function checkDefineCaseMismatch(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const defined = new Set<string>();
  let ignoreCase = false;

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;

    const ignoreCaseMatch = lineText.match(ignoreCaseRe);
    if (ignoreCaseMatch) {
      ignoreCase = /^yes$/i.test(ignoreCaseMatch[1]);
      return;
    }

    const defineMatch = lineText.match(defineRe);
    if (defineMatch) {
      defined.add(defineMatch[1]);
      return;
    }

    if (ignoreCase) return;

    const ifdefMatch = lineText.match(ifdefRe);
    if (!ifdefMatch) return;

    parseDefineNameList(ifdefMatch[1]).forEach((name) => {
      if (defined.has(name)) return;
      const caseInsensitiveHit = Array.from(defined).some(
        (d) => d.toLowerCase() === name.toLowerCase()
      );
      if (!caseInsensitiveHit) return;
      const idx = lineText.indexOf(name);
      issues.push({
        line: i,
        startChar: idx === -1 ? 0 : idx,
        length: name.length,
        severity: 'warning',
        message: `"${name}" doesn't exactly match any #DEFINE seen so far (names are case-sensitive unless #IGNORECASE = YES; is set) — likely a typo'd case rather than an intentionally-undefined flag.`,
        code: 'define-case-mismatch',
      });
    });
  });

  return issues;
}

export function computeDiagnostics(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  return [
    ...checkEmptyVarlist(lines, isNotInComment),
    ...checkUnmatchedBlocks(lines, isNotInComment),
    ...checkDuplicateDeclarations(lines, isNotInComment),
    ...checkRecodeBounds(lines, isNotInComment),
    ...checkCardOrdering(lines, isNotInComment),
    ...checkWeightcellsPercentages(lines, isNotInComment),
    ...checkCellsetElements(lines, isNotInComment),
    ...checkInvertoutUpdateinvert(lines, isNotInComment),
    ...checkDefineCaseMismatch(lines, isNotInComment),
  ];
}
