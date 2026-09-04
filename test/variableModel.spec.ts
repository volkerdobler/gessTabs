import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { buildWorkspaceIndex } from '../src/core/symbolIndex';
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
        '#endif',
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
});
