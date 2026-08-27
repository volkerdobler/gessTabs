import { expect } from 'chai';
import { findFoldRanges } from '../src/foldingRanges';

describe('findFoldRanges', () => {
  it('folds a #MACRO/#ENDMACRO block', () => {
    const lines = [
      '#macro #example( &parameter )',
      'compute  &parameter = 1;',
      '#endmacro',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 2, kind: 'macro' },
    ]);
  });

  it('folds #MACROEND as an alternate closer', () => {
    const lines = ['#macro #example( &p )', 'compute &p = 1;', '#macroend'];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 2, kind: 'macro' },
    ]);
  });

  it('folds an #IFDEF/#END block', () => {
    const lines = ['#ifdef FOO', 'variable x = 1;', '#end'];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 2, kind: 'conditional' },
    ]);
  });

  it('folds nested conditional blocks independently', () => {
    const lines = [
      '#ifdef FOO',
      '#ifndef BAR',
      'variable x = 1;',
      '#end',
      '#end',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 1, endLine: 3, kind: 'conditional' },
      { startLine: 0, endLine: 4, kind: 'conditional' },
    ]);
  });

  it('recognizes every #IFDEF-family opener', () => {
    [
      '#ifdef X',
      '#ifndef X',
      '#ifempty X',
      '#ifnempty X',
      '#ifexist X',
      '#ifnexist X',
      '#ifnexists X',
    ].forEach((opener) => {
      const ranges = findFoldRanges([opener, 'x;', '#end']);
      expect(ranges, opener).to.deep.equal([
        { startLine: 0, endLine: 2, kind: 'conditional' },
      ]);
    });
  });

  it('does not fold an unclosed #MACRO or #IFDEF block', () => {
    expect(findFoldRanges(['#macro #example( &p )', 'compute &p = 1;'])).to
      .be.empty;
    expect(findFoldRanges(['#ifdef FOO', 'variable x = 1;'])).to.be.empty;
  });

  it('ignores a directive-shaped line inside a comment via isCodeLine', () => {
    const lines = ['{ #macro #old( &p ) }', '#macro #real( &p )', '#endmacro'];
    const isCodeLine = (i: number) => i !== 0;
    expect(findFoldRanges(lines, isCodeLine)).to.deep.equal([
      { startLine: 1, endLine: 2, kind: 'macro' },
    ]);
  });
});
