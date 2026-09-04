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
    - **Follow-up over-correction, fixed same day (2026-09-05).** The
      "fall back to the single earliest entry" branch above was too
      blunt: a name created by a bare `COMPUTE` once in each arm of an
      `#ifdef`/`#else` (`#ifdef X; compute v = 1; #else; compute v = 2;
      #end;`) is exactly as legitimate as two real declarations in
      `#ifdef`/`#else` — just spelled with `COMPUTE` (`defKind:
      'assignment'` either way, §3.3) — and was silently collapsed to
      only the first arm, both in the F12 fix above and in Ctrl+T
      (reported while manually verifying the `GessTabsWorkspaceSymbolProvider`
      migration below). Root cause: nothing distinguished "two locations
      that could both run on the same real build, one after the other"
      (a genuine reassignment) from "two mutually exclusive branches of
      the same conditional" (each independently *the* creator for
      whichever arm compiles). Fix: a new `src/core/branchPaths.ts`
      module (`BranchPath`/`branchPathsCompatible`) plus
      `IncludeGraphResult.branchPaths` — `resolveIncludeGraph` already
      walks the `#ifdef`/`#else`/`#end` stack to decide line activity, so
      it now also records, per line, which arm of which conditional group
      it's nested in (a `groupId` added to its internal
      `ConditionalFrame`); threaded through `WorkspaceIndex.branchPaths`
      into a new parallel `VariableSymbol.definitionBranches` array.
      `primaryDefinitions()`'s fallback now keeps an assignment-kind entry
      as primary unless it's execution-compatible with an already-kept
      one (i.e., could genuinely follow it on some real build) — mutually
      exclusive branches both survive, a same-path reassignment still
      doesn't. **Known, accepted gap**: a conditional does not carry
      across an `INCLUDE` boundary (each visited file gets its own fresh
      stack, matching the resolver's pre-existing per-file gating) — two
      different `INCLUDE`s inside `#ifdef`/`#else` arms aren't recognised
      as mutually exclusive by `branchPaths`; real-world `#ifdef`/`#else`
      pairs almost always wrap the affected statements directly rather
      than an `INCLUDE` of them, so this doesn't affect the reported
      case. Covered by new tests in `test/includeGraph.spec.ts`
      (`resolveIncludeGraph — branchPaths`), `test/branchPaths.spec.ts`,
      and three more `variableModel.spec.ts` `primaryDefinitions` cases
      (kept per `#ifdef`/`#else` arm, still-excluded same-arm reassignment,
      an unconditional creator still dominating a later conditional touch).
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
    its regex-based callers.
    - **Manual verification 2026-09-05** (live Extension Development
      Host): substring search, dropping IF-THEN reassignments, and
      `#MACRO`/`#EXPAND` names all confirmed working. Cross-entry-program
      lookup not tested. Two problems found:
      - A name declared once per `#ifdef`/`#else` arm only showed the
        first arm — this was the `primaryDefinitions()` over-correction,
        **fixed** (see the F12 bug's follow-up note above; same root
        cause, same fix, both consumers share `primaryDefinitions()`).
      - A `TABLE` axis name wasn't found — **not a bug**: the user
        confirmed that specific variable is read from the raw dataset,
        never declared in-script. Expected given P1.4 isn't done yet (raw/
        external names aren't in the model at all — see P1.4 below); once
        P1.4 lands, Ctrl+T should find it as an `origin: 'external'`
        symbol.
      - **Containers reading "unknown" — fixed 2026-09-05.** A bare
        `COMPUTE`'s `targetKind` is `'unknown'` until something narrows it
        (ALPHA/OPEN, design §3.2) — `sym.kind` as the Ctrl+T container
        showed that raw value verbatim for the (very common) plain-
        `COMPUTE` case. Now uses the declaring statement's own keyword
        (`compute`/`singleq`/`varfamily`/…, re-derived from
        `primaryDefinitions()`'s `statement` text via `classifyStatement`)
        instead, falling back to `sym.kind` only if that somehow fails.
  - `singleVarDefRe`/`multiVarDefRe`/`computeDefRe`/`tableHeadRe` (their
    only caller was the old `GessTabsWorkspaceSymbolProvider`) join
    `weightcellsRe`/`tableAxisRe` as fully unused dead exports in
    `regex.ts` — low-priority tidy-up (their own `regex.spec.ts` coverage
    is harmless to keep meanwhile). `regex.ts` itself still has live
    callers elsewhere (`diagnostics.ts`, `symbolIndex.ts`,
    `tableElements.ts` — `usageRe`/`wordDefRe`/`multiVarRe`/`expandRe`/
    `macroOwnDefRe`), so full deletion is still a separate, later step.
  - **`.def` INCLUDE extension — done 2026-09-05 (design §9 Q6).** The
    manual's own `INCLUDE` example uses it (`INCLUDE = Labels.def;`,
    "Arbeit mit GESStabs > Das Skript") and `resolveIncludeGraph` never
    actually restricted an `INCLUDE` target's extension in the first
    place (it just reads whatever path the statement names) — the one
    place still gate-kept to `.tab`/`.inc` was the workspace-wide file
    *discovery* feeding `findWorkspaceFiles`/`GessTabsWorkspaceSymbolProvider`.
    Fix: `package.json`'s `languages[0].extensions` gained `.def`
    (syntax highlighting / language mode for `.def` files opened
    directly); both `getAllFilenamesInDirectory(…, '(tab|inc)')` call
    sites (`workspaceFiles.ts`'s `findWorkspaceFiles`, used by go-to-def/
    find-references/rename/macro CodeLens, and
    `GessTabsWorkspaceSymbolProvider`) now pass `'(tab|inc|def)'`.
    `entryScripts.ts`'s `.tab`-only entry-point discovery is deliberately
    untouched — a `.def`/`.inc` file is never its own entry point.
- **P1.4** — wire P0's external names into the model as `origin: 'external'`
  symbols. **Core model + go-to-definition done 2026-09-05**:
  - `buildVariableModel(index, { externalNames })` — `externalNames.ts`'s
    already-resolved `ExternalNameSource[]` (this module stays pure, no
    filesystem I/O of its own) seeds one `origin: 'external'` symbol per raw
    column/field, before the program-order pass, with a `firstSeen` index
    negative enough to sit before every real statement — visible from the
    very start of the program (the dataset loads before any script line
    runs), same reasoning as `PREDEFINED`, but **preserving the data
    source's own column order** across the flattened source-then-column
    sequence (needed for P1.1's reference-position `‹a› TO ‹b›`, §9 Q2, to
    resolve a range whose endpoints are raw/external variables — now
    covered). Its one `definitions` entry points at the
    `CSVINFILE`/`SPSSINFILE`/`DATAFILE` statement itself (the only
    "declaration" a raw column has), `definitionKinds: ['declaration']` so
    `primaryDefinitions()` picks it up like any real declaration. A later
    in-script **declaration**-kind statement (`SINGLEQ`/`VARFAMILY`/…)
    promotes `origin` to `'declared'` — a re-definition, not a duplicate —
    while a mere `COMPUTE`/`IF…THEN` touching it (recoding a raw column
    in place is common) does **not** promote it (§3.3: never a
    declaration). A name already `predefined` is never shadowed by a
    same-named raw column. Six new `variableModel.spec.ts` cases.
    `GesstabsDefintionProvider` now builds with
    `{ externalNames: await this.externalNames.sourcesFor(document) }` (new
    constructor param, `GesstabsExternalNamesManager` — same instance
    `GesstabsVariableHoverProvider` already receives) — F12 on a raw
    dataset variable now jumps to its data-source statement. Manual
    verification in a live Extension Development Host confirmed working
    (F12 on a raw dataset variable jumps to its data-source statement).
  - **Find-references / rename / Ctrl+T wired too — done 2026-09-05**:
    - `collectVariableOccurrences` gained a 4th `opts?: BuildVariableModelOptions`
      param, threaded into its own internal `buildVariableModel` call, plus
      a new case: a bare word-scan can never find a raw column's own
      "declaration" (the CSVINFILE/SPSSINFILE/DATAFILE line never
      literally mentions the column name — it's parsed from the data
      file's header/dictionary, not written in the script), so an
      `origin: 'external'` symbol's `definitions` are now added as
      explicit non-literal entries (same treatment the numeric-suffix/
      non-pattern `TO`-range members already got) — included in
      find-references, filtered out of rename by the existing
      `literal`-only rule. Two new `variableModel.spec.ts` cases (a quoted
      reference to a raw column now resolves once `externalNames` is
      passed; the CSVINFILE line itself shows up, and is excluded exactly
      like any other definition when `excludeDefinitions` is set).
    - `GesstabsReferenceProvider` now takes the same
      `GesstabsExternalNamesManager` constructor param and passes
      `sourcesFor(document)` through — Find All References on a raw
      dataset variable now finds every literal usage plus the data-source
      line.
    - `GesstabsRenameProvider` also takes it, but for the opposite
      reason: renaming a raw column's script references without
      renaming the actual dataset column would silently leave the script
      referring to a name no real column matches — `provideRenameEdits`
      now resolves `word` against a model built with `externalNames`
      first and **throws** (shown to the user as an error, VS Code's
      standard rename-provider-failure UX) when its `origin` is still
      `'external'`. An already-`declared` symbol (a real in-script
      declaration re-defined it, see `primaryDefinitions`) renames
      normally — only a still-purely-external name is blocked.
      - **UX follow-up, fixed same day**: without a `prepareRename`
        method, VS Code unconditionally opens the rename input box (plus
        its own rename-suggestions popup) the instant F2 is pressed, and
        only calls `provideRenameEdits` — and shows its thrown error —
        once the user commits a name. Reported: on an external variable,
        the rejection *did* show, but a few seconds later the rename box
        reopened/lingered and covered it. Added `prepareRename`, running
        the identical origin check the moment F2 is pressed — throwing
        there shows the reason immediately, inline, and the input box
        never opens at all. `GesstabsExternalNamesManager`'s own program/
        bytes caches make the repeated `sourcesFor` lookup inside
        `provideRenameEdits` afterward (kept as defense in depth for
        programmatic callers) effectively free.
    - `GessTabsWorkspaceSymbolProvider` (Ctrl+T) also takes it; since
      Ctrl+T is workspace-wide (no single "current document" to scope
      `sourcesFor` to), it instead unions every entry program's sources
      via `getPrograms()`, deduped by statement location the same way
      `sourcesFor` already dedupes. `model.all()`'s origin filter grew
      `'external'`; the container label is `'external'` outright (a raw
      column's `sym.kind` is always the generic `'atomic'`, and its
      "declaring statement" — the data-source line — isn't part of the §3
      grammar `classifyStatement` recognises at all, so there's no
      keyword to borrow the way a real declaration's container gets one).
    - `GesstabsVariableHoverProvider` remains deliberately **not**
      touched — it already has its own, separately working
      `externalSourcesFor` fallback (recently tuned, see git log), and
      wiring `externalNames` into its own model build would change *when*
      that fallback fires without a live-tested reason to.
    - **Still open**: the undefined-variable diagnostic itself (P1.6) —
      this phase is what it will check against.
- **P1.5** — macro-produced names into the model. **Core done 2026-09-05**
  (ahead of P1.6, which needs it to avoid false "undefined variable"
  positives on a macro-produced name — see P1.6 below):
  - `findAllMacroProducedNames(index)` (`symbolIndex.ts`) — the enumerative
    sibling of the existing `findMacroProducedDefinition` (which answers
    "who produced *this one* word", searched backward from a single
    position, for the go-to-def fallback). Walks every macro call site in
    the program once, substitutes its target macro's body the same way
    `findMacroProducedDefinition`/the macro hover already do, and
    classifies each substituted body line (`classifyStatement`) to
    collect every name it `defines` — covering numeric params (`&1`),
    comma-separated param lists, and mid-token substitution (`&p.recoded`,
    verified: `singleq &fr.a = 1;` called with `alter` → `alter.a`) for
    free, since substitution itself already handles all three (§9 wording
    "Builds on the existing findMacroProducedDefinition" undersold it —
    the *substitution* machinery already covered these; only the
    *enumeration* was missing). `#DOMACRO` looping stays P3.
  - `buildVariableModel(index, { macroExpansion: true })` — **opt-in**,
    unlike `externalNames` (always-on once passed). Seeds one
    `origin: 'macro-produced'` symbol per produced name, `firstSeen` at
    the call site's own statement index (visible from the call onward,
    honouring no-forward-reference same as everywhere else) — merges into
    an existing symbol via the identical "existing vs new" logic
    `externalNames` seeding already established (a name a real in-script
    **declaration** also names promotes `'external'`→`'declared'` the
    same way; a name called via the same macro more than once just gets
    another `definitions` entry). Opt-in because a consumer that already
    special-cases macro-produced names itself —
    `GesstabsDefintionProvider`'s existing `findMacroProducedDefinition`
    fallback, which additionally shows the call site, something a single
    `definitions` entry can't — must not have the model start resolving
    them out from under it and silently dropping that second location;
    **not wired into any consumer yet**, P1.6's diagnostic is the
    motivating one. Five new `symbolIndex.spec.ts` cases +
    five new `variableModel.spec.ts` cases (opt-in gating, visible from
    the call site, no-forward-reference, external→declared promotion,
    called-twice). `#DOMACRO` looping stays P3, but the model's macro
    hook is shaped so that work plugs in without reshaping the symbol
    record.
- **P1.6** — new model-based diagnostics. **Undefined variable +
  system-variable redeclaration done 2026-09-05**:
  - New `src/core/modelDiagnostics.ts` — checks that need the
    whole-workspace variable model (cross-`INCLUDE`, external/raw-dataset
    names, macro-produced names), unlike `diagnostics.ts`'s document-scoped,
    classifier-only checks (which explicitly document cross-`INCLUDE` scope
    as a known gap). Reuses `diagnostics.ts`'s `DiagnosticIssue` shape.
    - `checkUndefinedVariables(model, file)` — every `cls.references` span
      (across `model.statements`, filtered to `file`) `model.resolve()`
      can't resolve at its own position becomes a **Warning**
      `undefined-variable`. Skips `mode: 'never'`, a `synthetic` span
      (already covered elsewhere), and — the manual's quoted-token rule,
      already how `model.references()` itself behaves — an unresolved
      **quoted** `ifKnown`-mode token (ambiguous label text, not a name).
      Requires the model to be built with `externalNames` **and**
      `macroExpansion: true` or every raw/macro-produced name would
      falsely flag — the caller's job.
    - `checkSystemVariableRedeclaration(model, file)` — any statement
      that `defines` (not merely `references`) `SysMiss`/`NIL`/
      `SystemFileNo`/`SystemWeight`/`SystemCaseNo` becomes an **Error**
      `system-variable-redeclaration` (Manual: Systemvariablen, verbatim:
      *"Der Versuch, eigene Variablen mit diesen Namen zu **generieren**,
      führt zu einem Fehler."* — the syntax-error catalog wasn't found to
      have an exact matching message on a 2026-09-04 check, so the wording
      here is descriptive, not a verbatim compiler message). Deliberately
      reads the classified statements directly rather than
      `model.all()`/`resolveAnywhere`: `buildVariableModel`'s main pass
      never lets anything overwrite a `predefined` symbol, so a `SINGLEQ
      SysMiss = 1;` is silently dropped by the model itself and invisible
      to any symbol-table-based check.
      - **Fixed 2026-09-05, reported the same day**: initially gated on
        `cls.defKind === 'declaration'`, so `compute sysmiss = 1;` slipped
        through while `singleq sysmiss = 1;` was caught. The manual says
        "generieren" (generate), not "deklarieren" — `COMPUTE`/`IF…THEN`
        generates a variable exactly as much as `SINGLEQ` does (§3.3:
        gessTabs auto-creates on first `COMPUTE`), so the `defKind` gate
        was simply wrong; now checks every `defines` span regardless of
        kind. A mere *use* of the name (a `references` span — `if SysMiss
        eq 1 then x = 2;`) is completely legal and still never flagged.
        Two new tests (`COMPUTE` target, `IF…THEN` target) plus one
        confirming the reference-only case stays clean.
    - Wired into `GesstabsExternalNamesManager.refresh()` (the
      `'gesstabs-datasource'` collection — it already owns the
      "which program(s) own this file / is any of their sources
      unresolved" logic `checkUndefinedVariables`'s suppression rule
      needs, via the existing `sourcesFor`/`programsForFile`) rather than
      the separate F2 `GesstabsDiagnosticsManager`, which stays
      document-scoped/regex-classifier-only. **Suppression** (design §9
      "P1.6 (B)", settled 2026-09-04): `checkUndefinedVariables` is
      skipped entirely — not just filtered — when this document belongs
      to no known entry program (an orphan `.inc`, ambiguous ownership) or
      any of its owning program(s)' data sources is `'unresolved'`; ships
      under the existing `gesstabs.diagnostics.enabled` switch (the
      collection's whole `refresh()` already gates on it).
      `checkSystemVariableRedeclaration` always runs — a pure syntax
      check, independent of data-source resolution.
    - 15 new `modelDiagnostics.spec.ts` cases (in-script resolution,
      external/macro-produced names silencing false positives, the
      quoted-token rule holding in both `COMPUTE` and `IF` condition
      position, no-forward-reference, per-file filtering across an
      `INCLUDE`, redeclaration case-insensitivity, `COMPUTE` not
      flagged). Full suite passes (442), lint clean, typechecks clean,
      compiles. Manual verification in a live Extension Development Host
      still outstanding — this is the first genuinely new, user-visible
      diagnostic this phase adds (P1.0–P1.5 were tooling migrations of
      already-existing features), so it deserves real scripts, not just
      unit tests, before calling it settled.
    - Known perf note (not yet a problem, not yet measured): `refresh()`
      now builds a full `buildWorkspaceIndex` + `buildVariableModel` of
      its own, on top of what `getPrograms()`/`sourcesFor()` already
      resolve and what the F2 `GesstabsDiagnosticsManager` and any open
      hover/go-to-def request separately rebuild — no caching yet
      anywhere in this pipeline (design §9 "Perf → LRU first, measure").
  - **Still open**: kind-illegal operations (`RECODE`/arithmetic on a
    `VARFAMILY`/`VARGROUP`, an `ALPHA` var in two `AlphaFamily`s, …) — a
    fuzzier, larger effort than the other two (no single "which statement
    forms are illegal for which kind" list assembled yet), deliberately
    left for a separate pass.
  - **Still open — malformed statements never surface as a diagnostic.**
    Found 2026-09-05 while checking `groups sysmiss;` against the
    system-variable-redeclaration fix above (a red herring for that check
    specifically — see the commit/chat — but a real, separate gap):
    `variableStatements.ts`'s classifier already detects and records a
    good number of clearly-broken statement shapes via
    `ClassifiedStatement.malformed?: string` — `‹keyword›: no '='` and
    `‹keyword›: no target name` for `SINGLEQ`/`MAKESINGLE`/`VARIABLES`/
    `MULTIFROMSTRING`/`VARFAMILY`/`GROUPS`/`INTERVALS`/`VARGROUP`/
    `INDEXVAR`/the statistical creators/`DATA` (§9 Q1's "no-name
    VARFAMILY" case included) — but **nothing anywhere reads this field**;
    a script with `groups sysmiss;` (missing its `=` and body entirely)
    compiles cleanly as far as the extension is concerned, no squiggle at
    all, even though it would be a real compiler error. Needs: a new
    check (`diagnostics.ts` or `modelDiagnostics.ts` — doesn't need the
    full workspace model, just `toLogicalStatements` + `classifyStatement`
    per statement, so document-scoped like the rest of `diagnostics.ts`
    is probably the right home) that surfaces `cls.malformed` as an Error,
    anchored at the statement's own start. Small, contained, no design
    questions outstanding — good next pickup.

---

## P2 — Diagnostics & block constructs

- **`checkParenBalance` false positive on a "(" inside a string — fixed
  2026-09-05.** Reported: `#barchart(10 01 "&sp1" "&zeilen" 'POWERCHART
  OPTION "SeriesColorMarkstring=*(net*;$778a26"' 01 "valuelabels x
  position &sp1")` and `valuelabels "s3" = 1 "Dies ist ( ein Text";` both
  wrongly flagged `unmatched-open-paren`. Root cause: unlike every other
  check in `diagnostics.ts`, paren-balance checking was already
  documented as a known/accepted gap for exactly this ("doesn't
  distinguish string-literal content from real code") — the reports prove
  it isn't rare enough to accept. Fix: `checkParenBalance` now takes
  `isNormalScope` (code only, strings excluded) instead of
  `isNotInComment` (code + string content — the right choice for every
  *other* check, since gessTabs quotes names/tokens routinely);
  `computeDiagnostics` gained a matching optional 3rd param, threaded from
  `diagnosticsProvider.ts` as `scope.isNormalScope`. Three new
  `diagnostics.spec.ts` cases using a real `Scope` (not the always-true
  test stand-in, which can't exercise the string/comment distinction the
  bug is about) — both reported examples plus a "still flags a real
  unmatched paren outside any string" regression guard.
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
