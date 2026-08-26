import * as fs from 'fs';
import * as path from 'path';
import { fileListCache } from './lru';

export async function getAllFilenamesInDirectory(
  dir: string,
  fType: string
): Promise<string[]> {
  const cacheKey = `${dir}|${fType}`;
  const cached = fileListCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async (): Promise<string[]> => {
    const regEXP = new RegExp(`\\.${fType}$`, 'i');
    try {
      const list = await fs.promises.readdir(dir, { withFileTypes: true });
      const found = await Promise.all(
        list.map(async (file): Promise<string[]> => {
          const fileInclDir = path.join(dir, file.name);
          if (file.isDirectory()) {
            return getAllFilenamesInDirectory(fileInclDir, fType);
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
  })();

  fileListCache.set(cacheKey, promise);
  return promise;
}
