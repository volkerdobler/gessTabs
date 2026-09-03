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
// TITLE/TEXT/LABELS), plus COPYTEXT/COPYTITLE/COPYLABELS, silently apply
// to "die zuletzt erzeugte Variable" when no variable list is given.
// STRICTVARLIST = YES; exists purely to outlaw this. All of those share
// the same "keyword directly followed by =" shape when the (optional,
// bracketed in their own syntax) varlist is omitted. RECODE is different — it has no
// optional-bracket varlist at all; instead its own "empty" form is a pure
// value list (`RECODE 1 2 3 = 3;`) where a real varlist form always has
// at least one non-numeric variable-name token before the first `=`
// (`RECODE item1 item2 1 = 4;`) — confirmed directly against the
// handbook's own worked examples (line ~6505-6511).
// COPYTEXT/COPYTITLE/COPYLABELS share the same trap: with the (optional)
// <varlist> omitted — `COPYTEXT = <source>;` — the copy binds to the
// last-created variable (keywordData's COPYTITLE entry: "in some cases the
// last defined variable"; the manual notes STRICTVARLIST covers "die
// dazugehörigen COPY-Statements" too). Their RHS is always a single source
// variable rather than a literal, but for this positional check only the
// "keyword directly followed by =" shape matters.
const emptyVarlistPropertyRe =
  /^\s*(vartitle|title|vartext|text|valuelabels|labels|copytext|copytitle|copylabels)\s*=/i;
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

// F5's *other* fix for the empty-varlist trap — a source action (not a
// diagnostic-attached quick fix; see GesstabsStrictVarlistCodeActionProvider
// in src/providers/diagnosticsProvider.ts) that forbids the pattern
// outright by adding STRICTVARLIST = YES; near the top of the file. This
// just answers "is that setting already on", so the action can stay a
// one-shot suggestion — offered only while the document both has the risky
// pattern (checkEmptyVarlist) and doesn't already opt out of it.
const strictVarlistEnabledRe = /^\s*strictvarlist\s*=\s*yes\s*;/i;

export function hasStrictVarlistEnabled(
  lines: string[],
  isNotInComment: IsNotInComment
): boolean {
  return lines.some(
    (lineText, i) =>
      lineText.length > 0 &&
      isNotInComment(i, firstNonWs(lineText)) &&
      strictVarlistEnabledRe.test(lineText)
  );
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
  // A #MACRO body *can* legally contain another #MACRO — the inner one is
  // formed while the outer expands, and this nests recursively (Makros
  // page: "Man kann ein Macro auch innerhalb eines Macros definieren …
  // funktioniert rekursiv"). So track opens on a stack, like #IFDEF.
  const macroStack: number[] = [];

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
          macroStack.push(i);
          break;
        case 'macro-end':
          if (macroStack.length === 0) {
            issueAt(
              i,
              'error',
              '#ENDMACRO/#MACROEND with no matching #MACRO before it.',
              'unmatched-endmacro'
            );
          } else {
            macroStack.pop();
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
  macroStack.forEach((line) =>
    issueAt(
      line,
      'error',
      'Unclosed #MACRO block — no matching #ENDMACRO/#MACROEND found before the end of the file.',
      'unclosed-macro'
    )
  );

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

// --- 9. Unbalanced parentheses ---------------------------------------------
// A forgotten ")" — e.g. on a #MACRO call — otherwise silently shifts
// everything that follows into the wrong argument/expression instead of
// failing where the mistake actually is. Parens may nest freely; this only
// checks that every "(" outside a comment is eventually closed (and every
// ")" has something open to close it), never that the nesting matches any
// particular grammar. Like the rest of this module it doesn't distinguish
// string-literal content from real code — a stray "(" inside a quoted
// title is rare enough, and paired with its own ")" often enough, that
// this is an accepted gap rather than a worthwhile complication.
export function checkParenBalance(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const openStack: { line: number; char: number }[] = [];

  lines.forEach((lineText, i) => {
    for (let c = 0; c < lineText.length; c += 1) {
      const ch = lineText[c];
      if (ch !== '(' && ch !== ')') continue;
      if (!isNotInComment(i, c)) continue;

      if (ch === '(') {
        openStack.push({ line: i, char: c });
      } else if (openStack.length === 0) {
        issues.push({
          line: i,
          startChar: c,
          length: 1,
          severity: 'error',
          message: '")" has no matching "(" before it.',
          code: 'unmatched-close-paren',
        });
      } else {
        openStack.pop();
      }
    }
  });

  openStack.forEach(({ line, char }) =>
    issues.push({
      line,
      startChar: char,
      length: 1,
      severity: 'error',
      message: '"(" is never closed.',
      code: 'unmatched-open-paren',
    })
  );

  return issues;
}

// --- 10. Nested block comments ---------------------------------------------
// GESStabs block comments are "{ … }" (see language-configuration.json and
// scope.ts's blockCommentDelimiter) and — like scope.ts's own scanner —
// gessTabs itself does not support nesting them: once inside a block
// comment, the very next "}" ends it, no matter how many "{" appeared in
// between. Commenting out a script block that already contains a block
// comment (e.g. via the editor's built-in Toggle Block Comment, which just
// wraps the selection in "{ … }") silently truncates the intended comment
// at that inner "}", leaving the rest of the block active again — exactly
// the trap this flags.
//
// Braces are exclusively comment syntax in this language (they're not a
// general expression/argument delimiter the way "(" is), so any "{" found
// while already inside an opened one is never legitimate code — it's
// always either a second, doomed-to-truncate comment attempt or (rarer)
// stray text that happened to contain a brace. Either way it's worth
// flagging.
//
// Where the *real* (truncated) end is is computed directly — the first
// "}" after the outer start, full stop. Where the outer group's own end
// is depends on what the author actually intended, which isn't
// recoverable from the broken text alone; nesting is matched depth-first
// (like ordinary brackets) as a best-effort reconstruction of that intent,
// good enough for the common single-level case this bug actually produces
// and used only to size the "convert to line comments" quick fix, never
// for the diagnostic's own truncation message.
export interface BlockCommentGroup {
  outerStart: { line: number; char: number };
  outerEnd: { line: number; char: number };
  nestedStarts: { line: number; char: number }[];
}

export function scanBlockCommentGroups(lines: string[]): BlockCommentGroup[] {
  const groups: BlockCommentGroup[] = [];
  let depth = 0;
  let outerStart: { line: number; char: number } | undefined;
  let nestedStarts: { line: number; char: number }[] = [];
  let inString = false;
  let stringChar = '';

  lines.forEach((lineText, i) => {
    let c = 0;
    while (c < lineText.length) {
      const ch = lineText[c];

      if (depth === 0) {
        if (inString) {
          if (ch === stringChar) inString = false;
        } else if (ch === '/' && lineText[c + 1] === '/') {
          break; // rest of the line is a line comment
        } else if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
        } else if (ch === '{') {
          outerStart = { line: i, char: c };
          nestedStarts = [];
          depth = 1;
        }
        c += 1;
        continue;
      }

      // Already inside an opened "{" — from here on gessTabs treats
      // everything up to the next "}" as raw comment text, so (matching
      // that) neither strings nor "//" are recognized any more either.
      if (ch === '{') {
        nestedStarts.push({ line: i, char: c });
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0 && outerStart) {
          groups.push({
            outerStart,
            outerEnd: { line: i, char: c },
            nestedStarts,
          });
          outerStart = undefined;
          nestedStarts = [];
        }
      }
      c += 1;
    }
  });

  return groups;
}

function findRawClosingBrace(
  lines: string[],
  fromLine: number,
  fromChar: number
): { line: number; char: number } | undefined {
  for (let i = fromLine; i < lines.length; i += 1) {
    const idx = lines[i].indexOf('}', i === fromLine ? fromChar : 0);
    if (idx !== -1) return { line: i, char: idx };
  }
  return undefined;
}

export function checkNestedBlockComments(lines: string[]): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];

  scanBlockCommentGroups(lines).forEach((group) => {
    if (group.nestedStarts.length === 0) return;
    const realEnd = findRawClosingBrace(
      lines,
      group.outerStart.line,
      group.outerStart.char + 1
    );
    const realEndDescription = realEnd
      ? `line ${realEnd.line + 1}`
      : 'somewhere unexpected';

    group.nestedStarts.forEach((nested) => {
      issues.push({
        line: nested.line,
        startChar: nested.char,
        length: 1,
        severity: 'warning',
        message: `Block comments ("{ … }") can't be nested in GESStabs — this comment actually ends at ${realEndDescription} (its first "}"), reactivating everything after that. Comment out each line individually with "//" instead.`,
        code: 'nested-block-comment',
      });
    });
  });

  return issues;
}

// F5's quick fix for the nested-block-comment diagnostic — re-scans to find
// which group a diagnostic's position belongs to, since the diagnostic
// itself only carries a single point, not the whole (best-effort) outer
// range. Shared by GesstabsNestedBlockCommentCodeActionProvider in
// src/providers/diagnosticsProvider.ts.
export function findEnclosingBlockCommentGroup(
  lines: string[],
  line: number,
  char: number
): BlockCommentGroup | undefined {
  return scanBlockCommentGroups(lines).find((group) => {
    const afterStart =
      line > group.outerStart.line ||
      (line === group.outerStart.line && char >= group.outerStart.char);
    const beforeEnd =
      line < group.outerEnd.line ||
      (line === group.outerEnd.line && char <= group.outerEnd.char);
    return afterStart && beforeEnd;
  });
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
    ...checkParenBalance(lines, isNotInComment),
    ...checkNestedBlockComments(lines),
  ];
}
