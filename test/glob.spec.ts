import { expect } from 'chai';
import * as path from 'path';
import { resolveWildcardPath } from '../src/util/glob';

const ROOT = path.resolve('/gesstabs-test-root');
const p = (...segments: string[]) => path.join(ROOT, ...segments);

function listOf(entries: string[]) {
  return () => entries;
}

describe('resolveWildcardPath', () => {
  // Reproduces the reported case: DATAFILE/OPENQFILE (and any other file-
  // reference link) with an OS-wildcard path must still resolve to a real
  // file so it can get a clickable DocumentLink, same as a literal path
  // already did.
  it('resolves an OS-wildcard path to the first alphabetical real match', () => {
    const resolved = resolveWildcardPath(
      ROOT,
      '*cmpl_base.dat',
      listOf(['w2_cmpl_base.dat', 'w1_cmpl_base.dat', 'other.txt'])
    );
    expect(resolved).to.equal(p('w1_cmpl_base.dat'));
  });

  it('resolves relative to the directory the pattern itself names', () => {
    const resolved = resolveWildcardPath(
      ROOT,
      path.join('data', '*.opn'),
      (dir) => {
        expect(dir).to.equal(p('data'));
        return ['cmpl_base.opn'];
      }
    );
    expect(resolved).to.equal(p('data', 'cmpl_base.opn'));
  });

  it('returns undefined when nothing on disk matches', () => {
    expect(resolveWildcardPath(ROOT, '*.dat', listOf(['other.txt']))).to.be
      .undefined;
  });

  it('returns undefined when listFiles throws (e.g. an unreadable directory)', () => {
    const resolved = resolveWildcardPath(ROOT, '*.dat', () => {
      throw new Error('EACCES');
    });
    expect(resolved).to.be.undefined;
  });

  it('is case-insensitive, matching gessTabs filename convention', () => {
    const resolved = resolveWildcardPath(
      ROOT,
      '*CMPL_BASE.DAT',
      listOf(['cmpl_base.dat'])
    );
    expect(resolved).to.equal(p('cmpl_base.dat'));
  });
});
