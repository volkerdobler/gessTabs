import { expect } from 'chai';
import { matchInScope } from '../src/core/matching';

// pass-through: treat every regex match as "not in a comment" so these
// tests exercise only the regex-matching logic, not the scope wiring.
const alwaysVisible = (searchIndex: number) => searchIndex > -1;

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
