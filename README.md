# GESStabs README

VS Code language support for the GESStabs tabulation language from [gessgroup.de](https://www.gessgroup.de/).

## Features

- **Syntax highlighting** and **snippets** for `.tab` and `.inc` files.
- **Go to Definition** — jump from a variable/macro/expand usage to where it's defined, searching all `.tab`/`.inc` files in the workspace.
- **Document Symbols** (`Ctrl+Shift+O`) — list variables, computes, macros, expands, and table head/axis definitions in the current file.
- **Workspace Symbol Search** (`Ctrl+T`) — find a symbol definition across every `.tab`/`.inc` file in the open folder.
- **Macro hover, signature help, and usage-count CodeLens** — see what a `#name(...)` call expands to, parameter hints while typing a call, and a usage count on each `#MACRO` declaration.
- **`#EXPAND` hover** — hovering a bare `#name` shows its resolved value: nested `#EXPAND`s are substituted recursively and `{ … }`/`// …` comments in the definition are stripped, so `#expand #y #x { def } ghi` (with `#expand #x abc`) hovers as `abc ghi`.
- **Effective CELLELEMENTS/FRAMEELEMENTS hover** — hovering the `TABLE`/`OVERVIEW`/`XOVERVIEW` **keyword** shows which `CELLELEMENTS`/`FRAMEELEMENTS` defaults are in effect at that point (they persist until the next such assignment, not scoped to one table). Hovering a variable or `#EXPAND` reference on the same line no longer also shows it.
- **Variable hover** — hovering a plain variable name shows a `VARIABLE <name>` header, its origin (its declaration line when the script defines it — the same lookup as Go to Definition — or `aus <datei>.sav` for a raw dataset variable) and the `VARTEXT`/`VARTITLE`/`VALUELABELS` statements that annotate it, each in full (multi-line lists included) with a `file:line` link that jumps to it. Which blocks appear is controlled by `gesstabs.hover.variableContent`.
- **Code folding** for `#MACRO`/`#ENDMACRO` and `#IFDEF`-family/`#END` blocks.
- **Semantic highlighting** distinguishing variable/macro/table names from keywords (layered on top of the syntax grammar).
- **Basic formatter** (`Format Document`) — trims trailing whitespace, collapses blank-line runs, and reindents `#MACRO`/`#IFDEF`-family blocks by nesting depth. Statement content itself is left untouched.
- **Find All References** and **Rename Symbol** (`F2`) — across every `.tab`/`.inc` file in the workspace.
- **Keyword hover and autocomplete** — hovering a GESStabs keyword shows its syntax and description (mined from the German and English manuals; ~1500 keywords recognized, roughly half with syntax/description text so far, the rest placeholders to be filled in), and autocomplete suggests keywords, macro names, and variable/table names already defined earlier in the file. German or English is picked automatically from VS Code's display language, or fixed via `gesstabs.hover.language`; a keyword documented in only one manual falls back to showing that one rather than nothing. The database is the hand-maintained `src/keywords/keywordData.ts` (one `{ name, argsHint?, syntax, description }` entry per keyword, with `syntax` language-independent and `description` a per-language `{ de, en }` map — every string present, but `''` where not yet documented) — edit it directly to correct, add, or remove an entry; see the file's own header comment for the format.
- **Expanded snippet library** — `variable`, `variables`, `recode`, `valuelabels`, `overcode`, `compute`, `weightcells`, `#macro`, `#domacro`, `overview`, `xoverview`, `vargroup`, `groups`, and `#twobases` (a ready-to-use cookbook macro from `GESStabs_Basiswechsel.md`), alongside the original `table` snippet.
- **Diagnostics** for documented GESStabs pitfalls, shown in the Problems panel: an empty variable list on `RECODE`/`VARTITLE`/`VARTEXT`/`VALUELABELS` silently applying to the last-created variable, unmatched `#MACRO`/`#IFDEF`-family blocks, duplicate variable declarations, structurally inverted `RECODE` bounds, `CARD` exceeding the current `CARDS`, `WEIGHTCELLS` percentages not summing to 100%, a `CELLSET` element outside its fixed allow-list, `INVERTOUT`+`UPDATEINVERT` together, and an `#ifdef`/`#ifndef` name that only matches an existing `#define` case-insensitively. The empty-variable-list warning has a quick fix (💡) that inserts the actual last-declared variable name explicitly.

## Requirements

No requirements or dependencies.

## Extension Settings

- `gesstabs.debugMode` (boolean, default `false`) — enable debug messages in the Output console.
- `gesstabs.diagnostics.enabled` (boolean, default `true`) — flag documented GESStabs pitfalls in the Problems panel.
- `gesstabs.hover.enabled` (boolean, default `true`) — master switch for all GESStabs hovers.
- `gesstabs.hover.show` (object) — which hovers are shown. Keys: `keywords` (boolean, default `true`), `variables` (boolean, default `true`), `tableDefaults` (boolean, default `true` — effective `CELLELEMENTS`/`FRAMEELEMENTS` on a `TABLE`/`OVERVIEW`/`XOVERVIEW` keyword), and `macros` (`"short"` | `"full"`, default `"short"` — the `#name(...)` expansion / `#EXPAND` value hover; `"short"` trims blank and comment-only lines from the macro body, `"full"` shows it verbatim).
- `gesstabs.hover.variableContent` (object) — which blocks the variable hover shows, always in this order. Keys, all boolean and default `true`: `definition` (the variable's origin — its declaration line, or `aus <datei>.sav (SPSS, Spalte N)` for a raw dataset variable), `text` (`VARTEXT`), `title` (`VARTITLE`), `valueLabels` (`VALUELABELS`). Needs `gesstabs.hover.show` → `variables` on.
- `gesstabs.hover.language` (`"auto"` | `"de"` | `"en"`, default `"auto"`) — which manual's descriptions to show; `"auto"` follows VS Code's own display language.
- `gesstabs.autocomplete.enabled` (boolean, default `true`) — suggest keywords, macro names, and previously-defined variable/table names while typing.

> The pre-0.99.4 flat `gesstabs.hover.macros` / `.expands` / `.keywords` / `.variables` / `.variableAnnotations` / `.effectiveElements` / `.macroExpansionStyle` settings were replaced by the two objects above. Any still in your `settings.json` are honoured as a fallback but should be migrated.

## Known Issues

See [TODO.md](TODO.md) for known issues and planned improvements.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md).
