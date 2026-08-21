import * as fs from 'fs';
import * as path from 'path';
import { fileListCache } from './lru';

export async function getAllFilenamesInDirectory(
  dir: string,
  fType: string,
): Promise<string[]> {
  const cacheKey = dir + '|' + fType;
  const cached = fileListCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async (): Promise<string[]> => {
    const results: string[] = [];
    const regEXP = new RegExp('\\.' + fType + '$', 'i');
    try {
      const list = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const file of list) {
        const fileInclDir = path.join(dir, file.name);
        if (file.isDirectory()) {
          const sub = await getAllFilenamesInDirectory(fileInclDir, fType);
          results.push(...sub);
        } else if (file.isFile() && file.name.match(regEXP)) {
          results.push(fileInclDir);
        }
      }
    } catch (e) {
      return [];
    }
    return results;
  })();

  fileListCache.set(cacheKey, promise);
  return promise;
}
