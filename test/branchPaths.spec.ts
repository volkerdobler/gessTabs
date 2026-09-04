import { expect } from 'chai';
import { branchPathsCompatible } from '../src/core/branchPaths';

// computeBranchPaths itself lives on resolveIncludeGraph now (the walk
// that decides line activity already builds exactly this stack) — see
// test/includeGraph.spec.ts's 'branchPaths' describe block. This file
// only covers the pure compatibility check.
describe('branchPathsCompatible', () => {
  it('two empty paths are compatible', () => {
    expect(branchPathsCompatible([], [])).to.equal(true);
  });

  it('an empty path is compatible with any path (not nested in that conditional at all)', () => {
    expect(branchPathsCompatible([], [{ group: 0, arm: 'if' }])).to.equal(true);
    expect(branchPathsCompatible([{ group: 0, arm: 'if' }], [])).to.equal(true);
  });

  it('the same arm of the same group is compatible', () => {
    expect(
      branchPathsCompatible(
        [{ group: 0, arm: 'if' }],
        [{ group: 0, arm: 'if' }]
      )
    ).to.equal(true);
  });

  it('different arms of the same group are NOT compatible', () => {
    expect(
      branchPathsCompatible(
        [{ group: 0, arm: 'if' }],
        [{ group: 0, arm: 'else' }]
      )
    ).to.equal(false);
  });

  it('unrelated groups are compatible regardless of arm', () => {
    expect(
      branchPathsCompatible(
        [{ group: 0, arm: 'if' }],
        [{ group: 1, arm: 'else' }]
      )
    ).to.equal(true);
  });
});
