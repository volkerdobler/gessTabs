import { expect } from 'chai';
import {
  checkEmptyVarlist,
  findLastDeclaredVariableBefore,
  hasStrictVarlistEnabled,
  checkUnmatchedBlocks,
  checkDuplicateDeclarations,
  checkRecodeBounds,
  checkCardOrdering,
  checkWeightcellsPercentages,
  checkCellsetElements,
  checkInvertoutUpdateinvert,
  checkDefineCaseMismatch,
  checkParenBalance,
  checkNestedBlockComments,
  scanBlockCommentGroups,
  findEnclosingBlockCommentGroup,
  computeDiagnostics,
} from '../src/core/diagnostics';

const alwaysNotInComment = () => true;

describe('checkEmptyVarlist', () => {
  it('flags VARTITLE/VARTEXT/VALUELABELS (and synonyms) with no variable name', () => {
    const lines = [
      'VARTITLE = "ehemals Q17_1";',
      'TITLE = "x";',
      'VARTEXT = "x";',
      'TEXT = "x";',
      'VALUELABELS = 1 "a";',
      'LABELS = 1 "a";',
    ];
    const issues = checkEmptyVarlist(lines, alwaysNotInComment);
    expect(issues).to.have.length(6);
    issues.forEach((issue) => expect(issue.code).to.equal('empty-varlist'));
  });

  it('flags COPYTEXT/COPYTITLE/COPYLABELS with no variable name', () => {
    const lines = [
      'COPYTEXT = source;',
      'COPYTITLE = source;',
      'COPYLABELS = source;',
    ];
    const issues = checkEmptyVarlist(lines, alwaysNotInComment);
    expect(issues).to.have.length(3);
    issues.forEach((issue) => expect(issue.code).to.equal('empty-varlist'));
  });

  it('does not flag a COPY* statement with an explicit varlist', () => {
    const lines = [
      'COPYTEXT f1 f2 = source;',
      'COPYTITLE f1 = source;',
      'COPYLABELS f1 = source;',
    ];
    expect(checkEmptyVarlist(lines, alwaysNotInComment)).to.be.empty;
  });

  it('flags a RECODE with a pure value list and no variable name', () => {
    const issues = checkEmptyVarlist(['RECODE 1 2 3 = 3;'], alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('empty-varlist');
  });

  it('does not flag a statement with an explicit variable name', () => {
    const lines = [
      'VARTITLE x = "title";',
      'RECODE item1 item2 1 = 4;',
      'RECODE item1 TO item8 1 = 4;',
    ];
    expect(checkEmptyVarlist(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag inside a comment', () => {
    expect(checkEmptyVarlist(['VARTITLE = "x";'], () => false)).to.be.empty;
  });
});

describe('findLastDeclaredVariableBefore', () => {
  it('finds the most recently declared variable before the given line', () => {
    const lines = ['variable x = 1;', 'variable y = 2;', 'VARTITLE = "x";'];
    expect(
      findLastDeclaredVariableBefore(lines, 2, alwaysNotInComment)
    ).to.equal('y');
  });

  it('never looks at the diagnostic line itself or later', () => {
    const lines = ['variable x = 1;', 'variable y = 2;'];
    expect(
      findLastDeclaredVariableBefore(lines, 1, alwaysNotInComment)
    ).to.equal('x');
  });

  it('returns undefined when nothing was declared earlier', () => {
    expect(
      findLastDeclaredVariableBefore(['VARTITLE = "x";'], 0, alwaysNotInComment)
    ).to.be.undefined;
  });

  it('ignores a declaration-shaped line inside a comment', () => {
    const lines = ['variable x = 1;', 'variable y = 2;'];
    const isNotInComment = (line: number) => line !== 1;
    expect(findLastDeclaredVariableBefore(lines, 2, isNotInComment)).to.equal(
      'x'
    );
  });

  it('finds COMPUTE without a sub-keyword — the old regex-based version never matched this', () => {
    const lines = ['compute umsatz = preis * menge;', 'VARTITLE = "x";'];
    expect(
      findLastDeclaredVariableBefore(lines, 1, alwaysNotInComment)
    ).to.equal('umsatz');
  });

  it('follows an IF-THEN re-assignment as the current variable too', () => {
    const lines = [
      'singleq x = 1;',
      'if x eq 1 then y = 2;',
      'VARTITLE = "x";',
    ];
    expect(
      findLastDeclaredVariableBefore(lines, 2, alwaysNotInComment)
    ).to.equal('y');
  });
});

describe('hasStrictVarlistEnabled', () => {
  it('finds STRICTVARLIST = YES; anywhere in the document', () => {
    const lines = ['variable x = 1;', 'STRICTVARLIST = YES;', 'VARTITLE = "x";'];
    expect(hasStrictVarlistEnabled(lines, alwaysNotInComment)).to.be.true;
  });

  it('is case-insensitive and tolerant of whitespace', () => {
    expect(
      hasStrictVarlistEnabled(['  strictvarlist  =  yes ;'], alwaysNotInComment)
    ).to.be.true;
  });

  it('does not match STRICTVARLIST = NO;', () => {
    expect(hasStrictVarlistEnabled(['STRICTVARLIST = NO;'], alwaysNotInComment))
      .to.be.false;
  });

  it('ignores a match inside a comment', () => {
    expect(hasStrictVarlistEnabled(['STRICTVARLIST = YES;'], () => false)).to
      .be.false;
  });

  it('returns false when never set', () => {
    expect(hasStrictVarlistEnabled(['variable x = 1;'], alwaysNotInComment)).to
      .be.false;
  });
});

describe('checkUnmatchedBlocks', () => {
  const alwaysCode = () => true;

  it('does not flag a properly matched #MACRO/#ENDMACRO', () => {
    const lines = ['#macro #x( &p )', 'compute &p = 1;', '#endmacro'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('accepts a legally nested #MACRO … #MACRO … #ENDMACRO … #ENDMACRO', () => {
    const lines = [
      '#macro #out( &o1 &o2 )',
      '#macro #in( &i1 )',
      'variable fz&i1 = &i1;',
      '#endmacro',
      '#in( &o1 )',
      '#endmacro',
    ];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('flags an outer #MACRO left unclosed when only the inner one closes', () => {
    const lines = [
      '#macro #out( &o1 )',
      '#macro #in( &i1 )',
      'variable fz&i1 = &i1;',
      '#endmacro',
    ];
    const issues = checkUnmatchedBlocks(lines, alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 0, code: 'unclosed-macro' });
  });

  it('flags an unclosed #MACRO at end of file', () => {
    const lines = ['#macro #x( &p )', 'compute &p = 1;'];
    const issues = checkUnmatchedBlocks(lines, alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 0, code: 'unclosed-macro' });
  });

  it('flags a stray #ENDMACRO with nothing open', () => {
    const issues = checkUnmatchedBlocks(['#endmacro'], alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('unmatched-endmacro');
  });

  it('flags an unclosed conditional block', () => {
    const issues = checkUnmatchedBlocks(['#ifdef FOO', 'x;'], alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 0,
      code: 'unclosed-conditional',
    });
  });

  it('flags a stray #END with nothing open', () => {
    const issues = checkUnmatchedBlocks(['#end'], alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('unmatched-end');
  });

  it('accepts a single-line #ifnempty … #else … #end', () => {
    const lines = ['#ifnempty "&rows" &rows #else 1:99 #end'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('accepts a single-line #ifdef … #end and still flags a real unclosed one', () => {
    expect(checkUnmatchedBlocks(['#ifdef A x; #end'], alwaysCode)).to.be.empty;
    const issues = checkUnmatchedBlocks(
      ['#ifdef A x; #end', '#ifdef B', 'y;'],
      alwaysCode
    );
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'unclosed-conditional',
    });
  });

  it('pairs two closers written on one line', () => {
    const lines = ['#ifdef A', '#ifdef B', 'x;', '#end #end'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('ignores a directive keyword inside a trailing // comment', () => {
    // `#end // #ifdef PowerChart` — the annotation must not re-open a block.
    const lines = [
      '#ifdef PowerChart',
      'x;',
      '#ifnempty "&rows" &rows #else 1:99 #end',
      '#end // #ifdef PowerChart',
    ];
    const notInComment = (line: number, char: number) => {
      const c = lines[line].indexOf('//');
      return c === -1 || char < c;
    };
    expect(checkUnmatchedBlocks(lines, notInComment)).to.be.empty;
  });

  it('ignores a directive-shaped line inside a comment (so it does not open a real block)', () => {
    const isCodeLine = (i: number) => i !== 0;
    const issues = checkUnmatchedBlocks(['{ #ifdef OLD }', '#end'], isCodeLine);
    // The commented-out #ifdef is correctly never treated as opening a
    // block — so the real #end on line 1 has nothing to close, which is
    // itself correctly flagged (proving the comment was actually ignored,
    // not that it silently satisfied the match).
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 1, code: 'unmatched-end' });
  });
});

describe('checkDuplicateDeclarations', () => {
  it('flags a variable declared twice', () => {
    const lines = ['variable x = 1;', 'variable x = 2;'];
    const issues = checkDuplicateDeclarations(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'duplicate-declaration',
    });
  });

  it('does not flag a VARTITLE re-mentioning an existing variable', () => {
    const lines = ['variable x = 1;', 'vartitle x = "Title";'];
    expect(checkDuplicateDeclarations(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag a WEIGHTCELLS re-mentioning an existing variable', () => {
    const lines = [
      'singleq geschl = 1;',
      'weightcells geschl = 1:48% 2:52%;',
      'weightcells autoalign geschl = 1:48% 2:52%;',
    ];
    expect(checkDuplicateDeclarations(lines, alwaysNotInComment)).to.be.empty;
  });

  it('is case-insensitive', () => {
    const lines = ['variable X = 1;', 'variable x = 2;'];
    expect(
      checkDuplicateDeclarations(lines, alwaysNotInComment)
    ).to.have.length(1);
  });

  it('does not flag COMPUTE ADD re-assigning an existing variable — legal, not a duplicate declaration (§9 Q3)', () => {
    const lines = ['compute add x = 1;', 'compute add x = 2;'];
    expect(checkDuplicateDeclarations(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag a plain COMPUTE (no sub-keyword) re-assignment either', () => {
    const lines = ['compute x = 1;', 'compute x = 2;'];
    expect(checkDuplicateDeclarations(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag an IF-THEN re-assignment of an already-declared variable', () => {
    const lines = ['singleq x = 1;', 'if x eq 1 then x = 2;'];
    expect(checkDuplicateDeclarations(lines, alwaysNotInComment)).to.be.empty;
  });

  it('flags a VARFAMILY declared twice — a declaration form the old regex pass never covered', () => {
    const lines = ['varfamily f = a b c;', 'varfamily f = d e;'];
    const issues = checkDuplicateDeclarations(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 1, code: 'duplicate-declaration' });
  });
});

describe('checkRecodeBounds', () => {
  it('flags a structurally inverted range', () => {
    const issues = checkRecodeBounds(['RECODE 88:7 = 4;'], alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('recode-inverted-bounds');
  });

  it('does not flag a normal ascending range', () => {
    expect(checkRecodeBounds(['RECODE 7:88 = 4;'], alwaysNotInComment)).to.be
      .empty;
  });

  it('does not flag intentionally overlapping ranges', () => {
    const lines = [
      'RECODE x y z',
      '1:5 , 7 = 1 /',
      '6 : 10 = 2 /',
      '11 : 15 = 3;',
    ];
    expect(checkRecodeBounds(lines, alwaysNotInComment)).to.be.empty;
  });

  it('checks ranges across a multi-line RECODE statement', () => {
    const lines = ['RECODE x', '9:2 = 1;'];
    const issues = checkRecodeBounds(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].line).to.equal(1);
  });

  it('does not flag a range outside of any RECODE statement', () => {
    expect(checkRecodeBounds(['OVERCODE 3:1 "x";'], alwaysNotInComment)).to.be
      .empty;
  });
});

describe('checkCardOrdering', () => {
  it('flags CARD greater than the current CARDS', () => {
    const issues = checkCardOrdering(
      ['CARDS = 2;', 'CARD = 3;'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('card-exceeds-cards');
  });

  it('does not flag CARD within the current CARDS', () => {
    expect(checkCardOrdering(['CARDS = 2;', 'CARD = 2;'], alwaysNotInComment))
      .to.be.empty;
  });

  it('uses the documented default CARDS = 1 when never set', () => {
    const issues = checkCardOrdering(['CARD = 2;'], alwaysNotInComment);
    expect(issues).to.have.length(1);
  });

  it('does not flag CARDS itself as if it were CARD', () => {
    expect(checkCardOrdering(['CARDS = 5;'], alwaysNotInComment)).to.be.empty;
  });
});

describe('checkWeightcellsPercentages', () => {
  it('flags target percentages that do not sum to 100', () => {
    const issues = checkWeightcellsPercentages(
      ['WEIGHTCELLS geschl = 1:40% 2:40%;'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('weightcells-not-100');
  });

  it('does not flag target percentages that sum to 100', () => {
    expect(
      checkWeightcellsPercentages(
        ['WEIGHTCELLS geschl = 1:50% 2:50%;'],
        alwaysNotInComment
      )
    ).to.be.empty;
  });

  it('excludes the MISSING clause from the sum', () => {
    expect(
      checkWeightcellsPercentages(
        ['WEIGHTCELLS geschl = 1:50% 2:50% MISSING : 9 : 25%;'],
        alwaysNotInComment
      )
    ).to.be.empty;
  });

  it('checks a multi-line WEIGHTCELLS statement', () => {
    const lines = ['WEIGHTCELLS geschl =', '1:30% 2:30%;'];
    const issues = checkWeightcellsPercentages(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].line).to.equal(0);
  });
});

describe('checkCellsetElements', () => {
  it('flags an element not in the CELLSET allow-list', () => {
    const issues = checkCellsetElements(
      ['CELLSET myset( p1 ) = harmonicmean( p1 );'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('cellset-invalid-element');
  });

  it('does not flag allowed elements', () => {
    const lines = ['CELLSET myset( p1 p2 ) = mean( p1 ) sum( p2 );'];
    expect(checkCellsetElements(lines, alwaysNotInComment)).to.be.empty;
  });

  it('checks a multi-line CELLSET statement', () => {
    const lines = ['cellset set2( v1 v2 ) =', 'mean ( v1 )', 'median ( v2 );'];
    expect(checkCellsetElements(lines, alwaysNotInComment)).to.be.empty;
  });
});

describe('checkInvertoutUpdateinvert', () => {
  it('flags UPDATEINVERT combined with INVERTOUT in the same file', () => {
    const lines = ['INVERTOUT = out.dat;', 'UPDATEINVERT;'];
    const issues = checkInvertoutUpdateinvert(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'invertout-updateinvert',
    });
  });

  it('does not flag UPDATEINVERT alone', () => {
    expect(checkInvertoutUpdateinvert(['UPDATEINVERT;'], alwaysNotInComment)).to
      .be.empty;
  });

  it('does not flag INVERTOUT alone', () => {
    expect(
      checkInvertoutUpdateinvert(['INVERTOUT = out.dat;'], alwaysNotInComment)
    ).to.be.empty;
  });
});

describe('checkDefineCaseMismatch', () => {
  it('flags an #ifdef reference that only matches case-insensitively', () => {
    const lines = ['#define xyz', '#ifdef XYZ', 'x;', '#end'];
    const issues = checkDefineCaseMismatch(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'define-case-mismatch',
    });
  });

  it('does not flag an exact-case match', () => {
    const lines = ['#define xyz', '#ifdef xyz', 'x;', '#end'];
    expect(checkDefineCaseMismatch(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag a reference to a name never defined at all', () => {
    const lines = ['#ifdef UNDEFINEDFLAG', 'x;', '#end'];
    expect(checkDefineCaseMismatch(lines, alwaysNotInComment)).to.be.empty;
  });

  it('is suppressed once #IGNORECASE = YES; is set', () => {
    const lines = [
      '#define xyz',
      '#ignorecase = yes;',
      '#ifdef XYZ',
      'x;',
      '#end',
    ];
    expect(checkDefineCaseMismatch(lines, alwaysNotInComment)).to.be.empty;
  });

  it('checks every name in a bracketed OR list', () => {
    const lines = ['#define foo', '#ifdef [ FOO bar ]', 'x;', '#end'];
    const issues = checkDefineCaseMismatch(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].message).to.include('FOO');
  });
});

describe('checkParenBalance', () => {
  it('does not flag balanced, nested parens', () => {
    const lines = ['#x( a( b ) c( d ) );'];
    expect(checkParenBalance(lines, alwaysNotInComment)).to.be.empty;
  });

  it('flags a forgotten closing paren on a macro call', () => {
    const issues = checkParenBalance(['#x( a, b;'], alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 0,
      startChar: 2,
      code: 'unmatched-open-paren',
    });
  });

  it('flags a stray closing paren with nothing open', () => {
    const issues = checkParenBalance(['x = 1 );'], alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('unmatched-close-paren');
  });

  it('balances parens across multiple lines', () => {
    const lines = ['#x( a,', 'b );'];
    expect(checkParenBalance(lines, alwaysNotInComment)).to.be.empty;
  });

  it('ignores parens inside a comment', () => {
    const isCodeChar = (line: number) => line !== 0;
    expect(checkParenBalance(['{ #x( a, b; }', 'x;'], isCodeChar)).to.be.empty;
  });
});

describe('scanBlockCommentGroups / checkNestedBlockComments', () => {
  it('finds a single, un-nested block comment group', () => {
    const lines = ['{ old code }'];
    const groups = scanBlockCommentGroups(lines);
    expect(groups).to.have.length(1);
    expect(groups[0].nestedStarts).to.be.empty;
    expect(checkNestedBlockComments(lines)).to.be.empty;
  });

  it('flags a block comment nested inside another', () => {
    const lines = ['{ outer', 'code { inner comment }', 'more code }'];
    const issues = checkNestedBlockComments(lines);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'nested-block-comment',
    });
    expect(issues[0].message).to.include('line 2');
  });

  it('does not flag independent, sequential block comments', () => {
    const lines = ['{ first }', 'x;', '{ second }'];
    expect(checkNestedBlockComments(lines)).to.be.empty;
  });

  it('ignores a brace-shaped character inside a string before any comment opens', () => {
    const lines = ['VARTITLE x = "a { b";', '{ real comment }'];
    expect(checkNestedBlockComments(lines)).to.be.empty;
  });
});

describe('findEnclosingBlockCommentGroup', () => {
  it('finds the group containing a given position', () => {
    const lines = ['{ outer', 'code { inner }', 'more code }'];
    const group = findEnclosingBlockCommentGroup(lines, 1, 5);
    expect(group).to.not.be.undefined;
    expect(group?.outerStart).to.deep.equal({ line: 0, char: 0 });
    expect(group?.outerEnd).to.deep.equal({ line: 2, char: 10 });
  });

  it('returns undefined outside any group', () => {
    expect(findEnclosingBlockCommentGroup(['x;'], 0, 0)).to.be.undefined;
  });
});

describe('computeDiagnostics', () => {
  it('aggregates issues from every check', () => {
    const lines = ['VARTITLE = "x";', 'variable x = 1;', 'variable x = 2;'];
    const issues = computeDiagnostics(lines, alwaysNotInComment);
    const codes = issues.map((i) => i.code).sort();
    expect(codes).to.deep.equal(['duplicate-declaration', 'empty-varlist']);
  });
});
