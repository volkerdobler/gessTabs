# Variable model — handbook-driven design pass

> Status: **design, not yet implemented.** The handbook-driven design pass
> [TODO.md](../TODO.md)'s P1 asks for *before* go-to-definition / references /
> rename / hover / the F2 diagnostics are touched again. Nothing in `src/` changes
> until this is agreed. §11 (external variables) was pulled out to a standalone
> **P0** on 2026-09-03. Written 2026-09-03 against the online manual mirror in
> `dokumentation/online-manual/md/` (Variablentypen, Bildung neuer Variablen,
> Variablen-Eigenschaften, Texte, Label-Eigenschaften, Systemvariablen, Compute,
> Logische Bedingungen, Statistische Funktionen, Gruppierungen/*, Filter, Das Skript)
> plus `dokumentation/gesstabs_handbuch_52.md` for `DATA` / `ASSOCVAR` / `CLONEVAR`.

## 1. Why the current model doesn't hold together

Today "what is a variable definition / reference" is spread across **eleven regex
factories** in [src/core/regex.ts](../src/core/regex.ts), OR-ed together per line in
[src/core/matching.ts](../src/core/matching.ts), and consumed independently by:

| consumer | file | what it asks |
| --- | --- | --- |
| go-to-definition | `extension.ts` `GesstabsDefintionProvider` | nearest backward `lineMatchesDefinition` |
| find-references | `extension.ts` `GesstabsReferenceProvider` | every `lineMatchesUsage` line |
| rename | `extension.ts` `GesstabsRenameProvider` | every `lineMatchesUsage` line |
| variable hover | `providers/variableHoverProvider.ts` | `findDefinitionLine` + `findVariableAnnotations` + `lineHasQuotedVariableReference` |
| F2 duplicate-declaration | `core/diagnostics.ts` | `collectDeclarationTokens` (a *third* "is this a declaration" definition) |
| F2 empty-varlist | `core/diagnostics.ts` | its own `emptyVarlistPropertyRe` + `findLastDeclaredVariableBefore` |
| semantic highlighting | `core/semanticTokens.ts` | `collectDeclarationTokens` + most of the regex factories |
| autocomplete | `core/symbolCompletion.ts` | `collectSemanticTokens` |

Structural problems:

1. **Three different definitions of "definition."** `lineMatchesDefinition` (6
   factories), `collectDeclarationTokens` (3 factories), and
   `checkEmptyVarlist`'s own regex disagree about which statements create a name.
   `singleVarDefRe`'s keyword list includes `static` and `init` (both are
   *properties/sub-keywords*, never declarations) and omits `COMPUTE` without a
   sub-keyword, `MAKESINGLE`, `MAKESINGLES`, `CLONEVAR`-as-written, `VARGROUP … = (
   … ) EQ`, `GROUPS`, `INTERVALS`, `INDEXVAR`, `MULTIFROMSTRING`, `CROSSVAR`,
   `MININDEX`/`MAXINDEX`, `DATA <method>`, `ASSOCVAR`, `IF … THEN <var> = …`.
2. **Line-scoped, not statement-scoped.** Every factory is anchored with `^\s*` or a
   `\b`; a `VALUELABELS` list, a `GROUPS` block or a `RECODE` that spans lines is
   only ever half-matched. The include-graph `order` already drops blank/comment
   lines but does **not** join continuation lines.
3. **No notion of variable identity or kind.** A name is re-derived from a regex
   capture every time. There is nowhere to record that `f_offen` is a `VARFAMILY`
   of 10, that `region` is `ALPHA`, that `SysMiss` is predefined, or that
   `medsort $1` is an atomic member of `medsort`.
4. **Quoted-token ambiguity is hard-coded per factory.** `lineHasQuotedVariable
   Reference` hand-enumerates "positions that accept a quoted variable name"; it
   can't answer the manual's actual rule ("*a quoted token is a variable iff a
   variable of that name exists*", Logische Bedingungen) because there is no symbol
   table to consult.
5. **Externally-sourced variables don't exist in the model at all** — for a real
   project that's most of the variables, so hover says "probably a dataset
   variable" and go-to-definition fails for the majority of names.

The fix is a single **variable model**: one program-order pass that produces a
symbol table, plus one **statement classifier** that every consumer shares.

---

## 2. The conceptual model (from the handbook)

### 2.1 Tokens, names, and quoting

- A **variable name is a token.** A token that contains a space (or other
  separator) **must be quoted** — `compute 'frage 1' = 1;` declares a variable
  literally named `frage 1`. Quotes here are **not** a string literal; they are
  token delimiters (Logische Bedingungen, "syntaktische Problematik").
- Therefore a quoted token is **ambiguous**: it is a variable reference when a
  variable of that name exists *and* the position accepts one, otherwise it is
  text content (a label, a title, a filter text). The manual states the tie-break
  outright: *"GESStabs interpretiert Strings in Anführungszeichen … als
  Variablennamen, wenn es eine Variable mit dem entsprechenden Namen gibt, sonst
  als Textkonstante."*
- **Names are case-insensitive** (unlike `#define`/`#ifdef` preprocessor names).
- Member access uses `$` — `medsort $1` / `medsort_$1` is the *n*-th atomic
  member of a `MultiQ`/`VARFAMILY` (Variablenfamilien, MultiFromString). `.` also
  appears in names (`item.1`, `f.3`) and is a plain name character, **not** an
  operator (`region.f24` is one name, per `usageRe`'s existing lookahead).

### 2.2 Variable kinds

```
Variable
├── atomic (SingleQ / VARIABLE)          one storage slot, one code per case
│   ├── numeric        (degenerate: values have no label texts)
│   ├── labelled       (numeric code ↔ VALUELABEL tree)
│   ├── ALPHA          reads a string; internal code assigned per distinct text
│   └── OPEN           key-based open answer; codes assigned externally
│       └── OPENASALPHA DATA <src>   derived text-view of another OPEN var
├── MultiQ / VARFAMILY / FAMILYVAR       ordered list of atomic vars; shared labels
│   ├── AlphaFamily                      VARFAMILY whose members are ALPHA
│   └── CrossVar                         VARFAMILY of all value-combinations of N vars
├── DichoQ / VARGROUP / GROUPVAR / GROUPS   unordered set of 0/1 atomic vars
│   └── SPSSGroup                        VARGROUP derived from a MultiQ for SPSS output
├── IndexVar / InvIndexVar               a varlist addressed through an index var
├── AssocVar                             supplementary var from an ASSOCFILE
└── virtual (no statement declares them by name)
    ├── Overcode / OverOverCode          synthetic codes 65001+ inside a VALUELABELS list
    ├── system variables                 SysMiss, NIL, SystemFileNo, …
    └── POSTPROCESS cell references      SELF, CellAbs, XAbs, … (valid only in that clause)
```

Kind matters for diagnostics the later tiers want: `RECODE`/arithmetic is illegal
on a `VARFAMILY`/`VARGROUP`; `COMPUTE ALPHA` target must be `ALPHA`; `CALCULATECOLUMN`
needs exactly one elementary `CELLELEMENT`; `COLUMNPERCENT100` needs a multi-response
var; an `ALPHA` atomic var may be in only one `AlphaFamily`.

### 2.3 Variable origin

The model must distinguish **five** origins — go-to-definition and "undefined
variable" behave differently for each:

| origin | where the name comes from | go-to-definition lands on |
| --- | --- | --- |
| `declared` | a statement in the resolved script creates it | that statement |
| `external` | the data source (`CSVINFILE`/`SPSSINFILE`/`DATAFILE`/`INVERTIN`/`COLBININFILE`) | the input statement (phase 4: the CSV header / `.sav` dict / vardef macro call) |
| `predefined` | `SysMiss`, `NIL`, `SystemFileNo`, `SystemWeight`, `SystemCaseNo` | nothing — show a builtin doc string |
| `virtual` | overcodes, `POSTPROCESS` refs | the `VALUELABELS`/`POSTPROCESS` clause that introduces them |
| `macro-produced` | a `#MACRO` body statement, name assembled from `&params` | the body line + the call site (already done: `findMacroProducedDefinition`) |

"External variables unknown" is a **normal state**, never an error — the data file
is often not on the editing machine.

### 2.4 Program order and the "current variable"

- gessTabs compiles **top-to-bottom, no forward references.** The resolved
  include `order` already models this; `findDefinitionLine` already scans backward.
- After any variable-creating statement, its target becomes **"die aktuelle
  Variable"** (Compute page). A subsequent `VALUELABELS`/`RECODE`/`PRINTALL`/
  `VARTITLE`/`VARTEXT`/`COPY*` **with no varlist** binds to it. This is the
  empty-varlist trap `checkEmptyVarlist` warns about; the model should track the
  current variable so the warning can *name* it (F5 quick-fix already reconstructs
  it via `findLastDeclaredVariableBefore` — that logic moves into the model).
- `SETFILTER <name> … ENDFILTER` and `IFBLOCK`/`WHILEBLOCK` open runtime scopes.
  They do **not** create variable scopes (gessTabs has one flat namespace) but a
  variable *created inside* a filter block inherits that filter, and Tier 2 wants
  block folding/diagnostics for them — the classifier should recognise the
  block-opening/closing statements even though the model treats the namespace as
  flat.

---

## 3. Inventory — definition forms

Every statement that **creates or re-defines** a name. Grouped by shape. `‹v›` = a
single name token (bare or quoted); `‹vl›` = a whitespace/comma list of them,
possibly with `<a> TO <b>` ranges; `$` member forms expand to atomic members.

### 3.1 Atomic (SingleQ)

| statement | target | notes |
| --- | --- | --- |
| `SINGLEQ ‹v› = …` / `VARIABLE ‹v› = …` | `‹v›` | classic; may carry `TITLE`/`ALPHA`/`OPEN`/`LABELS …` inline |
| `SINGLEQ ‹v› 0 VARTEXT … ;` | `‹v›` | **no `=`** — column-position form; `singleVarDefRe` misses it |
| `SINGLEQ ‹v› = OPENASALPHA DATA ‹src›;` | `‹v›` (+ **ref** to `‹src›`) | derived text view of an OPEN var |
| `MAKESINGLE ‹v›;` | `‹v›` | **no `=`**; error if `‹v›` already exists |
| `MAKESINGLE ‹v› = ‹expr›;` | `‹v›` | shorthand for `MAKESINGLE ‹v›; COMPUTE ‹v› = ‹expr›;` |
| `MAKESINGLE ‹v› = ALPHA;` | `‹v›` (ALPHA) | |
| `VARIABLES ‹v›‹n1› TO ‹v›‹n2› = ‹start› ‹width›;` | `‹v›n1 … ‹v›n2` | contiguous block |
| `MAKESINGLES ‹vl› [ = ‹vl› ];` | left `‹vl›` (+ **refs** to right `‹vl›`) | `VARIABLES` + `COMPUTE COPY` |
| `ASSOCVAR ‹v› = [ALPHA] ‹startcol› …;` | `‹v›` | supplementary from ASSOCFILE |
| `CLONEVAR ‹v› = ‹src› [opts];` | `‹v›` (+ **ref** `‹src›`) | same type as `‹src›`; not for ASSOCVAR/INDEXVAR |

### 3.2 COMPUTE family (Compute page)

`COMPUTE`/`FCOMPUTE`, target auto-created if absent. **The single most common
creator**, and `computeDefRe` only matches when a sub-keyword is present (a
documented quirk — [regex.spec.ts](../test/regex.spec.ts)).

| form | target | source refs |
| --- | --- | --- |
| `COMPUTE ‹v› = ‹arith expr›;` | `‹v›` (or `‹vl›` — `COMPUTE a b c = 0;` sets several) | operands in expr |
| `FCOMPUTE ‹v› = …` | as COMPUTE | honours `SETFILTER` |
| `COMPUTE ADD ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `COMPUTE ALPHA ‹v› = ‹v›\|‹str›;` | `‹v›` (ALPHA) | `‹v›` |
| `COMPUTE ASCEND\|DESCEND ‹vl› = ‹vl›;` | left `‹vl›` | right `‹vl›` |
| `COMPUTE CONCAT [LOWER\|UPPERCASE] ‹v› = { ‹str› \| ‹v› }*;` | `‹v›` (ALPHA) | the `‹v›` args (strings are text) |
| `COMPUTE COPY ‹vl› = ‹vl›;` | left `‹vl›` | right `‹vl›` |
| `COMPUTE ELIMINATE ‹v› = { ‹num› }*;` | `‹v›` (must be family/group) | — |
| `COMPUTE INIT ‹v› = { ‹num› }*;` | `‹v›` (family) | — |
| `COMPUTE LOAD ‹v› = ‹vl›;` | `‹v›` (created structure-like when 1 src) | `‹vl›` |
| `COMPUTE REPLACE ‹value› ‹v› = ‹src›;` | `‹v›` (target **after** the value arg) | `‹src›` |
| `COMPUTE SHUFFLE ‹vl› = ‹vl›;` | left `‹vl›` | right `‹vl›` |
| `COMPUTE SORT ( ‹nums› ) ‹v› = ‹src›;` | `‹v›` (target **after** the `( … )`) | `‹src›` |
| `COMPUTE SUBSTR [LOWER\|UPPERCASE] ‹v› = ‹src› ‹start› ‹len›;` | `‹v›` (ALPHA) | `‹src›` |
| `COMPUTE SWAP ‹vl› = ‹vl›;` | **both** sides (bidirectional copy) | both sides |

### 3.3 IF / IFBLOCK / WHILEBLOCK (Logische Bedingungen)

`<anweisung>` after `THEN`/`ELSE` (and inside `IFBLOCK`/`WHILEBLOCK` bodies) is
*"ein beliebiges `COMPUTE`-Statement unter Weglassen des Keywords `COMPUTE`."* So
every 3.2 form recurs here without the `COMPUTE` prefix:

| form | target |
| --- | --- |
| `IF ‹cond› THEN ‹v› = ‹expr› [ELSE ‹v› = ‹expr›];` | the `‹v›` after `THEN`/`ELSE` |
| `IF ‹cond› THEN COPY\|LOAD\|CONCAT\|SUBSTR ‹v› = …` | as the matching COMPUTE form |
| `IF ‹cond› THEN ‹vl› = -1;` (filtering) | the `‹vl›` (re-def to MISSING, not a *new* name) |
| statements inside `IFBLOCK ‹cond› THEN … ELSEBLOCK … ENDBLOCK;` | per statement |
| statements inside `WHILEBLOCK ‹cond› DO … ENDBLOCK;` | per statement |

Condition side (`‹cond›`) is **reference-only** — see §4.

### 3.4 Multi-response constructs

| statement | target | member/source refs |
| --- | --- | --- |
| `VARFAMILY ‹v› = ‹vl›;` | `‹v›` | `‹vl›` (atomic members) |
| `MAKEFAMILY ‹v› = ‹count›;` | `‹v›` (empty, n slots) | — |
| `ALPHAFAMILY ‹v› = { ‹alphavar› }*;` | `‹v›` (ALPHA family) | the alpha vars |
| `CROSSVAR ‹v› = ‹v1› ‹v2› [ ‹v3› … ];` | `‹v›` | `‹v1› ‹v2› …` |
| `MULTIFROMSTRING [DELIMITED ‹d›] [DECIMALS ‹c›] ‹v› = ‹alfavar›;` | `‹v›` (must pre-exist as FAMILYVAR — re-def) | `‹alfavar›` |
| `VARGROUP ‹v› = ( ‹vl› ) EQ ‹valuelist›;` | `‹v›` | `‹vl›` |
| `GROUPS ‹v› = \| "label" [opts] : ‹cond› … ;` | `‹v›` | vars in each `‹cond›` (incl. `[k] IN ‹v›` self-ref) |
| `MAKEGROUP ‹v› = ‹count›;` | `‹v›` (empty, n slots) | — |
| `SPSSGROUP ‹v› = ‹familyvar›;` | `‹v›` | `‹familyvar›` |
| `INTERVALS ‹v› = ‹sourcevar› \| "label" : ‹cmp› ‹val› … ;` | `‹v›` (SingleQ) | `‹sourcevar›` (once, not per line) |
| `INDEXVAR ‹v› = ‹vl› BY ‹idxvar›;` | `‹v›` | `‹vl›` + `‹idxvar›` |
| `INVINDEXVAR ‹v› = ‹vl› BY ‹idxvar›;` | `‹v›` | `‹vl›` + `‹idxvar›` |

Note `GROUPS`/`INTERVALS` bodies use `|` row separators and `:` before the
condition — multi-line, block-shaped. `VARGROUP`'s `( ‹vl› )` is parenthesised.

### 3.5 Statistical creators (Statistische Funktionen, DATA)

| statement | target | source refs |
| --- | --- | --- |
| `MEAN ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `SUM ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `MIN ‹v› = ‹vl›;` / `MAX ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `STDDEV ‹v› = ‹vl›;` / `VARIANCE ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `MININDEX ‹v› = ‹vl›;` / `MAXINDEX ‹v› = ‹vl›;` | `‹v›` | `‹vl›` |
| `COUNT ‹v› = ‹cond›;` | `‹v›` | vars in `‹cond›` |
| `DATA [USEWEIGHT ‹w›] ‹method› ‹v› = ‹basevar› [BY ‹groupvar›];` | `‹v›` | `‹w›`, `‹basevar›`, `‹groupvar›` |

`‹method›` ∈ ABSOLUTE VALIDN PHYSICALRECORDS SUM MEAN VARIANCE STDDEV MEDIAN PCNTL1
PCNTL2 MIN MAX — a token between the keyword and `‹v›`, like `COMPUTE`'s sub-keywords.

### 3.6 Overcodes (virtual, inside a VALUELABELS list)

`OVERCODE [ SUM | ‹ocname› ] ‹valuelist› "text"` and
`OVEROVERCODE [ SUM ] ‹oocname› { :‹ocname› }* "text"` — introduce a **named virtual
code** (`‹ocname›`/`‹oocname›`) usable later as `[‹ocname›] IN ‹var›`. Scoped to the
enclosing variable's label list. Codes assigned 65001+.

### 3.7 Not definitions (currently mis-classified or at risk)

`STATIC`, `INIT` (as a bare word), `NOINPUT`, `NOOUTPUT`, `PRINTALL`, `ALPHA <vl> =
YES`, `ASALPHA`, `OPENASALPHA <vl> = YES`, `FILTER`, `WEIGHTCELLS`, `NORMALIZE`,
`EVALFAMVALONCE`, `CONCATNUMTOSTR`, `INCLUDETITLEINTEXT`, `GENERATELABELS`,
`LABELFORMAT`, `RECODE`, `RANGES`, `OVERCODE` on an *existing* list — these
**annotate / reference / operate on** existing variables. `singleVarConst` must
drop `static`/`init`.

---

## 4. Inventory — reference forms

A **reference** is any occurrence of an existing name that is not its definition.

| position | example | quoted token = variable? |
| --- | --- | --- |
| declaration varlist (right side) | `VARFAMILY f = a b c;` | **always** (grammar only accepts names) |
| annotation varlist | `VARTITLE ‹vl› = "…";` `COPYTEXT ‹vl› = ‹src›;` | **always** (before `=`) |
| `COPY*`/`USELABELS` source | `COPYLABELS x = y;` `VALUELABELS x COPY y;` `… AS y;` | **always** |
| TABLE / OVERVIEW head & axis | `TABLE = a b BY c d;` | **always** |
| `WEIGHTCELLS [AUTOALIGN] ‹v› = …` | | **always** |
| `FILTER ‹vl› [= ‹cond› \| AS ‹v›];` | | **always** (varlist + `AS` target) |
| `SETFILTER`/`FIF`/`IF`/`IFBLOCK`/`WHILEBLOCK` **condition** | `IF Partei EQ "SPD" THEN …` | **only if a variable of that name exists** — else text constant (the manual's rule) |
| `IN` set test | `IF [1:3] IN frage11 THEN …` / `IF [2] IN ( v1 v7 TO v10 ) THEN …` | RHS: always a name; `( … )` list: always names; LHS `[ … ]`: values/overcode-names |
| arithmetic operand | `COMPUTE m = (v1 + v2) / 2;` | bare: always; quoted: iff exists |
| `IS` type test | `IF ‹v› IS MULTIQ THEN …` | LHS always a name; RHS is a type keyword |
| `CONCAT` / `SUBSTR` args | `COMPUTE CONCAT x = "lit" q1 "lit" q2;` | a token is a var iff it names one, else text |
| `GENERATELABELS ‹v›;` `NORMALIZE = ‹vl›;` `CLONEVAR x = ‹v› …` | | always |
| `LABELFORMAT ‹v› = "@medsort";` | the `@name` inside the format string | `@`-prefixed name ref |
| `#DOMACRO`/macro-call arguments | `#domacro( defvar age income )` | args may be var names (phase: macro-produced) |
| `$` member | `medsort $1`, `f.3` | member of a family — resolves to family + index |

**Rule for the classifier**: each argument slot in the statement table carries a
`nameMode`:

- `always` — the grammar accepts only a name here. A quoted token is a reference
  regardless of whether the symbol table knows it (it might be external).
- `ifKnown` — a quoted token is a reference **iff** the symbol table has a
  variable of that name at this program point; otherwise it's text. A **bare**
  token in an `ifKnown` slot is still always a reference (free text must be
  quoted).
- `never` — text/label/number slot; no name resolution (e.g. `VALUELABELS`
  label texts, `SETFILTER TEXT "…"`, `TABLETITLE`, `GROUPS` label texts).

This is the whole of the "quoted-token ambiguity" resolution: a positional table +
one lookup against the model.

---

## 5. Predefined & virtual variables

Seed the model unconditionally with:

| name | kind | note |
| --- | --- | --- |
| `SysMiss` / `SYSMISS` | predefined | always MISSING; usable as `IF SYSMISS IN ‹v›` |
| `NIL` | predefined | empty var, handy in `TABLE ADD` |
| `SystemFileNo` | predefined | current dataset number |
| `SystemWeight` | predefined | current case weight |
| `SystemCaseNo` | predefined | 1-based case number |

Declaring a variable with one of these names is a **syntax error** ("Der Versuch,
eigene Variablen mit diesen Namen zu generieren, führt zu einem Fehler") → new
diagnostic candidate (Tier 2).

`POSTPROCESS ‹cellelement› : …` introduces clause-local virtual names — `SELF`,
`CellAbs`, `CellPhys`, `XAbs`, `YAbs`, `TtlAbs`, `XVarNo`, `YVarNo`, `XCode`,
`YCode`, `StatAbs`, `StatPhys`, `XPhys`, `YPhys`. The model records them with a
`scope` limited to the `POSTPROCESS` statement so hover/undefined-var checks don't
treat them as global and don't flag them elsewhere.

---

## 6. Macro-produced names

Already partly handled (`findMacroProducedDefinition`, commit `7f0b000`). The model
must additionally cope with:

- `&param` substituted **mid-token**: `&p.recoded`, `&name_alpha`, `&p1.recoded` —
  substitution is pure text (Makros: *"reine Textersetzung … auch innerhalb … eines
  Tokens"*).
- **numeric** param names: `&1`, `&2` (`#domacro`'s positional args).
- **comma-separated** param lists: `#macro #x( &1 &combicode, &faktor )`
  (Variablenfamilien example) — `parseTokenList` currently splits on whitespace
  only.
- `#DOMACRO`/`#DOMACRO2/3/4` looping expansion and the
  `#call(&index &namepart &macroname)` indirect-call pattern — **out of scope for
  Tier 1**, but the model's macro hook should be shaped so the Tier 3 `#DOMACRO`
  work plugs in without reshaping the symbol record.
- Data-vardef includes: `#defvar( age 1 2 )` — "first argument of every macro call
  in a vardef include is an externally-sourced variable" (phase 4).

The model exposes macro-produced names with `origin: 'macro-produced'` and the
`{ bodyLine, callSite }` pair the hover already renders.

---

## 7. Proposed architecture

Three new pure modules under `src/core/`, plus deletions.

### 7.1 `variableStatements.ts` — the statement classifier

One authoritative table replacing all eleven regex factories' definition/reference
knowledge.

```ts
export type NameMode = 'always' | 'ifKnown' | 'never';

export interface NameSpan {
  name: string;            // unquoted, lower-cased for lookup; keep raw for range
  rawStart: number;        // offset within the joined statement text
  rawLength: number;
  quoted: boolean;
}

export interface ClassifiedStatement {
  kind: StatementKind;                 // 'singleq' | 'compute-copy' | 'vargroup' | 'if-then' | 'annotation' | 'table' | 'block-open' | …
  defines: NameSpan[];                 // names this statement creates / re-defines
  references: { span: NameSpan; mode: NameMode }[];
  targetKind?: VariableKind;           // what kind `defines` are, when statically known
  bindsCurrentVariable: boolean;       // updates "die aktuelle Variable"
  usesCurrentVariable: boolean;        // empty-varlist form (no varlist before `=`)
  block?: 'open' | 'close';            // IFBLOCK/WHILEBLOCK/SETFILTER/#MACRO/#STARTEXPORT …
}

export function classifyStatement(statementText: string): ClassifiedStatement | undefined;
```

- Input is a **whole logical statement** (joined across continuation lines — see
  7.4), not a line.
- Implemented as a dispatch on the leading keyword(s) → a per-shape parser. Each
  parser knows its own grammar (where the target sits, which slots are varlists,
  each slot's `NameMode`). No more "OR eleven regexes and hope."
- The existing `constVarList` / `‹a› TO ‹b›` / `$`-member expansion helpers move
  here.
- Covered by a large table-driven spec (`test/variableStatements.spec.ts`) — one
  case per row of §3 and §4.

### 7.2 `variableModel.ts` — the symbol table

```ts
export interface VariableSymbol {
  name: string;                        // canonical (lower-cased)
  displayName: string;                 // first-seen casing
  kind: VariableKind;
  origin: 'declared' | 'external' | 'predefined' | 'virtual' | 'macro-produced';
  definitions: ResolvedLine[];         // usually 1; >1 for #ifdef per-branch or re-def
  annotations: VariableAnnotation[];   // VARTITLE/VARTEXT/VALUELABELS (moves from variableInfo.ts)
  members?: string[];                  // atomic members of a family/group, when known
  scope?: { file: string; startLine: number; endLine: number };  // POSTPROCESS virtuals
  macroProducedBy?: { bodyLine: ResolvedLine; callSite: ResolvedLine };
}

export interface VariableModel {
  at(file: string, line: number): ProgramPointView;   // symbols visible at a point (no forward ref)
  all(): VariableSymbol[];
  resolve(name: string, atFile: string, atLine: number): VariableSymbol | undefined;
  currentVariableAt(file: string, line: number): string | undefined;
  references(name: string): ResolvedLine[];
}

export function buildVariableModel(
  index: WorkspaceIndex,
  opts?: { externalNames?: ExternalNameSource[]; macroExpansion?: boolean }
): VariableModel;
```

- Single forward pass over `index.order`, joining continuation lines, calling
  `classifyStatement`, accumulating symbols and tracking the current variable.
- Seeds predefined variables first.
- `references()` is computed by a second pass that, for every statement, resolves
  each `NameSpan` per its `NameMode` against the symbols known *at that point*.
  This is where the quoted-token rule actually runs.
- `conditionalsAllActive` stays the resolution mode for the symbol-tooling
  consumers (go-to-def/refs/rename/hover) — a per-branch definition is still a
  definition. The gated resolution stays for autocomplete / effective-elements.
- Cache by workspace-file-set + mtimes (same shape as the existing
  `buildWorkspaceIndex` callers; add an LRU like `src/util/lru.ts`).

### 7.3 `externalNames.ts` — externally-sourced variables (phase 0 reader, phase 4 model wiring — see §11)

```ts
export interface ExternalNameSource {
  statement: ResolvedLine;             // the CSVINFILE/SPSSINFILE/DATAFILE line
  names: string[] | 'unresolved';      // 'unresolved' when the data file isn't present
  headerLocation?: (name: string) => { file: string; line: number; col: number };
}
export function readExternalNames(index: WorkspaceIndex, fs: FileSystemLike): ExternalNameSource[];
```

The reader is **phase 0** (standalone, §11). This section is just the interface
the model consumes at phase 4. Coverage, per the 2026-09-03 decisions in §11:

- **v1**: `CSVINFILE`, delimited `DATAFILE` (first line, split on `‹delimchar›`
  or the default), and `SPSSINFILE` (`.sav` dictionary parser — **names + type
  only**: record type 2 + type-7/subtype-13 long-name map + type-7/subtype-20
  encoding; `$FL2` only).
- **later**: SPSS variable/value labels, ZSAV (`$FL3`), column-fixed `.dat`
  (vardef-include macro-call heuristic; `VARNAME = ‹n› ‹col› ‹len›;`;
  `VARIABLES ‹a› TO ‹b› = ‹col› ‹w›;`).
- `FileSystemWatcher` + `path+mtime+size` cache in the provider layer; **never**
  re-read on keystroke. `‹filepath›` still holding `#EXPAND`/`&token&`/wildcards
  after normal substitution → `unresolved`, don't guess.
- Manual pages to mirror first: `csv.html`, `spss2.html`,
  `handhabung-von-ascii-daten.html`.

### 7.4 Continuation-line joining

`classifyStatement` needs whole statements. Add to `symbolIndex.ts` (or a small
`statements.ts`):

```ts
export interface LogicalStatement { lines: ResolvedLine[]; text: string; }
export function toLogicalStatements(order: ResolvedLine[]): LogicalStatement[];
```

Walk `order`, accumulate until a line contains `;` **at normal scope** (reuse
`Scope`), emit. `collectStatement` in `variableInfo.ts` is a one-off version of
this — replace it. Edge cases: `GROUPS`/`INTERVALS`/`VALUELABELS` bodies (many
lines, one `;`), `RECODE … / … / … ;`, a `;` inside a quoted label
(`"a; b"`) — the scope check handles the last.

### 7.5 What each consumer becomes

| consumer | before | after |
| --- | --- | --- |
| go-to-definition | `findDefinitionLine` (backward regex scan) | `model.resolve(word, file, line)?.definitions` (+ macro-produced fallback stays) |
| find-references | `findAllUsages` (per-line `lineMatchesUsage`) | `model.references(word)` |
| rename | same as references | `model.references(word)` + `definitions`; block rename of predefined/external-header |
| variable hover | 3 helpers | `model.resolve(...)` → kind, origin, definition statement, annotations, members |
| F2 duplicate-declaration | `collectDeclarationTokens` | statements whose `defines` names a symbol already `declared` earlier (kind-aware: re-def vs. dup) |
| F2 empty-varlist | own regex + `findLastDeclaredVariableBefore` | `classified.usesCurrentVariable` + `model.currentVariableAt(...)` |
| semantic highlighting | regex factories + "last name only" | `classifiedStatement.defines`/`references` give **every** span with a real offset → fixes the "last-name-only" Tier 3 item for free |
| autocomplete | `collectSemanticTokens` | `model.at(file, line)` (gated resolution) |
| new: undefined-variable diagnostic (Tier 2) | — | bare reference that `model.resolve` misses AND no `external` source is `unresolved` |
| new: system-var redeclaration (Tier 2) | — | `defines` names a `predefined` symbol |

`src/core/regex.ts`, `src/core/matching.ts`, `collectDeclarationTokens`,
`findVariableAnnotations`, `lineHasQuotedVariableReference` are **deleted** once all
consumers move. `usageRe`'s token-boundary regex survives as a small helper for
turning a resolved reference line into precise character ranges (rename needs it).

---

## 8. Phasing (so nothing is built twice)

| phase | deliverable | risk | unblocks |
| --- | --- | --- | --- |
| **0** | `entryScripts.ts` + `externalNames.ts` (CSV + SPSS names/type + delimited `DATAFILE`) + a lightweight hover note / `DocumentLink`. **Standalone — does not touch indexing or wait on the model.** See §11. | low — pure + one watcher | phase 4; near-term "which names are dataset vars" signal |
| **1** | `variableStatements.ts` + `toLogicalStatements` + full spec. **No consumer wired yet.** **First cut landed 2026-09-04** — `src/core/statements.ts` + `src/core/variableStatements.ts` + specs; covers §3.1–§3.5, the §4 name-modes, `defKind`, and `block` open/close/mid. Open: overcodes (§3.6), `TO`/`$`-member expansion, `POSTPROCESS` virtuals, exhaustive per-row spec. | low — pure, additive | everything below |
| **2** | `variableModel.ts` (declared + predefined origins; no macro/external). Wire **hover** first (smallest blast radius, best signal). **Core module landed 2026-09-04** — `src/core/variableModel.ts` + spec (`buildVariableModel` → `all`/`at`/`resolve`/`currentVariableAt`/`references`; system-var seed, no-forward-ref, kinds+members, annotations, quoted-token rule). Open: wire the hover onto it. | med | — |
| **3** | Move go-to-definition, references, rename, semantic highlighting onto the model. Delete `regex.ts`/`matching.ts`. Move F2 empty-varlist + duplicate-declaration onto the model. | med-high — behaviour-visible | Tier 2 cross-INCLUDE F2 scope, Tier 3 semantic "last-name" fix |
| **4** | Feed the phase-0 `externalNames.ts` output into the model as `origin: 'external'`. (The reader itself — CSV + SPSS + delimited `DATAFILE` — is pulled out to **phase 0**, see §11.) | low | "undefined variable" diagnostic, real go-to-def for dataset vars |
| **5** | macro-produced names into the model (numeric/comma params, mid-token). `#DOMACRO` stays Tier 3. | med | — |
| **6** | New diagnostics on the model: undefined-variable, system-var redeclaration, `ALPHA` var in two `AlphaFamily`s, kind-illegal ops. | low each | Tier 2 items |

Tier 2's "Hover over String" and the multi-response classification for the
mutually-exclusive cell-option diagnostics both fall out of phases 2–3 (the model
knows kinds) and phase 4 (the model knows every `MULTIQ` across the resolved
program) — they are **not** separate work.

---

## 9. Open questions (need a decision before phase 1 lands)

> **P1.0 — resolved 2026-09-04.** All six adopted as proposed. Rationale is
> unchanged from the proposals below; the short form:
> 1. **No-name `VARFAMILY`/`VARGROUP`/… → ignore** (classifier returns no
>    `defines`); emit a `malformed` marker so a later diagnostic can flag it.
> 2. **`$` members → resolve on demand.** The classifier expands `‹v›$1`/`‹v›_$1`
>    /`‹v› TO`-style member spans for *reference* purposes, but the symbol table
>    stores `members` / `memberCount` and synthesises a `$k` symbol only when
>    `resolve()` is asked for one.
> 3. **Duplicate-declaration is kind-gated.** The classifier tags each defining
>    statement with `defKind: 'declaration' | 'assignment'`. Only `declaration`
>    kinds (SINGLEQ/VARIABLE(S)/MAKE*/VARFAMILY/VARGROUP/GROUPS/INTERVALS/
>    INDEXVAR/CROSSVAR/SPSSGROUP/ASSOCVAR/CLONEVAR/the statistical creators) can
>    raise a duplicate; COMPUTE/FCOMPUTE/IF-THEN re-assignment never does.
> 4. **`#IF[N]EMPTY` / `#IF[N]EXIST` → keep both branches** (no change);
>    revisit the `#ifexist` feedback loop after phase 4.
> 5. **Perf → LRU by file-set + mtime first**, measure, add incremental
>    `didChange` updates only if a real project stutters.
> 6. **`.def` and other INCLUDE extensions → folded into phase 3** (one
>    "which files are part of the program" change: `contributes.languages`,
>    the workspace scan's `(tab|inc)` filter, and `includeGraph` follow-any-name
>    all move together).
>
> **Later-phase judgement calls — settled 2026-09-04 (adopt the default unless
> a real case argues otherwise):**
> - **P1.3 (A)** — migrating go-to-def / references / rename / semantic
>   highlighting onto the model *will* change observable behaviour in the edge
>   cases today's regexes miss or mishandle; that is acceptable, with the spec
>   suite as the safety net. `regex.ts` / `matching.ts` / `collectDeclaration
>   Tokens` / `findVariableAnnotations` / `lineHasQuotedVariableReference` are
>   **deleted in the same commit** that removes their last consumer, not left
>   as dead code for a release.
> - **P1.6 (B)** — the undefined-variable diagnostic ships **under the existing
>   `gesstabs.diagnostics.enabled` switch**, severity **Warning**, and is
>   **fully suppressed for a program while any of its data sources is
>   `unresolved`** (so a project whose `.sav`/`.csv` isn't on the editing
>   machine gets no false "undefined" noise). System-variable redeclaration is
>   an **Error** (the manual says it is one).
> - **P1.4 (C)** — a shared `.inc` opened with no active `main*.tab`: use the
>   program the active editor belongs to; if only the `.inc` is open, the
>   **union** of all programs that include it, with per-name type/kind
>   conflicts surfaced as "mehrdeutig".

1. **`VARFAMILY = ‹vl›;` with no name.** The Bildung-neuer-Variablen syntax box
   shows it; every worked example has a name (`VARFAMILY item = …`). Treat the
   no-name form as: (a) not real / ignore, (b) binds to current variable, or (c)
   its own thing? — *Proposed: (a), flag it if it ever appears.*
2. **`$` member expansion.** Should `model.all()` list `medsort $1 … $n`
   individually (needs the family's declared count, which `MAKEFAMILY x = 10;`
   gives but `VARFAMILY x = a b c;` gives as `members.length`), or only resolve
   them on demand in `resolve()`? — *Proposed: resolve on demand; store
   `members`/`memberCount`, synthesise the `$k` symbol when asked.*
3. **Re-definition = duplicate?** `COMPUTE x = …` twice is legal and normal;
   `SINGLEQ x = …` after `x` exists is a syntax error (`MAKESINGLE` explicitly so).
   Duplicate-declaration diagnostic should fire only for the **declaration**
   statement kinds (SINGLEQ/VARIABLE/MAKE*/VARFAMILY/VARGROUP/GROUPS/…), never for
   COMPUTE/IF re-assignment. — *Proposed: yes, kind-gated; matches handbook.*
4. **How hard to try on `#IF[N]EMPTY`/`#IF[N]EXIST` branches?** Currently both
   kept. `#IFEXIST ‹name›` actually depends on the variable model — a phase-6
   feedback loop is possible (resolve `#ifexist` against the model). Worth it, or
   keep "both branches always"? — *Proposed: keep both branches for now; revisit
   after phase 4.*
5. **Performance budget.** `buildVariableModel` over a large resolved workspace on
   every hover/keystroke — LRU by file-set + mtime like today, or an incremental
   update on `didChange`? — *Proposed: LRU first, measure, add incremental only if
   a real project stutters.*
6. **`.def` / other include extensions** (Tier 2 doc-review item) — fold the
   language-association + workspace-scan extension list fix into phase 3 (the
   model's file discovery), or keep separate? — *Proposed: fold in; it's the same
   "which files are part of the program" question.*

---

## 10. Non-goals for Tier 1

- `#DOMACRO`-family loop expansion (Tier 3).
- Formatter alignment, keyword-hover-content setting, deprecated-keyword
  diagnostic, `#EXPANDINTOKEN`/`#EXPANDINC` (Tier 3).
- Runtime-block folding for `IFBLOCK`/`WHILEBLOCK`/`SETFILTER` (Tier 2) — but
  phase 1's classifier **does** emit `block: 'open'|'close'` for them so the Tier 2
  folding work has one recognizer to call.
- Value labels / variable labels from the SPSS `.sav` — **permanent non-goal**
  (§11.7 Q1): in a gessTabs workflow the labels are (re)defined in the script,
  directly or auto-generated by `#define … syntax`, so the `.sav`'s own labels
  are never authoritative for the extension. Phase 0 ships names + type only.
- Header-cell go-to-definition jumps (§11.7 Q3). ZSAV (`$FL3`): the dictionary
  is uncompressed even in ZSAV, so names + type already work (§11.7 Q2).

---

## 11. External variables from the data input file

Concrete plan for reading the "raw" variable names a script pulls in from its data
source. Raised and scoped 2026-09-03.

> **Status: first cut implemented 2026-09-03.** `src/core/externalNames.ts` +
> `src/core/savDictionary.ts` + `src/core/entryScripts.ts` +
> `src/providers/externalNamesProvider.ts` + the
> `gesstabs.dataInput.entryScriptPatterns` setting. Covers §11.1–§11.6 and
> §11.9; the §11.7 open questions are the follow-up list. Not yet wired into a
> variable model (that is P1.4 / §8 phase 4).

**Decisions taken (2026-09-03):**

- **Built early, as a standalone step** — `entryScripts.ts` + `externalNames.ts`
  first, *not* gated behind the classifier / model / consumer migration. It is
  self-contained (script text in, name list out) and independently useful.
- **The symbol index is not touched.** `buildWorkspaceIndex`'s "merge every
  non-included `.tab`" behaviour stays exactly as today. Entry-script detection
  here is used **only** to decide *which* data-source statements to read.
- **A working data source is mandatory.** A GESStabs script without one does
  nothing useful, so a missing/unreadable input file **is a diagnostic**, not a
  silent normal state (§11.6). We still can't recover the names in that case, but
  we say so.
- **In v1**: `CSVINFILE`, `SPSSINFILE`, and delimited `DATAFILE` (delimiter
  detected in the file's first line, §11.3). Column-fixed / column-binary
  `DATAFILE`, `COLBININFILE`, `INVERTIN` are out (their names come from a vardef
  `INCLUDE` — §6, a later phase).
- **CSV/`DATAFILE` delimiter is `;` or `,` only** — auto-detected from the header
  line (explicit `[ <delimchar> ]` in the statement wins if present). A first
  line with neither → the file is **ignored** (not a delimited source).
- **Encoding**: UTF-8 first; fall back to Windows-1252 when the bytes aren't
  valid UTF-8 (external data is sometimes CP-1252).
- **`.tab` search recurses into subdirectories**, and **every** matching root
  `.tab` is an independent entry program with its own data source — not "pick
  one" (a repo can run `main.tab` and `mainFlipped.tab` over different datasets;
  §11.2). The pattern list is the setting
  `gesstabs.dataInput.entryScriptPatterns`.
- **SPSS `.sav` parser**: variable **names + type** only, permanently. Variable
  and value labels are out of scope — gessTabs scripts (re)define them, directly
  or via `#define … syntax` (§11.7 Q1).

### 11.1 Two consumers, one module

`readExternalNames(...)` produces `ExternalNameSource[]` (§7.3 shape). Two things
consume it, on different timelines:

| consumer | when | uses |
| --- | --- | --- |
| **near-term, lightweight** | *done 2026-09-03* | the existing variable hover appends "_aus `data.csv` (CSVINFILE, Spalte 3) — main.tab:54_" for a name found in a source (via `manager.externalSourcesFor`); a `DocumentLink` on the `<filepath>`; the **missing-data-source diagnostic** (§11.6) |
| **the variable model** | phase 2–4 of §8 | seeded as `origin: 'external'` symbols before the program-order pass (§11.5) |

The near-term consumer must **not** try to be an "undefined variable" linter yet —
without the model there is no reliable "declared in the script" set to subtract,
so it would be noisy. It only *adds* information about names it positively knows,
plus the one diagnostic that needs no symbol model (a data source that is declared
but unreadable, or missing entirely).

### 11.2 Entry scripts and per-include-graph resolution

**No change to indexing.** An *entry script* is a `.tab` that starts a real
GESStabs run — it (and only it) names the data source, and every file it pulls in
via `INCLUDE` inherits that source's variables. A workspace can have **several**
entry scripts that share include files but read **different** data, so this is
not "pick one":

> Example (from a real project): `main.tab` runs the normal tables against
> `data.csv`; `mainFlipped.tab` runs a second set against a *flipped* dataset
> with partly different variable names. Both `INCLUDE` a shared label/format
> file, but each also includes its own variable-specific `.inc`s. A name
> resolved for a file reached from `main.tab` must use `main.tab`'s data source;
> the same-named `.inc` reached from `mainFlipped.tab` uses that one's.

**Discovery.** `gesstabs.dataInput.entryScriptPatterns` — `string[]`, default:

```json
["main.tab", "main*.tab", "*.tab"]
```

Each entry is a case-insensitive glob, matched against `.tab` files found
**recursively** in the workspace. **Every** `.tab` matching **any** pattern that
is also a root (never itself reached through another file's `INCLUDE`) is an
entry script — all of them, not the first match. The default list matches every
`.tab`; a project with stray helper `.tab` files narrows it (e.g.
`["main.tab", "mainFlipped.tab"]`). An empty list disables external-name reading.

**Building the map.** For each entry script, resolve its `INCLUDE` graph
(`resolveIncludeGraph`) and scan for input statements (§11.3). Produce, per entry
script, an `EntryProgram { entryFile, files: string[], sources: ExternalNameSource[] }`.

**Resolving a name in a given file.** The provider takes the file being
hovered/edited and finds every `EntryProgram` whose `files` contains it:

- exactly one → use that program's `sources`.
- more than one (a shared `.inc`) → the union of their names; when two programs
  disagree on a name's kind, keep it but mark it ambiguous (hover: "aus `main.tab`
  *oder* `mainFlipped.tab`").
- none (an orphan file, or the entry-script patterns matched nothing) → no
  external names; the missing-source diagnostic (§11.6) fires on the orphan's
  own root if it declares no source.

`findEntryScripts(folder, patterns, fsLike)` and the per-file lookup are pure;
only the `EntryProgram` cache + watcher is vscode-facing.

### 11.3 Locating the data-source statements

Scan the resolved `order` (normal scope only — reuse `Scope`) for:

```
SPSSINFILE  [ FILEKEY <key> ]                = <filepath> ;
CSVINFILE   [ FILEKEY <key> ] [ <delimchar> ] = <filepath> ;
DATAFILE    [ FILEKEY <key> ]                = <filepath> ;
```

(Manual: *In- und Output von Datensätzen*.)

- **One input-file keyword *type* per script** — the manual: *"Die gleichzeitige
  Verwendung von SPSSINFILE, CSVINFILE, INVERTIN, DATAFILE oder COLBININFILE ist
  nicht möglich."* Multiple statements of that one type are normal (sequential
  waves), each optionally `FILEKEY <key>`-tagged. `<key>` is irrelevant to
  raw-name extraction — ignore it.
- `<filepath>`: quoted or bare, resolved **relative to the directory of the
  `.tab`/`.inc` file that physically contains the statement**.
- `<filepath>` still containing `#` / `&` / `*` / `?` after the include graph's
  normal substitution → **unresolved** (§11.6), don't guess.
- **`DATAFILE` type discrimination** (it has no delimiter token of its own):
  read the file's first line.
  - contains `;` or `,` → treat as a delimited source, read like CSV (§11.4).
  - contains neither **and** the script has a vardef include
    (`INPUT = <…>.inc;` / a `.inc` of `VARNAME`/`#defvar`-style column
    definitions) → **column-binary / column-fixed**; record the source but
    `names: 'unresolved'`, reason `"column-fixed data — not supported yet"`.
    Defer to §6 / a later phase.
  - contains neither and no vardef include → `unresolved`, reason
    `"cannot determine DATAFILE format"`.

### 11.4 Reading the raw names

Result per entry program: the **union** of names across all its waves (a name in
*any* wave counts; panel waves routinely differ).

**CSV / delimited `DATAFILE`:**

- Read only the first line (bounded chunk, cut at first `\n` — never load the file).
- Decode UTF-8; on invalid bytes, re-decode as Windows-1252. Strip a leading BOM.
- Delimiter: the statement's explicit `[ <delimchar> ]` if present; else whichever
  of `;` or `,` appears in the line (if both, the more frequent one). **Neither
  present → the file is not a delimited source: skip it** (no names, no error —
  for `CSVINFILE` this shouldn't happen and is worth a warning; for `DATAFILE`
  it's the column-fixed branch, §11.3).
- Unquote (`"…"`), trim. Each field = one raw variable name, **column index kept**
  (for the hover note / a future header-cell jump).

**SPSS `.sav`** — hand-written dictionary parser, front-of-file only, never the
case data:

- magic `$FL2` (plain / type-1 bytecode compression) — **supported**.
- magic `$FL3` (ZSAV, zlib-compressed dictionary) — **not v1**; detect and return
  `unresolved` with a clear reason (§11.7 Q2).
- record type 2 (variable records): 8-byte short name, type field
  (`0` numeric → kind `atomic`; `>0` string width → kind `alpha`; `-1` string
  continuation segment → skip). Ignore formats, missing-value specs, the inline
  label for v1.
- record type 7 / subtype 13 (long-name map): short name → real
  case-preserving name (≤ 64 chars). Prefer this name when present.
- record type 7 / subtype 20 (encoding): use it to decode the names.

Everything else (value-label sets type 3/4, variable labels, measurement level)
is **skipped in v1**.

### 11.5 Feeding the variable model (later)

When the model is built (§8 phase 2+): seed each raw name **before** the
program-order pass as
`VariableSymbol { origin: 'external', kind, definitions: [<the input statement
line>] }`. A later in-script `SINGLEQ`/`COMPUTE` of the same name is a
**re-definition layered on** the external origin — not a duplicate-declaration
error (§9 Q3); origin stays `external`, the extra line is appended to
`definitions`.

go-to-definition on an external name lands on the input statement. The
CSV-header-cell / `.sav`-offset jump is a later refinement (§11.7 Q3).

The variable model (§7.2) is a **single** symbol table built in one pass. But
entry programs can carry **different, partly conflicting** variable universes: a
name may be external in one program and unknown in another, or numeric in
`main.tab`'s dataset and `ALPHA` in `mainFlipped.tab`'s. One shared model cannot
hold both truths. So there must be **one model per entry program** (built lazily,
cached, keyed by the program's resolved file set + external mtimes). See §11.7 Q5
for the parts still to decide.

### 11.6 Missing or unreadable data source — a diagnostic

A GESStabs script needs a working data source; without one it does nothing. So,
unlike an ordinary "undefined variable" (which needs the model), this **is**
flagged, by the near-term consumer alone:

| situation | diagnostic | `names` |
| --- | --- | --- |
| a `CSVINFILE`/`SPSSINFILE`/`DATAFILE` statement whose `<filepath>` cannot be resolved or read | **warning** on that statement line: *"Datenquelle `<path>` nicht gefunden"* | `'unresolved'` |
| an entry script's own `INCLUDE` graph has **no** input statement at all | **warning** on that entry script (line 1): *"keine Datenquelle (SPSSINFILE/CSVINFILE/DATAFILE) im Skript"* | — |
| `<filepath>` unresolvable because it still holds `#EXPAND`/`&token&`/wildcard | **info** (not warning — it may well resolve at runtime): *"Datenpfad nicht statisch auflösbar"* | `'unresolved'` |
| column-fixed / ZSAV / other not-yet-supported format | **info**: *"Variablennamen aus diesem Quellformat werden noch nicht gelesen"* | `'unresolved'` |

Whenever an entry program has any `'unresolved'` source, the later model-level
per-variable "undefined variable" check stays **suppressed for every file in that
program's include graph** — we cannot know which names the source would have
supplied, so flagging unknown tokens would be noise. The source-level warning
above is the signal instead.

Wildcard path (`data*.csv`): try the union of `fs`-matching files' headers; only
`'unresolved'` if none match (§11.7 Q4).

### 11.7 Open questions

1. **SPSS parser depth** — *resolved 2026-09-04: names + type only, no labels,
   ever.* In a gessTabs workflow the variable/value labels are (re)defined in
   the script, directly or auto-generated by `#define … syntax`, so the `.sav`'s
   own labels are never authoritative. Not an extension task. Parser stays as-is.
2. **ZSAV (`$FL3`)** — *resolved: nothing to do.* The front-of-file dictionary is
   uncompressed even in ZSAV (only the case data is compressed), so `readSavDictionary`
   already handles the `$FL3` magic and returns names + type. No zlib inflate needed.
3. **Header-cell / offset jump** — worth building the CSV-column and `.sav`-record
   location tracking for go-to-definition, or is landing on the input statement
   enough? *Proposed: keep the column index around (cheap), wire the jump later.*
4. **Wildcard data paths** — union of matches, or `unresolved`? *Proposed: union
   for CSV headers, `unresolved` if no match.*
5. **The variable model when there is more than one entry program.** The model
   is one symbol table per entry program (§11.5). Two things still to decide:
   - **A shared `.inc` opened on its own** — no active `main*.tab` context. Which
     program's model applies? *Proposed: the program the active editor belongs
     to; if none (the `.inc` is the only thing open), the union of all programs
     that include it, with type conflicts shown as "mehrdeutig".*
   - **Cost** — N entry programs ⇒ N model builds instead of one. *Proposed:
     build lazily on first query into a program, cache keyed by that program's
     file set + external-file mtimes, drop on a watcher event.*
6. **Exact `DATAFILE` / vardef-include shape** — confirm the `INPUT = <…>.inc;`
   vs. `INCLUDE = <…>.inc;` spelling and how a column-fixed `DATAFILE` names its
   variable definitions, from `csv.html` / `handhabung-von-ascii-daten.html`
   (not yet mirrored). Only matters for the deferred column-fixed branch.

### 11.8 Caching & performance

- `FileSystemWatcher` on the resolved data-source paths **and** on `*.tab`.
- Parse result cached by `path + mtime + size`; the SPSS parse is the expensive
  one — evict only on watcher events.
- **Never** parse on keystroke. The model (later) takes the already-parsed
  `ExternalNameSource[]` as an input (`buildVariableModel` `opts.externalNames`),
  so its hot path stays file-free.

### 11.9 New module surface (additive, no consumer churn)

- `src/core/entryScripts.ts` — `findEntryScripts(folder, patterns, fsLike)` →
  root `.tab` files matching any pattern; `buildEntryPrograms(...)` →
  `EntryProgram[]` (`{ entryFile, files, sources }`); `programsForFile(programs,
  file)`. Pure. `patterns` from `gesstabs.dataInput.entryScriptPatterns`.
- `src/core/externalNames.ts` — `readExternalNames(resolvedOrder, containingDir,
  fsLike)` → `ExternalNameSource[]`; the CSV first-line reader and the `.sav`
  dictionary parser (split into `savDictionary.ts` if it grows past ~250 lines).
  Pure over an injected byte reader.
- `src/providers/externalNamesProvider.ts` (or fold into the existing variable
  hover) — the `FileSystemWatcher` + `path+mtime+size` cache of `EntryProgram[]`,
  the hover note, the `DocumentLink`, the missing-source diagnostic. The only
  vscode-facing piece.
- New setting `gesstabs.dataInput.entryScriptPatterns` in `package.json`
  (`string[]`, default `["main.tab", "main*.tab", "*.tab"]`).
- `test/entryScripts.spec.ts`, `test/externalNames.spec.ts` with tiny real
  `.csv` / `.sav` fixtures under `test/fixtures/`.

