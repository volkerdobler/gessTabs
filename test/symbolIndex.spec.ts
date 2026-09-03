import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import {
  buildWorkspaceIndex,
  findDefinitionLine,
  findMacroProducedDefinition,
  findAllUsages,
  findWordRangeInLine,
  findAllWordRangesInLine,
} from '../src/core/symbolIndex';

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

describe('findMacroProducedDefinition', () => {
  it('finds a variable defined via a macro-call-substituted &param', () => {
    const files = {
      [p('main.tab')]: [
        '#macro #x( &fr )',
        'compute &fr = 2;',
        '#endmacro',
        '#x( alter )',
        'table t = #k by alter;',
      ].join('\n'),
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    // No literal declaration of "alter" is found the normal way.
    expect(findDefinitionLine(index, p('main.tab'), 4, 'alter')).to.be
      .undefined;

    const macroDef = findMacroProducedDefinition(
      index,
      p('main.tab'),
      4,
      'alter'
    );
    expect(macroDef?.macro.name).to.equal('x');
    expect(macroDef?.bodyLine.text).to.equal('compute alter = 2;');
    expect(macroDef?.bodyLine.line).to.equal(1);
    expect(macroDef?.callSite.text).to.equal('#x( alter )');
    expect(macroDef?.callSite.line).to.equal(3);
  });

  it('does not find a macro call that only occurs later (no forward references)', () => {
    const files = {
      [p('main.tab')]: [
        'table t = #k by alter;',
        '#macro #x( &fr )',
        'compute &fr = 2;',
        '#endmacro',
        '#x( alter )',
      ].join('\n'),
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    expect(findMacroProducedDefinition(index, p('main.tab'), 0, 'alter')).to
      .be.undefined;
  });

  it('returns undefined when no macro call produces the word', () => {
    const files = {
      [p('main.tab')]: [
        '#macro #x( &fr )',
        'compute &fr = 2;',
        '#endmacro',
        '#x( alter )',
      ].join('\n'),
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    expect(findMacroProducedDefinition(index, p('main.tab'), 3, 'somethingelse'))
      .to.be.undefined;
  });

  it('does not report a preceding macro call whose body declares a different name', () => {
    // Regression: a macro call sits before the cursor and its expanded
    // body declares `f39mult`; hovering the unrelated `f23.12.1` must not
    // claim it is "produced by" that macro. (The body line still mentions
    // no `f23.12.1` at all — the old check matched every line regardless.)
    const files = {
      [p('main.tab')]: [
        '#macro #makemulti2( &v )',
        'makefamily &v = 50;',
        '#endmacro',
        '#makemulti2( f39mult )',
        'vartitle "f23.12.1" = "REWE";',
      ].join('\n'),
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    expect(findMacroProducedDefinition(index, p('main.tab'), 4, 'f23.12.1')).to
      .be.undefined;
    // ...but the name it really does produce is still found.
    expect(
      findMacroProducedDefinition(index, p('main.tab'), 4, 'f39mult')?.bodyLine
        .text
    ).to.equal('makefamily f39mult = 50;');
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

  it('finds a bare reference in an IF condition / THEN assignment', () => {
    const files = {
      [p('main.tab')]: [
        'variable f24 = 1;',
        'if (not ([1:2] in f24)) then f24 = 2;',
        '// f24 mentioned only in a comment here',
      ].join('\n'),
    };
    const index = buildWorkspaceIndex([p('main.tab')], makeReader(files));
    const texts = findAllUsages(index, 'f24').map((u) => u.text);
    expect(texts).to.include('variable f24 = 1;');
    expect(texts).to.include('if (not ([1:2] in f24)) then f24 = 2;');
    expect(texts).to.not.include('// f24 mentioned only in a comment here');
  });
});

describe('findAllWordRangesInLine', () => {
  it('returns every occurrence of the word on the line', () => {
    expect(
      findAllWordRangesInLine('if (not ([1:2] in f24)) then f24 = 2;', 'f24')
    ).to.deep.equal([
      [18, 21],
      [29, 32],
    ]);
  });

  it('ignores longer identifiers and `.`-qualified members', () => {
    expect(
      findAllWordRangesInLine('f24 f240 region.f24 xf24 f24;', 'f24')
    ).to.deep.equal([
      [0, 3],
      [25, 28],
    ]);
  });

  it('is case-insensitive and returns [] when absent', () => {
    expect(findAllWordRangesInLine('IN F24 THEN', 'f24')).to.deep.equal([
      [3, 6],
    ]);
    expect(findAllWordRangesInLine('nothing here', 'f24')).to.deep.equal([]);
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
