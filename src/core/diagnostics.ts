// F2 diagnostics: each check below mirrors a failure mode the manual
// itself calls out (often with its own compiler-level mitigation flag),
// not a speculative lint rule. Pure, per-document, unit-tested — same
// split as the rest of this codebase's checks. Deliberately scoped to the
// *current document only* — a real script's variables/#defines can span
// files, but resolving the whole workspace on every keystroke for every
// check here is a bigger design (and performance) undertaking than this
// pass attempts. Duplicate-declaration got its cross-INCLUDE fix anyway —
// see `checkDuplicateDeclarations` in modelDiagnostics.ts, which reuses
// the whole-workspace `VariableModel` already rebuilt per keystroke for
// P1.6's undefined-variable/system-variable-redeclaration checks, so the
// performance question was already answered there. A `#define`-case
// mismatch across an INCLUDE boundary remains a known, accepted gap.

import { scanBlockDirectives } from './directives';
import { ResolvedLine } from './includeGraph';
import { toLogicalStatements, locateInStatement } from './statements';
import { classifyStatement } from './variableStatements';
import {
  isTableOrOverviewStatement,
  extractElementsValue,
  extractInlineCellElements,
  findEffectiveElements,
} from './tableElements';

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

// Turns this document's lines into the classifier's input shape
// (src/core/statements.ts / src/core/variableStatements.ts): blank out
// comment-scoped characters per the caller's own IsNotInComment (so a `;`
// or a keyword inside a comment can't be mistaken for real code — same
// trick src/core/includeGraph.ts's blankComments plays, just driven by a
// generic callback instead of requiring a real Scope instance, matching
// this module's own existing IsNotInComment convention), then join into
// logical statements. Document-scoped, like every check in this file —
// no workspace/INCLUDE resolution (see the file header).
function toClassifierOrder(
  lines: string[],
  isNotInComment: IsNotInComment
): ResolvedLine[] {
  return lines.map((text, i) => {
    let blanked = '';
    for (let c = 0; c < text.length; c += 1) {
      blanked += isNotInComment(i, c) ? text[c] : ' ';
    }
    return { file: 'document', line: i, text: blanked };
  });
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
// <lastVariableName> explicitly" — finds "die aktuelle Variable" (Compute
// page) gessTabs would silently apply the statement to, i.e. the fix
// inserts exactly what the compiler would otherwise have guessed, made
// explicit. Tracks it the same way src/core/variableModel.ts's
// buildVariableModel does (classified.bindsCurrentVariable), rather than
// the old regex-based collectDeclarationTokens' narrower keyword set —
// which, notably, never matched COMPUTE without a sub-keyword (regex.ts's
// documented computeDefRe quirk), so a script's single most common
// creator used to defeat this quick fix entirely. Scans strictly *before*
// `beforeLine` (never the diagnostic's own line), matching the
// no-forward-reference/backward-scan shape used everywhere else in this
// codebase (symbolIndex.ts's findDefinitionLine).
export function findLastDeclaredVariableBefore(
  lines: string[],
  beforeLine: number,
  isNotInComment: IsNotInComment
): string | undefined {
  const limit = Math.min(beforeLine, lines.length);
  const statements = toLogicalStatements(
    toClassifierOrder(lines.slice(0, limit), isNotInComment)
  );
  let current: string | undefined;
  statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (cls?.bindsCurrentVariable && cls.defines.length > 0) {
      current = cls.defines[cls.defines.length - 1].raw;
    }
  });
  return current;
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

// --- 2. Unmatched #MACRO/#ENDMACRO, #STARTEXPORT/#ENDEXPORT and ----------
//        #IFDEF-family/#END directives, plus the runtime IFBLOCK/
//        WHILEBLOCK/SETFILTER block keywords.
// Directive recognition (single-line `#ifnempty … #else … #end`, and
// directives sitting in a trailing `// …` comment / string) lives in
// src/core/directives.ts, shared with foldingRanges.ts / formatter.ts.
//
// The runtime block keywords (real statements, not `#`-preprocessor
// directives) are recognized line-anchored here instead, like every other
// multi-keyword check in this file — deliberately NOT run through
// toLogicalStatements/classifyStatement even though
// `ClassifiedStatement.block` already tags them (design doc P1.1):
// IFBLOCK/WHILEBLOCK/ELSEBLOCK have no terminating `;` in real gessTabs
// syntax (manual: `IFBLOCK <bedingung> THEN` / `WHILEBLOCK <bedingung>
// DO` / bare `ELSEBLOCK`, confirmed by every worked example), and
// toLogicalStatements finds statement boundaries purely by `;` — so
// feeding these through it would silently merge an open with everything
// up to the *next unrelated statement's* `;`, hiding any nested block
// inside that merged blob. ENDBLOCK/SETFILTER/ENDFILTER do end with `;`,
// but are kept on the same simple line-anchored footing for consistency
// (and because SETFILTER/ENDFILTER's own optional `<filtername>` isn't
// part of `ClassifiedStatement` anyway — it's not a variable).
const ifOrWhileBlockRe = /^\s*(?:ifblock|whileblock)\b/i;
const elseblockRe = /^\s*elseblock\b/i;
const endblockRe = /^\s*endblock\b/i;
// `SETFILTER [<filtername>] [TEXT "…"] = <cond>;` — the name is optional,
// so a bare `SETFILTER TEXT "…" = …;`/`SETFILTER = …;` must not mistake
// TEXT (or `=`) for the name.
const setfilterStartRe = /^\s*setfilter\b/i;
const setfilterNameRe = /^\s*setfilter\s+(?!text\b)([A-Za-z_]\w*)/i;
const endfilterStartRe = /^\s*endfilter\b/i;
const endfilterNameRe = /^\s*endfilter\s+([A-Za-z_]\w*)/i;

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
  const exportStack: number[] = [];

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
        case 'export-start':
          exportStack.push(i);
          break;
        case 'export-end':
          if (exportStack.length === 0) {
            issueAt(
              i,
              'error',
              '#ENDEXPORT with no matching #STARTEXPORT before it.',
              'unmatched-endexport'
            );
          } else {
            exportStack.pop();
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
  exportStack.forEach((line) =>
    issueAt(
      line,
      'error',
      'Unclosed #STARTEXPORT block — no matching #ENDEXPORT found before the end of the file.',
      'unclosed-export'
    )
  );

  // --- runtime blocks: IFBLOCK/WHILEBLOCK…ENDBLOCK, ELSEBLOCK, -----------
  //     SETFILTER…ENDFILTER (named or not)
  //
  // Line-anchored, like every other multi-keyword check in this file
  // (checkRecodeBounds, checkCellsetElements, …) — NOT run through
  // toLogicalStatements/classifyStatement, even though
  // ClassifiedStatement.block already tags these (design doc P1.1):
  // IFBLOCK/WHILEBLOCK/ELSEBLOCK have no terminating `;` in real gessTabs
  // syntax (manual: `IFBLOCK <bedingung> THEN` / `WHILEBLOCK <bedingung>
  // DO` / bare `ELSEBLOCK`, confirmed by every worked example) —
  // toLogicalStatements finds statement boundaries purely by `;`, so
  // feeding these through it would silently merge an IFBLOCK/WHILEBLOCK
  // open with everything up to the *next unrelated statement's* `;`,
  // hiding any nested block inside that merged blob from ever being seen.
  const blockStack: number[] = [];
  const filterStack: { line: number; name?: string }[] = [];

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;

    if (ifOrWhileBlockRe.test(lineText)) {
      blockStack.push(i);
      return;
    }
    if (elseblockRe.test(lineText)) {
      if (blockStack.length === 0) {
        issueAt(
          i,
          'error',
          'ELSEBLOCK with no matching IFBLOCK/WHILEBLOCK before it.',
          'unmatched-elseblock'
        );
      }
      return;
    }
    if (endblockRe.test(lineText)) {
      if (blockStack.length === 0) {
        issueAt(
          i,
          'error',
          'ENDBLOCK with no matching IFBLOCK/WHILEBLOCK before it.',
          'unmatched-endblock'
        );
      } else {
        blockStack.pop();
      }
      return;
    }
    const setfilterMatch = lineText.match(setfilterNameRe);
    if (setfilterStartRe.test(lineText)) {
      filterStack.push({ line: i, name: setfilterMatch?.[1] });
      return;
    }
    const endfilterMatch = lineText.match(endfilterNameRe);
    if (endfilterStartRe.test(lineText)) {
      const name = endfilterMatch?.[1];
      if (filterStack.length === 0) {
        issueAt(
          i,
          'error',
          'ENDFILTER with no matching SETFILTER before it.',
          'unmatched-endfilter'
        );
        return;
      }
      if (!name) {
        filterStack.pop();
        return;
      }
      const matchIdx = [...filterStack]
        .reverse()
        .findIndex((f) => f.name === name);
      if (matchIdx === -1) {
        issueAt(
          i,
          'error',
          `ENDFILTER ${name} has no matching SETFILTER ${name} on the stack.`,
          'unmatched-endfilter'
        );
        return;
      }
      // Pop every frame down to and including the matching one.
      filterStack.length = filterStack.length - 1 - matchIdx;
    }
  });

  blockStack.forEach((line) =>
    issueAt(
      line,
      'error',
      'Unclosed IFBLOCK/WHILEBLOCK — no matching ENDBLOCK found before the end of the file.',
      'unclosed-ifblock'
    )
  );
  filterStack.forEach(({ line, name }) =>
    issueAt(
      line,
      'error',
      `Unclosed SETFILTER${
        name ? ` ${name}` : ''
      } — no matching ENDFILTER found before the end of the file.`,
      'unclosed-setfilter'
    )
  );

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
// Scoped down from the full TODO item to what's objectively, syntactically
// checkable without workspace-wide semantic classification: CELLSET's own
// fixed allow-list of element types (handbook line ~11453-11460, an
// exhaustive enumeration), the INVERTOUT/UPDATEINVERT combination
// (GESStabs_InvertierteDateien.md:195, "nicht erlaubt"), and — since 2026-
// 09-05 — the two crisp, closed HARMONICMEAN/GEOMETRICMEAN and MEDIAN
// incompatibility rules from `Zellenelemente _ Besonderheiten.md`.
// COLUMNPERCENT100's own "not suitable for …" caveat is deliberately left
// out — `keywordData.ts`'s own entry names four different, non-error
// conditions (multi-response vars, OVERCODEs, suppressed MISSING VALUES,
// "selectively built variables"), not a single hard rule this check could
// implement without guessing.
const cellsetStartRe = /^\s*cellset\b/i;
// The single-value, non-composite CELLELEMENT names — CELLSET's own
// "erlaubt sind" enumeration and CALCULATECOLUMN's "nur ein elementares
// CELLELEMENT" condition (see checkCalculateColumnSingleCellElement below)
// independently land on the same set.
export const elementaryCellElements = new Set([
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
      if (!elementaryCellElements.has(name) && !seen.has(name)) {
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
// particular grammar.
//
// Unlike every other check in this module, this one is given `isNormalScope`
// (code only), not `isNotInComment` (code + string content) — a "(" inside a
// quoted title/#MACRO-argument string is common (found 2026-09-05:
// `#barchart(... 'POWERCHARTOPTION "SeriesColorMark=*(net*;..."' ...)`, and
// `valuelabels "s3" = 1 "Dies ist ( ein Text";`) and never has to balance
// with anything, so counting it would misreport a real script as broken.
export function checkParenBalance(
  lines: string[],
  isNormalScope: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const openStack: { line: number; char: number }[] = [];

  lines.forEach((lineText, i) => {
    for (let c = 0; c < lineText.length; c += 1) {
      const ch = lineText[c];
      if (ch !== '(' && ch !== ')') continue;
      if (!isNormalScope(i, c)) continue;

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

// --- 11. Malformed statements the classifier already detected -------------
// variableStatements.ts's classifier already records a good number of
// clearly-broken statement shapes via `ClassifiedStatement.malformed?:
// string` (`‹keyword›: no '='`, `‹keyword›: no target name`, for
// SINGLEQ/MAKESINGLE/VARIABLES/MULTIFROMSTRING/VARFAMILY/GROUPS/INTERVALS/
// VARGROUP/INDEXVAR/the statistical creators/DATA — see collectNames'
// callers) — but until now nothing read that field, so e.g. `groups
// sysmiss;` (missing its `=` and body entirely) compiled with no squiggle
// at all, even though it's a real compiler error. Document-scoped like the
// rest of this file: just toLogicalStatements + classifyStatement per
// statement, no workspace model needed.
export function checkMalformedStatements(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const statements = toLogicalStatements(
    toClassifierOrder(lines, isNotInComment)
  );

  statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls || !cls.malformed) return;
    const loc = locateInStatement(stmt, 0);
    const keywordMatch = stmt.text.match(/^\s*(\S+)/);
    const length = keywordMatch ? keywordMatch[1].length : 1;
    issues.push({
      line: loc.line.line,
      startChar: loc.character,
      length,
      severity: 'error',
      message: `This statement is malformed (${cls.malformed}) and would fail to compile.`,
      code: 'malformed-statement',
    });
  });

  return issues;
}

// --- 12. Cell-content diagnostics ------------------------------------------

// `MEDIAN` is "nur mit Häufigkeiten und den Perzentilen kompatibel" —
// Häufigkeiten is exactly the "Zellenelemente > Zählergebnisse" manual
// page's category (ABSOLUTE/DELTAEXPECT/ESS/EXPECT/PHYSICALRECORDS/
// PROJECTION), plus the percentiles (PCNTL1-4) already tracked above.
const medianCompatibleElements = new Set([
  'median',
  'absolute',
  'physicalrecords',
  'deltaexpect',
  'ess',
  'expect',
  'projection',
  'pcntl1',
  'pcntl2',
  'pcntl3',
  'pcntl4',
]);

function checkElementListIncompatibilities(
  elements: string[],
  line: number,
  lines: string[],
  issues: DiagnosticIssue[]
): void {
  const lower = elements.map((e) => e.toLowerCase());
  const upper = () => lower.map((e) => e.toUpperCase()).join(' ');
  if (
    lower.length > 1 &&
    (lower.includes('harmonicmean') || lower.includes('geometricmean'))
  ) {
    issues.push({
      line,
      startChar: firstNonWs(lines[line]),
      length: 'CELLELEMENTS'.length,
      severity: 'error',
      message: `HARMONICMEAN/GEOMETRICMEAN cannot be combined with any other cell content — found "${upper()}".`,
      code: 'cellelement-incompatible-harmonicgeometric',
    });
  }
  if (lower.includes('median')) {
    const incompatible = lower.filter((e) => !medianCompatibleElements.has(e));
    if (incompatible.length > 0) {
      issues.push({
        line,
        startChar: firstNonWs(lines[line]),
        length: 'CELLELEMENTS'.length,
        severity: 'error',
        message: `MEDIAN is only compatible with frequencies (ABSOLUTE/PHYSICALRECORDS/…) and percentiles (PCNTL1-4), not other sum/mean/dispersion measures — found "${incompatible
          .map((e) => e.toUpperCase())
          .join(' ')}" alongside it.`,
        code: 'cellelement-incompatible-median',
      });
    }
  }
}

// Scans every CELLELEMENTS-list occurrence, both forms: the standalone
// `CELLELEMENTS = <list>;` assignment (may wrap lines) and the inline
// per-table `CELLELEMENTS(…)` taboption clause (single-line, via
// tableElements.ts's `extractInlineCellElements`). Manual:
// `Zellenelemente _ Besonderheiten.md`.
const cellElementsAssignStartRe = /^\s*cellelements\s*=/i;

export function checkCellElementIncompatibilities(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let startLine: number | undefined;
  let buffer = '';

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;

    const inline = extractInlineCellElements(lineText);
    if (inline) {
      checkElementListIncompatibilities(inline, i, lines, issues);
    }

    if (startLine === undefined) {
      if (!cellElementsAssignStartRe.test(lineText)) return;
      startLine = i;
    }
    buffer += ` ${lineText}`;
    if (!lineText.includes(';')) return;

    const value = extractElementsValue(buffer, 'cellelements');
    const list = value
      .split(/[\s,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);
    checkElementListIncompatibilities(list, startLine, lines, issues);
    startLine = undefined;
    buffer = '';
  });

  return issues;
}

// The manual's "Bedingungen zur Anwendung von CalculateColumn" documents
// this condition only for CALCULATECOLUMN, not COLUMNSUMMARY — scoped
// accordingly. Resolves "the preceding table"'s effective CELLELEMENTS:
// its own inline `CELLELEMENTS(…)` clause if present, else the standalone
// global default (tableElements.ts's `findEffectiveElements`) — no
// CELLELEMENTS in effect at all means the documented default, a single
// implicit ABSOLUTE, so that case is never flagged.
const calculateColumnStartRe = /^\s*calculatecolumn\b/i;

export function checkCalculateColumnSingleCellElement(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const order = toClassifierOrder(lines, isNotInComment);

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (!calculateColumnStartRe.test(lineText)) return;

    let tableLine: number | undefined;
    for (let j = i - 1; j >= 0; j -= 1) {
      if (!isNotInComment(j, firstNonWs(lines[j]))) continue;
      if (isTableOrOverviewStatement(lines[j])) {
        tableLine = j;
        break;
      }
    }
    if (tableLine === undefined) return;

    let elements = extractInlineCellElements(lines[tableLine]);
    if (!elements) {
      const { cellElements } = findEffectiveElements(
        order,
        'document',
        tableLine
      );
      if (cellElements) {
        const value = extractElementsValue(cellElements.text, 'cellelements');
        elements = value
          .split(/[\s,]+/)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length > 0);
      }
    }
    if (!elements) return;

    const elementary = elements.filter((e) => elementaryCellElements.has(e));
    const nonElementary = elements.filter(
      (e) => !elementaryCellElements.has(e)
    );
    if (elementary.length !== 1 || nonElementary.length > 0) {
      issues.push({
        line: i,
        startChar: firstNonWs(lineText),
        length: 'CALCULATECOLUMN'.length,
        severity: 'error',
        message: `CALCULATECOLUMN requires its preceding table to carry exactly one elementary CELLELEMENT (e.g. COLUMNPERCENT or ABSOLUTE, not both, and no composite like ABSCOLPERCENT) — found "${elements
          .map((e) => e.toUpperCase())
          .join(' ')}".`,
        code: 'calculatecolumn-multiple-cellelements',
      });
    }
  });

  return issues;
}

// `VALUELABELS <VarList> = [ ADD ] …` — ADD is one-variable-only
// (`keywordData.ts`'s own syntax entry), Syntaxerror 528: "VALUELABELS
// ... ADD works only with one single variable" (Anhang > Liste aller
// Syntaxfehlermeldungen).
export function checkValuelabelsAddSingleVar(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const statements = toLogicalStatements(
    toClassifierOrder(lines, isNotInComment)
  );

  statements.forEach((stmt) => {
    const cls = classifyStatement(stmt.text);
    if (!cls) return;
    if (cls.keyword !== 'valuelabels' && cls.keyword !== 'labels') return;
    if (cls.references.length <= 1) return;
    if (!/=\s*add\b/i.test(stmt.text)) return;
    const loc = locateInStatement(stmt, 0);
    issues.push({
      line: loc.line.line,
      startChar: loc.character,
      length: cls.keyword.length,
      severity: 'error',
      message:
        'Syntaxerror 528: VALUELABELS ... ADD works only with one single variable — split this into one VALUELABELS ... = ADD statement per variable.',
      code: 'valuelabels-add-multi-var',
    });
  });

  return issues;
}

// OVERCODE's own value-range span sanity — same shape as
// checkRecodeBounds above (reuses its `rangeRe`), tracking "inside an
// OVERCODE statement" instead of RECODE.
const overcodeStartRe = /^\s*overcode\b/i;

export function checkOvercodeRangeSpan(
  lines: string[],
  isNotInComment: IsNotInComment
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  let inOvercode = false;

  lines.forEach((lineText, i) => {
    if (lineText.length === 0) return;
    if (!isNotInComment(i, firstNonWs(lineText))) return;
    if (!inOvercode && overcodeStartRe.test(lineText)) inOvercode = true;
    if (!inOvercode) return;

    rangeRe.lastIndex = 0;
    let m = rangeRe.exec(lineText);
    while (m !== null) {
      if (isNotInComment(i, m.index)) {
        const span = Number(m[2]) - Number(m[1]);
        if (span > 100000) {
          issues.push({
            line: i,
            startChar: m.index,
            length: m[0].length,
            severity: 'error',
            message: `OVERCODE range ${m[1]}:${m[2]} spans ${span} values, over the 100,000 limit.`,
            code: 'overcode-range-too-large',
          });
        } else if (span > 5000) {
          issues.push({
            line: i,
            startChar: m.index,
            length: m[0].length,
            severity: 'warning',
            message: `OVERCODE range ${m[1]}:${m[2]} spans ${span} values — over 5,000 is unusual, double-check this is intentional.`,
            code: 'overcode-range-large',
          });
        }
      }
      m = rangeRe.exec(lineText);
    }

    if (lineText.includes(';')) inOvercode = false;
  });

  return issues;
}

export function computeDiagnostics(
  lines: string[],
  isNotInComment: IsNotInComment,
  // code only, excluding string content too — see checkParenBalance's own
  // comment for why it alone needs this instead of isNotInComment.
  isNormalScope: IsNotInComment = isNotInComment
): DiagnosticIssue[] {
  return [
    ...checkEmptyVarlist(lines, isNotInComment),
    ...checkUnmatchedBlocks(lines, isNotInComment),
    ...checkRecodeBounds(lines, isNotInComment),
    ...checkCardOrdering(lines, isNotInComment),
    ...checkWeightcellsPercentages(lines, isNotInComment),
    ...checkCellsetElements(lines, isNotInComment),
    ...checkInvertoutUpdateinvert(lines, isNotInComment),
    ...checkDefineCaseMismatch(lines, isNotInComment),
    ...checkParenBalance(lines, isNormalScope),
    ...checkNestedBlockComments(lines),
    ...checkMalformedStatements(lines, isNotInComment),
    ...checkCellElementIncompatibilities(lines, isNotInComment),
    ...checkCalculateColumnSingleCellElement(lines, isNotInComment),
    ...checkValuelabelsAddSingleVar(lines, isNotInComment),
    ...checkOvercodeRangeSpan(lines, isNotInComment),
  ];
}
