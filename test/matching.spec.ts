import { expect } from 'chai';
import { lineMatchesDefinition, lineMatchesUsage } from '../src/matching';

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
});
