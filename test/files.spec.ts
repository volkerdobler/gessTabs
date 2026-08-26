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

describe('file discovery: robustness against pathological directory trees', () => {
  // Regression coverage for a real hang: getAllFilenamesInDirectory used
  // to recurse into every subdirectory with no exclusions, no depth cap,
  // and no cycle detection, so a workspace root that also contained
  // node_modules/.git, or any symlink/junction cycle, could make the
  // recursive scan (and therefore hover/definition/rename, which all
  // depend on it) never resolve.

  const excludeDir = path.join(__dirname, 'tmp_test_dir_exclude');

  it('skips node_modules and .git while still finding real files', async () => {
    fs.mkdirSync(path.join(excludeDir, 'node_modules'), { recursive: true });
    fs.writeFileSync(
      path.join(excludeDir, 'node_modules', 'should_not_be_found.tab'),
      'x'
    );
    fs.mkdirSync(path.join(excludeDir, '.git'), { recursive: true });
    fs.writeFileSync(path.join(excludeDir, '.git', 'also_not_found.tab'), 'x');
    fs.writeFileSync(path.join(excludeDir, 'real.tab'), 'x');

    try {
      const files = await getAllFilenamesInDirectory(excludeDir, '(tab|inc)');
      expect(files.map((f) => path.basename(f))).to.deep.equal(['real.tab']);
    } finally {
      fs.rmSync(excludeDir, { recursive: true, force: true });
    }
  });

  const deepDir = path.join(__dirname, 'tmp_test_dir_deep');

  it('does not hang on an excessively deep directory chain (depth cap)', async () => {
    let current = deepDir;
    for (let i = 0; i < 45; i++) {
      current = path.join(current, `d${i}`);
    }
    fs.mkdirSync(current, { recursive: true });
    fs.writeFileSync(path.join(deepDir, 'shallow.tab'), 'x');
    fs.writeFileSync(path.join(current, 'toodeep.tab'), 'x');

    try {
      const files = await getAllFilenamesInDirectory(deepDir, '(tab|inc)');
      // Terminating at all (mocha's own timeout would otherwise catch a
      // real hang) is the main assertion; the deeply-nested file being
      // excluded confirms the cap actually took effect rather than just
      // happening to finish in time.
      expect(files.map((f) => path.basename(f))).to.deep.equal(['shallow.tab']);
    } finally {
      fs.rmSync(deepDir, { recursive: true, force: true });
    }
  });

  const cycleDir = path.join(__dirname, 'tmp_test_dir_cycle');

  it('does not hang on a symlink/junction cycle', async function test() {
    fs.mkdirSync(cycleDir, { recursive: true });
    fs.writeFileSync(path.join(cycleDir, 'real.tab'), 'x');
    const loopLink = path.join(cycleDir, 'loop');
    try {
      // 'junction' works on Windows without elevated privileges; on
      // other platforms a plain directory symlink needs no special
      // privileges either. If link creation itself fails in this
      // environment, skip rather than fail the suite over an unrelated
      // permissions issue.
      fs.symlinkSync(cycleDir, loopLink, 'junction');
    } catch (e) {
      this.skip();
      return;
    }

    try {
      const files = await getAllFilenamesInDirectory(cycleDir, '(tab|inc)');
      expect(files.map((f) => path.basename(f))).to.deep.equal(['real.tab']);
    } finally {
      fs.rmSync(cycleDir, { recursive: true, force: true });
    }
  });
});
