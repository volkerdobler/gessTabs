import { expect } from 'chai';
import {
  classifyStatement,
  expandNameRange,
  ClassifiedStatement,
} from '../src/core/variableStatements';

const c = (text: string): ClassifiedStatement => {
  const r = classifyStatement(text);
  expect(r, `classifyStatement(${JSON.stringify(text)})`).to.not.be.undefined;
  return r as ClassifiedStatement;
};

const defNames = (s: ClassifiedStatement) => s.defines.map((d) => d.name);
const refNames = (s: ClassifiedStatement) =>
  s.references.map((r) => r.span.name);

describe('classifyStatement — definition forms (§3)', () => {
  it('SINGLEQ v = … is a declaration of an atomic var', () => {
    const s = c('singleq alter = 1;');
    expect(s.kind).to.equal('singleq');
    expect(defNames(s)).to.deep.equal(['alter']);
    expect(s.defKind).to.equal('declaration');
    expect(s.targetKind).to.equal('atomic');
    expect(s.bindsCurrentVariable).to.be.true;
  });

  it('SINGLEQ v 0 VARTEXT … — the no-= column form still declares v', () => {
    const s = c('singleq land 0 vartext "Land";');
    expect(defNames(s)).to.deep.equal(['land']);
    expect(s.defKind).to.equal('declaration');
  });

  it('SINGLEQ v = ALPHA marks the target ALPHA', () => {
    expect(c('singleq name = alpha;').targetKind).to.equal('alpha');
  });

  it('MAKESINGLE v; declares v with no =', () => {
    const s = c('makesingle neu;');
    expect(s.kind).to.equal('makesingle');
    expect(defNames(s)).to.deep.equal(['neu']);
  });

  it('LABELVALUE numvar = src; declares numvar and references src', () => {
    const s = c('labelvalue NumberVar = alphatest;');
    expect(s.kind).to.equal('labelvalue');
    expect(defNames(s)).to.deep.equal(['numbervar']);
    expect(s.defKind).to.equal('declaration');
    expect(s.targetKind).to.equal('atomic');
    expect(refNames(s)).to.deep.equal(['alphatest']);
  });

  it("SINGLEFROMSTRING = newvar = alphavar; (manual's doubled =) declares newvar", () => {
    const s = c('singlefromstring = newvar = alphavar;');
    expect(s.kind).to.equal('labelvalue');
    expect(defNames(s)).to.deep.equal(['newvar']);
    expect(refNames(s)).to.deep.equal(['alphavar']);
  });

  it('SINGLEFROMSTRING newvar = alphavar; (without the doubled =) still works', () => {
    const s = c('singlefromstring newvar = alphavar;');
    expect(defNames(s)).to.deep.equal(['newvar']);
    expect(refNames(s)).to.deep.equal(['alphavar']);
  });

  it('VARIABLES a b c = … declares every name, not just the last', () => {
    const s = c('variables a b c = 1 2;');
    expect(defNames(s)).to.deep.equal(['a', 'b', 'c']);
    expect(s.targetKind).to.equal('atomic');
  });

  it('COMPUTE v = expr (no sub-keyword) is an assignment that creates v', () => {
    const s = c('compute umsatz = preis * menge;');
    expect(s.kind).to.equal('compute');
    expect(defNames(s)).to.deep.equal(['umsatz']);
    expect(s.defKind).to.equal('assignment');
    expect(refNames(s)).to.include.members(['preis', 'menge']);
  });

  it('COMPUTE a b c = 0 sets several targets', () => {
    expect(defNames(c('compute a b c = 0;'))).to.deep.equal(['a', 'b', 'c']);
  });

  it('COMPUTE COPY x = y — left defines, right is an always-mode ref', () => {
    const s = c('compute copy x = y;');
    expect(s.keyword).to.equal('compute copy');
    expect(defNames(s)).to.deep.equal(['x']);
    expect(s.references).to.deep.equal([
      { span: s.references[0].span, mode: 'always' },
    ]);
    expect(refNames(s)).to.deep.equal(['y']);
  });

  it('COMPUTE SWAP a = b defines both sides', () => {
    const s = c('compute swap a = b;');
    expect(defNames(s)).to.have.members(['a', 'b']);
  });

  it('COMPUTE with no varlist before = uses the current variable', () => {
    const s = c('compute = 1;');
    expect(s.usesCurrentVariable).to.be.true;
    expect(s.bindsCurrentVariable).to.be.true;
    expect(s.defines).to.be.empty;
  });

  it('IF cond THEN v = … : condition refs are ifKnown, target is an assignment', () => {
    const s = c('if partei eq "spd" then wechsel = 1;');
    expect(s.kind).to.equal('if-then');
    expect(defNames(s)).to.deep.equal(['wechsel']);
    expect(s.defKind).to.equal('assignment');
    const partei = s.references.find((r) => r.span.name === 'partei');
    expect(partei?.mode).to.equal('ifKnown');
  });

  it('IF … THEN … ELSE … collects both branch targets', () => {
    const s = c('if a eq 1 then x = 1 else y = 2;');
    expect(defNames(s)).to.have.members(['x', 'y']);
  });

  it('IF cond1 ASSERT cond2 TITLE "…"; — both conditions ifKnown, ASSERT/TITLE never phantom refs', () => {
    const s = c(
      'if hatProdukt eq 1 assert kenntProdukt eq 1 title "muss kennen";'
    );
    expect(defNames(s)).to.be.empty;
    expect(refNames(s)).to.deep.equal(['hatprodukt', 'kenntprodukt']);
    expect(s.references.every((r) => r.mode === 'ifKnown')).to.be.true;
  });

  it('IF cond1 ASSERT cond2; — no TITLE clause, still just the two conditions', () => {
    const s = c('if a eq 1 assert b eq 2;');
    expect(refNames(s)).to.deep.equal(['a', 'b']);
  });

  it('VARFAMILY f = a b c — family decl, members are always-mode refs', () => {
    const s = c('varfamily f = a b c;');
    expect(s.kind).to.equal('varfamily');
    expect(s.targetKind).to.equal('family');
    expect(defNames(s)).to.deep.equal(['f']);
    expect(refNames(s)).to.deep.equal(['a', 'b', 'c']);
    expect(s.references.every((r) => r.mode === 'always')).to.be.true;
  });

  it('MAKEFAMILY x = 10 — RHS is a count, not a name', () => {
    const s = c('makefamily x = 10;');
    expect(defNames(s)).to.deep.equal(['x']);
    expect(s.references).to.be.empty;
  });

  it('VARGROUP g = ( a b c ) EQ 1 — targets and parenthesised members', () => {
    const s = c('vargroup g = ( a b c ) eq 1;');
    expect(s.kind).to.equal('vargroup');
    expect(defNames(s)).to.deep.equal(['g']);
    expect(refNames(s)).to.deep.equal(['a', 'b', 'c']);
  });

  it('GROUPS g = | "x" : v eq 1 | "y" : w eq 2 — condition vars are refs', () => {
    const s = c('groups g = | "x" : v eq 1 | "y" : w eq 2;');
    expect(defNames(s)).to.deep.equal(['g']);
    expect(refNames(s)).to.have.members(['v', 'w']);
  });

  it('INTERVALS iv = src | "x" : ge 1 — source var once', () => {
    const s = c('intervals iv = src | "low" : ge 0 | "high" : ge 100;');
    expect(defNames(s)).to.deep.equal(['iv']);
    expect(refNames(s)).to.deep.equal(['src']);
  });

  it('INDEXVAR v = a b c BY idx', () => {
    const s = c('indexvar v = a b c by idx;');
    expect(defNames(s)).to.deep.equal(['v']);
    expect(refNames(s)).to.have.members(['a', 'b', 'c', 'idx']);
  });

  it('MEAN m = a b c — statistical creator, atomic declaration', () => {
    const s = c('mean m = a b c;');
    expect(s.kind).to.equal('stat-creator');
    expect(defNames(s)).to.deep.equal(['m']);
    expect(refNames(s)).to.deep.equal(['a', 'b', 'c']);
  });

  it('DATA MEAN v = base BY grp', () => {
    const s = c('data mean v = basevar by grp;');
    expect(s.keyword).to.equal('data mean');
    expect(defNames(s)).to.deep.equal(['v']);
    expect(refNames(s)).to.have.members(['basevar', 'grp']);
  });

  it('MULTIFROMSTRING v = a — target pre-exists, so an assignment', () => {
    const s = c('multifromstring delimited "," v = alfa;');
    expect(s.defKind).to.equal('assignment');
    expect(defNames(s)).to.deep.equal(['v']);
    expect(refNames(s)).to.deep.equal(['alfa']);
  });
});

describe('classifyStatement — references & current variable (§4)', () => {
  it('VARTITLE vl = "…" — varlist names are always-mode refs, no defines', () => {
    const s = c('vartitle a b = "Titel";');
    expect(s.kind).to.equal('annotation');
    expect(s.defines).to.be.empty;
    expect(refNames(s)).to.deep.equal(['a', 'b']);
    expect(s.references.every((r) => r.mode === 'always')).to.be.true;
  });

  it('VALUELABELS = 1 "x"; with no varlist uses the current variable', () => {
    const s = c('valuelabels = 1 "eins" 2 "zwei";');
    expect(s.usesCurrentVariable).to.be.true;
    expect(s.references).to.be.empty;
  });

  it('COPYLABELS x = y — target ref plus source ref', () => {
    const s = c('copylabels x = y;');
    expect(refNames(s)).to.deep.equal(['x', 'y']);
  });

  it('TABLE = a b BY c — every head/axis name is an always-mode ref', () => {
    const s = c('table = a b by c;');
    expect(s.kind).to.equal('table');
    expect(refNames(s)).to.deep.equal(['a', 'b', 'c']);
  });

  it('OVERVIEW ADD = … FILTER [range] IN v | BY #expand(...) — clause keywords and the macro name are not phantom refs (reported example)', () => {
    const s = c(
      'overview add = 1 1 filter [11:19] in f13mult | by #meantest(f71_m1.1.1 f71_m1.2.1);'
    );
    expect(s.kind).to.equal('table');
    // "filter"/"in"/"by" are clause keywords, "#meantest" is the macro
    // call itself — none of those are variable references. f13mult and
    // the macro's own arguments still are.
    expect(refNames(s)).to.deep.equal(['f13mult', 'f71_m1.1.1', 'f71_m1.2.1']);
  });

  it("TABLE = a MEAN(v1) BY c — a cellelement(...) call's own keyword is not a phantom ref, its varname arg is", () => {
    const s = c('table = a mean(v1) by c;');
    expect(refNames(s)).to.deep.equal(['a', 'v1', 'c']);
  });

  it('TABLE = a MEAN(v1 v2 BY v3) BY c — the two-varname-plus-BY cellelement form', () => {
    const s = c('table = a mean(v1 v2 by v3) by c;');
    expect(refNames(s)).to.deep.equal(['a', 'v1', 'v2', 'v3', 'c']);
  });

  it('TABLE NAME <tablename> HIDDEN(...) = a BY b — a taboption never names a variable', () => {
    const s = c('table name sortsource hidden(ps pdf) = a by b;');
    expect(refNames(s)).to.deep.equal(['a', 'b']);
  });

  it('TABLE CELLELEMENTS(...) FRAMEELEMENTS(...) TITLE "…" = a BY b — taboption argument lists are opaque, not refs', () => {
    const s = c(
      'table cellelements(absolute columnpercent) frameelements(absrow) title "Titel" = a by b;'
    );
    expect(refNames(s)).to.deep.equal(['a', 'b']);
  });

  it('TABLE SORT AS <tablename> = a BY b — the taboption form of SORT AS, not the part-option SORT', () => {
    const s = c('table sort as overbase = a by b;');
    expect(refNames(s)).to.deep.equal(['a', 'b']);
  });

  it('TABLE = a MEAN :DESCRIPTION "…" (v1) BY c — the :suffix sits before the parens (per the manual\'s worked examples, not its EBNF table row)', () => {
    const s = c('table = a mean :description "Mittelwert" (v1) by c;');
    expect(refNames(s)).to.deep.equal(['a', 'v1', 'c']);
  });

  it('TABLE = a MEAN :USEVARTITLE x1 (v1) BY c — :USEVARTITLE\'s argument is a real varname ref, unlike :DESCRIPTION/:FORMAT\'s text', () => {
    const s = c('table = a mean :usevartitle x1 (v1) by c;');
    expect(refNames(s)).to.deep.equal(['a', 'x1', 'v1', 'c']);
  });

  it('TABLE = a BY c SORT ABSOLUTE DESCEND TOP 80 — a part-option SORT clause has no variable refs', () => {
    const s = c('table = a by c sort absolute descend top 80;');
    expect(refNames(s)).to.deep.equal(['a', 'c']);
  });

  it("TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST — FILTER's condition refs are ifKnown, part content stays always", () => {
    const s = c(
      'table = v1 filter geschl eq 1 | v1 filter geschl eq 2 | by v1 meantest;'
    );
    // A bare CELLELEMENT-style keyword with no "(...)" args (MEANTEST
    // here) is indistinguishable from a real <varname> without a
    // maintained keyword allowlist (out of scope for this grammar pass,
    // same as item 2's kind-illegal-operations list) — it legitimately
    // falls through to the <varname> content rule, same as a real
    // variable would.
    expect(refNames(s)).to.deep.equal([
      'v1',
      'geschl',
      'v1',
      'geschl',
      'v1',
      'meantest',
    ]);
    const conditionRefs = s.references.filter((r) =>
      ['geschl'].includes(r.span.name)
    );
    expect(conditionRefs.every((r) => r.mode === 'ifKnown')).to.be.true;
    const contentRefs = s.references.filter(
      (r) => r.span.name === 'v1' || r.span.name === 'meantest'
    );
    expect(contentRefs.every((r) => r.mode === 'always')).to.be.true;
  });

  it('WEIGHTCELLS [AUTOALIGN] v = … references v, creates nothing', () => {
    const s = c('weightcells autoalign gewicht = 1 : 50% 2 : 50%;');
    expect(s.defines).to.be.empty;
    expect(refNames(s)).to.deep.equal(['gewicht']);
    expect(s.references[0].mode).to.equal('always');
  });

  it('FILTER vl = cond — varlist is always-mode, condition vars ifKnown', () => {
    const s = c('filter west ost = region eq 1;');
    expect(s.defines).to.be.empty;
    const west = s.references.find((r) => r.span.name === 'west');
    expect(west?.mode).to.equal('always');
    const region = s.references.find((r) => r.span.name === 'region');
    expect(region?.mode).to.equal('ifKnown');
  });
});

describe('classifyStatement — blocks (§2.4)', () => {
  it('IFBLOCK opens a block and exposes its condition refs', () => {
    const s = c('ifblock alter gt 18 then');
    expect(s.kind).to.equal('block');
    expect(s.block).to.equal('open');
    expect(refNames(s)).to.include('alter');
  });

  it('ENDBLOCK closes a block', () => {
    expect(c('endblock;').block).to.equal('close');
  });

  it('SETFILTER opens, ENDFILTER closes', () => {
    expect(c('setfilter f1 west eq 1;').block).to.equal('open');
    expect(c('endfilter f1;').block).to.equal('close');
  });

  it('#MACRO opens, #ENDMACRO closes', () => {
    expect(c('#macro #foo (').block).to.equal('open');
    expect(c('#endmacro').block).to.equal('close');
  });
});

describe('classifyStatement — ranges & overcodes', () => {
  it('flags an ‹a› TO ‹b› name range with hasNameRange', () => {
    expect(c('variables v1 to v9 = 1 2;').hasNameRange).to.be.true;
    expect(c('varfamily f = q1 to q10;').hasNameRange).to.be.true;
    expect(c('compute x = 1;').hasNameRange).to.be.undefined;
  });

  it('VARIABLES a1 TO a9 declares every member, not just the two endpoints', () => {
    const s = c('variables a1 to a9 = 1 2;');
    expect(defNames(s)).to.deep.equal([
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'a7',
      'a8',
      'a9',
    ]);
  });

  it('VARFAMILY members expand a numeric-suffix TO range, dotted prefix included', () => {
    expect(refNames(c('varfamily f = a1 to a3;'))).to.deep.equal([
      'a1',
      'a2',
      'a3',
    ]);
    expect(refNames(c('varfamily f = f.1 to f.3;'))).to.deep.equal([
      'f.1',
      'f.2',
      'f.3',
    ]);
  });

  it('a statistical creator source list expands a TO range', () => {
    const s = c('mean m = Item1 to Item4;');
    expect(refNames(s)).to.deep.equal(['item1', 'item2', 'item3', 'item4']);
  });

  it('COMPUTE COPY expands a TO range on both sides', () => {
    const s = c('compute copy v1 to v3 = x1 to x3;');
    expect(defNames(s)).to.deep.equal(['v1', 'v2', 'v3']);
    expect(refNames(s)).to.deep.equal(['x1', 'x2', 'x3']);
  });

  it('a comma-separated list of TO ranges expands each independently', () => {
    const s = c('compute copy v1 to v4 = x1 to x2, item1 to item2;');
    expect(refNames(s)).to.deep.equal(['x1', 'x2', 'item1', 'item2']);
  });

  it('a reference-position TO whose endpoints share no numeric-suffix pattern keeps just the two endpoints (§9 Q2 — the model resolves the rest)', () => {
    const s = c('vartext esseWagnerMenge to esseHandelsmarkeMenge = "xxx";');
    expect(refNames(s)).to.deep.equal([
      'essewagnermenge',
      'essehandelsmarkemenge',
    ]);
    expect(s.hasNameRange).to.be.true;
    expect(s.unresolvedRanges).to.have.length(1);
    expect(s.unresolvedRanges?.[0].from.name).to.equal('essewagnermenge');
    expect(s.unresolvedRanges?.[0].to.name).to.equal('essehandelsmarkemenge');
  });

  it('an expandable numeric-suffix pair is NOT recorded as an unresolvedRange', () => {
    expect(c('mean m = item1 to item4;').unresolvedRanges).to.be.undefined;
  });

  it('OVERCODE ‹name› ‹values› "text" records a virtual code', () => {
    const s = c('overcode ost 1 2 3 "Ostdeutschland";');
    expect(s.kind).to.equal('overcode');
    expect(s.usesCurrentVariable).to.be.true;
    expect((s.virtualDefines ?? []).map((v) => v.name)).to.deep.equal(['ost']);
  });

  it('an anonymous OVERCODE (no name) records nothing virtual', () => {
    const s = c('overcode sum 1 2 3 "Summe";');
    expect(s.virtualDefines).to.be.undefined;
  });

  it('expandNameRange handles a shared prefix + trailing integer', () => {
    expect(expandNameRange('v1', 'v4')).to.deep.equal(['v1', 'v2', 'v3', 'v4']);
    expect(expandNameRange('q08', 'q11')).to.deep.equal([
      'q08',
      'q09',
      'q10',
      'q11',
    ]);
  });

  it('expandNameRange returns undefined for mismatched / non-numeric endpoints', () => {
    expect(expandNameRange('alpha', 'omega')).to.be.undefined;
    expect(expandNameRange('a1', 'b4')).to.be.undefined;
    expect(expandNameRange('v4', 'v1')).to.be.undefined;
  });
});

describe('classifyStatement — edge cases', () => {
  it('returns undefined for a statement with no leading keyword', () => {
    expect(classifyStatement('  = 5;')).to.be.undefined;
    expect(classifyStatement('')).to.be.undefined;
  });

  it('flags a no-name VARFAMILY as malformed rather than inventing a symbol (§9 Q1)', () => {
    const s = c('varfamily = a b c;');
    expect(s.defines).to.be.empty;
    expect(s.malformed).to.be.a('string');
  });

  it('case-insensitive on keywords and names', () => {
    const s = c('SingleQ Alter = 1;');
    expect(defNames(s)).to.deep.equal(['alter']);
  });

  it('an unknown statement keyword yields kind "other"', () => {
    expect(c('tabletitle "Report";').kind).to.equal('other');
  });
});
