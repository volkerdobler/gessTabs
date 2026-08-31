import { expect } from 'chai';
import {
  lineMatchesDefinition,
  lineMatchesUsage,
  matchInScope,
} from '../src/matching';

// pass-through: treat every regex match as "not in a comment" so these
// tests exercise only the regex-matching logic, not the scope wiring.
const alwaysVisible = (searchIndex: number) => searchIndex > -1;

describe('lineMatchesDefinition', () => {
  it('matches a single variable definition', () => {
    expect(
      lineMatchesDefinition('variable myVar = 1', 'myVar', alwaysVisible)
    ).to.equal(true);
  });

  it('matches a #macro definition', () => {
    expect(
      lineMatchesDefinition('#macro #myMacro(', 'myMacro', alwaysVisible)
    ).to.equal(true);
  });

  it('matches an #expand definition', () => {
    expect(
      lineMatchesDefinition('#expand #myMacro', 'myMacro', alwaysVisible)
    ).to.equal(true);
  });

  it('does not match table usage (head/axis are not definitions)', () => {
    expect(
      lineMatchesDefinition('table t = myVar by other', 'myVar', alwaysVisible)
    ).to.equal(false);
  });

  it('does not match an unrelated line', () => {
    expect(
      lineMatchesDefinition('variable other = 1', 'myVar', alwaysVisible)
    ).to.equal(false);
  });

  it('respects the isNotInComment callback (comment suppresses the match)', () => {
    const alwaysInComment = () => false;
    expect(
      lineMatchesDefinition('variable myVar = 1', 'myVar', alwaysInComment)
    ).to.equal(false);
  });
});

describe('lineMatchesUsage', () => {
  it('matches everything a definition match does', () => {
    expect(
      lineMatchesUsage('variable myVar = 1', 'myVar', alwaysVisible)
    ).to.equal(true);
  });

  it('also matches table head usage', () => {
    expect(
      lineMatchesUsage('table t = myVar by other', 'myVar', alwaysVisible)
    ).to.equal(true);
  });

  it('also matches table axis usage', () => {
    expect(
      lineMatchesUsage('table t = other by myVar', 'myVar', alwaysVisible)
    ).to.equal(true);
  });

  it('does not match an unrelated line', () => {
    expect(
      lineMatchesUsage('table t = other by another', 'myVar', alwaysVisible)
    ).to.equal(false);
  });

  it('matches a bare reference in an IF condition / THEN assignment', () => {
    expect(
      lineMatchesUsage(
        'if (not ([1:2] in f24)) then f24 = 2;',
        'f24',
        alwaysVisible
      )
    ).to.equal(true);
  });

  it('matches a bare reference used as an expression operand', () => {
    expect(
      lineMatchesUsage('compute add x = f24 + 1;', 'f24', alwaysVisible)
    ).to.equal(true);
  });

  it('does not match the word as part of a longer identifier', () => {
    expect(
      lineMatchesUsage('if (f240 gt 0) then x = 1;', 'f24', alwaysVisible)
    ).to.equal(false);
  });

  it('does not match a `.`-qualified member with the same tail', () => {
    expect(
      lineMatchesUsage('if (region.f24 gt 0) then x = 1;', 'f24', alwaysVisible)
    ).to.equal(false);
  });

  it('respects the isNotInComment callback for a bare reference', () => {
    const alwaysInComment = () => false;
    expect(
      lineMatchesUsage(
        'if (not ([1:2] in f24)) then f24 = 2;',
        'f24',
        alwaysInComment
      )
    ).to.equal(false);
  });
});

describe('matchInScope', () => {
  it('returns the match when the regex hits inside scope', () => {
    const result = matchInScope('variable myVar = 1', /myVar/, alwaysVisible);
    expect(result).to.not.be.null;
    expect(result?.[0]).to.equal('myVar');
  });

  it('returns null when the regex does not match at all', () => {
    expect(matchInScope('nothing here', /myVar/, alwaysVisible)).to.be.null;
  });

  it('returns null when the match falls outside the allowed scope', () => {
    const alwaysInComment = () => false;
    expect(matchInScope('variable myVar = 1', /myVar/, alwaysInComment)).to.be
      .null;
  });

  it('only calls match() when the scope check passes (search is not re-run blindly)', () => {
    let calls = 0;
    const countingScopeCheck = (searchIndex: number) => {
      calls += 1;
      return searchIndex > -1;
    };
    matchInScope('variable myVar = 1', /myVar/, countingScopeCheck);
    expect(calls).to.equal(1);
  });
});
