// A shell glob against a bare filename: `*` and `?` do not cross path
// separators (there are none in a basename anyway), everything else is
// literal. Case-insensitive, like gessTabs filenames on Windows. Shared by
// entry-script pattern matching (src/core/entryScripts.ts) and OS-wildcard
// data-source paths (src/core/externalNames.ts, e.g. "WELLE.*").

import * as path from 'path';

export function globToRegExp(glob: string): RegExp {
  const body = Array.from(glob)
    .map((c) => {
      if (c === '*') return '[^/\\\\]*';
      if (c === '?') return '[^/\\\\]';
      return c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    })
    .join('');
  return new RegExp(`^${body}$`, 'i');
}

export function matchesAnyPattern(
  basename: string,
  patterns: string[]
): boolean {
  return patterns.some((p) => globToRegExp(p).test(basename));
}

// Resolves an OS-wildcard path ("*cmpl_base.dat") to the first
// (alphabetically) real file it matches in its directory — same
// match/sort convention as core/externalNames.ts's own resolveWildcard
// (§11.7 "wildcard-path resolution"), reused here for DocumentLink targets
// (fileReferenceLinkProvider.ts / externalNamesProvider.ts), which have no
// single literal file to point at for a wildcard path. `listFiles` is
// injected (rather than this module reaching for `fs` itself) so it stays
// pure/testable, same DI convention as ExternalNamesIO.listFiles — the
// real fs.readdirSync-backed implementation lives at each call site.
// Returns undefined when nothing on disk matches (or `listFiles` throws) —
// the caller decides what "no target" means (typically: no link at all,
// same as an entirely unresolvable path).
export function resolveWildcardPath(
  baseDir: string,
  rawPath: string,
  listFiles: (dirAbsPath: string) => string[]
): string | undefined {
  const fullPattern = path.resolve(baseDir, rawPath);
  const dir = path.dirname(fullPattern);
  const patternRe = globToRegExp(path.basename(fullPattern));
  let list: string[];
  try {
    list = listFiles(dir);
  } catch {
    return undefined;
  }
  const match = list
    .filter((n) => patternRe.test(n))
    .sort((a, b) => a.localeCompare(b))[0];
  return match ? path.join(dir, match) : undefined;
}
