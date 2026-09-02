import { expect } from 'chai';
import { formatLines } from '../src/core/formatter';

const alwaysCode = () => true;

describe('formatLines', () => {
  it('trims trailing whitespace', () => {
    expect(
      formatLines(['variable x = 1;   ', 'compute y = 2;\t'])
    ).to.deep.equal(['variable x = 1;', 'compute y = 2;']);
  });

  it('collapses runs of blank lines down to a single blank line', () => {
    expect(formatLines(['a;', '', '', '', 'b;'])).to.deep.equal([
      'a;',
      '',
      'b;',
    ]);
  });

  it('keeps a single existing blank line as-is', () => {
    expect(formatLines(['a;', '', 'b;'])).to.deep.equal(['a;', '', 'b;']);
  });

  it('indents inside a #MACRO/#ENDMACRO block by one level', () => {
    expect(
      formatLines(['#macro #example( &p )', 'compute &p = 1;', '#endmacro'])
    ).to.deep.equal([
      '#macro #example( &p )',
      '  compute &p = 1;',
      '#endmacro',
    ]);
  });

  it('indents nested #IFDEF blocks by increasing levels', () => {
    expect(
      formatLines([
        '#ifdef FOO',
        '#ifndef BAR',
        'variable x = 1;',
        '#end',
        '#end',
      ])
    ).to.deep.equal([
      '#ifdef FOO',
      '  #ifndef BAR',
      '    variable x = 1;',
      '  #end',
      '#end',
    ]);
  });

  it('dedents #ELSE to the level of its #IFDEF, then re-indents the else branch', () => {
    expect(
      formatLines(['#ifdef FOO', 'a;', '#else', 'b;', '#end'])
    ).to.deep.equal(['#ifdef FOO', '  a;', '#else', '  b;', '#end']);
  });

  it('leaves depth unchanged after a single-line #ifnempty … #else … #end', () => {
    expect(
      formatLines([
        '#macro #m( &rows )',
        'table = a #ifnempty "&rows" &rows #else 1:99 #end;',
        'compute x = 1;',
        '#endmacro',
      ])
    ).to.deep.equal([
      '#macro #m( &rows )',
      '  table = a #ifnempty "&rows" &rows #else 1:99 #end;',
      '  compute x = 1;',
      '#endmacro',
    ]);
  });

  it('does not count a directive keyword inside a trailing // comment', () => {
    const lines = ['#ifdef FOO', 'a;', '#end // #ifdef FOO', 'b;'];
    const notInComment = (line: number, char: number) => {
      const c = lines[line].indexOf('//');
      return c === -1 || char < c;
    };
    expect(formatLines(lines, notInComment)).to.deep.equal([
      '#ifdef FOO',
      '  a;',
      '#end // #ifdef FOO',
      'b;',
    ]);
  });

  it('re-normalizes existing indentation rather than trusting it', () => {
    expect(
      formatLines([
        '#macro #example( &p )',
        '        compute &p = 1;',
        '#endmacro',
      ])
    ).to.deep.equal([
      '#macro #example( &p )',
      '  compute &p = 1;',
      '#endmacro',
    ]);
  });

  it("leaves a comment/string line's own indentation untouched (via isCodeLine), trimming only trailing whitespace", () => {
    const lines = ['   { an old comment }   ', 'variable x = 1;'];
    const isCodeLine = (i: number) => i !== 0;
    expect(formatLines(lines, isCodeLine)).to.deep.equal([
      '   { an old comment }',
      'variable x = 1;',
    ]);
  });

  it('supports a custom indent unit', () => {
    expect(
      formatLines(
        ['#macro #example( &p )', 'compute &p = 1;', '#endmacro'],
        alwaysCode,
        { indentUnit: '\t' }
      )
    ).to.deep.equal([
      '#macro #example( &p )',
      '\tcompute &p = 1;',
      '#endmacro',
    ]);
  });
});
