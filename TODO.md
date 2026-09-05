# TODO — open work

Finished work is recorded in git history (and, for everything that predates the
2026-08-27 convention change, in [docs/HISTORY.md](docs/HISTORY.md)). This file
lists only what is **still open**, in rough priority order. Priority is not a
strict queue — an independent lower item can be picked up at any time. Manual
citations point at the local mirror in `dokumentation/online-manual/` (see
[Reference material](#reference-material)).

---

## P0 — Read the dataset's raw variables

**Done 2026-09-03/04** (first cut) **and 2026-09-05** (the §11.7 follow-up
list, closing P0 out completely): `src/core/externalNames.ts` /
`savDictionary.ts` / `entryScripts.ts` / `src/providers/externalNamesProvider.ts`
/ `src/util/glob.ts`, the `gesstabs.dataInput.entryScriptPatterns` setting.
Design: **[docs/variable-model-design.md §11](docs/variable-model-design.md)**.

The 2026-09-05 pass closed every item on the follow-up list:

- **CSV-header-cell go-to-definition** — `ExternalNameSource.columnRanges`
  (each header name's exact character range on line 0 of the CSV/DATAFILE)
  feeds `GesstabsDefintionProvider`'s new `headerCellLocations`, which jumps
  straight into the data file's own header cell, alongside (not instead of)
  the CSVINFILE/DATAFILE statement location.
- **Wildcard-path resolution** — `resolveWildcard` in `externalNames.ts`
  unions every OS-wildcard-matching file's header, alphabetically (the
  manual's own documented order), via the new `ExternalNamesIO.listFiles`;
  `unresolved` only when nothing matches or `listFiles` isn't available.
- **Column-fixed `DATAFILE`/`INFILE`** — `INFILE` is now recognized as
  `DATAFILE`'s documented synonym; `hasVardefStatements` detects a `VARNAME`
  vardef (`VARNAME = <name> <startcol> <width>;`) anywhere in the resolved
  program to tell a genuinely column-fixed `DATAFILE` (still deferred, §6)
  apart from one whose format simply can't be determined.
- **Multi-line input statements** — `findDataSourceStatements` now matches
  whole logical statements (reusing `toLogicalStatements`/`locateInStatement`
  from `src/core/statements.ts`), so a statement wrapped across several
  physical lines is still found; `DataSourceStatement.pathLine`/`pathChar`
  track exactly where the `<filepath>` token itself sits, for the
  DocumentLink.
- **`ENCODING <filetype> = …` override** — `findEncodingOverride` reads an
  `ENCODING DATAFILE = LATIN1|UTF8|UTF16LE|UTF16BE;` statement and forces
  that encoding over the auto-detection for every CSVINFILE/DATAFILE/INFILE
  header read.
- **Per-workspace-folder cache** — `GesstabsExternalNamesManager` now keys
  its `EntryProgram[]` cache and `FileSystemWatcher` per workspace folder
  (`Map<folder, …>`) instead of one shared `scanRoot`/`programs` pair, which
  used to thrash a full rescan every time the active editor switched
  between two folders of a multi-root workspace.

P1.4 already wires the names into the model as `origin: 'external'`.

Not doing: SPSS variable/value labels — gessTabs scripts (re)define them,
directly or via `#define … syntax`, so this isn't an extension task. ZSAV
inflate — the `.sav` dictionary is uncompressed even in ZSAV, so names + type
already work without it.

---

## P1 — Variable model rebuild

The single biggest structural gap: "what counts as a variable definition vs. a
reference" used to be spread across eleven regex factories, OR-ed per line,
and consumed by go-to-definition, find-references, rename, hover and the F2
diagnostics through three disagreeing notions of "definition". Design pass:
**[docs/variable-model-design.md](docs/variable-model-design.md)**. P1.0–P1.6
are effectively **done** (go-to-def/find-refs/rename/semantic highlighting/F2
checks/document & workspace symbols all migrated onto one model; external
raw-dataset names and macro-produced names wired in; undefined-variable and
system-variable-redeclaration diagnostics shipped), and a 2026-09-05 pass
closed out every reported false positive plus most of the smaller remaining
gaps in one go — see git log for the detailed history. Fixed that day: a
column-1 macro call needing no trailing `;` (was fusing itself with
everything after it into one garbled statement); the "data source
unreadable" diagnostic ignoring `#ifdef`/`#define` entirely; a real
three-state `#ifdef`/`#ifndef` in `resolveIncludeGraph` (confidently
defined / confidently not / never mentioned anywhere → `uncertain`, keep
both arms — such a switch is routinely set from outside the script, plus a
related latent `#IF[N]EMPTY`/`#IF[N]EXIST`+`#else` bug the new tests caught
along the way); `classifyTable` sweeping a `FILTER`/`IN`/`#name(...)`
cell-content clause's own keywords in as phantom references; `LABELVALUE`/
`SINGLEFROMSTRING` and the THEN-less `IF … ASSERT … TITLE` variant missing
from the classifier; ten dead `regex.ts` exports (more than the one item
originally tracked here — nothing outside its own tests imports them any
more); and malformed statements (`groups sysmiss;`, missing `=`) never
surfacing as a diagnostic. The `kMarkenAbCode1` false-positive report is
presumed (not re-confirmed) fixed by the macro-semicolon fix; the
`#meantest`/`filter`/`in` report is confirmed fixed by the `classifyTable`
fix, covered directly by its own test.

**Also done 2026-09-05**: `classifyTable` rewritten into a real parser
against the manual's full `TABLE`/`OVERVIEW`/`XOVERVIEW` grammar
(`dokumentation/online-manual/md/Datenauswertung _ Kreuztabelle _
Syntax.md`) instead of the previous keyword-allowlist scan —
`taboptions` (`ADD`/`NAME <tablename>`/`TITLE`/`CELLELEMENTS(…)`/
`FRAMEELEMENTS(…)`/`TABLEFORMATS(…)`/`CONTENTKEY`/`HIDDEN(…)`/`SORT AS
<tablename>`) are now fully consumed without leaking into `references`;
each `part`'s `content` recognizes a bare `<varname>`, a
`<cellelement>( <varname> [<varname>] [BY <varname>] )` call (the
cellelement keyword itself is never a phantom ref — fixes e.g. `TABLE = a
MEAN(v1) BY c;` wrongly referencing `mean`), and the
`:DESCRIPTION`/`:USEVARTITLE`/`:FORMAT` suffix (confirmed from the manual's
own worked examples to sit *before* the `(…)`, not after, contrary to its
own ambiguous EBNF table row); `FILTER <condition> |` refs are `ifKnown`,
matching `classifyIf`'s existing condition convention; the part-option
`SORT sorttype [DESCEND] [PANE…] [TOP|BOTTOM|EXTREME|SLICE|LSLICE|RANGE…]`
clause never produces a reference. `NAME`/`SORT AS <tablename>` are
recognized and excluded (a table name is a different kind of symbol than a
variable, out of scope for the variable model itself) without being
modeled as their own symbol kind. Known remaining imprecision: a bare
`CELLELEMENT`-style keyword used as `content` with no `(...)` args (e.g.
`MEANTEST` in `TABLE = v1 BY v1 MEANTEST;`) is indistinguishable from a
real `<varname>` without a maintained keyword allowlist — falls through to
the `<varname>` rule, same as today's `IF`/`FILTER` condition parsing does
for its own bare words; not attempted here, same class of problem as the
keyword-allowlist question kind-illegal-operations below would also need.

Still open:

- **`$`-member spans, `POSTPROCESS` clause-local virtuals, and precise
  `IN`/`IS`/`[ … ]` set-test handling** (design doc §5/§9 Q2) — not yet
  precisely modeled in `variableModel.ts`; a separate effort from the
  `TABLE`-statement grammar above (now done). Needs a full table-driven
  spec pass (one case per §3/§4 row). Large — no further slice of this
  attempted yet. See also the sibling manual page `Datenauswertung _
  Kreuztabelle _ Weitere Optionen.md` for whatever it adds beyond the
  `TABLE` syntax page already mined above.
- **Kind-illegal operations** (`RECODE`/arithmetic on a `VARFAMILY`/
  `VARGROUP`, an `ALPHA` var in two `AlphaFamily`s, …) — a fuzzier, larger
  effort than the diagnostics already shipped; no single "which statement
  forms are illegal for which kind" list assembled yet. Needs a research
  pass over the manual before any code.

---

## P2 — Diagnostics & block constructs

- **Runtime-block folding + unmatched-block diagnostics** for
  `IFBLOCK`/`ELSEBLOCK`/`ENDBLOCK` (nesting depth up to 512),
  `WHILEBLOCK <cond> DO … ENDBLOCK`, `SETFILTER [name] … ENDFILTER [name]` (a
  named `ENDFILTER` closes every `SETFILTER` down to the named one, and errors if
  that name is not on the stack) and `#STARTEXPORT`/`#ENDEXPORT`. Today only
  `#MACRO`/`#IFDEF` blocks fold and get checked. Consumes P1.1's `block` flags.
- **Cross-`INCLUDE` scope for the F2 diagnostics.** `checkDuplicateDeclarations`
  and `checkDefineCaseMismatch` are document-scoped, so a duplicate declaration
  or `#define`-case mismatch across an `INCLUDE` boundary is missed.
  `includeGraph.ts` / `symbolIndex.ts` already resolve the workspace; running
  that on every keystroke across the whole resolved program is the open
  design/performance question.
- **`CALCULATECOLUMN` / `COLUMNSUMMARY` single-`CELLELEMENT` rule** — the
  preceding table must carry exactly one elementary `CELLELEMENT`
  (`COLUMNPERCENT` **or** `ABSOLUTE`, not both, and no composite like
  `ABSCOLPERCENT`). Purely syntactic against the effective `CELLELEMENTS` the
  extension already computes for its hover. (Manual: Berechnung von
  Tabelleninhalten.)
- **Mutually-exclusive cell-option diagnostics** beyond the existing
  `CELLSET`/`INVERTOUT`+`UPDATEINVERT` check: `HARMONICMEAN`/`GEOMETRICMEAN` with
  other cell contents, `MEDIAN` beyond frequencies/percentiles,
  `COLUMNPERCENT100` with a multi-response variable — the last needs the model to
  know which variables are `MULTIQ`. (The `HARMONICMEAN`/`GEOMETRICMEAN`/
  `MEDIAN` rules and the existing `CELLSET` allow-list are independently
  confirmed against `Datenauswertung > Statistische Maßzahlen > Zellenelemente >
  Besonderheiten`, now mirrored.)
- **Cheap syntactic checks** in the spirit of the current F2 set:
  `VALUELABELS <a> <b> = ADD …` (a varlist with `ADD` → Syntaxerror 528; `ADD` is
  one-variable-only); `OVERCODE <a> : <b>` where the range span exceeds 100 000
  (error) / 5 000 (warning) — same shape as `checkRecodeBounds`.
- **Deprecated-keyword diagnostic** — flag retired keywords. Full list now
  mined from the newly-mirrored `Anhang > Historisches > Abgelöste Befehle`
  page into `keywordData.ts`: `AutoClear`, `AutoOverSort` (+
  `IndentAutoOversort`), `CalcColLowAccuracy`,
  `CHIQUMinimum`/`ChiQUColMinumum`/`ChiQURowMinimum`, `LowerCase`, `MarkCells`
  (alte Version), `Nominations`/`NominationsTitle`, `Outfile`, `TableType`,
  `UseFilter`/`MakeFilter`, `YSignifInFront` — each names its replacement on
  that page; read it for the exact "use X instead" wording per keyword before
  writing the diagnostic message.

---

## P3 — Editor niceties (independent, opportunistic)

- **`DocumentLink` provider for filename references** — `INCLUDE = <file>;`,
  `VALUELABELS … = LABELFROMFILE <file>;`, `#DOMACRO3( name, <file>.csv )` /
  `#DOMACRO4( <file>.csv )`, `DATAFILE`/`CSVINFILE`/`SPSSINFILE`/`SYNTAX = <file>`
  — none are clickable today. Pairs naturally with P1.4, which already resolves
  the data-source paths.
- **`#DOMACRO`/`#DOMACRO2`/`#DOMACRO3`/`#DOMACRO4` looping expansion** and the
  `#call( &index &namepart &macroname )` indirect-call pattern (the callee name
  is itself a parameter and never appears literally at the call site) — not
  recognized by the macro hover / expansion engine, nor by P1.5's macro-produced-
  name enumeration.
- **`#EXPANDINTOKEN &search& <replace>` and `#EXPANDINC`** — `#EXPANDINTOKEN`
  uses `&search&` delimiters (trailing `&` too, unlike a `&param` macro name) and
  rewrites inside tokens (`DATAFILE = study&land&.dat;`); `#EXPANDINC` increments
  its integer value on each expansion (the expand hover should reflect that, not
  the literal seed).
- **Formatter: align `=` in option lists, wrap long `TABLEFORMAT`/`CELLELEMENTS`
  flag lists** — deferred; no authoritative gessTabs style guide to formalize
  against, so today only mechanical whitespace/indent changes are made.
- **Keyword-hover-content setting** (`gesstabs.hover.keywordContent`:
  `"both"` | `"syntaxOnly"` | `"descriptionOnly"`), shaped like the existing
  `gesstabs.hover.macroExpansionStyle`. Build only if a real "denser hovers while
  editing" need actually surfaces.

---

## Ongoing

- **Keyword database gaps.** `src/keywords/keywordData.ts` is the hand-maintained
  source of record now (the manuals moved online and won't be re-extracted).
  Patch entries directly as gaps/errors are noticed. Known issue: the
  `VALUELABELS` entry's `description` is actually about the STRICTVARLIST /
  empty-varlist error (an extraction artifact) — replace it with a real
  description from the Texte / Label-Eigenschaften pages.
- **Mine the online manual further.** It has substantially more detail than the
  extension currently reflects — worth revisiting during any refactor, not just
  the P1 rework.

---

## Reference material

The whole `dokumentation/` tree is git-ignored — local reference only, not
committed. When looking something up, use these in order (most useful first):

1. **`dokumentation/online-manual/md/*.md`** — **start here.** Pages of the
   current online manual converted to Markdown (clean UTF-8, code examples as
   fenced blocks). All 71 HTML pages currently saved under `online-manual/` are
   converted (as of 2026-09-04). Covers the topics the open work above needs:
   `Variablentypen`, `Bildung neuer Variablen`, `Variablen-Eigenschaften`,
   `Texte`, `Label-Eigenschaften`, `Systemvariablen`, `Compute`, `Berechnung von
   Tabelleninhalten`, `Logische Bedingungen`, `Statistische Funktionen`, `Filter`
   / `Fallselektion` / `Bedingte Tabellenanzeige`, `Rundungen`, `Gruppierungen`
   (Obercodes / Indexvariablen / Variablenfamilien / Variablengruppen), `Das
   Skript`, `Makros`, `Textersatz`, `In- und Output von Datensätzen`,
   `Handhabung von ASCII-Daten`, plus `hmkwindex` (keyword index). Two pages
   worth knowing about specifically: `Anhang > Liste aller
   Syntaxfehlermeldungen` (the full ~850-message compiler error catalog — e.g.
   exact wording for undefined-variable-style diagnostics: #10/#20/#69) and
   `Anhang > Historisches > Abgelöste Befehle` (the deprecated-keyword list,
   see P2).
2. **`dokumentation/online-manual/*.html`** — the browser-saved source pages;
   check these when the Markdown conversion dropped a table or detail.
   `dokumentation/online-manual/_convert.py` (bs4 + markdownify, git-ignored
   along with the rest of `dokumentation/`) regenerates `md/<name>.md` from
   any `<name>.html` — run it again after saving a new or updated page. Not
   mirrored yet and needed for P1.4/P0's SPSS/CSV follow-ups: `csv.html`,
   `spss2.html`, `invertierte-datensaetze.html`, `openq-files.html`,
   `assoc.html`, `dbase-input.html`, `columnbinary-format.html` (all linked
   from `In- und Output von Datensätzen`, none saved yet).
3. **Online gessTabs manual** — the authoritative source, but the site sits
   behind a Cloudflare JS challenge, so `WebFetch` / `curl` / `wget` all get
   HTTP 403 and only a real browser can reach it (re-save pages into
   `online-manual/` as needed). Entry point:
   [Startseite](https://help.gessgroup.de/gesstabs-help/) ·
   [Referenzindex](https://help.gessgroup.de/gesstabs-help/hmkwindex.html) ·
   [Variablen](https://help.gessgroup.de/gesstabs-help/variablen.html) ·
   [Variablen bilden](https://help.gessgroup.de/gesstabs-help/bildung-neuer-variablen.html) ·
   [Das Skript](https://help.gessgroup.de/gesstabs-help/das-skript.html).
4. **`dokumentation/GESStabs-Handbuch_engl.md`** (English) /
   **`dokumentation/gesstabs_handbuch_52.md`** (German, umlauts mangled to `�`) —
   the older full handbook as one converted-PDF file; cross-check and for
   anything the mirrored pages don't cover. Also `manual_index_list.tab` (flat
   keyword list) and `syntax.txt`.
