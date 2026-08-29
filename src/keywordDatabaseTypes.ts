// Types and lookup helpers for the F1 keyword database (src/keywordData.ts),
// consumed by the hover / keyword-completion providers in
// src/keywordProviders.ts.
//
// Keyword *names* and *syntax* are language-independent (GESStabs syntax
// doesn't translate); only the prose `description` differs per language.
// Every entry always carries `syntax` and a `description` for every
// KEYWORD_LANGUAGES tag, but any of those strings may be '' when that piece
// isn't documented yet — buildResolvedIndex below treats '' as "missing"
// and falls back to another language so a keyword documented in just one
// manual still gets a hover/completion entry rather than none.

// The keyword-description languages, in fallback preference order. Single
// source of truth: the KeywordLanguage type and the keys of a
// KeywordEntry's `description` map are derived from it, and every function
// below iterates it rather than naming 'de'/'en' literally. To add a
// language: add its tag here, add its text to the `description` maps in
// src/keywordData.ts, and add an enum value to package.json's
// gesstabs.hover.language — the resolver, the fallback, and the entry type
// then pick it up with no further code changes. The first entry is the
// default when nothing else matches.
export const KEYWORD_LANGUAGES = ['en', 'de'] as const;

export type KeywordLanguage = (typeof KEYWORD_LANGUAGES)[number];

export const DEFAULT_KEYWORD_LANGUAGE: KeywordLanguage = KEYWORD_LANGUAGES[0];

export type KeywordEntry = {
  // Canonical display form, e.g. "TABLEFORMAT", "#MACRO", "COLSUMPERCENT" —
  // always the bare identifier (no trailing page-reference number), in the
  // casing the manuals use, which is reliably the real GESStabs keyword
  // casing.
  name: string;
  // A "( Var, BasisVar )"-style argument hint from the heading line, when
  // present (e.g. COLSUMPERCENT, DELTAPERCENT).
  argsHint?: string;
  // A "Syntax:"-anchored grammar block. Language-independent — the same
  // string for every KEYWORD_LANGUAGES tag. '' when none is known yet.
  syntax: string;
  // Prose description, one entry per KEYWORD_LANGUAGES tag (`de`, `en`,
  // ...), each '' when that language isn't documented yet. Some older texts
  // still carry PDF-to-markdown extraction artifacts (the "�" replacement
  // character where umlauts/ß were, page-reference numbers embedded mid-
  // sentence, the odd truncated sentence) — fixed in place as noticed, not
  // by re-running any extraction.
  description: Record<KeywordLanguage, string>;
};

// A keyword resolved to one language for display: the description flattened
// onto the name, so providers don't each re-implement the fallback.
export interface ResolvedKeyword {
  name: string;
  argsHint?: string;
  description: string;
  syntax?: string;
}

// Lookup key: GESStabs keyword names are case-insensitive, so this only
// lowercases — it deliberately does NOT strip a leading '#'. "#END" (the
// preprocessor's #IFDEF/#MACRO block closer) and "END" (the statement that
// terminates a whole script) are two different, unrelated keywords that
// happen to share the same letters once the '#' is gone; keeping them as
// distinct keys ("#end" vs "end") avoids merging their entries together, an
// actual bug this caught during extraction. This does mean a lookup needs
// the '#' reinstated when it's known to be there — see keywordLookupKeyAt —
// since this extension's own wordPattern (language-configuration.json)
// doesn't include '#', so vscode's default word-range detection alone can't
// tell the two apart.
export function keywordLookupKey(name: string): string {
  return name.toLowerCase();
}

// Given the line text and the start offset of a word vscode resolved under
// the cursor (via its default wordPattern, which never includes a leading
// '#'), returns the correct lookup key — reinstating the '#' when the source
// text actually has one immediately before the word, so hovering "END"
// inside "#END" resolves the preprocessor directive and hovering a bare
// "END" resolves the script-terminator statement.
export function keywordLookupKeyAt(
  lineText: string,
  wordStart: number,
  word: string
): string {
  const hasHash = wordStart > 0 && lineText[wordStart - 1] === '#';
  return keywordLookupKey(hasHash ? `#${word}` : word);
}

// Resolves which manual's descriptions to show. `setting` is the value of
// the gesstabs.hover.language setting ("auto" or one of KEYWORD_LANGUAGES);
// anything that isn't a known language (i.e. "auto") falls back to
// vscode.env.language (a BCP-47 tag like "de", "en-US", "fr", ...) — a
// German software company's customers are not guaranteed to run VS Code in
// German, and a non-German customer running VS Code in German still wants
// German keyword docs, so this is a real, independent setting rather than
// something inferred once and hardcoded. A UI language with no matching
// keyword-doc language falls back to DEFAULT_KEYWORD_LANGUAGE rather than
// throwing. Driven entirely by KEYWORD_LANGUAGES so a new language needs no
// change here.
export function resolveKeywordLanguage(
  setting: string,
  envLanguage: string
): KeywordLanguage {
  const explicit = KEYWORD_LANGUAGES.find((lang) => lang === setting);
  if (explicit) return explicit;
  const env = envLanguage.toLowerCase();
  const fromEnv = KEYWORD_LANGUAGES.find((lang) => env.startsWith(lang));
  return fromEnv ?? DEFAULT_KEYWORD_LANGUAGE;
}

// Builds the lookup index for one display language: each entry flattened to
// its `primary`-language description, or — when that one is '' — the first
// other language with a non-empty one, tried in KEYWORD_LANGUAGES order (so
// a keyword documented in only one manual still shows something). `syntax`
// is language-independent and passes straight through. Every entry is
// indexed, even one whose syntax and every description are still '' — it's
// still a valid keyword to complete.
export function buildResolvedIndex(
  entries: KeywordEntry[],
  primary: KeywordLanguage
): Map<string, ResolvedKeyword> {
  const order: KeywordLanguage[] = [
    primary,
    ...KEYWORD_LANGUAGES.filter((lang) => lang !== primary),
  ];
  const index = new Map<string, ResolvedKeyword>();
  entries.forEach((entry) => {
    const description =
      order.map((lang) => entry.description[lang]).find((d) => d) ?? '';
    index.set(keywordLookupKey(entry.name), {
      name: entry.name,
      argsHint: entry.argsHint,
      description,
      syntax: entry.syntax,
    });
  });
  return index;
}
