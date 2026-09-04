import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { buildWorkspaceIndex } from '../src/core/symbolIndex';
import { buildVariableModel } from '../src/core/variableModel';

const ROOT = path.resolve('/gesstabs-varmodel-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

const modelOf = (main: string, files: Record<string, string> = {}) => {
  const all = { [p('main.tab')]: main, ...files };
  const reader: FileReader = (fp) =>
    all[fp] === undefined ? undefined : all[fp].split('\n');
  const index = buildWorkspaceIndex(Object.keys(all), reader, {
    conditionalsAllActive: true,
  });
  return buildVariableModel(index);
};

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

  it('a re-definition adds a definition line, not a duplicate symbol', () => {
    const m = modelOf('compute x = 1;\ncompute x = 2;');
    const all = m.all().filter((s) => s.name === 'x');
    expect(all).to.have.length(1);
    expect(all[0].definitions).to.have.length(2);
  });
});
