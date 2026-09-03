# Variable model — handbook-driven design pass

> Status: **design, not yet implemented.** This is the "handbook-driven design pass"
> TODO.md's Tier 1 asks for *before* go-to-definition / references / rename / hover /
> the F2 diagnostics are touched again. Nothing in `src/` changes until this is
> agreed. Written 2026-09-03 against the online manual mirror in
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

### 7.3 `externalNames.ts` — externally-sourced variables (phase 4)

```ts
export interface ExternalNameSource {
  statement: ResolvedLine;             // the CSVINFILE/SPSSINFILE/DATAFILE line
  names: string[] | 'unresolved';      // 'unresolved' when the data file isn't present
  headerLocation?: (name: string) => { file: string; line: number; col: number };
}
export function readExternalNames(index: WorkspaceIndex, fs: FileSystemLike): ExternalNameSource[];
```

- **Phase 4a**: CSV (`CSVINFILE`, delimited `DATAFILE`) — resolve path relative to
  the `.tab`, read first line, split on `[ ‹delimchar› ]` or default. Node `fs`.
- **Phase 4b**: SPSS `.sav` dictionary parser (record type 2 + type-7/subtype-13
  long-name map). ~200 lines against the public format spec, or a vendored reader.
- **Phase 4c**: column-fixed `.dat` — vardef-include macro-call first-argument
  heuristic; `VARNAME = ‹n› ‹col› ‹len›;`; `VARIABLES ‹a› TO ‹b› = ‹col› ‹w›;`.
- `FileSystemWatcher` + cache in the provider layer; **never** re-read on
  keystroke. `‹filepath›` may contain `#EXPAND`/`&token&`/wildcards — mark
  `unresolved` rather than guess.
- Manual pages to mirror first: `csv.html`, `spss2.html`,
  `handhabung-von-ascii-daten.html`, `invertierte-datensaetze.html`.

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
| **1** | `variableStatements.ts` + `toLogicalStatements` + full spec. **No consumer wired yet.** | low — pure, additive | everything below |
| **2** | `variableModel.ts` (declared + predefined origins; no macro/external). Wire **hover** first (smallest blast radius, best signal). | med | — |
| **3** | Move go-to-definition, references, rename, semantic highlighting onto the model. Delete `regex.ts`/`matching.ts`. Move F2 empty-varlist + duplicate-declaration onto the model. | med-high — behaviour-visible | Tier 2 cross-INCLUDE F2 scope, Tier 3 semantic "last-name" fix |
| **4** | `externalNames.ts` 4a (CSV) → 4b (SPSS) → 4c (fixed `.dat`). Feed `origin: 'external'`. Add DocumentLink for the data-source statement. | med | "undefined variable" diagnostic, real go-to-def for dataset vars |
| **5** | macro-produced names into the model (numeric/comma params, mid-token). `#DOMACRO` stays Tier 3. | med | — |
| **6** | New diagnostics on the model: undefined-variable, system-var redeclaration, `ALPHA` var in two `AlphaFamily`s, kind-illegal ops. | low each | Tier 2 items |

Tier 2's "Hover over String" and the multi-response classification for the
mutually-exclusive cell-option diagnostics both fall out of phases 2–3 (the model
knows kinds) and phase 4 (the model knows every `MULTIQ` across the resolved
program) — they are **not** separate work.

---

## 9. Open questions (need a decision before phase 1 lands)

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
- Actually shipping the SPSS `.sav` parser (phase 4b) — design only until 4a
  proves the model's `external` slot is right.
