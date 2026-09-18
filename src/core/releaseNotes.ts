// Pure logic behind the release-notes feature — no vscode import, so it's
// unit-testable on its own (src/providers/releaseNotesProvider.ts does the
// vscode-facing wiring). Mirrors the sibling gessQ extension's own
// src/infra/releaseNotes.ts: same folder/filename convention
// (release-notes/<version>.md) and the same two commands
// (show / reset-for-development), so the two extensions behave alike and
// a future gessQ change can be ported here (or vice versa) with minimal
// translation.

// Path of a version's release notes, relative to the extension root.
export function releaseNotesPath(version: string): string {
  return `release-notes/${version}.md`;
}

// `a` vs. `b` as `x.y.z` version strings — negative/0/positive, like
// `Array.sort`'s comparator.
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// The newest of `available` version strings, or undefined if empty.
//
// There is only ever at most one release-notes file "current" at a time — a
// quick patch release (e.g. 1.0.1 after 1.0.0) doesn't get its own file when
// it has nothing worth announcing, it just keeps shipping the previous one.
// So "what notes should this install show" is never "the file matching the
// installed version", it's "the newest file that exists at all": someone
// who installs 1.0.1 fresh, or updates to it having never seen 1.0.0's
// notes, still sees them; someone who already dismissed 1.0.0's notes and
// then updates to 1.0.1 does not see them again, since nothing new shipped.
export function latestVersion(
  available: readonly string[]
): string | undefined {
  return available.length === 0
    ? undefined
    : available.reduce((best, v) => (compareVersions(v, best) > 0 ? v : best));
}

// Whether the auto "what's new" popup should fire, given the
// gesstabs.releaseNotes.showOnUpdate setting and this version's stored
// checkbox state (undefined/false until the user checks "don't show this
// again" and closes the panel).
export function shouldShowReleaseNotes(
  showOnUpdate: boolean,
  suppressed: boolean | undefined
): boolean {
  return showOnUpdate && suppressed !== true;
}
