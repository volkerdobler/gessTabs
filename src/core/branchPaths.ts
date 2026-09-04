// Compares "which #IFDEF/#IFNDEF/#IFEMPTY/... arm" two source locations
// sit in.
//
// variableModel.ts always resolves with conditionalsAllActive (design
// §7.2 — a per-branch definition is still a definition to the symbol
// tooling), so both arms of a conditional contribute to a symbol's
// `definitions`. That's right for find-references, but a consumer asking
// "which of these is *the* declaration" (primaryDefinitions()) needs to
// tell two shapes apart:
//   - two locations that could both execute on the same real build (one
//     after the other) — a genuine reassignment, only the first "creates"
//     the name;
//   - two locations in mutually exclusive arms of the same conditional
//     (`#ifdef X … #else … #end`) — each is independently *the* creator
//     for whichever arm actually compiles, same as a plain #ifdef/#else
//     double declaration, just spelled with a COMPUTE/IF…THEN
//     (`defKind: 'assignment'`) instead of a real declaration keyword.
//
// The path itself is computed by src/core/includeGraph.ts (see
// `IncludeGraphResult.branchPaths`), which already walks exactly this
// #ifdef/#else/#end stack to decide line activity — re-deriving it here
// by re-scanning `order` text would risk disagreeing with that walk, and
// in fact can't work at all: a line that is itself a directive is
// consumed by that walk and never reaches `order`, so there is no
// directive text left downstream to re-scan. This module only holds the
// shared type, the lookup key, and the compatibility check.

export interface BranchArm {
  // unique id per #ifdef/#ifndef/... opening (shared by its #else arm).
  group: number;
  arm: 'if' | 'else';
}
export type BranchPath = BranchArm[];

export function branchKey(file: string, line: number): string {
  return `${file} ${line}`;
}

// Whether two branch paths could both be active on some real build — no
// conditional group present in both picked a different arm. (A group
// present in only one path doesn't conflict: the other location simply
// isn't nested in that particular conditional, which is compatible with
// either of its arms.)
export function branchPathsCompatible(a: BranchPath, b: BranchPath): boolean {
  const arms = new Map<number, 'if' | 'else'>();
  a.forEach((x) => arms.set(x.group, x.arm));
  return b.every((x) => {
    const seen = arms.get(x.group);
    return seen === undefined || seen === x.arm;
  });
}
