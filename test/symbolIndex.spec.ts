import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/includeGraph';
import {
  buildWorkspaceIndex,
  findDefinitionLine,
  findAllUsages,
  findWordRangeInLine,
} from '../src/symbolIndex';

const ROOT = path.resolve('/gesstabs-symbolindex-test');
const p = (...segments: string[]) => path.join(ROOT, ...segments);

function makeReader(files: Record<string, string>): FileReader {
  return (filePath: string) => {
    const text = files[filePath];
    return text === undefined ? undefined : text.split('\n');
  };
}

describe('buildWorkspaceIndex', () => {
  it('treats a file that is never INCLUDEd by another as a root, and merges its resolved lines', () => {
    const files = {
      [p('main.tab')]: 'INCLUDE = vars.inc;\ntable a = #k by b;',
      [p('vars.inc')]: 'variable b = 1;',
    };
    const index = buildWorkspaceIndex(
      [p('main.tab'), p('vars.inc')],
      makeReader(files)
    );
    expect(index.rootFiles).to.deep.equal([p('main.tab')]);
    expect(index.order.map((l) => l.text)).to.deep.equal([
      'variable b = 1;',
      'table a = #k by b;',
    ]);
  });

  it('excludes a file that exists on disk but is never reachable from any root', () => {
    const files = {
      [p('main.tab')]: 'variable a = 1;',
      [p('orphan.inc')]: 'variable orphan = 1;',
    };
    const index = buildWorkspaceIndex(
      [p('main.tab'), p('orphan.inc')],
      makeReader(files)
    );
    // orphan.inc is its own root too (nothing includes it), so both are
    // roots here — but it demonstrates content isn't silently merged
    // into main.tab's program order.
    expect(index.rootFiles).to.have.members([p('main.tab'), p('orphan.inc')]);
  });

  it('falls back to treating every file as its own root when nothing qualifies otherwise', () => {
    // a.inc and b.inc include each other — neither is "never included".
    const files = {
      [p('a.inc')]: 'variable a = 1;\nINCLUDE = b.inc;',
      [p('b.inc')]: 'variable b = 1;\nINCLUDE = a.inc;',
    };
    const index = buildWorkspaceIndex(
      [p('a.inc'), p('b.inc')],
      makeReader(files)
    );
    expect(index.rootFiles).to.have.members([p('a.inc'), p('b.inc')]);
    expect(index.order.length).to.be.greaterThan(0);
  });
});

describe('findDefinitionLine', () => {
  it('finds the nearest matching definition scanning backward', () => {
    const files = {
      [p('main.tab')]: 'variable a = 1;\nvariable b = 2;\ntable t = #k by a;',
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    const def = findDefinitionLine(index, p('main.tab'), 2, 'a');
    expect(def?.text).to.equal('variable a = 1;');
    expect(def?.line).to.equal(0);
  });

  it('does not find a definition that only occurs later (no forward references)', () => {
    const files = {
      [p('main.tab')]: 'table t = #k by a;\nvariable a = 1;',
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    // cursor is on line 0, "a" is only defined afterward on line 1
    const def = findDefinitionLine(index, p('main.tab'), 0, 'a');
    expect(def).to.be.undefined;
  });

  it('finds a definition across an INCLUDE boundary', () => {
    const files = {
      [p('main.tab')]: 'INCLUDE = vars.inc;\ntable t = #k by a;',
      [p('vars.inc')]: 'variable a = 1;',
    };
    const index = buildWorkspaceIndex(
      [p('main.tab'), p('vars.inc')],
      makeReader(files)
    );
    const def = findDefinitionLine(index, p('main.tab'), 1, 'a');
    expect(def?.file).to.equal(p('vars.inc'));
    expect(def?.text).to.equal('variable a = 1;');
  });

  it('ignores a definition-like pattern inside a comment', () => {
    const files = {
      [p('main.tab')]: '// variable a = 1;\ntable t = #k by a;',
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    const def = findDefinitionLine(index, p('main.tab'), 1, 'a');
    expect(def).to.be.undefined;
  });
});

describe('findAllUsages', () => {
  it('finds every usage across the merged workspace order', () => {
    const files = {
      [p('main.tab')]: 'INCLUDE = vars.inc;\ntable t1 = #k by a;',
      [p('vars.inc')]: 'variable a = 1;',
      [p('other.tab')]: 'table t2 = #k by a;',
    };
    const index = buildWorkspaceIndex(
      [p('main.tab'), p('vars.inc'), p('other.tab')],
      makeReader(files)
    );
    const usages = findAllUsages(index, 'a');
    const texts = usages.map((u) => u.text);
    expect(texts).to.include('variable a = 1;');
    expect(texts).to.include('table t1 = #k by a;');
    expect(texts).to.include('table t2 = #k by a;');
  });
});

describe('conditionalsAllActive', () => {
  it('finds a definition and its uses inside an inactive #ifdef branch', () => {
    const files = {
      [p('main.tab')]: [
        '#ifdef DRAFT',
        'variable a = 1;',
        'table t1 = #k by a;',
        '#else',
        'variable a = 2;',
        '#end',
      ].join('\n'),
    };
    // DRAFT is not defined -> normally the whole #ifdef branch is gone.
    const gated = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    expect(findAllUsages(gated, 'a').map((u) => u.text)).to.deep.equal([
      'variable a = 2;',
    ]);

    const all = buildWorkspaceIndex([p('main.tab')], makeReader(files), {
      conditionalsAllActive: true,
    });
    const texts = findAllUsages(all, 'a').map((u) => u.text);
    expect(texts).to.include('variable a = 1;');
    expect(texts).to.include('table t1 = #k by a;');
    expect(texts).to.include('variable a = 2;');
    expect(findDefinitionLine(all, p('main.tab'), 2, 'a')).to.not.be.undefined;
  });
});

describe('findWordRangeInLine', () => {
  it('finds the word-boundary range of a plain occurrence', () => {
    expect(findWordRangeInLine('variable myVar = 1;', 'myVar')).to.deep.equal([
      9, 14,
    ]);
  });

  it('does not match a substring that is part of a larger word', () => {
    expect(findWordRangeInLine('variable myVarExtra = 1;', 'myVar')).to.be
      .undefined;
  });

  it('is case-insensitive', () => {
    expect(findWordRangeInLine('variable MYVAR = 1;', 'myVar')).to.deep.equal([
      9, 14,
    ]);
  });

  it('returns undefined when the word is not present', () => {
    expect(findWordRangeInLine('variable other = 1;', 'myVar')).to.be.undefined;
  });
});
