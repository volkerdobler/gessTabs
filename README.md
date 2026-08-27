# gesstabs README

VS Code language support for the gess.Tab tabulation language from [gessgroup.de](https://www.gessgroup.de/).

## Features

- **Syntax highlighting** and **snippets** for `.tab` and `.inc` files.
- **Go to Definition** — jump from a variable/macro/expand usage to where it's defined, searching all `.tab`/`.inc` files in the workspace.
- **Document Symbols** (`Ctrl+Shift+O`) — list variables, computes, macros, expands, and table head/axis definitions in the current file.
- **Workspace Symbol Search** (`Ctrl+T`) — find a symbol definition across every `.tab`/`.inc` file in the open folder.
- **Macro hover, signature help, and usage-count CodeLens** — see what a `#name(...)` call expands to, parameter hints while typing a call, and a usage count on each `#MACRO` declaration.
- **Effective CELLELEMENTS/FRAMEELEMENTS hover** — hovering a `TABLE`/`OVERVIEW`/`XOVERVIEW` statement shows which `CELLELEMENTS`/`FRAMEELEMENTS` defaults are in effect at that point (they persist until the next such assignment, not scoped to one table).
- **Code folding** for `#MACRO`/`#ENDMACRO` and `#IFDEF`-family/`#END` blocks.
- **Semantic highlighting** distinguishing variable/macro/table names from keywords (layered on top of the syntax grammar).
- **Basic formatter** (`Format Document`) — trims trailing whitespace, collapses blank-line runs, and reindents `#MACRO`/`#IFDEF`-family blocks by nesting depth. Statement content itself is left untouched.
- **Find All References** and **Rename Symbol** (`F2`) — across every `.tab`/`.inc` file in the workspace.
- **Keyword hover and autocomplete** — hovering a gessTabs keyword shows its syntax and description (mined from the German and English manuals; ~650-750 keywords known per language), and autocomplete suggests keywords, macro names, and variable/table names already defined earlier in the file. German or English is picked automatically from VS Code's display language, or fixed via `gesstabs.hover.language`; a keyword documented in only one manual falls back to showing that one rather than nothing. Corrections, additions, or removals for individual keyword entries go in `src/keywordDatabaseOverrides.de.ts` / `src/keywordDatabaseOverrides.en.ts` (hand-maintained, survives re-running the extraction script — see either file's own comment for the format).
- **Expanded snippet library** — `variable`, `variables`, `recode`, `valuelabels`, `overcode`, `compute`, `weightcells`, `#macro`, `#domacro`, `overview`, `xoverview`, `vargroup`, `groups`, and `#twobases` (a ready-to-use cookbook macro from `GESStabs_Basiswechsel.md`), alongside the original `table` snippet.

## Requirements

No requirements or dependencies.

## Extension Settings

- `gesstabs.debugMode` (boolean, default `false`) — enable debug messages in the Output console.
- `gesstabs.hover.enabled` (boolean, default `true`) — master switch for all gessTabs hovers.
- `gesstabs.hover.macros` (boolean, default `true`) — show the expanded body when hovering a `#name(...)` macro call.
- `gesstabs.hover.expands` (boolean, default `true`) — show the defined value when hovering a bare `#name` `#EXPAND` reference.
- `gesstabs.hover.effectiveElements` (boolean, default `true`) — show the effective `CELLELEMENTS`/`FRAMEELEMENTS` defaults when hovering a `TABLE`/`OVERVIEW`/`XOVERVIEW` statement.
- `gesstabs.hover.macroExpansionStyle` (`"short"` | `"normal"`, default `"short"`) — `short` hides blank lines and comment-only lines from the macro's source in the expanded-body hover; `normal` shows the body exactly as written, blank lines and comments included.
- `gesstabs.hover.keywords` (boolean, default `true`) — show syntax + description for the gessTabs keyword under the cursor.
- `gesstabs.hover.language` (`"auto"` | `"de"` | `"en"`, default `"auto"`) — which manual's descriptions to show; `"auto"` follows VS Code's own display language.
- `gesstabs.autocomplete.enabled` (boolean, default `true`) — suggest keywords, macro names, and previously-defined variable/table names while typing.

## Known Issues

See [TODO.md](TODO.md) for known issues and planned improvements.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md).
