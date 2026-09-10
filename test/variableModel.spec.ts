import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { buildWorkspaceIndex } from '../src/core/symbolIndex';
import { ExternalNameSource } from '../src/core/externalNames';
import {
  buildVariableModel,
  collectVariableOccurrences,
  primaryDefinitions,
} from '../src/core/variableModel';

const ROOT = path.resolve('/gesstabs-varmodel-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

const indexOf = (main: string, files: Record<string, string> = {}) => {
  const all = { [p('main.tab')]: main, ...files };
  const reader: FileReader = (fp) =>
    all[fp] === undefined ? undefined : all[fp].split('\n');
  return buildWorkspaceIndex(Object.keys(all), reader, {
    conditionalsAllActive: true,
  });
};

const modelOf = (main: string, files: Record<string, string> = {}) =>
  buildVariableModel(indexOf(main, files));

// A CSVINFILE source at main.tab:0, unless overridden.
const externalSource = (
  names: string[] | 'unresolved',
  overrides: Partial<ExternalNameSource['statement']> = {}
): ExternalNameSource => ({
  statement: {
    kind: 'csv',
    file: p('main.tab'),
    line: 0,
    rawPath: 'data.csv',
    text: 'csvinfile = data.csv;',
    ...overrides,
  },
  names,
});

describe('buildVariableModel', () => {
  it('seeds the predefined system variables', () => {
    const m = modelOf('compute x = 1;');
    const sysmiss = m.resolve('SysMiss', p('main.tab'), 0);
    expect(sysmiss?.origin).to.equal('predefined');
    expect(m.resolve('SystemCaseNo', p('main.tab'), 0)?.origin).to.equal(
      'predefined'
    );
  });

  it('records a declared variable with its kind and definition line', () => {
    const m = modelOf('singleq alter = 1;\nvarfamily fam = a b c;');
    const alter = m.resolve('alter', p('main.tab'), 5);
    expect(alter?.origin).to.equal('declared');
    expect(alter?.kind).to.equal('atomic');
    expect(alter?.definitions[0].line).to.equal(0);

    const fam = m.resolve('fam', p('main.tab'), 5);
    expect(fam?.kind).to.equal('family');
    expect(fam?.members).to.deep.equal(['a', 'b', 'c']);
  });

  it('honours no-forward-reference: a name is not visible before its declaration', () => {
    const m = modelOf('compute early = late;\nsingleq late = 1;');
    expect(m.resolve('late', p('main.tab'), 0)).to.be.undefined;
    expect(m.resolve('late', p('main.tab'), 1)).to.not.be.undefined;
  });

  it('tracks "die aktuelle Variable"', () => {
    const m = modelOf(
      'singleq alter = 1;\nvaluelabels = 1 "eins";\nsingleq stadt = 2;'
    );
    expect(m.currentVariableAt(p('main.tab'), 1)).to.equal('alter');
    expect(m.currentVariableAt(p('main.tab'), 2)).to.equal('stadt');
  });

  it('attaches an empty-varlist annotation to the current variable', () => {
    const m = modelOf('singleq alter = 1;\nvaluelabels = 1 "eins" 2 "zwei";');
    const alter = m.resolve('alter', p('main.tab'), 5);
    expect(alter?.annotations).to.have.length(1);
    expect(alter?.annotations[0].kind).to.equal('valuelabels');
    expect(alter?.annotations[0].statement).to.contain('valuelabels');
  });

  it('attaches a varlist annotation to each named variable', () => {
    const m = modelOf(
      'singleq a = 1;\nsingleq b = 2;\nvartitle a b = "Titel";'
    );
    expect(m.resolve('a', p('main.tab'), 5)?.annotations[0].kind).to.equal(
      'vartitle'
    );
    expect(m.resolve('b', p('main.tab'), 5)?.annotations[0].kind).to.equal(
      'vartitle'
    );
  });

  it('collects references and skips quoted text that is not a known name', () => {
    const m = modelOf(
      'singleq partei = 1;\nif partei eq "spd" then x = 1;\ncompute y = "partei";'
    );
    const refs = m.references('partei');
    // the condition use on line 1, plus the quoted "partei" on line 2
    // (quoted, ifKnown, but partei IS known by then → counts)
    expect(refs.map((r) => r.line.line)).to.include(1);
  });

  it('a quoted token naming nothing is not a reference', () => {
    const m = modelOf('compute y = "nichtvorhanden" + 1;');
    expect(m.references('nichtvorhanden')).to.be.empty;
  });

  it('resolves across an INCLUDE in program order', () => {
    const m = modelOf('include = vars.inc;\ncompute t = alter + 1;', {
      [p('vars.inc')]: 'singleq alter = 1;',
    });
    const alter = m.resolve('alter', p('main.tab'), 1);
    expect(alter?.origin).to.equal('declared');
    expect(alter?.definitions[0].file).to.equal(p('vars.inc'));
  });

  it("COPYLABELS aliases the source variable's value labels onto the target", () => {
    const m = modelOf(
      [
        'singleq src = 1;',
        'valuelabels src = 1 "ja" 2 "nein";',
        'singleq dst = 1;',
        'copylabels dst = src;',
      ].join('\n')
    );
    const dst = m.resolve('dst', p('main.tab'), 9);
    expect(dst?.annotations).to.have.length(1);
    expect(dst?.annotations[0].kind).to.equal('valuelabels');
    expect(dst?.annotations[0].copiedFrom).to.equal('src');
    expect(dst?.annotations[0].statement).to.contain('"ja"');
  });

  it('keeps a VALUELABELS on an undeclared (dataset) name as an orphan annotation', () => {
    const m = modelOf('valuelabels rohvar = 1 "ja" 2 "nein";');
    expect(m.resolve('rohvar', p('main.tab'), 9)).to.be.undefined;
    const anns = m.annotationsFor('rohvar');
    expect(anns).to.have.length(1);
    expect(anns[0].kind).to.equal('valuelabels');
  });

  it("annotationsFor merges a declared symbol's own and orphan annotations", () => {
    const m = modelOf('vartitle a = "T";\nsingleq a = 1;\nvartext a = "X";');
    // "a" is declared on line 1; the line-0 VARTITLE precedes it (orphan),
    // the line-2 VARTEXT is its own
    expect(
      m
        .annotationsFor('a')
        .map((x) => x.kind)
        .sort()
    ).to.deep.equal(['vartext', 'vartitle']);
  });

  it('resolveAnywhere ignores program order', () => {
    const m = modelOf('compute t = later;\nsingleq later = 1;');
    expect(m.resolve('later', p('main.tab'), 0)).to.be.undefined;
    expect(m.resolveAnywhere('later')?.origin).to.equal('declared');
  });

  it('exposes the defining statement text and program-order statements', () => {
    const m = modelOf('varfamily f =\n a b c ;');
    expect(
      m.resolve('f', p('main.tab'), 9)?.definitionStatements[0]
    ).to.contain('varfamily f');
    expect(m.statements.length).to.be.greaterThan(0);
  });

  it('a re-definition adds a definition line, not a duplicate symbol', () => {
    const m = modelOf('compute x = 1;\ncompute x = 2;');
    const all = m.all().filter((s) => s.name === 'x');
    expect(all).to.have.length(1);
    expect(all[0].definitions).to.have.length(2);
  });

  it('keeps definitions in program order — index 0 is always the earliest (the real hover fix)', () => {
    // regression: an IF-THEN re-assignment must never be mistaken for an
    // alternate "declaration" — hovering the true first definition used
    // to surface it as if it were one (see TODO.md's "Known bug" entry).
    const m = modelOf(
      [
        'compute esseWagnerMenge = 0;',
        'if (1 in s10) then esseWagnerMenge = esseWagnerMenge + anzahl;',
      ].join('\n')
    );
    const sym = m.resolveAnywhere('esseWagnerMenge');
    expect(sym?.definitions).to.have.length(2);
    expect(sym?.definitions[0].line).to.equal(0);
    expect(sym?.definitions[0].text).to.contain('compute esseWagnerMenge');
    expect(sym?.definitions[1].line).to.equal(1);
  });

  it('a VARIABLES numeric-suffix range declares every member — not just the two endpoints', () => {
    // regression: a1..a9 used to only exist in the model as a1 and a9;
    // a5 was invisible to hover/go-to-def/duplicate-declaration entirely.
    const m = modelOf('variables a1 to a9 = 1 2;');
    const a5 = m.resolve('a5', p('main.tab'), 5);
    expect(a5?.origin).to.equal('declared');
    expect(a5?.definitions[0].line).to.equal(0);
  });
});

describe('buildVariableModel — external names (P1.4)', () => {
  it('a raw column becomes an external symbol, resolvable from the very start of the program', () => {
    const m = buildVariableModel(indexOf('compute y = 1;'), {
      externalNames: [externalSource(['alter', 'geschlecht'])],
    });
    const alter = m.resolve('alter', p('main.tab'), 0);
    expect(alter?.origin).to.equal('external');
    expect(alter?.kind).to.equal('atomic');
    expect(alter?.definitions).to.have.length(1);
    expect(alter?.definitions[0].line).to.equal(0);
    expect(alter?.definitions[0].file).to.equal(p('main.tab'));
    // "visible from the start" — resolves even at the very first line,
    // same as a predefined system variable (the dataset loads first).
    expect(m.resolve('geschlecht', p('main.tab'), 0)?.origin).to.equal(
      'external'
    );
  });

  it('preserves column order for the reference-position non-pattern ‹a› TO ‹b› form (§9 Q2)', () => {
    // names deliberately share no numeric-suffix pattern, so expandNameRange
    // can't expand this at classify time — only the model, which knows the
    // raw columns' own file order, can resolve it (unresolvedRanges).
    const m = buildVariableModel(
      indexOf('vartext esseWagner to esseGustavo = "x";'),
      {
        externalNames: [
          externalSource([
            'esseWagner',
            'esseOetker',
            'esseGustavo',
            'esseHandelsmarke',
          ]),
        ],
      }
    );
    const refs = m.references('esseOetker');
    expect(refs).to.have.length(1);
    expect(refs[0].span.synthetic).to.equal(true);
    // esseHandelsmarke is outside the esseWagner..esseGustavo range.
    expect(m.references('esseHandelsmarke')).to.have.length(0);
  });

  it('a later real declaration promotes it to "declared" — a re-definition, not a duplicate', () => {
    const m = buildVariableModel(indexOf('singleq alter = 1 2 3;'), {
      externalNames: [externalSource(['alter'])],
    });
    const sym = m.resolveAnywhere('alter');
    expect(sym?.origin).to.equal('declared');
    expect(sym?.definitions).to.have.length(2);
    const primary = primaryDefinitions(sym!);
    // both the CSVINFILE line and the SINGLEQ line are `declaration`-kind.
    expect(primary).to.have.length(2);
    expect(primary.map((d) => d.line.line)).to.deep.equal([0, 0]);
  });

  it('a mere COMPUTE/IF…THEN touching a raw column does NOT promote it (§3.3 — never a declaration)', () => {
    const m = buildVariableModel(indexOf('compute alter = alter + 1;'), {
      externalNames: [externalSource(['alter'])],
    });
    const sym = m.resolveAnywhere('alter');
    expect(sym?.origin).to.equal('external');
    expect(sym?.definitions).to.have.length(2);
  });

  it('an IF … THEN re-assignment of a raw column: primaryDefinitions is the data-source line, not the assignment (the hover "external, not Variable" fix)', () => {
    const m = buildVariableModel(
      indexOf('compute f1 = 1;\nif f1 eq 1 then alter = 2;'),
      { externalNames: [externalSource(['alter'])] }
    );
    const sym = m.resolveAnywhere('alter')!;
    expect(sym.origin).to.equal('external');
    const primary = primaryDefinitions(sym);
    expect(primary).to.have.length(1);
    // main.tab:0 — the CSVINFILE statement, never the IF … THEN line (1).
    expect(primary[0].line.line).to.equal(0);
  });

  it('an unresolved source contributes no symbols, without crashing', () => {
    const m = buildVariableModel(indexOf('compute y = 1;'), {
      externalNames: [externalSource('unresolved')],
    });
    expect(m.resolveAnywhere('alter')).to.be.undefined;
  });

  it('a name already predefined is not shadowed by a same-named raw column', () => {
    const m = buildVariableModel(indexOf('compute y = 1;'), {
      externalNames: [externalSource(['SysMiss'])],
    });
    expect(m.resolveAnywhere('SysMiss')?.origin).to.equal('predefined');
  });
});

describe('buildVariableModel — macro-produced names (P1.5, opt-in)', () => {
  const macroScript = [
    '#macro #x( &fr )',
    'compute &fr = 2;',
    '#endmacro',
    '#x( alter )',
    'table t = #k by alter;',
  ].join('\n');

  it('is not resolved at all unless opts.macroExpansion is set', () => {
    const m = buildVariableModel(indexOf(macroScript));
    expect(m.resolveAnywhere('alter')).to.be.undefined;
  });

  it('becomes an origin: "macro-produced" symbol once opted in, visible from the call site', () => {
    const m = buildVariableModel(indexOf(macroScript), {
      macroExpansion: true,
    });
    const sym = m.resolveAnywhere('alter');
    expect(sym?.origin).to.equal('macro-produced');
    expect(sym?.definitions).to.have.length(1);
    expect(sym?.definitions[0].text).to.equal('compute alter = 2;');
    expect(sym?.definitions[0].line).to.equal(1);
    // visible on/after the call site (line 3) and everything following.
    expect(m.resolve('alter', p('main.tab'), 4)).to.not.be.undefined;
  });

  it('honours no-forward-reference: not visible before the call site', () => {
    const before = [
      'table early = #k by alter;',
      '#macro #x( &fr )',
      'compute &fr = 2;',
      '#endmacro',
      '#x( alter )',
    ].join('\n');
    const m = buildVariableModel(indexOf(before), { macroExpansion: true });
    expect(m.resolve('alter', p('main.tab'), 0)).to.be.undefined;
  });

  it('a declaration-kind macro body promotes an existing external symbol to "declared"', () => {
    const declScript = [
      '#macro #x( &fr )',
      'singleq &fr = 1 2 3;',
      '#endmacro',
      '#x( alter )',
    ].join('\n');
    const m = buildVariableModel(indexOf(declScript), {
      externalNames: [externalSource(['alter'])],
      macroExpansion: true,
    });
    const sym = m.resolveAnywhere('alter');
    expect(sym?.origin).to.equal('declared');
    expect(sym?.definitions).to.have.length(2);
  });

  it('the same macro called twice with the same name adds a second definitions entry', () => {
    const twice = [
      '#macro #x( &fr )',
      'compute &fr = 2;',
      '#endmacro',
      '#x( alter )',
      '#x( alter )',
    ].join('\n');
    const m = buildVariableModel(indexOf(twice), { macroExpansion: true });
    const sym = m.resolveAnywhere('alter');
    expect(sym?.origin).to.equal('macro-produced');
    expect(sym?.definitions).to.have.length(2);
  });
});

describe('primaryDefinitions', () => {
  it('drops IF-THEN/COMPUTE reassignments — go-to-definition must not offer them (the F12 fix)', () => {
    // regression: F12 on esseWagnerMenge used to also list every later
    // `if (...) then esseWagnerMenge = ...` line as if each were an
    // alternate declaration, even though gessTabs never treats a
    // reassignment as declaring anything (design §3.3).
    const m = modelOf(
      [
        'compute esseWagnerMenge = 0;',
        'if (1 in s10) then esseWagnerMenge = esseWagnerMenge + anzahl;',
        'if (2 in s10) then esseWagnerMenge = esseWagnerMenge + anzahl2;',
      ].join('\n')
    );
    const sym = m.resolveAnywhere('esseWagnerMenge');
    expect(sym?.definitions).to.have.length(3);

    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(1);
    expect(primary[0].line.line).to.equal(0);
    expect(primary[0].statement).to.contain('compute esseWagnerMenge');
  });

  it('returns every real declaration when a name is declared more than once (#ifdef branches)', () => {
    const m = modelOf(
      [
        '#ifdef DE',
        'singleq land = 1 2 3;',
        '#else',
        'singleq land = 4 5 6;',
        '#end',
      ].join('\n')
    );
    const sym = m.resolveAnywhere('land');
    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(2);
    expect(primary.map((d) => d.line.line)).to.deep.equal([1, 3]);
  });

  it('falls back to the earliest entry when no defKind is a declaration', () => {
    // a bare COMPUTE is the sole creator of the name (defKind
    // 'assignment') despite gessTabs auto-creating it on first use.
    const m = modelOf('compute x = 1;\ncompute x = x + 1;');
    const sym = m.resolveAnywhere('x');
    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(1);
    expect(primary[0].line.line).to.equal(0);
  });

  it('keeps both COMPUTEs of a name declared once per #ifdef/#else arm — reported after the F12 fix above', () => {
    // regression: the fix above (fall back to the single earliest entry)
    // over-corrected — a name created by a bare COMPUTE once in each arm
    // of an #ifdef/#else is exactly as legitimate as two SINGLEQ
    // declarations in #ifdef/#else (previous test), just spelled with
    // COMPUTE (defKind 'assignment' either way, §3.3), and Ctrl+T/F12 was
    // silently dropping the #else arm's location.
    const m = modelOf(
      [
        '#ifdef DE',
        'compute land = 1;',
        '#else',
        'compute land = 2;',
        '#end',
      ].join('\n')
    );
    const sym = m.resolveAnywhere('land');
    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(2);
    expect(primary.map((d) => d.line.line)).to.deep.equal([1, 3]);
  });

  it('a second COMPUTE inside the SAME #ifdef arm is still a plain reassignment', () => {
    const m = modelOf(
      ['#ifdef DE', 'compute land = 1;', 'compute land = 2;', '#end'].join('\n')
    );
    const sym = m.resolveAnywhere('land');
    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(1);
    expect(primary[0].line.line).to.equal(1);
  });

  it('an unconditional COMPUTE dominates a later reassignment inside an #ifdef, even under conditionalsAllActive', () => {
    // when the #ifdef arm actually compiles, the unconditional COMPUTE
    // ran first — the conditional one is a real reassignment, not an
    // alternate creator, regardless of whether the branch is "taken".
    const m = modelOf(
      ['compute land = 1;', '#ifdef DE', 'compute land = 2;', '#end'].join('\n')
    );
    const sym = m.resolveAnywhere('land');
    const primary = primaryDefinitions(sym!);
    expect(primary).to.have.length(1);
    expect(primary[0].line.line).to.equal(0);
  });
});

describe('collectVariableOccurrences', () => {
  it('finds every bare occurrence of a name, including twice on one line', () => {
    const occ = collectVariableOccurrences(
      indexOf('singleq f24 = 1;\nif f24 eq 1 then f24 = 2;'),
      'f24'
    );
    expect(occ.map((o) => o.line.line)).to.deep.equal([0, 1, 1]);
  });

  it('excludes the declaration line when excludeDefinitions is set', () => {
    const occ = collectVariableOccurrences(
      indexOf('singleq alter = 1;\ncompute x = alter + 1;'),
      'alter',
      true
    );
    expect(occ.map((o) => o.line.line)).to.deep.equal([1]);
  });

  it('leaves quoted label text that merely reads like a variable name alone', () => {
    const occ = collectVariableOccurrences(
      indexOf('singleq region = 1;\nvaluelabels status = 1 "region";'),
      'region'
    );
    // only the real declaration on line 0 — not the "region" label text
    expect(occ.map((o) => o.line.line)).to.deep.equal([0]);
  });

  it("keeps a quoted token that IS used as a name (the manual's rule)", () => {
    const occ = collectVariableOccurrences(
      indexOf("compute 'frage 1' = 1;\ncompute x = 'frage 1' + 2;"),
      'frage 1'
    );
    expect(occ.map((o) => o.line.line)).to.deep.equal([0, 1]);
  });

  it('skips occurrences inside comments', () => {
    const occ = collectVariableOccurrences(
      indexOf('singleq alter = 1;\n// alter is nice\ncompute x = alter;'),
      'alter'
    );
    expect(occ.map((o) => o.line.line)).to.deep.equal([0, 2]);
  });

  it('model.references() finds a TO-range-synthesised member (no literal token needed)', () => {
    // the classifier now expands a numeric-suffix TO range into real
    // reference spans (item2/item3), anchored at the range phrase's own
    // position — buildVariableModel's references() picks these up via
    // locateInStatement, same as any other span.
    const idx = indexOf('mean m = item1 to item4;');
    const refs = buildVariableModel(idx).references('item3');
    expect(refs.map((r) => r.line.line)).to.deep.equal([0]);
  });

  it('collectVariableOccurrences surfaces a range-synthesised member as a non-literal occurrence (find-references, not rename)', () => {
    // fixed: the range phrase itself ("item1 to item4") is reported as a
    // usage location for item3, but flagged literal: false — there is no
    // "item3" text on this line to safely rename (that would corrupt
    // item1's own name), so a rename provider must filter these out while
    // a references provider can keep them.
    const occ = collectVariableOccurrences(
      indexOf('mean m = item1 to item4;'),
      'item3'
    );
    expect(occ).to.have.length(1);
    expect(occ[0].literal).to.be.false;
    expect(occ[0].line.line).to.equal(0);
  });

  it('a literal occurrence of a plain name is flagged literal: true', () => {
    const occ = collectVariableOccurrences(
      indexOf('singleq alter = 1;\ncompute x = alter;'),
      'alter'
    );
    expect(occ.every((o) => o.literal)).to.be.true;
  });

  it("the non-pattern reference-position TO form resolves to every variable declared between the two endpoints, in program order (§9 Q2 — the user's own reported example)", () => {
    const idx = indexOf(
      [
        'compute esseWagnerMenge = 0;',
        'compute esseOetkerMenge = 0;',
        'compute esseGustavoMenge = 0;',
        'compute esseHandelsmarkeMenge = 0;',
        'vartext esseWagnerMenge to esseHandelsmarkeMenge = "xxx";',
      ].join('\n')
    );
    // the two named endpoints are already literal, always-mode references —
    // this is about the two variables in between, which share no name
    // pattern with the endpoints at all. excludeDefinitions drops each
    // one's own `compute` line, leaving just the vartext range hit.
    ['esseOetkerMenge', 'esseGustavoMenge'].forEach((name) => {
      const refs = collectVariableOccurrences(idx, name, true);
      expect(refs, name).to.have.length(1);
      expect(refs[0].literal, name).to.be.false;
      expect(refs[0].line.line, name).to.equal(4);
    });
    // the endpoints themselves are unaffected — still literal occurrences.
    const wagner = collectVariableOccurrences(idx, 'esseWagnerMenge');
    expect(wagner.some((o) => o.literal && o.line.line === 4)).to.be.true;
  });

  it('a reversed non-pattern range (‹b› declared before ‹a›) is resolved by swapping, not silently dropped (§9 Q2 open sub-question)', () => {
    const idx = indexOf(
      [
        'compute a = 0;',
        'compute b = 0;',
        'compute c = 0;',
        'vartext c to a = "xxx";',
      ].join('\n')
    );
    expect(collectVariableOccurrences(idx, 'b', true)).to.have.length(1);
  });

  it('finds a quoted reference to a raw external column (only resolvable once externalNames is passed)', () => {
    const idx = indexOf('compute y = "alter";');
    const opts = { externalNames: [externalSource(['alter'])] };
    // without externalNames, the model doesn't know "alter" is a real
    // name, so the manual's quoted-token rule correctly leaves it alone.
    expect(collectVariableOccurrences(idx, 'alter')).to.have.length(0);
    const occ = collectVariableOccurrences(idx, 'alter', false, opts);
    expect(occ.some((o) => o.literal && o.line.line === 0)).to.be.true;
  });

  it('includes the CSVINFILE statement itself as a non-literal "declaration" location, excluded like any other when excludeDefinitions is set', () => {
    const idx = indexOf('compute y = "alter";');
    const opts = { externalNames: [externalSource(['alter'])] };
    const withDef = collectVariableOccurrences(idx, 'alter', false, opts);
    const csvLine = withDef.find((o) => o.line.line === 0 && !o.literal);
    expect(csvLine).to.not.be.undefined;
    expect(csvLine?.length).to.equal('csvinfile = data.csv;'.length);

    const withoutDef = collectVariableOccurrences(idx, 'alter', true, opts);
    expect(withoutDef.some((o) => !o.literal)).to.be.false;
  });
});
