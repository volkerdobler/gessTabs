# Change Log

All notable changes to the "GESStabs" extension will be documented in this file (last change first).

## Unreleased

### Go to Definition, Find All References & Rename

- Large feature update built on a new INCLUDE/#ifdef-graph model that resolves files in real compile order instead of scanning the workspace unordered:
- Go to Definition, Find All References, and the new Rename Symbol (`F2`) now all respect INCLUDE order and gessTabs' no-forward-reference rule.
- New command **Go to Matching Directive**, bound to `Ctrl+Shift+\` (the built-in _Go to Bracket_ key) for `.tab`/`.inc`/`.def` files. On a `#MACRO`/`#ENDMACRO` line — and `#IFDEF`-family/`#END`, `#STARTEXPORT`/`#ENDEXPORT`, `IFBLOCK`/`WHILEBLOCK`…`ENDBLOCK`, `SETFILTER`/`ENDFILTER` — it jumps to the matching delimiter (nesting-aware, comment-aware, reusing the folding pairing). On any other line it falls through to the built-in bracket jump, so the keystroke is unchanged everywhere it already worked.
- Fixed: Find All References (and Rename) now also find a variable where it is _used_ in an expression — a condition, an `IF … THEN <var> = …` assignment, an operand — not only where it is declared or named on a `TABLE` head/axis. A line such as `if (not ([1:2] in f24)) then f24 = 2;` was previously missing from the results for `f24`. Rename additionally now replaces **every** occurrence on a line, not just the first (occurrences inside a comment on that line are left alone). Bare-token matching ignores longer identifiers (`f240`), `.`-qualified members (`region.f24`), `#macro` calls and `&param` references.
- Fixed: Go to Definition / hover on a raw dataset variable (one from `CSVINFILE`/`SPSSINFILE`/`DATAFILE`) sometimes jumped a few lines above the real data-source statement — e.g. onto a `document = "";` line just before it. Root cause: a trailing `// comment` after a statement's `;`, once blanked, was mistakenly treated as the start of the next statement, so every statement after such a line was recorded a few lines too early. Also fixed two ways the data-source information could go stale: the entry-program cache is now rebuilt after in-editor edits (not only on save), and the workspace reader now sees the live buffer of _every_ open file, not just the focused one.

### Macro & #EXPAND tooling

- Macro tooling: hover shows a `#name(...)` call's expanded body (short or full, configurable), signature help while typing a call, and a usage-count CodeLens on each `#MACRO`.
- Macro-call hover now also shows the macro's declaration — `#macro #name(&p1 &p2 …)` — and a `file:line` link to its definition, above the expanded body. The `#EXPAND`, `#EXPANDINC` and `#EXPANDINTOKEN` hovers gained the same jump-to-definition link.
- Macro hover now shows just the hovered macro's body with its parameters filled in; nested `#other(…)` calls are left as literal calls instead of being expanded inline (which had made calls to `#ifdef`-gated macros silently disappear).
- `#EXPAND` hover: a value-less `#expand #name` is now recognized as a real (empty) definition instead of being silently ignored, and an `#expand #name …` in the current file always resolves even when the INCLUDE graph doesn't reach that file. Together these fix a same-file `#EXPAND` (e.g. `#s`) sometimes not showing a hover. The hover now also resolves nested `#EXPAND`s recursively and strips `{ … }`/`// …` comments from the definition — `#expand #y #x { def } ghi` (with `#expand #x abc`) hovers as `abc ghi`.
- Macro and `#EXPAND` hover / go-to-definition / signature help / usage count — and now also variable/symbol go-to-definition, find-all-references and rename — find a definition even when it sits in an `#ifdef`/`#ifndef` branch the current run doesn't compile; the tooling shouldn't depend on which branch is active. (Definitions inside a `{ … }` block comment are still, correctly, not offered. Autocomplete and the effective-elements hover keep the active-branch view.)
- Fixed: the first real statement after a `#MACRO … #ENDMACRO` block (and the first body line after `#MACRO`) was silently glued onto the directive line and lost — so a variable declared right after a macro block was invisible to Go to Definition, Find All References, rename, the variable hover, and diagnostics. Macro bodies are now skipped as the substitution templates they are (nested `#MACRO` blocks included).

### Variable & keyword hover

- New variable hover: hovering a plain variable name shows its declaration and, unless disabled, the `VARTITLE`/`VARTEXT`/`VALUELABELS` statements that annotate it — one `VARIABLE <name>` header, then each statement in full (gathered start-to-`;`, so a multi-line `VALUELABELS` list shows completely) with a `file:line` link that jumps to it. Toggles: `gesstabs.hover.variables` (master) and `gesstabs.hover.variableAnnotations`. A `#name`/`&name` token is left to the macro hover — the variable hover no longer also fires on it. Hovering a variable at the exact spot it's declared, or inside one of its own `VARTITLE`/`VARTEXT`/`VALUELABELS` statements, no longer echoes that same statement back — it shows nothing there unless there's a real declaration elsewhere to point to. `COPYTITLE`/`COPYTEXT`/`COPYLABELS <varlist> = <variable>;` is now resolved too: hovering a target name shows only the corresponding `VARTITLE`/`VARTEXT`/`VALUELABELS` copied from `<variable>`.
- Keyword hover and autocomplete: syntax + description for ~650-750 gessTabs keywords, mined from the German and English manuals (auto-picks the language from VS Code's display language, configurable, falls back to the other language if a keyword is only documented there).
- Effective `CELLELEMENTS`/`FRAMEELEMENTS` hover, showing which defaults are actually in effect at that point. Now shown only when hovering the `TABLE`/`OVERVIEW`/`XOVERVIEW` keyword itself — hovering a variable or an `#EXPAND` reference on the same statement line no longer also pops it (that information is only meaningful for the statement as a whole).
- Every symbol/context hover now leads with the same upper-case category label: `KEYWORD <name>`, `MACRO <call>`, `EXPAND <#name>`, `EFFECTIVE ELEMENTS` — instead of a bare word or a sentence fragment.
- Variable hover: a variable passed to a `#MACRO` call is shown as itself (declaration + `VARTEXT`/`VARTITLE`/`VALUELABELS`) when it is already defined elsewhere; when the variable is _created inside_ the macro body (e.g. `MAKEFAMILY &1 = …`) the hover instead points at the macro and the body line that produces it. Previously the macro block was either always shown (noise) or never (missing for macro-created names).
- Variable hover: a variable that a `#MACRO` body produces (passed in as an argument) no longer shows the macro body / call-site expansion — that belongs to the macro hover, which now fires only on the `#name` token itself, not anywhere inside its `( … )` argument list. A raw dataset column that the script later re-assigns is now described by its data source ("aus …sav"), not as a plain in-script "Variable".
- Variable hover: the blocks are shown in a fixed order — definition, then `VARTEXT`, `VARTITLE`, `VALUELABELS` — instead of whatever order the statements happened to sit in the script.

### Diagnostics

- New diagnostic: `USEFILTER`/`MAKEFILTER` are flagged as retired since GESStabs 2.82 (replaced by `FILTER`/`TABLEFILTER`/`SETFILTER`) — the only two keywords from a much longer originally-considered "deprecated keyword" list the manual actually documents as removed; everything else on that list is still supported today, just superseded by a newer/preferred mechanism.
- Fixed: `#define`/`#ifdef` case-mismatch detection is now cross-INCLUDE-aware — a `#define FOO;` sitting in an INCLUDEd file no longer goes unseen by a wrong-case `#ifdef foo` in the main file (or the reverse), closing the one gap the duplicate-declaration diagnostic had already been fixed for.
- Fixed: a false "undefined variable" warning on `IF <var> IS <vartype> THEN …` (the type-test construct, e.g. `IF v1 IS MULTIQ THEN …`) — the `<vartype>` keyword itself (`VARIABLE`/`SINGLEQ`, `FAMILYVAR`/`MULTIQ`, `GROUPVAR`/`DICHOQ`, `OPEN`) was being collected as an ordinary variable reference and flagged since it (almost never) resolves to a real declared variable.
- Fixed: a `$`-member reference (`medsort$1`, `Datum1_$1`, or the quoted `"medsort $1"`) is now resolved against its family/group instead of silently truncating at the `$` — this used to either falsely flag the reference as an undefined variable (`Datum1_$1`, since that truncated name never exists) or silently resolve to the wrong symbol (`medsort$1` resolved as plain `medsort`, the whole family). Hover and Go to Definition on a member now also work, pointing at the family's own declaration.
- New diagnostics for documented gessTabs pitfalls: empty-varlist trap on `RECODE`/`VARTITLE`/`VARTEXT`/`VALUELABELS` (with a quick fix), unmatched `#MACRO`/`#IFDEF` blocks, duplicate variable declarations, inverted `RECODE` bounds, `CARD`/`CARDS` ordering, `WEIGHTCELLS` percentages not summing to 100%, invalid `CELLSET` elements, `INVERTOUT`+`UPDATEINVERT` together, and `#define`/`#ifdef` case mismatches.
- Fixed: a single-line `#ifnempty … #else … #end` (or any line with more than one preprocessor directive) no longer produces a false "unclosed block" diagnostic, and no longer throws off code folding or the formatter's indentation. A directive keyword written in a trailing `// …` comment (e.g. `#end // #ifdef PowerChart`) is likewise no longer miscounted. The same fix in the INCLUDE/#ifdef resolver: such a line no longer leaves an `#ifdef` block "open" for the rest of the file, which had been hiding later `#MACRO` definitions from hover/autocomplete/go-to-definition.

### Editor niceties

- Code folding for `#MACRO`/`#ENDMACRO` and `#IFDEF`-family/`#END` blocks.
- Semantic highlighting distinguishing variable/macro names from keywords.
- A basic formatter (trailing whitespace, blank-line runs, directive-nesting indentation).
- Snippet library expanded from 1 to 14 snippets (`recode`, `compute`, `weightcells`, `#macro`, `overview`, `#twobases`, and more).
- Syntax highlighting: the keyword list was brought back up to parity with the older `.tmLanguage` grammar (~375 keywords re-added, including `BY` in `TABLE` statements).
- Fixed: keywords (e.g. `NOT`, `SYSMISS`) are now highlighted even when they are not preceded by whitespace or the start of the line — e.g. directly after an opening parenthesis, as in `(SYSMISS x)` or `x=NOT y`. The grammar's keyword/preprocessor rules used a `(?:^|\s)` prefix that required a leading blank; they now use a `(?<![\w.])` lookbehind, so a keyword after `(` is recognised while member-style `region.not` and substrings like `cannot` still are not.

### Settings

- New leveled logger writing to a "GESStabs" output channel (`View > Output`), replacing `console.log` gated behind `gesstabs.debugMode` (invisible without opening the Extension Host's own dev tools). New setting `gesstabs.logLevel` (`off`/`error`/`warn`/`info`/`debug`) controls verbosity; left unset by default, it falls back to the existing `gesstabs.debugMode` boolean, so no `settings.json` changes are required.
- Hover settings consolidated. The flat `gesstabs.hover.macros` / `.expands` / `.keywords` / `.variables` / `.variableAnnotations` / `.effectiveElements` / `.macroExpansionStyle` are replaced by two grouped settings: `gesstabs.hover.show` (`{ keywords, variables, tableDefaults: boolean; macros: "short" | "full" }`) and `gesstabs.hover.variableContent` (`{ definition, text, title, valueLabels: boolean }` — pick which blocks of the variable hover appear). `gesstabs.hover.enabled` and `gesstabs.hover.language` are unchanged. Old keys still in `settings.json` are honoured as a fallback.
- Many new `gesstabs.*` settings to turn individual hovers/diagnostics/autocomplete on or off — see the README.

### Internal

- Performance: the comment/string `Scope` scan (used by every hover, completion, fold, format, semantic-token and diagnostics pass) is now cached per document version instead of rebuilt from scratch on every request.
- The remaining ad hoc `vscode.workspace.getConfiguration('gesstabs')` reads (`diagnostics.enabled`, `autocomplete.enabled`, `hover.language`, `dataInput.entryScriptPatterns`) are now centralized alongside the existing `hover.*` settings in one typed module — no behavior change.
- Internal: fixed the packaged extension accidentally including internal/dev-only files; resolved all `npm audit` findings; added the missing LICENSE file. The keyword hover/autocomplete database is now a single hand-maintained `src/keywordData.ts` (one `{ name, argsHint?, syntax, description }` entry per keyword, `syntax` language-independent and `description` a per-language `{ de, en }` map — strings `''` where not yet documented) instead of two generated per-language files plus separate override files — the manuals are moving online and won't be re-extracted.

## 0.3.0

Update language file: optimize number definition again

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
