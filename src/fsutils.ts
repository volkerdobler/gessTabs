import * as fs from 'fs';
import * as path from 'path';
import { fileListCache } from './lru';

// Never valid places for gessTabs scripts, and the single biggest source
// of pathologically large/slow recursive scans if a project happens to
// live inside or alongside a JS toolchain.
const excludedDirNames = new Set(['node_modules', '.git']);

// Safety net against a directory tree deep enough to be a de facto hang
// (there is no legitimate reason for gessTabs script folders to nest this
// deep; a real symlink/junction cycle would otherwise recurse forever).
const MAX_SCAN_DEPTH = 40;

async function scanDirectory(
  dir: string,
  regEXP: RegExp,
  visitedRealPaths: Set<string>,
  depth: number
): Promise<string[]> {
  if (depth > MAX_SCAN_DEPTH) return [];

  // Resolve symlinks/junctions before recursing so a cycle (a link that
  // eventually points back to an ancestor) is caught by identity rather
  // than by the depth cap alone.
  let realDir: string;
  try {
    realDir = await fs.promises.realpath(dir);
  } catch (e) {
    return [];
  }
  if (visitedRealPaths.has(realDir)) return [];
  visitedRealPaths.add(realDir);

  try {
    const list = await fs.promises.readdir(dir, { withFileTypes: true });
    const found = await Promise.all(
      list.map(async (file): Promise<string[]> => {
        const fileInclDir = path.join(dir, file.name);
        if (file.isDirectory()) {
          if (excludedDirNames.has(file.name.toLowerCase())) return [];
          return scanDirectory(
            fileInclDir,
            regEXP,
            visitedRealPaths,
            depth + 1
          );
        }
        if (file.isFile() && file.name.match(regEXP)) {
          return [fileInclDir];
        }
        return [];
      })
    );
    return found.flat();
  } catch (e) {
    console.error(`gesstabs: failed to scan directory "${dir}":`, e);
    return [];
  }
}

export async function getAllFilenamesInDirectory(
  dir: string,
  fType: string
): Promise<string[]> {
  const cacheKey = `${dir}|${fType}`;
  const cached = fileListCache.get(cacheKey);
  if (cached) return cached;

  const regEXP = new RegExp(`\\.${fType}$`, 'i');
  const promise = scanDirectory(dir, regEXP, new Set<string>(), 0);

  fileListCache.set(cacheKey, promise);
  return promise;
}
