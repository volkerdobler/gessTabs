# TODO — open work

Finished work is recorded in git history (and, for everything that predates the
2026-08-27 convention change, in [docs/HISTORY.md](docs/HISTORY.md)). This file
lists only what is **still open**, in rough priority order. Priority is not a
strict queue — an independent lower item can be picked up at any time. Manual
citations point at the local mirror in `dokumentation/online-manual/` (see
[Reference material](#reference-material)).

---

## P1 — Variable model rebuild

The single biggest structural gap: "what counts as a variable definition vs. a
reference" used to be spread across eleven regex factories, OR-ed per line,
and consumed by go-to-definition, find-references, rename, hover and the F2
diagnostics through three disagreeing notions of "definition". Design pass:
**[docs/variable-model-design.md](docs/variable-model-design.md)**. P1.0–P1.6
are done — go-to-def/find-refs/rename/semantic highlighting/F2 checks/document
& workspace symbols all migrated onto one model; external raw-dataset names,
macro-produced names, and the full `TABLE`/`OVERVIEW`/`XOVERVIEW` grammar wired
in; undefined-variable and system-variable-redeclaration diagnostics shipped.
See git log for the detailed history (P0's read-the-dataset work and every
P1.0–P1.6 fix/rewrite along the way).

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

Runtime-block folding + unmatched-block diagnostics (`IFBLOCK`/`ELSEBLOCK`/
`ENDBLOCK`/`WHILEBLOCK`/named-and-unnamed `SETFILTER`/`ENDFILTER`/
`#STARTEXPORT`/`#ENDEXPORT`), the cross-INCLUDE half of
`checkDuplicateDeclarations`, the `CALCULATECOLUMN` single-`CELLELEMENT`
rule, the `HARMONICMEAN`/`GEOMETRICMEAN`/`MEDIAN` cell-option
incompatibilities, and the `VALUELABELS … = ADD`/`OVERCODE` range-span
cheap syntactic checks are done — see git log for the detailed history
(2026-09-05).

Still open:

- **`checkDefineCaseMismatch`'s own cross-INCLUDE half** — unlike
  duplicate-declaration, `#define` visibility isn't tracked by the
  `VariableModel` at all; `includeGraph.ts`'s `DefineSet` only exists
  within `resolveIncludeGraph`'s own single pass, not exposed per-file.
  Own follow-up, not attempted yet.
- **`COLUMNPERCENT100` with a multi-response variable** — turned out
  fuzzier than "needs the model to know which variables are `MULTIQ`" on
  inspection: `keywordData.ts`'s own `COLUMNPERCENT100` entry names *four*
  different "not suitable for" conditions (multi-response vars,
  `OVERCODE`s, tables with suppressed `MISSING VALUES`, "selectively built
  variables"), phrased as a caveat rather than a hard error, and only one
  of the four is the `MULTIQ` check this item originally asked for. Left
  out rather than coding a rule the source doesn't actually specify that
  precisely.
- **Deprecated-keyword diagnostic** — flagging retired keywords. **Reading
  `Anhang > Historisches > Abgelöste Befehle` directly (2026-09-05) changes
  this significantly**: of the 11 keywords originally listed here, only
  `UseFilter`/`MakeFilter` is actually described as no longer working
  ("seit Version 2.82 außer Dienst gestellt"). Every other one —
  `AutoClear`, `AutoOverSort` (+ `IndentAutoOversort`), `CalcColLowAccuracy`,
  `CHIQUMinimum`/`ChiQUColMinumum`/`ChiQURowMinimum`, `LowerCase`,
  `MarkCells` (alte Version), `Nominations`/`NominationsTitle`, `Outfile`,
  `TableType`, `YSignifInFront` — is explicitly described as **still
  supported**, just superseded by a newer/preferred mechanism (e.g.
  "`LOWERCASE` gibt es also zwar noch in GESStabs, aber nur aus Gründen der
  Kompatibilität"; `MARKCELLS` alte Version "wird gegenwärtig noch
  unterstützt"; `Outfile`/`TableType`/`NominationsTitle` are just permanent
  synonyms; `AutoOverSort` legally coexists with the newer `AutoSortTree`).
  A diagnostic flagging all 11 as "deprecated" would misinform users about
  10 of them. If this is still wanted, scope it to just `UseFilter`/
  `MakeFilter` rather than the full original list.

---

## P3 — Editor niceties (independent, opportunistic)

`DocumentLink` for filename references (`INCLUDE`, `VALUELABELS …
LABELFROMFILE`, `#DOMACRO3`/`#DOMACRO4`'s CSV argument, `SYNTAX`), `#DOMACRO`/
`#DOMACRO2` looping expansion, the `#call(&index &namepart &macroname)`
indirect-call idiom, and `#EXPANDINTOKEN`/`#EXPANDINC` are done — including
wiring the loop/indirect-call expansion into P1.5's macro-produced-name
enumeration, so a variable only reachable that way is no longer flagged as
undefined. See git log for the detailed history (2026-09-06).

Still open:

- **`#DOMACRO3`/`#DOMACRO4`'s own looping expansion** — unlike their filename
  argument (handled by the DocumentLink provider above), the parameter list
  itself comes from a CSV file rather than the source text, genuine file I/O
  that `macroExpansion.ts` deliberately stays free of (same split as
  `externalNames.ts`/`externalNamesProvider.ts`). Not attempted.
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
   mirrored yet and needed for P1.4's SPSS/CSV follow-ups: `csv.html`,
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
