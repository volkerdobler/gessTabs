import { expect } from 'chai';
import { releaseNotesPath } from '../src/core/releaseNotes';

describe('releaseNotesPath', () => {
  it('is release-notes/<version>.md', () => {
    expect(releaseNotesPath('1.2.3')).to.equal('release-notes/1.2.3.md');
    expect(releaseNotesPath('0.99.9')).to.equal('release-notes/0.99.9.md');
  });
});
