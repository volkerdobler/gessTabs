import { expect } from 'chai';
import {
  compareVersions,
  latestVersion,
  releaseNotesPath,
  shouldShowReleaseNotes,
} from '../src/core/releaseNotes';

describe('releaseNotesPath', () => {
  it('is release-notes/<version>.md', () => {
    expect(releaseNotesPath('1.2.3')).to.equal('release-notes/1.2.3.md');
    expect(releaseNotesPath('0.99.9')).to.equal('release-notes/0.99.9.md');
  });
});

describe('compareVersions', () => {
  it('orders by numeric major.minor.patch, not lexically', () => {
    expect(compareVersions('1.0.0', '1.0.1')).to.be.lessThan(0);
    expect(compareVersions('1.0.10', '1.0.9')).to.be.greaterThan(0);
    expect(compareVersions('1.2.0', '1.10.0')).to.be.lessThan(0);
    expect(compareVersions('1.0.0', '1.0.0')).to.equal(0);
  });
});

describe('latestVersion', () => {
  it('no notes files at all -> undefined', () => {
    expect(latestVersion([])).to.be.undefined;
  });

  it('a single file -> that version', () => {
    expect(latestVersion(['1.0.0'])).to.equal('1.0.0');
  });

  it('picks the numerically newest, regardless of list order', () => {
    expect(latestVersion(['1.0.0', '1.0.10', '1.0.9'])).to.equal('1.0.10');
    expect(latestVersion(['1.0.10', '1.0.9', '1.0.0'])).to.equal('1.0.10');
  });

  // The reported scenario: 1.0.1 ships with no notes file of its own (no
  // user-facing changes worth announcing) — the newest available notes are
  // still 1.0.0's, and that's what a fresh 1.0.1 install/update should show.
  it('a patch release with no notes file of its own still resolves to the last real notes', () => {
    expect(latestVersion(['1.0.0'])).to.equal('1.0.0');
  });
});

describe('shouldShowReleaseNotes', () => {
  it('setting on, never suppressed (fresh install / update) -> yes', () => {
    expect(shouldShowReleaseNotes(true, undefined)).to.be.true;
  });

  it('setting on, checkbox left unchecked last time -> yes', () => {
    expect(shouldShowReleaseNotes(true, false)).to.be.true;
  });

  it('setting on, checkbox checked for this version -> no', () => {
    expect(shouldShowReleaseNotes(true, true)).to.be.false;
  });

  it('setting off, regardless of checkbox state -> no', () => {
    expect(shouldShowReleaseNotes(false, undefined)).to.be.false;
    expect(shouldShowReleaseNotes(false, true)).to.be.false;
  });
});
