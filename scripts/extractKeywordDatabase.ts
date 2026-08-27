// Offline, run-once extraction script for the F1 keyword database (see
// TODO.md's F1 section). NOT part of npm run compile/test/lint — it reads
// dokumentation/*.md, which are the real GESStabs manuals and deliberately
// git-ignored (.gitignore: "dokumentation/*.md"), so this script only
// works with a local checkout that actually has them. Its OUTPUT,
// src/keywordDatabase.<lang>.ts, is committed as ordinary source — see
// the F1 TODO.md entry for why that's fine even though the raw manuals
// aren't tracked.
//
// Run with: npm run extract-keywords (regenerates every language below)
//
// Multi-language: added 2026-08-27 once an English manual
// (GESStabs-Handbuch_engl.md) became available. Keyword *names* are
// language-independent (gessTabs syntax doesn't translate), but
// descriptions/syntax prose do — so each language gets its own
// completely independent extraction pass and output file, merged at
// *runtime*, not here (see src/keywordProviders.ts's language-fallback
// index). Checked directly rather than assumed: the English manual's own
// PDF-to-markdown conversion is structurally quite different from the
// German one (no repeating copyright-footer block, bare page-number-only
// lines instead, an actual markdown-table-shaped index appendix, and
// section headings numbered with roman numerals ("III ...") rather than
// decimals ("6.5.2.1 ...")) — hence LanguageConfig below rather than one
// hardcoded set of patterns.
//
// What this can and can't reliably extract, and why:
//
// Both manuals turned out to be flat PDF-to-text dumps with essentially
// no markdown structure (headers, bold, etc. — the English one does have
// a handful of genuine markdown tables scattered around, unlike the
// German one, but neither has real headers). Their reference/glossary
// sections DO follow two very regular, mechanically-recognizable shapes,
// which is what this script mines:
//   (1) An ALL-CAPS line standing entirely alone (optionally with a
//       trailing PDF cross-reference page number, or a "( Var, ... )"
//       argument hint) is a keyword heading; the prose lines that follow,
//       up to the next such heading / a numbered section title / a
//       "Syntax:" anchor, are its description.
//   (2) A "Syntax:" line (the English manual uses this literal word too),
//       found anywhere including the tutorial-style chapters, is followed
//       by a grammar block whose own first token is the keyword it
//       documents — this avoids ever needing to guess which heading a
//       syntax block "belongs to".
//
// What this deliberately does NOT attempt, and why:
//   - The German-language topic-specific manuals (Makros, OfficeExport,
//     GESStabs-Artist, ...) were checked directly and are NOT reference/
//     glossary documents — they're free-flowing how-to prose with
//     embedded script examples, with at most a handful of ALL-CAPS
//     heading-shaped lines or "Syntax:" anchors each (e.g.
//     GESStabs_OfficeExport.md has exactly one, GESStabs_Makros.md has
//     zero). Mechanically mining them the same way would mean guessing at
//     heading shapes in ordinary prose, which is a precision/false-
//     positive tradeoff not worth making. They still get scanned for
//     "Syntax:" blocks (cheap and reliable wherever it exists) but
//     otherwise remain "prose to read", not turned into hover entries.
//   - Encoding: every ä/ö/ü/ß in the source .md files was already
//     replaced with the Unicode replacement character "�" by an earlier,
//     lossy conversion, long before this script ever sees the text — the
//     original bytes are simply gone. Nothing here can recover them, so
//     descriptions containing "�" are passed through as-is rather than
//     guessed at.
//   - Inline PDF cross-reference numbers/page-refs embedded mid-sentence
//     (e.g. "CELLELEMENTS 418 in der Tabelle", "SORT 462-Schlüsselwort")
//     are left in the description text. Reliably telling "a real number
//     that's part of the sentence" apart from "a stray page reference"
//     from the flattened text alone isn't safe to automate — cosmetic
//     noise, not a correctness problem for a hover tooltip.
//
// A heading/citation-list false positive (e.g. a sentence that cites
// several keywords each on its own line, with no actual description text
// following any of them before the next one) is filtered out for free by
// the minimum-description-length check below — such a "heading" has zero
// content between it and the next heading, so it never produces an entry,
// and the *real* definition of that keyword elsewhere in the document
// (which does have real prose) wins instead.

import * as fs from 'fs';
import * as path from 'path';
import { KeywordEntry, keywordLookupKey } from '../src/keywordDatabaseTypes';

const DOC_DIR = path.resolve(__dirname, '../dokumentation');
const MIN_DESCRIPTION_LENGTH = 15;
const MAX_DESCRIPTION_LENGTH = 400;

const headingLineRe =
  /^(#?[A-Za-z][A-Za-z0-9_]*)\s*(\([^)]*\))?\s*(?:[0-9]{1,4})?\s*$/;
const syntaxAnchorRe = /^Syntax(?::|\s+f[\wü]r[^:]*:)\s*$/i;

interface LanguageConfig {
  language: string;
  outFile: string;
  matchesFile: (filename: string) => boolean;
  // A real description is prose in this language and reliably contains a
  // common stopword; a code-example line masquerading as a heading's
  // description essentially never does. Language-specific word list.
  stopwordRe: RegExp;
  // "Example:"-style marker that ends a syntax block, language-specific.
  exampleMarkerRe: RegExp;
  // A numbered/lettered section title's own shape differs per manual
  // (decimal "6.5.2.1 ..." vs. roman-numeral "III ..."/"Appendix ...") —
  // used only as a stop-boundary when accumulating a description, so an
  // approximate pattern is fine; a miss here just means a little extra
  // unwanted trailing content, not a wrong keyword.
  sectionHeadingRe: RegExp;
  // Skips page-layout noise (footers, running headers, bare page
  // numbers) that would otherwise get swallowed into a description.
  // Returns line indices to skip, keyed by original (1-based-friendly)
  // index so `source` references stay accurate.
  computeSkipSet: (lines: string[]) => Set<number>;
  // Finds where an alphabetical index/appendix section starts, so
  // everything from there on (garbage for extraction purposes — see the
  // module doc comment) is excluded. undefined = no such section found.
  findIndexSectionStart: (lines: string[]) => number | undefined;
}

// A real grammar line almost always contains one of these — placeholder
// brackets, an assignment, an OR-pipe, a terminating semicolon. Plain
// prose commentary that happens to follow a "Syntax:" block's first line
// essentially never does, so this is what stops syntax-line accumulation
// from running on into that commentary. Language-independent (symbol-
// based, not word-based).
function looksLikeSyntax(line: string): boolean {
  return /[<>=;{}|]/.test(line);
}

function isAllCapsIdentifier(word: string): boolean {
  const bare = word.replace(/^#/, '');
  return bare.length >= 2 && bare === bare.toUpperCase() && /[A-Z]/.test(bare);
}

// Even with the boundary checks above, a description can still run on
// too long when the source has no clean heading-line boundary between two
// keywords' explanations at all. The real content is reliably at the
// *start* of an over-long accumulation (extraction always begins right
// after the heading), so capping length turns "wrong, confusing content
// included" into "correct content shown, then cut off" — a strict
// improvement, not a full fix. Cuts at the nearest sentence end within
// the cap when there is one, else the nearest word boundary.
function truncateDescription(text: string): string {
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
  const cut = text.slice(0, MAX_DESCRIPTION_LENGTH);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(': '));
  const boundary =
    sentenceEnd > MAX_DESCRIPTION_LENGTH * 0.5
      ? sentenceEnd + 1
      : cut.lastIndexOf(' ');
  return `${cut.slice(0, boundary > 0 ? boundary : cut.length).trim()}…`;
}

interface DocFile {
  name: string;
  lines: string[];
}

function readDocs(config: LanguageConfig): DocFile[] {
  return fs
    .readdirSync(DOC_DIR)
    .filter((f) => f.endsWith('.md') && config.matchesFile(f))
    .map((f) => {
      const allLines = fs
        .readFileSync(path.join(DOC_DIR, f), 'utf8')
        .split(/\r\n|\r|\n/);
      const indexStart = config.findIndexSectionStart(allLines);
      return {
        name: f,
        lines:
          indexStart === undefined ? allLines : allLines.slice(0, indexStart),
      };
    });
}

function extractAllCapsHeadings(
  file: string,
  lines: string[],
  skip: Set<number>,
  config: LanguageConfig
): KeywordEntry[] {
  const entries: KeywordEntry[] = [];
  const isContent = (i: number) => i < lines.length && !skip.has(i);

  for (let i = 0; i < lines.length; i += 1) {
    if (!isContent(i)) continue;
    const text = lines[i].trim();
    const m = text.match(headingLineRe);
    if (!m || !isAllCapsIdentifier(m[1])) continue;

    const descLines: string[] = [];
    let j = i + 1;
    while (j < lines.length) {
      if (!isContent(j)) {
        j += 1;
        continue;
      }
      const next = lines[j].trim();
      if (next.length === 0) break;
      if (config.sectionHeadingRe.test(next)) break;
      if (syntaxAnchorRe.test(next)) break;
      const headingMatch = next.match(headingLineRe);
      if (headingMatch && isAllCapsIdentifier(headingMatch[1])) break;
      descLines.push(next);
      j += 1;
    }

    const description = descLines.join(' ').trim();
    if (description.length < MIN_DESCRIPTION_LENGTH) continue;
    if (!config.stopwordRe.test(description)) continue;

    entries.push({
      name: m[1],
      argsHint: m[2],
      description: truncateDescription(description),
      source: `${file}:${i + 1}`,
    });
  }

  return entries;
}

function extractSyntaxBlocks(
  file: string,
  lines: string[],
  skip: Set<number>,
  config: LanguageConfig
): KeywordEntry[] {
  const entries: KeywordEntry[] = [];
  const isContent = (i: number) => i < lines.length && !skip.has(i);

  for (let i = 0; i < lines.length; i += 1) {
    if (!isContent(i)) continue;
    if (!syntaxAnchorRe.test(lines[i].trim())) continue;

    const syntaxLines: string[] = [];
    let j = i + 1;
    while (j < lines.length && syntaxLines.length < 6) {
      if (!isContent(j)) {
        j += 1;
        continue;
      }
      const next = lines[j].trim();
      if (next.length === 0) break;
      if (config.exampleMarkerRe.test(next)) break;
      if (syntaxAnchorRe.test(next)) break;
      if (config.sectionHeadingRe.test(next)) break;
      if (!looksLikeSyntax(next)) break;
      syntaxLines.push(next);
      j += 1;
    }
    if (syntaxLines.length === 0) continue;

    const nameMatch = syntaxLines[0].match(/^(#?[A-Za-z_][A-Za-z0-9_]*)/);
    if (!nameMatch) continue;
    if (!nameMatch[1].startsWith('#') && !isAllCapsIdentifier(nameMatch[1])) {
      continue;
    }

    entries.push({
      name: nameMatch[1],
      description: '',
      syntax: syntaxLines.join('\n'),
      source: `${file}:${i + 1}`,
    });
  }

  return entries;
}

// First-valid-candidate-wins per field, not "longest wins": a later,
// incidental reuse of the same all-caps word in a totally different,
// narrower context is just as likely to be a worse, more fragmented
// extraction as a better one — confirmed directly on the German manual: a
// later "FILTER" candidate came from a two-column PDF table so badly
// flattened that it accidentally swallowed the *next* enum value's
// description too, making it *longer* than the correct, clean, earlier
// one. Candidates within one file are naturally already in ascending
// line-number order (each pass scans top-to-bottom), so "first" here
// means "found earliest in the document" — a reasonable proxy for "the
// primary definition" given no other structure survived the PDF-to-
// markdown conversion.
function mergeEntries(candidates: KeywordEntry[]): KeywordEntry[] {
  const byKey = new Map<string, KeywordEntry>();

  candidates.forEach((candidate) => {
    const key = keywordLookupKey(candidate.name);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, candidate);
      return;
    }
    byKey.set(key, {
      name: existing.name,
      argsHint: existing.argsHint ?? candidate.argsHint,
      description: existing.description || candidate.description,
      syntax: existing.syntax ?? candidate.syntax,
      source: existing.source,
    });
  });

  return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function serialize(entries: KeywordEntry[], language: string): string {
  return `// GENERATED FILE — do not hand-edit.
// Produced by scripts/extractKeywordDatabase.ts from the local
// dokumentation/*.md manuals (git-ignored — see that script's header
// comment for what this covers, what it doesn't, and why). Re-run
// npm run extract-keywords to regenerate after documentation changes.
// Language: ${language}. Hand corrections go in
// src/keywordDatabaseOverrides.${language}.ts instead — that file is
// never touched by this script.

import { KeywordEntry } from './keywordDatabaseTypes';

export const keywordDatabase: KeywordEntry[] = ${JSON.stringify(entries, null, 2)};
`;
}

function runLanguage(config: LanguageConfig): void {
  const docs = readDocs(config);
  const all: KeywordEntry[] = [];

  docs.forEach((doc) => {
    const skip = config.computeSkipSet(doc.lines);
    all.push(...extractAllCapsHeadings(doc.name, doc.lines, skip, config));
    all.push(...extractSyntaxBlocks(doc.name, doc.lines, skip, config));
  });

  const merged = mergeEntries(all);
  const outFile = path.resolve(__dirname, '..', config.outFile);
  fs.writeFileSync(outFile, serialize(merged, config.language), 'utf8');

  const withSyntax = merged.filter((e) => e.syntax).length;
  const withDescription = merged.filter((e) => e.description.length > 0).length;
  // eslint-disable-next-line no-console
  console.log(
    `[${config.language}] Wrote ${merged.length} keyword entries to ` +
      `${config.outFile} (${withDescription} with a description, ` +
      `${withSyntax} with a syntax block, from ${docs.length} file(s)).`
  );
}

// German: the original, main handbook + topic manuals. Copyright footer
// repeats "GESStabs Handbuch 5.2 ..." on every page; the alphabetical
// index repeats its own "Index <pagenum>" running header on every one of
// its pages (the *second* such occurrence is the section's real start —
// the first is just the table of contents' own citation of it).
const GERMAN_CONFIG: LanguageConfig = {
  language: 'de',
  outFile: 'src/keywordDatabase.de.ts',
  matchesFile: (f) => !/engl/i.test(f),
  stopwordRe:
    /\b(der|die|das|und|oder|ist|wird|kann|man|mit|f[uü]r|eine|einen|nicht|wenn|sich|auch|sind|werden|beim|dieser|diese|dieses|einem|einer|von|zu|im|am|auf|als|bei)\b/i,
  exampleMarkerRe: /^(Beispiel|Zum Beispiel)\s*:?\s*$/i,
  sectionHeadingRe: /^\d+(?:\.\d+)*\s+\S/,
  computeSkipSet: (lines) => {
    const FOOTER_MARKER = 'GESStabs Handbuch 5.2';
    const skip = new Set<number>();
    for (let i = 0; i < lines.length; i += 1) {
      if (!lines[i].includes(FOOTER_MARKER)) continue;
      skip.add(i);
      let j = i + 1;
      if (lines[j] !== undefined && lines[j].trim() === '') {
        skip.add(j);
        j += 1;
      }
      if (lines[j] !== undefined && /^.{1,80}\s\d{1,4}$/.test(lines[j].trim())) {
        skip.add(j);
      }
    }
    return skip;
  },
  findIndexSectionStart: (lines) => {
    const indexHeaderRe = /^Index\s+\d+$/;
    let seen = 0;
    for (let i = 0; i < lines.length; i += 1) {
      if (indexHeaderRe.test(lines[i].trim())) {
        seen += 1;
        if (seen === 2) return i;
      }
    }
    return undefined;
  },
};

// English: a single, differently-converted manual. No repeating
// copyright footer — instead bare page-number-only lines scattered
// throughout ("202", "203", ...). Its alphabetical index is one
// contiguous markdown-table-shaped block starting at a single, uniquely-
// worded "Appendix B: Index" heading (confirmed unique — the table of
// contents' own citation of it has trailing dot-leaders + a page number
// on the same line, so it doesn't match this exact, unadorned pattern).
const ENGLISH_CONFIG: LanguageConfig = {
  language: 'en',
  outFile: 'src/keywordDatabase.en.ts',
  matchesFile: (f) => /engl/i.test(f),
  stopwordRe:
    /\b(the|and|or|is|are|can|will|with|for|not|if|this|that|these|those|of|to|in|on|as|at|by|an|a)\b/i,
  exampleMarkerRe: /^(Example|For example)\s*:?\s*$/i,
  sectionHeadingRe: /^(?:[IVXLC]+\s+[A-Z]|Appendix\b)/,
  computeSkipSet: (lines) => {
    const skip = new Set<number>();
    lines.forEach((line, i) => {
      if (/^\d{1,4}$/.test(line.trim())) skip.add(i);
    });
    return skip;
  },
  findIndexSectionStart: (lines) => {
    const indexHeaderRe = /^Appendix\s+[A-Z]:\s*Index\s*$/;
    const i = lines.findIndex((line) => indexHeaderRe.test(line.trim()));
    return i === -1 ? undefined : i;
  },
};

[GERMAN_CONFIG, ENGLISH_CONFIG].forEach(runLanguage);
