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
