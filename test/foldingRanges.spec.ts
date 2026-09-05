import { expect } from 'chai';
import { findFoldRanges } from '../src/core/foldingRanges';

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

  it('produces no fold range for a single-line #ifnempty … #else … #end', () => {
    const lines = ['a;', '#ifnempty "&rows" &rows #else 1:99 #end', 'b;'];
    expect(findFoldRanges(lines)).to.be.empty;
  });

  it('ignores a directive keyword inside a trailing // comment', () => {
    const lines = ['#ifdef FOO', 'x;', '#end // #ifdef FOO', 'y;'];
    const notInComment = (line: number, char: number) => {
      const c = lines[line].indexOf('//');
      return c === -1 || char < c;
    };
    expect(findFoldRanges(lines, notInComment)).to.deep.equal([
      { startLine: 0, endLine: 2, kind: 'conditional' },
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

  it('folds a legally nested #MACRO inside a #MACRO independently', () => {
    const lines = [
      '#macro #out( &o1 &o2 )',
      '#macro #in( &i1 )',
      'variable fz&i1 = &i1;',
      '#endmacro',
      '#in( &o1 )',
      '#endmacro',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 1, endLine: 3, kind: 'macro' },
      { startLine: 0, endLine: 5, kind: 'macro' },
    ]);
  });

  it('does not fold an unclosed #MACRO or #IFDEF block', () => {
    expect(findFoldRanges(['#macro #example( &p )', 'compute &p = 1;'])).to.be
      .empty;
    expect(findFoldRanges(['#ifdef FOO', 'variable x = 1;'])).to.be.empty;
  });

  it('ignores a directive-shaped line inside a comment via isCodeLine', () => {
    const lines = ['{ #macro #old( &p ) }', '#macro #real( &p )', '#endmacro'];
    const isCodeLine = (i: number) => i !== 0;
    expect(findFoldRanges(lines, isCodeLine)).to.deep.equal([
      { startLine: 1, endLine: 2, kind: 'macro' },
    ]);
  });

  it('folds a #STARTEXPORT/#ENDEXPORT block', () => {
    const lines = ['#startexport', 'x;', '#endexport'];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 2, kind: 'export' },
    ]);
  });

  it('folds an IFBLOCK…ENDBLOCK and nested WHILEBLOCK independently', () => {
    const lines = [
      'ifblock x eq 1 then',
      'whileblock y eq 1 do',
      'compute y = 0;',
      'endblock',
      'endblock',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 1, endLine: 3, kind: 'block' },
      { startLine: 0, endLine: 4, kind: 'block' },
    ]);
  });

  it('does not fold an unclosed IFBLOCK, and ELSEBLOCK never opens its own fold', () => {
    expect(findFoldRanges(['ifblock x eq 1 then', 'compute y = 1;'])).to.be
      .empty;
    const lines = [
      'ifblock x eq 1 then',
      'compute y = 1;',
      'elseblock',
      'compute y = 2;',
      'endblock',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 4, kind: 'block' },
    ]);
  });

  it('folds an unnamed SETFILTER…ENDFILTER', () => {
    const lines = ['setfilter = x eq 1;', 'endfilter;'];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 1, kind: 'filter' },
    ]);
  });

  it('a named ENDFILTER folds every SETFILTER it closes, not just the innermost', () => {
    const lines = [
      'setfilter a = x eq 1;',
      'setfilter b = y eq 1;',
      'setfilter c = z eq 1;',
      'endfilter a;',
    ];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 3, kind: 'filter' },
      { startLine: 1, endLine: 3, kind: 'filter' },
      { startLine: 2, endLine: 3, kind: 'filter' },
    ]);
  });

  it('does not mistake SETFILTER TEXT "…" for a named filter called TEXT', () => {
    const lines = ['setfilter text "Mein Filter" = x eq 1;', 'endfilter;'];
    expect(findFoldRanges(lines)).to.deep.equal([
      { startLine: 0, endLine: 1, kind: 'filter' },
    ]);
  });
});
