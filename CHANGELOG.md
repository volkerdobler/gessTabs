# Change Log

All notable changes to the "GESStabs" extension will be documented in this file (last change first).

## 0.99.0-beta

Internal beta ahead of 1.0.0 — large feature update built on a new INCLUDE/#ifdef-graph model that resolves files in real compile order instead of scanning the workspace unordered.

- Go to Definition, Find All References, and the new Rename Symbol (`F2`) now all respect INCLUDE order and gessTabs' no-forward-reference rule.
- Macro tooling: hover shows a `#name(...)` call's expanded body (short or full, configurable), signature help while typing a call, and a usage-count CodeLens on each `#MACRO`.
- Keyword hover and autocomplete: syntax + description for ~650-750 gessTabs keywords, mined from the German and English manuals (auto-picks the language from VS Code's display language, configurable, falls back to the other language if a keyword is only documented there).
- New diagnostics for documented gessTabs pitfalls: empty-varlist trap on `RECODE`/`VARTITLE`/`VARTEXT`/`VALUELABELS` (with a quick fix), unmatched `#MACRO`/`#IFDEF` blocks, duplicate variable declarations, inverted `RECODE` bounds, `CARD`/`CARDS` ordering, `WEIGHTCELLS` percentages not summing to 100%, invalid `CELLSET` elements, `INVERTOUT`+`UPDATEINVERT` together, and `#define`/`#ifdef` case mismatches.
- Effective `CELLELEMENTS`/`FRAMEELEMENTS` hover on `TABLE`/`OVERVIEW`/`XOVERVIEW` statements, showing which defaults are actually in effect at that point.
- Code folding for `#MACRO`/`#ENDMACRO` and `#IFDEF`-family/`#END` blocks.
- Semantic highlighting distinguishing variable/macro names from keywords.
- A basic formatter (trailing whitespace, blank-line runs, directive-nesting indentation).
- Snippet library expanded from 1 to 14 snippets (`recode`, `compute`, `weightcells`, `#macro`, `overview`, `#twobases`, and more).
- Many new `gesstabs.*` settings to turn individual hovers/diagnostics/autocomplete on or off — see the README.
- Syntax highlighting: the keyword list was brought back up to parity with the older `.tmLanguage` grammar (~375 keywords re-added, including `BY` in `TABLE` statements).
- Fixed: a single-line `#ifnempty … #else … #end` (or any line with more than one preprocessor directive) no longer produces a false "unclosed block" diagnostic, and no longer throws off code folding or the formatter's indentation. A directive keyword written in a trailing `// …` comment (e.g. `#end // #ifdef PowerChart`) is likewise no longer miscounted. The same fix in the INCLUDE/#ifdef resolver: such a line no longer leaves an `#ifdef` block "open" for the rest of the file, which had been hiding later `#MACRO` definitions from hover/autocomplete/go-to-definition.
- Internal: fixed the packaged extension accidentally including internal/dev-only files; resolved all `npm audit` findings; added the missing LICENSE file. The keyword hover/autocomplete database is now a single hand-maintained `src/keywordData.ts` (nested `de`/`en` blocks per keyword) instead of two generated per-language files plus separate override files — the manuals are moving online and won't be re-extracted.

## 0.2.9

Update language file: optimize number definition

## 0.2.8

Updated tmLanguage file to json format

## 0.2.7

Updated tmLanguage files to show all commands mentioned in https://help.gessgroup.de/gesstabs-help/ (Stand Mai 2023)

## 0.2.6

New feature: folding region is now available for Pre-Processor commands and comments

## 0.2.5

Bug fix: Language file optimization

## 0.2.4

Internal release

## 0.2.3

Bug fix: only variables with a length of 2 or more had been recognized as variable.

## 0.2.2

Showing all variables only got container "variables" which was not very
informative. Now shows type of variable again.

Minor bug fix for word boundaries (did not work with quotations)

## 0.2.1

Bug fix missing word boundary in getWordDefinition
Changed CHANGELOG.md to have last fix on top

## 0.2.0

- Updated Symbols in tmLanguage file
- Changed how to identify comments and strings, now the scope will be identified for each char in a text file

## 0.1.1

- Added fix to find also files in subdirectories
- Changed tmLanguage file

## 0.1.0

- Changed variable definition. Now, dots are part of a GESStabs variable name. Follows definition from manual,
  beside the fact, that variables names with quotes (and spaces) are not recognized.
- updated to minor new version, as go to definition and find all references work more stable and is usable.

## 0.0.9

- minor bugfix in class clComment

## 0.0.8

- added Go to Definition, Find all References and Show Symbol provider (CTRL-T) - still in beta testing!

## 0.0.7

- test with icon - still work in progress

## 0.0.6

- Changed behaviour of DocumentSymbolProvider - now all table commands are found

## 0.0.4

- Add excludevalues and include values to language
- Changed symbol search to "table = KOPF by ACHSE;"

## 0.0.3

- Now with an icon-picture

## 0.0.2

- Slightly changes in snipped file and syntax highlighting file

## 0.0.1

- Initial release
