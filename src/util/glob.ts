// A shell glob against a bare filename: `*` and `?` do not cross path
// separators (there are none in a basename anyway), everything else is
// literal. Case-insensitive, like gessTabs filenames on Windows. Shared by
// entry-script pattern matching (src/core/entryScripts.ts) and OS-wildcard
// data-source paths (src/core/externalNames.ts, e.g. "WELLE.*").

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
