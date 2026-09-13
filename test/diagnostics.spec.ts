import { expect } from 'chai';
import { Scope } from '../src/core/scope';
import {
  checkEmptyVarlist,
  findLastDeclaredVariableBefore,
  hasStrictVarlistEnabled,
  checkUnmatchedBlocks,
  checkRecodeBounds,
  checkCardOrdering,
  checkWeightcellsPercentages,
  checkCellsetElements,
  checkInvertoutUpdateinvert,
  checkDeprecatedKeywords,
  checkDefineCaseMismatch,
  checkParenBalance,
  checkNestedBlockComments,
  scanBlockCommentGroups,
  findEnclosingBlockCommentGroup,
  checkMalformedStatements,
  checkCellElementIncompatibilities,
  checkCalculateColumnSingleCellElement,
  checkValuelabelsAddSingleVar,
  checkOvercodeRangeSpan,
  computeDiagnostics,
} from '../src/core/diagnostics';

const alwaysNotInComment = () => true;

// A real Scope over `text`, for tests that need the actual string/comment
// distinction (checkParenBalance's isNormalScope) rather than the
// always-true stand-in above.
function scopeOf(text: string): Scope {
  const lines = text.split('\n');
  const doc = {
    lineCount: lines.length,
    lineAt: (n: number) => ({ text: lines[n] }),
  };
  return new Scope(doc as any);
}

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
    const lines = [
      'variable x = 1;',
      'STRICTVARLIST = YES;',
      'VARTITLE = "x";',
    ];
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
    expect(hasStrictVarlistEnabled(['STRICTVARLIST = YES;'], () => false)).to.be
      .false;
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

  it('does not flag a properly matched #STARTEXPORT/#ENDEXPORT', () => {
    const lines = ['#startexport', 'x;', '#endexport'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('flags an unclosed #STARTEXPORT and a stray #ENDEXPORT', () => {
    const unclosed = checkUnmatchedBlocks(['#startexport', 'x;'], alwaysCode);
    expect(unclosed).to.have.length(1);
    expect(unclosed[0]).to.deep.include({ line: 0, code: 'unclosed-export' });

    const stray = checkUnmatchedBlocks(['#endexport'], alwaysCode);
    expect(stray).to.have.length(1);
    expect(stray[0].code).to.equal('unmatched-endexport');
  });

  it('accepts a properly matched IFBLOCK … ELSEBLOCK … ENDBLOCK', () => {
    const lines = [
      'ifblock x eq 1 then',
      'compute y = 1;',
      'elseblock',
      'compute y = 2;',
      'endblock',
    ];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('accepts nested IFBLOCK/WHILEBLOCK', () => {
    const lines = [
      'ifblock x eq 1 then',
      'whileblock y eq 1 do',
      'compute y = 0;',
      'endblock',
      'endblock',
    ];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('flags an unclosed IFBLOCK and a stray ENDBLOCK', () => {
    const unclosed = checkUnmatchedBlocks(
      ['ifblock x eq 1 then', 'compute y = 1;'],
      alwaysCode
    );
    expect(unclosed).to.have.length(1);
    expect(unclosed[0]).to.deep.include({ line: 0, code: 'unclosed-ifblock' });

    const stray = checkUnmatchedBlocks(['endblock;'], alwaysCode);
    expect(stray).to.have.length(1);
    expect(stray[0].code).to.equal('unmatched-endblock');
  });

  it('flags a stray ELSEBLOCK with nothing open', () => {
    const issues = checkUnmatchedBlocks(['elseblock'], alwaysCode);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('unmatched-elseblock');
  });

  it('accepts an unnamed SETFILTER … ENDFILTER', () => {
    const lines = ['setfilter = x eq 1;', 'endfilter;'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('accepts a named SETFILTER … ENDFILTER', () => {
    const lines = ['setfilter myfilter = x eq 1;', 'endfilter myfilter;'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('does not mistake SETFILTER TEXT "…" for a named filter called TEXT', () => {
    const lines = ['setfilter text "Mein Filter" = x eq 1;', 'endfilter;'];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('a named ENDFILTER closes every SETFILTER down to the named one', () => {
    const lines = [
      'setfilter a = x eq 1;',
      'setfilter b = y eq 1;',
      'setfilter c = z eq 1;',
      'endfilter a;',
    ];
    expect(checkUnmatchedBlocks(lines, alwaysCode)).to.be.empty;
  });

  it('errors when a named ENDFILTER matches nothing on the stack', () => {
    const issues = checkUnmatchedBlocks(
      ['setfilter a = x eq 1;', 'endfilter nosuchname;'],
      alwaysCode
    );
    expect(issues).to.have.length(2);
    expect(issues[0].code).to.equal('unmatched-endfilter');
    expect(issues[1].code).to.equal('unclosed-setfilter');
  });

  it('flags an unclosed SETFILTER and a stray ENDFILTER', () => {
    const unclosed = checkUnmatchedBlocks(
      ['setfilter a = x eq 1;'],
      alwaysCode
    );
    expect(unclosed).to.have.length(1);
    expect(unclosed[0]).to.deep.include({
      line: 0,
      code: 'unclosed-setfilter',
    });

    const stray = checkUnmatchedBlocks(['endfilter;'], alwaysCode);
    expect(stray).to.have.length(1);
    expect(stray[0].code).to.equal('unmatched-endfilter');
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

describe('checkDeprecatedKeywords', () => {
  it('flags a bare USEFILTER statement', () => {
    const issues = checkDeprecatedKeywords(
      ['USEFILTER f1;'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 0,
      severity: 'warning',
      code: 'deprecated-keyword',
    });
    expect(issues[0].message).to.include('USEFILTER');
  });

  it('flags a bare MAKEFILTER statement', () => {
    const issues = checkDeprecatedKeywords(
      ['MAKEFILTER f1 = x eq 1;'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].message).to.include('MAKEFILTER');
  });

  it('is case-insensitive', () => {
    expect(
      checkDeprecatedKeywords(['usefilter f1;'], alwaysNotInComment)
    ).to.have.length(1);
  });

  it('ignores a commented-out occurrence', () => {
    expect(checkDeprecatedKeywords(['USEFILTER f1;'], () => false)).to.be.empty;
  });

  it('does not flag SETFILTER (the current, still-supported mechanism)', () => {
    expect(checkDeprecatedKeywords(['SETFILTER = x eq 1;'], alwaysNotInComment))
      .to.be.empty;
  });

  // Every one of these was on the original, broader "deprecated keyword"
  // candidate list, but the manual (Anhang > Historisches > Abgelöste
  // Befehle) explicitly still supports all of them — flagging any would
  // misinform users, which is exactly why this check stays scoped to just
  // USEFILTER/MAKEFILTER.
  [
    'AUTOCLEAR = YES;',
    'AUTOOVERSORT = YES;',
    'LOWERCASE = YES;',
    'MARKCELLS = YES;',
    'NOMINATIONS = YES;',
    'OUTFILE = out.dat;',
    'TABLETYPE = 1;',
    'YSIGNIFINFRONT = YES;',
  ].forEach((line) => {
    it(`does not flag still-supported "${line.split(/[\s=]/)[0]}"`, () => {
      expect(checkDeprecatedKeywords([line], alwaysNotInComment)).to.be.empty;
    });
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

  describe('workspaceDefines (cross-INCLUDE half)', () => {
    it('does not flag a name only #define-d in an INCLUDEd/INCLUDEing file when its exact case is passed in', () => {
      // "xyz" is never #define-d in *this* document's own lines — only
      // workspaceDefines (standing in for collectAllDefineNames' whole-graph
      // scan) knows about it, with the same case as the #ifdef reference.
      const lines = ['#ifdef xyz', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(
        lines,
        alwaysNotInComment,
        new Set(['xyz'])
      );
      expect(issues).to.be.empty;
    });

    it("flags a name that only matches an INCLUDEd file's #define case-insensitively", () => {
      const lines = ['#ifdef XYZ', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(
        lines,
        alwaysNotInComment,
        new Set(['xyz'])
      );
      expect(issues).to.have.length(1);
      expect(issues[0]).to.deep.include({
        line: 0,
        code: 'define-case-mismatch',
      });
      expect(issues[0].message).to.include('XYZ');
    });

    it('still flags a name absent from both the document and workspaceDefines entirely — passing workspaceDefines does not suppress a genuine unknown', () => {
      const lines = ['#define abc', '#ifdef XYZ', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(
        lines,
        alwaysNotInComment,
        new Set(['abc'])
      );
      // "XYZ" doesn't case-insensitively match anything in either set, so
      // this is the "intentionally undefined flag" case, not a mismatch.
      expect(issues).to.be.empty;
    });

    it('an exact in-document match still wins even when workspaceDefines is also passed', () => {
      const lines = ['#define xyz', '#ifdef xyz', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(
        lines,
        alwaysNotInComment,
        new Set(['somethingElse'])
      );
      expect(issues).to.be.empty;
    });

    it('#IGNORECASE = YES; still suppresses the check even with workspaceDefines passed', () => {
      const lines = ['#ignorecase = yes;', '#ifdef XYZ', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(
        lines,
        alwaysNotInComment,
        new Set(['xyz'])
      );
      expect(issues).to.be.empty;
    });

    it('omitting workspaceDefines keeps the exact prior document-only behavior', () => {
      // Same shape as the very first test in this describe block, just
      // spelled out again here to pin down that the new parameter is
      // opt-in and changes nothing when absent.
      const lines = ['#define xyz', '#ifdef XYZ', 'x;', '#end'];
      const issues = checkDefineCaseMismatch(lines, alwaysNotInComment);
      expect(issues).to.have.length(1);
    });
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

  // Reported 2026-09-05: a "(" inside a string was counted as real code,
  // so a script with an unbalanced paren *inside a quoted title/argument*
  // (which never has to balance with anything) was wrongly flagged as
  // broken. checkParenBalance is given isNormalScope (code only, strings
  // excluded) instead of isNotInComment (which includes string content)
  // specifically to fix this — these tests use a real Scope, not the
  // always-true stand-in above, since the bug is entirely about the
  // string/comment distinction the stand-in can't exercise.
  it('does not flag a "(" inside a single-quoted #MACRO argument string (the reported POWERCHARTOPTION example)', () => {
    const line =
      '#barchart(10 01 "&sp1" "&zeilen" \'POWERCHARTOPTION "SeriesColorMarkstring=*(net*;$778a26"\' 01 "valuelabels x position &sp1")';
    const scope = scopeOf(line);
    expect(checkParenBalance([line], (l, c) => scope.isNormalScope(l, c))).to.be
      .empty;
  });

  it('does not flag a "(" inside a double-quoted VALUELABELS text (the reported example)', () => {
    const lines = ['valuelabels "s3" =', '1 "Dies ist ( ein Text"', ';'];
    const scope = scopeOf(lines.join('\n'));
    expect(checkParenBalance(lines, (l, c) => scope.isNormalScope(l, c))).to.be
      .empty;
  });

  it('still flags a real unmatched "(" that sits outside any string', () => {
    const line = '#x( "a" ;';
    const scope = scopeOf(line);
    const issues = checkParenBalance([line], (l, c) =>
      scope.isNormalScope(l, c)
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('unmatched-open-paren');
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

describe('checkMalformedStatements', () => {
  it('flags GROUPS missing its "=" and body entirely (the reported example)', () => {
    const lines = ['groups sysmiss;'];
    const issues = checkMalformedStatements(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 0,
      startChar: 0,
      length: 'groups'.length,
      severity: 'error',
      code: 'malformed-statement',
    });
    expect(issues[0].message).to.include('groups: no =');
  });

  it('flags a VARFAMILY with no target name', () => {
    const lines = ['varfamily = a b c;'];
    const issues = checkMalformedStatements(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].message).to.include('varfamily: no target name');
  });

  it('does not flag a well-formed statement', () => {
    const lines = ['groups g = | "x" : v eq 1;'];
    expect(checkMalformedStatements(lines, alwaysNotInComment)).to.be.empty;
  });

  it('does not flag an unrecognized keyword — classifyStatement never sets malformed for kind "other"', () => {
    const lines = ['foobar xyz;'];
    expect(checkMalformedStatements(lines, alwaysNotInComment)).to.be.empty;
  });
});

describe('checkCellElementIncompatibilities', () => {
  it('does not flag HARMONICMEAN/GEOMETRICMEAN alone', () => {
    const lines = ['CELLELEMENTS = HARMONICMEAN;'];
    expect(checkCellElementIncompatibilities(lines, alwaysNotInComment)).to.be
      .empty;
  });

  it('flags HARMONICMEAN combined with another cell content (standalone assignment)', () => {
    const lines = ['CELLELEMENTS = HARMONICMEAN ABSOLUTE;'];
    const issues = checkCellElementIncompatibilities(
      lines,
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('cellelement-incompatible-harmonicgeometric');
  });

  it('flags GEOMETRICMEAN combined with another cell content (inline taboption)', () => {
    const lines = ['table cellelements( geometricmean absolute ) = a by b;'];
    const issues = checkCellElementIncompatibilities(
      lines,
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('cellelement-incompatible-harmonicgeometric');
  });

  it('does not flag MEDIAN alone or combined with frequencies/percentiles', () => {
    expect(
      checkCellElementIncompatibilities(
        ['CELLELEMENTS = MEDIAN;'],
        alwaysNotInComment
      )
    ).to.be.empty;
    expect(
      checkCellElementIncompatibilities(
        ['CELLELEMENTS = MEDIAN ABSOLUTE PCNTL1;'],
        alwaysNotInComment
      )
    ).to.be.empty;
  });

  it('flags MEDIAN combined with a mean/sum/dispersion measure', () => {
    const issues = checkCellElementIncompatibilities(
      ['CELLELEMENTS = MEDIAN MEAN;'],
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('cellelement-incompatible-median');
    expect(issues[0].message).to.include('MEAN');
  });

  it('does not flag an ordinary combination unrelated to either rule', () => {
    const lines = ['CELLELEMENTS = ABSOLUTE COLUMNPERCENT;'];
    expect(checkCellElementIncompatibilities(lines, alwaysNotInComment)).to.be
      .empty;
  });
});

describe('checkCalculateColumnSingleCellElement', () => {
  it('does not flag a preceding table with exactly one elementary inline CELLELEMENTS', () => {
    const lines = [
      'table cellelements( absolute ) = a by b;',
      'calculatecolumn <2 3> = <1 2> - <1 1>;',
    ];
    expect(
      checkCalculateColumnSingleCellElement(lines, alwaysNotInComment)
    ).to.be.empty;
  });

  it('flags a preceding table whose inline CELLELEMENTS has more than one elementary element', () => {
    const lines = [
      'table cellelements( absolute columnpercent ) = a by b;',
      'calculatecolumn <2 3> = <1 2> - <1 1>;',
    ];
    const issues = checkCalculateColumnSingleCellElement(
      lines,
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'calculatecolumn-multiple-cellelements',
    });
  });

  it('flags a preceding table whose inline CELLELEMENTS is a composite (not elementary)', () => {
    const lines = [
      'table cellelements( abscolpercent ) = a by b;',
      'calculatecolumn <2 3> = <1 2> - <1 1>;',
    ];
    const issues = checkCalculateColumnSingleCellElement(
      lines,
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
  });

  it('falls back to the standalone global CELLELEMENTS default when the table has no inline clause', () => {
    const okLines = [
      'CELLELEMENTS = ABSOLUTE;',
      'table = a by b;',
      'calculatecolumn <2 3> = <1 2> - <1 1>;',
    ];
    expect(
      checkCalculateColumnSingleCellElement(okLines, alwaysNotInComment)
    ).to.be.empty;

    const badLines = [
      'CELLELEMENTS = ABSOLUTE COLUMNPERCENT;',
      'table = a by b;',
      'calculatecolumn <2 3> = <1 2> - <1 1>;',
    ];
    const issues = checkCalculateColumnSingleCellElement(
      badLines,
      alwaysNotInComment
    );
    expect(issues).to.have.length(1);
  });

  it('does not flag when no CELLELEMENTS is in effect at all (the documented implicit-ABSOLUTE default)', () => {
    const lines = ['table = a by b;', 'calculatecolumn <2 3> = <1 2> - <1 1>;'];
    expect(
      checkCalculateColumnSingleCellElement(lines, alwaysNotInComment)
    ).to.be.empty;
  });

  it('does not flag a CALCULATECOLUMN with no preceding table at all', () => {
    const lines = ['calculatecolumn <2 3> = <1 2> - <1 1>;'];
    expect(
      checkCalculateColumnSingleCellElement(lines, alwaysNotInComment)
    ).to.be.empty;
  });
});

describe('checkValuelabelsAddSingleVar', () => {
  it('flags VALUELABELS ADD with more than one variable (Syntaxerror 528)', () => {
    const lines = ['VALUELABELS a b = ADD 1 "eins";'];
    const issues = checkValuelabelsAddSingleVar(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0].code).to.equal('valuelabels-add-multi-var');
    expect(issues[0].message).to.include('528');
  });

  it('does not flag VALUELABELS ADD with exactly one variable', () => {
    const lines = ['VALUELABELS a = ADD 1 "eins";'];
    expect(checkValuelabelsAddSingleVar(lines, alwaysNotInComment)).to.be
      .empty;
  });

  it('does not flag several variables without ADD', () => {
    const lines = ['VALUELABELS a b = 1 "eins";'];
    expect(checkValuelabelsAddSingleVar(lines, alwaysNotInComment)).to.be
      .empty;
  });

  it('also recognizes the LABELS synonym', () => {
    const lines = ['LABELS a b = ADD 1 "eins";'];
    expect(
      checkValuelabelsAddSingleVar(lines, alwaysNotInComment)
    ).to.have.length(1);
  });
});

describe('checkOvercodeRangeSpan', () => {
  it('flags a range span over 100,000 as an error', () => {
    const lines = ['OVERCODE myoc 1:100002 "Text";'];
    const issues = checkOvercodeRangeSpan(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      severity: 'error',
      code: 'overcode-range-too-large',
    });
  });

  it('flags a range span over 5,000 (but under 100,000) as a warning', () => {
    const lines = ['OVERCODE myoc 1:6000 "Text";'];
    const issues = checkOvercodeRangeSpan(lines, alwaysNotInComment);
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      severity: 'warning',
      code: 'overcode-range-large',
    });
  });

  it('does not flag a small range span', () => {
    const lines = ['OVERCODE myoc 1:100 "Text";'];
    expect(checkOvercodeRangeSpan(lines, alwaysNotInComment)).to.be.empty;
  });
});

describe('computeDiagnostics', () => {
  it('aggregates issues from every check', () => {
    const lines = ['VARTITLE = "x";', '#endmacro'];
    const issues = computeDiagnostics(lines, alwaysNotInComment);
    const codes = issues.map((i) => i.code).sort();
    expect(codes).to.deep.equal(['empty-varlist', 'unmatched-endmacro']);
  });
});
