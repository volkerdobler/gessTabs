import { expect } from 'chai';
import { scanBlockDirectives } from '../src/core/directives';

const kinds = (line: string) => scanBlockDirectives(line).map((d) => d.kind);

describe('scanBlockDirectives', () => {
  it('recognizes each block directive on its own line', () => {
    expect(kinds('#ifdef FOO')).to.deep.equal(['conditional-start']);
    expect(kinds('#ifndef BAR')).to.deep.equal(['conditional-start']);
    expect(kinds('#ifnempty "&x"')).to.deep.equal(['conditional-start']);
    expect(kinds('#ifexist x')).to.deep.equal(['conditional-start']);
    expect(kinds('#ifnexists x')).to.deep.equal(['conditional-start']);
    expect(kinds('#else')).to.deep.equal(['conditional-else']);
    expect(kinds('#end')).to.deep.equal(['conditional-end']);
    expect(kinds('#macro #m( &p )')).to.deep.equal(['macro-start']);
    expect(kinds('#endmacro')).to.deep.equal(['macro-end']);
    expect(kinds('#macroend')).to.deep.equal(['macro-end']);
  });

  it('does not confuse #endmacro/#macroend with #macro or #end', () => {
    expect(scanBlockDirectives('#macroend')[0].kind).to.equal('macro-end');
    expect(scanBlockDirectives('#endmacro')[0].kind).to.equal('macro-end');
  });

  it('finds every directive on a single line, in source order', () => {
    expect(kinds('#ifnempty "&rows" &rows #else 1:99 #end')).to.deep.equal([
      'conditional-start',
      'conditional-else',
      'conditional-end',
    ]);
  });

  it('reports the column of each directive', () => {
    const ds = scanBlockDirectives('  #ifdef A #end');
    expect(ds.map((d) => d.index)).to.deep.equal([2, 11]);
  });

  it('is case-insensitive and preserves the written token', () => {
    const ds = scanBlockDirectives('#IfNempty x #END');
    expect(ds.map((d) => d.text)).to.deep.equal(['#IfNempty', '#END']);
  });

  it('ignores non-block directives and bare words', () => {
    expect(kinds('#define FOO 1')).to.be.empty;
    expect(kinds('#expand #x 1:99')).to.be.empty;
    expect(kinds('compute x = 1; // mentions #end informally')).to.deep.equal([
      'conditional-end',
    ]);
  });

  it('does not treat a bare #macro (no name/paren) as a start', () => {
    expect(kinds('#macro')).to.be.empty;
    expect(kinds('#macro alone')).to.be.empty;
  });

  it('pairs two closers on one line', () => {
    expect(kinds('#end #end')).to.deep.equal([
      'conditional-end',
      'conditional-end',
    ]);
  });

  it('drops a directive token that isCodeAt rejects (e.g. a trailing comment)', () => {
    const line = '#end // #ifdef PowerChart';
    const commentAt = line.indexOf('//');
    const ds = scanBlockDirectives(line, (col) => col < commentAt);
    expect(ds.map((d) => d.kind)).to.deep.equal(['conditional-end']);
  });

  it('keeps every directive when isCodeAt is not given', () => {
    expect(kinds('#end // #ifdef PowerChart')).to.deep.equal([
      'conditional-end',
      'conditional-start',
    ]);
  });
});
