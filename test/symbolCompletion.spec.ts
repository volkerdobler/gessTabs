import { expect } from 'chai';
import { collectDefinedNamesBefore } from '../src/core/symbolCompletion';

describe('collectDefinedNamesBefore', () => {
  it('collects a variable defined on an earlier line', () => {
    const lines = ['variable x = 1;', 'variable y = 2;'];
    expect(collectDefinedNamesBefore(lines, 2).sort()).to.deep.equal(['x', 'y']);
  });

  it('excludes a variable defined on or after the cursor line (no forward references)', () => {
    const lines = ['variable x = 1;', 'variable y = 2;'];
    expect(collectDefinedNamesBefore(lines, 1)).to.deep.equal(['x']);
  });

  it('deduplicates repeated definitions of the same name', () => {
    const lines = ['variable x = 1;', 'compute x = x + 1;'];
    expect(collectDefinedNamesBefore(lines, 2)).to.deep.equal(['x']);
  });

  it('returns an empty list when nothing is defined before the cursor', () => {
    expect(collectDefinedNamesBefore(['variable x = 1;'], 0)).to.deep.equal([]);
  });
});
