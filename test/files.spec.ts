import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { getAllFilenamesInDirectory } from '../src/fsutils';

const tmpDir = path.join(__dirname, 'tmp_test_dir');

function setupFiles(): void {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  fs.writeFileSync(path.join(tmpDir, 'a.tab'), 'a');
  fs.writeFileSync(path.join(tmpDir, 'b.inc'), 'b');
  fs.writeFileSync(path.join(tmpDir, 'c.txt'), 'c');
  const sub = path.join(tmpDir, 'sub');
  if (!fs.existsSync(sub)) fs.mkdirSync(sub);
  fs.writeFileSync(path.join(sub, 'd.tab'), 'd');
}

function teardownFiles(): void {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

describe('file discovery', () => {
  before(() => setupFiles());
  after(() => teardownFiles());

  it('finds .tab and .inc files recursively', async () => {
    const files = await getAllFilenamesInDirectory(tmpDir, '(tab|inc)');
    const basenames = files.map((f) => path.basename(f)).sort();
    expect(basenames).to.deep.equal(['a.tab', 'b.inc', 'd.tab']);
  });
});
