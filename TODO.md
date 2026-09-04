# TODO — open work

Finished work is recorded in git history (and, for everything that predates the
2026-08-27 convention change, in [docs/HISTORY.md](docs/HISTORY.md)). This file
lists only what is **still open**, in rough priority order. Priority is not a
strict queue — an independent lower item can be picked up at any time. Manual
citations point at the local mirror in `dokumentation/online-manual/` (see
[Reference material](#reference-material)).

---

## P0 — Read the dataset's raw variables

**Done 2026-09-03/04.** `src/core/externalNames.ts` / `src/core/savDictionary.ts`
/ `src/core/entryScripts.ts` / `src/providers/externalNamesProvider.ts`, the
`gesstabs.dataInput.entryScriptPatterns` setting. Detailed plan:
**[docs/variable-model-design.md §11](docs/variable-model-design.md)**.

Follow-ups (design doc §11.7): CSV-header-cell go-to-definition, wildcard-path
resolution, column-fixed `DATAFILE` (`INPUT = ….inc;` vardef — `INFILE` is a
documented synonym for `DATAFILE`, same deferred column-fixed case), multi-line
input statements, the `ENCODING <filetype> = …` override, per-workspace-folder
cache for multi-root workspaces. Then P1.4 wires the names into the model as
`origin: 'external'`.

Closed (not doing): SPSS variable/value labels — gessTabs scripts (re)define
them, directly or via `#define … syntax`, so this is not an extension task.
ZSAV inflate — the `.sav` dictionary is uncompressed even in ZSAV, so names +
type already work without it.

---

## P1 — Variable model rebuild

The single biggest structural gap. "What counts as a variable definition vs. a
reference" used to be spread across eleven regex factories, OR-ed per line, and
consumed by go-to-definition, find-references, rename, hover and the F2
diagnostics through three disagreeing notions of "definition". Design pass:
**[docs/variable-model-design.md](docs/variable-model-design.md)**. Several P2/P3
items below are facets of this same problem, marked "(needs P1)".

- **P1.0** (the six §9 open questions) — **done**, all adopted as proposed
  (design doc §9, "P1.0 — resolved").
- **P1.1** (statement classifier `variableStatements.ts` + `toLogicalStatements`,
  `src/core/statements.ts`) — **done**. `‹a› TO ‹b›` turned out to be two
  distinct mechanisms (design doc §9 Q2/§3.1/§4):
  - **Numeric-suffix (definition *and* reference position) — done 2026-09-05.**
    `collectNames` now expands a `VARIABLES a1 TO a9 = …;`/`MAKESINGLES f1 TO
    f17;` range (definition position) and a `RECODE item1 TO item8 …`/`MEAN m
    = Item1 TO Item13;`/`VARFAMILY f = a1 TO a3;`/`COMPUTE COPY …`/`VARGROUP
    ( … )` range (reference position) into every real member via
    `expandNameRange`, not just the two literal endpoints — fixes two real
    gaps: (1) `a2..a8` from a `VARIABLES` range were previously **invisible
    to the model entirely** (not declared, so hover/go-to-def/duplicate-
    declaration/`VariableSymbol.members` never saw them); (2)
    `model.references()` now correctly reports a reference-position range's
    in-between members too (anchored at the whole `‹a› TO ‹b›` phrase, since
    there's no literal token of their own to point at).
  - **`collectVariableOccurrences` wired up too — done 2026-09-05.**
    `NameSpan` gained `synthetic?: boolean` (set by `expandNameRange`'s
    caller for a range-phrase member); `VariableOccurrence` gained
    `literal: boolean`. Find-references (`GesstabsReferenceProvider`) now
    includes a range-synthesised member as a non-literal hit pointing at the
    whole `‹a› TO ‹b›` phrase — a genuine usage location, just not editable
    text. Rename (`GesstabsRenameProvider`) filters to `literal` occurrences
    only before building its `WorkspaceEdit`, since substituting the range
    phrase's text would corrupt the *other* endpoint's own name. Locked in
    with `variableModel.spec.ts` cases for both the non-literal hit and the
    `literal: true` case staying unaffected.
  - **The non-pattern reference-position form — in-script part done
    2026-09-05.** The classifier's post-pass now records every `‹a› TO ‹b›`
    pair `expandNameRange` couldn't expand as `unresolvedRanges: { from,
    to }[]`; `buildVariableModel`'s `references()` resolves each one against
    its own program-order symbol sequence (`firstSeen`) — every declared
    symbol strictly between `from`'s and `to`'s declaration index becomes a
    synthetic (non-literal) reference, same `synthetic`/`literal` machinery
    as the numeric-suffix case, so `collectVariableOccurrences` picks it up
    automatically (find-references shows it, rename correctly skips it) with
    no further plumbing. `‹b›` declared before `‹a›` (the open sub-question)
    is resolved as: swap silently rather than drop the range. Verified
    end-to-end against the exact reported example (four `COMPUTE`-created
    names, `vartext esseWagnerMenge to esseHandelsmarkeMenge = "xxx";`) —
    `variableModel.spec.ts`. **Still open**: a **raw/external** variable's
    "declaration order" — its column position in the SPSS/CSV file — needs
    P1.4 (external names aren't in the model's symbol table at all yet), so
    a range whose endpoint is a dataset variable rather than an in-script
    one isn't resolved yet.
  - `$`-member spans (§9 Q2 — resolve on demand in the model);
    `POSTPROCESS` clause-local virtuals (§5); precise `IN`/`IS`/`[ … ]`
    set-test handling; a full table-driven spec pass (one case per §3/§4 row).
  - `LABELVALUE ‹numvar› = ‹src›;` (+ synonym `SINGLEFROMSTRING`, found
    2026-09-04 in `Anhang > (Kunden-)Spezifika`) — a real atomic-variable-
    creating statement, added to design doc §3.1, not yet in
    `variableStatements.ts`.
  - `IF ‹cond1› ASSERT ‹cond2› [TITLE "…"];` (a THEN-less `IF` variant, same
    page) falls through `classifyIf`'s no-`THEN` branch, which scans the
    whole rest of the statement as condition references — the bare word
    `ASSERT` and the `TITLE "…"` text risk being picked up as phantom
    references (minor false-positive; `EXPR_OPERATORS` could gain `assert`/
    `title` as a quick fix).
- **P1.2** (symbol table `variableModel.ts` + the variable hover) — **done**,
  manually verified in a live Extension Development Host.
- **P1.3** (migrate go-to-definition / find-references / rename / semantic
  highlighting / the F2 empty-varlist + duplicate-declaration checks /
  `GesstabsDocumentSymbolProvider` / `symbolCompletion.ts` onto the model) —
  **done**, manually verified in a live Extension Development Host.
  - **F12 go-to-definition bug — fixed 2026-09-05.** Reported after the
    above verification: F12 over an `IF … THEN` reassignment still listed
    *every other* `IF … THEN` reassignment of the same name as an
    alternate definition target, even though none of them declares
    anything (design §3.3 — gessTabs never treats a reassignment as a
    declaration). Root cause: `GesstabsDefintionProvider` jumped straight
    to `sym.definitions` (every touch, declarations and reassignments
    alike), the same class of bug the hover already had to work around
    earlier by hard-coding `definitions[0]`, but go-to-definition's
    multi-location answer can't just take index 0 — a name legitimately
    declared twice (e.g. once per `#ifdef`/`#else` branch) must still
    surface both. Fix: `VariableSymbol` gained a parallel
    `definitionKinds: ('declaration' | 'assignment')[]` array (the
    `defKind` of the statement behind each `definitions` entry), and a new
    `primaryDefinitions(sym)` in `variableModel.ts` returns every
    `'declaration'`-kind entry when there is at least one, else falls back
    to the single earliest entry (a bare `COMPUTE` that happens to be the
    sole creator). `GesstabsDefintionProvider` now maps over
    `primaryDefinitions(sym)` instead of `sym.definitions`. Covered by
    three new `variableModel.spec.ts` cases (reassignments dropped,
    multi-declaration kept, bare-COMPUTE fallback).
  - Still open (pre-existing, unrelated to the F12 fix above):
  - **`GessTabsWorkspaceSymbolProvider` (Ctrl+T) migrated — done 2026-09-05.**
    Was rebuilding `singleVarDefRe`/`multiVarDefRe`/`computeDefRe`/
    `tableHeadRe` regexes **per keystroke** from the search query — an
    architecturally different, query-driven shape from every other
    consumer. Rebuilt as: `getAllFilenamesInDirectory` finds every
    `.tab`/`.inc` file in the workspace (unchanged), then one
    `buildWorkspaceIndex(files, …)` over the whole set — every file no
    other file `INCLUDE`s becomes its own root, so every independent
    entry program is covered, not just whichever file happens to be open
    (entry scripts are independent programs, not "pick one" — §11.2) —
    feeds one `buildVariableModel`; each symbol contributes
    `primaryDefinitions(sym)` (declaration(s) only, same §3.3 rule the F12
    fix above enforces — a reassignment must not clutter Ctrl+T results
    either). Macro/`#EXPAND` definitions and `TABLE` head/axis names stay
    the same per-document regex/classifier scan
    `GesstabsDocumentSymbolProvider` already uses (unrelated to the
    variable model), just looped over every discovered file instead of
    one open document. `query` is now a plain case-insensitive substring
    filter applied to the full result, not baked into a regex — a
    genuine UX improvement (partial names now match, not just an exact
    whole-word token). The old `spush` name-splitting helper is gone with
    its regex-based callers. Manual verification of Ctrl+T in the live
    Extension Development Host still outstanding.
  - `singleVarDefRe`/`multiVarDefRe`/`computeDefRe`/`tableHeadRe` (their
    only caller was the old `GessTabsWorkspaceSymbolProvider`) join
    `weightcellsRe`/`tableAxisRe` as fully unused dead exports in
    `regex.ts` — low-priority tidy-up (their own `regex.spec.ts` coverage
    is harmless to keep meanwhile). `regex.ts` itself still has live
    callers elsewhere (`diagnostics.ts`, `symbolIndex.ts`,
    `tableElements.ts` — `usageRe`/`wordDefRe`/`multiVarRe`/`expandRe`/
    `macroOwnDefRe`), so full deletion is still a separate, later step.
  - Fold in the `.def` / other INCLUDE-extension fix (design §9 Q6).
- **P1.4** — wire P0's external names into the model as `origin: 'external'`
  symbols, seeded before the program-order pass, **preserving the data
  source's own column order** (SPSS field order / CSV header order — needed
  for P1.1's reference-position `‹a› TO ‹b›`, §9 Q2, to resolve a range whose
  endpoints are raw/external variables). A later in-script `SINGLEQ`/`COMPUTE`
  of the same name is a re-definition, not a duplicate. This is what gives
  go-to-definition and the undefined-variable diagnostic something to land on
  / check against for the bulk of a real project's variables.
- **P1.5** — macro-produced names into the model: numeric params (`&1`),
  comma-separated param lists, mid-token substitution (`&p.recoded`). Builds on
  the existing `findMacroProducedDefinition`. `#DOMACRO` looping stays P3, but the
  model's macro hook is shaped so that work plugs in without reshaping the
  symbol record.
- **P1.6** — new model-based diagnostics: undefined variable (a bare reference
  the model cannot resolve, with no unresolved external source in play);
  system-variable redeclaration (`SysMiss`, `NIL`, `SystemFileNo`,
  `SystemWeight`, `SystemCaseNo` — declaring one is a syntax error, Manual:
  Systemvariablen; the syntax-error catalog (Reference material) wasn't found
  to have an exact matching message on a 2026-09-04 check — worth another look
  before wiring the diagnostic's text); kind-illegal operations (`RECODE`/arithmetic on a
  `VARFAMILY`/`VARGROUP`, an `ALPHA` var in two `AlphaFamily`s, …).

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
  design/performance question. (needs P1)
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
  know which variables are `MULTIQ`. (needs P1; the `HARMONICMEAN`/`GEOMETRICMEAN`/
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
- **`.def` (and any other) INCLUDE file extensions** — the manual's own examples
  use `INCLUDE = Labels.def;`; `includeGraph.ts` follows any filename, but the
  language association (`package.json` `contributes.languages`) and the workspace
  scan (`getAllFilenamesInDirectory(…, '(tab|inc)')`) are `.tab`/`.inc` only. Fold
  into P1.3's remaining file-discovery work (§9 Q6).
- **`#DOMACRO`/`#DOMACRO2`/`#DOMACRO3`/`#DOMACRO4` looping expansion** and the
  `#call( &index &namepart &macroname )` indirect-call pattern (the callee name
  is itself a parameter and never appears literally at the call site) — not
  recognized by the macro hover / expansion engine.
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
   exact wording for P1.6's undefined-variable diagnostic: #10/#20/#69) and
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
