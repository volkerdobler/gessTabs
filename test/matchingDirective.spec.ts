import { expect } from 'chai';
import { findMatchingDirectiveLine } from '../src/core/matchingDirective';

describe('findMatchingDirectiveLine', () => {
  const macro = [
    'variable a = 1;',
    '#macro #example( &p )',
    'compute &p = 1;',
    '#endmacro',
    'variable b = 2;',
  ];

  it('jumps from #MACRO down to its #ENDMACRO', () => {
    expect(findMatchingDirectiveLine(macro, 1)).to.equal(3);
  });

  it('jumps from #ENDMACRO up to its #MACRO', () => {
    expect(findMatchingDirectiveLine(macro, 3)).to.equal(1);
  });

  it('returns undefined on a line that is not a delimiter', () => {
    expect(findMatchingDirectiveLine(macro, 2)).to.be.undefined;
    expect(findMatchingDirectiveLine(macro, 0)).to.be.undefined;
  });

  it('pairs the nearest still-open opener for nested blocks', () => {
    const lines = [
      '#macro #outer( &a )',
      '#macro #inner( &b )',
      'compute &b = 1;',
      '#endmacro',
      'compute &a = 2;',
      '#endmacro',
    ];
    expect(findMatchingDirectiveLine(lines, 0)).to.equal(5);
    expect(findMatchingDirectiveLine(lines, 1)).to.equal(3);
    expect(findMatchingDirectiveLine(lines, 3)).to.equal(1);
    expect(findMatchingDirectiveLine(lines, 5)).to.equal(0);
  });

  it('also pairs #IFDEF/#END and runtime IFBLOCK/ENDBLOCK', () => {
    const lines = ['#ifdef FOO', 'ifblock (x = 1)', 'y;', 'endblock', '#end'];
    expect(findMatchingDirectiveLine(lines, 0)).to.equal(4);
    expect(findMatchingDirectiveLine(lines, 4)).to.equal(0);
    expect(findMatchingDirectiveLine(lines, 1)).to.equal(3);
  });

  it('ignores a delimiter keyword sitting in a comment', () => {
    const lines = ['#macro #x( &p )', 'compute &p = 1;', '#endmacro'];
    const withComment = [...lines, '// #endmacro is mentioned here'];
    const notInComment = (line: number, char: number) => {
      const c = withComment[line].indexOf('//');
      return c === -1 || char < c;
    };
    expect(
      findMatchingDirectiveLine(withComment, 3, notInComment)
    ).to.be.undefined;
    expect(findMatchingDirectiveLine(withComment, 0, notInComment)).to.equal(2);
  });
});
