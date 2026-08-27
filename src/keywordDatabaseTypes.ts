// Shared, hand-written type for the F1 keyword database — kept separate
// from src/keywordDatabase.<lang>.ts (the generated, per-language data
// files) so regenerating the data never touches this declaration.
// Keyword *names* are language-independent (gessTabs syntax doesn't
// translate), only `description`/`syntax` prose does — see
// resolveKeywordLanguage/buildIndexWithFallback below for how a language
// is chosen and how a gap in one language's manual is covered by falling
// back to the other's.

export interface KeywordEntry {
  // Canonical display form as found in the source manual, e.g.
  // "TABLEFORMAT", "#MACRO", "COLSUMPERCENT". Always the bare identifier
  // (no trailing page-reference number) — case as originally written,
  // which for the reference/glossary sections this is mined from is
  // reliably the real gessTabs keyword casing.
  name: string;
  // A "( Var, BasisVar )"-style argument hint from the heading line
  // itself, when present (e.g. COLSUMPERCENT, DELTAPERCENT).
  argsHint?: string;
  // Prose description, mechanically extracted — expect PDF-to-markdown
  // artifacts (page-reference numbers embedded mid-sentence like "SORT
  // 462", the odd mojibake "�" replacement character where umlauts/ß were
  // in the source) to still be present; see scripts/extractKeywordDatabase.ts's
  // header comment for exactly what was and wasn't cleaned up.
  description: string;
  // A "Syntax:"-anchored grammar block, when one was found for this
  // keyword (not every keyword has one).
  syntax?: string;
  // "<file>:<line>" (1-based) pointing at the first place this entry's
  // content was found, for tracing an entry back to the manual.
  source: string;
}

// Lookup key: gessTabs keyword names are case-insensitive, so this only
// lowercases — it deliberately does NOT strip a leading '#'. "#END" (the
// preprocessor's #IFDEF/#MACRO block closer) and "END" (the statement
// that terminates a whole script) are two different, unrelated keywords
// that happen to share the same letters once the '#' is gone; keeping
// them as distinct keys ("#end" vs "end") avoids merging their entries
// together, an actual bug this caught during extraction. This does mean a
// lookup needs the '#' reinstated when it's known to be there — see
// hasHashPrefixAt/keywordLookupKeyAt in this module — since this
// extension's own wordPattern (language-configuration.json) doesn't
// include '#', so vscode's default word-range detection alone can't tell
// the two apart.
export function keywordLookupKey(name: string): string {
  return name.toLowerCase();
}

// Given the line text and the start offset of a word vscode resolved
// under the cursor (via its default wordPattern, which never includes a
// leading '#'), returns the correct lookup key — reinstating the '#' when
// the source text actually has one immediately before the word, so
// hovering "END" inside "#END" resolves the preprocessor directive and
// hovering a bare "END" resolves the script-terminator statement.
export function keywordLookupKeyAt(
  lineText: string,
  wordStart: number,
  word: string
): string {
  const hasHash = wordStart > 0 && lineText[wordStart - 1] === '#';
  return keywordLookupKey(hasHash ? `#${word}` : word);
}

export function buildKeywordIndex(
  entries: KeywordEntry[]
): Map<string, KeywordEntry> {
  const index = new Map<string, KeywordEntry>();
  entries.forEach((entry) => {
    index.set(keywordLookupKey(entry.name), entry);
  });
  return index;
}

// A hand-maintained correction/addition/removal for one entry — see
// src/keywordDatabaseOverrides.<lang>.ts, the files a person actually edits.
// Matched against a generated KeywordEntry by `name` (case-insensitively,
// '#'-aware — see keywordLookupKey above). Any field left unset here
// keeps the generated value; `remove: true` drops the entry entirely
// (name/other fields are ignored in that case, only used for matching).
export interface KeywordOverride {
  name: string;
  description?: string;
  syntax?: string;
  argsHint?: string;
  remove?: boolean;
}

// Applies hand-written overrides on top of the mechanically-extracted
// database — kept as a runtime merge (not folded into the generator
// script) specifically so re-running the extraction never touches, and
// never needs to preserve, anything a person wrote by hand. An override
// whose name doesn't match any existing entry adds a brand new one
// (source is set to say so), covering a keyword the extraction missed
// entirely (e.g. #MACRO, #EXPAND — real, important keywords that never
// got a clean mechanically-extracted entry; see the F1 docs/HISTORY.md notes).
export function applyKeywordOverrides(
  base: KeywordEntry[],
  overrides: KeywordOverride[]
): KeywordEntry[] {
  const byKey = new Map<string, KeywordEntry>();
  base.forEach((entry) => byKey.set(keywordLookupKey(entry.name), entry));

  overrides.forEach((override) => {
    const key = keywordLookupKey(override.name);
    if (override.remove) {
      byKey.delete(key);
      return;
    }
    const existing = byKey.get(key);
    byKey.set(key, {
      name: existing?.name ?? override.name,
      argsHint: override.argsHint ?? existing?.argsHint,
      description: override.description ?? existing?.description ?? '',
      syntax: override.syntax ?? existing?.syntax,
      source: existing?.source ?? 'manual override',
    });
  });

  return Array.from(byKey.values());
}

export type KeywordLanguage = 'de' | 'en';

// Resolves which manual's descriptions to show. `setting` is the value of
// the gesstabs.hover.language setting ("auto" | "de" | "en"); "auto"
// falls back to vscode.env.language (a BCP-47 tag like "de", "en-US",
// "fr", ...) — a German software company's customers are not guaranteed
// to run VS Code in German, and a non-German customer running VS Code in
// German still wants German keyword docs, so this is a real, independent
// setting rather than something inferred once and hardcoded. Any
// non-German UI language currently falls back to English, since those are
// the only two manuals available; a language that isn't German maps to
// English rather than throwing, so this never needs to be revisited if a
// third manual shows up later without also updating every call site.
export function resolveKeywordLanguage(
  setting: string,
  envLanguage: string
): KeywordLanguage {
  if (setting === 'de' || setting === 'en') return setting;
  return envLanguage.toLowerCase().startsWith('de') ? 'de' : 'en';
}

// Merges a primary language's entries over a fallback language's, so a
// keyword documented in only one manual still gets a hover/completion
// entry (in the other language) rather than none at all. Primary wins
// whenever both have the keyword.
export function buildIndexWithFallback(
  primary: KeywordEntry[],
  fallback: KeywordEntry[]
): Map<string, KeywordEntry> {
  const index = buildKeywordIndex(fallback);
  buildKeywordIndex(primary).forEach((entry, key) => index.set(key, entry));
  return index;
}
