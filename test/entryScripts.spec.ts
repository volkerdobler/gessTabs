import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { ExternalNamesIO } from '../src/core/externalNames';
import {
  matchesAnyPattern,
  findEntryScripts,
  buildEntryPrograms,
  programsForFile,
  DEFAULT_ENTRY_SCRIPT_PATTERNS,
} from '../src/core/entryScripts';

const ROOT = path.resolve('/entry-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

function reader(files: Record<string, string>): FileReader {
  return (fp) => (files[fp] === undefined ? undefined : files[fp].split('\n'));
}

function io(files: Record<string, string>): ExternalNamesIO {
  return {
    readBytes: (fp) =>
      files[fp] === undefined
        ? undefined
        : Uint8Array.from(Buffer.from(files[fp], 'utf8')),
  };
}

describe('matchesAnyPattern', () => {
  it('matches case-insensitively with * and ? wildcards', () => {
    const pat = DEFAULT_ENTRY_SCRIPT_PATTERNS;
    expect(matchesAnyPattern('main.tab', pat)).to.equal(true);
    expect(matchesAnyPattern('MAIN.TAB', pat)).to.equal(true);
    expect(matchesAnyPattern('mainFlipped.tab', pat)).to.equal(true);
    expect(matchesAnyPattern('tabellen.tab', pat)).to.equal(true);
    expect(matchesAnyPattern('labels.inc', pat)).to.equal(false);
    expect(matchesAnyPattern('run.tab', ['main*.tab'])).to.equal(false);
    expect(matchesAnyPattern('run.tab', ['run.tab', 'x.tab'])).to.equal(true);
  });
});

describe('findEntryScripts', () => {
  it('filters the tab list by the patterns; empty patterns -> none', () => {
    const tabs = [p('main.tab'), p('sub', 'mainFlipped.tab'), p('helper.tab')];
    expect(findEntryScripts(tabs, ['main*.tab'])).to.deep.equal([
      p('main.tab'),
      p('sub', 'mainFlipped.tab'),
    ]);
    expect(findEntryScripts(tabs, [])).to.deep.equal([]);
  });
});

describe('buildEntryPrograms', () => {
  it('makes one program per root, each with its own data source', () => {
    const files = {
      [p('main.tab')]: 'CSVINFILE = data/normal.csv;\nINCLUDE = shared.inc;',
      [p('mainFlipped.tab')]:
        'CSVINFILE = data/flipped.csv;\nINCLUDE = shared.inc;',
      [p('shared.inc')]: 'vartitle x = "X";',
    };
    const data = {
      [p('data', 'normal.csv')]: 'id;age;region\n',
      [p('data', 'flipped.csv')]: 'id;alter;bundesland\n',
    };
    const programs = buildEntryPrograms(
      [p('main.tab'), p('mainFlipped.tab'), p('shared.inc')],
      ['main*.tab'],
      reader(files),
      io(data)
    );
    expect(programs.map((x) => x.entryFile)).to.deep.equal([
      p('main.tab'),
      p('mainFlipped.tab'),
    ]);
    expect(programs[0].sources[0].names).to.deep.equal(['id', 'age', 'region']);
    expect(programs[1].sources[0].names).to.deep.equal([
      'id',
      'alter',
      'bundesland',
    ]);
  });

  it('does not treat an INCLUDEd .tab as its own root', () => {
    const files = {
      [p('main.tab')]: 'CSVINFILE = d.csv;\nINCLUDE = part.tab;',
      [p('part.tab')]: 'vartitle x = "X";',
    };
    const programs = buildEntryPrograms(
      [p('main.tab'), p('part.tab')],
      ['*.tab'],
      reader(files),
      io({ [p('d.csv')]: 'a,b\n' })
    );
    expect(programs.map((x) => x.entryFile)).to.deep.equal([p('main.tab')]);
  });
});

describe('programsForFile', () => {
  it('returns every program whose graph contains the file', () => {
    const files = {
      [p('main.tab')]: 'CSVINFILE = n.csv;\nINCLUDE = shared.inc;',
      [p('mainFlipped.tab')]: 'CSVINFILE = f.csv;\nINCLUDE = shared.inc;',
      [p('shared.inc')]: 'x',
    };
    const programs = buildEntryPrograms(
      [p('main.tab'), p('mainFlipped.tab')],
      ['main*.tab'],
      reader(files),
      io({ [p('n.csv')]: 'a;b\n', [p('f.csv')]: 'a;c\n' })
    );
    expect(
      programsForFile(programs, p('shared.inc')).map((x) => x.entryFile)
    ).to.have.members([p('main.tab'), p('mainFlipped.tab')]);
    expect(
      programsForFile(programs, p('main.tab')).map((x) => x.entryFile)
    ).to.deep.equal([p('main.tab')]);
    expect(programsForFile(programs, p('orphan.inc'))).to.deep.equal([]);
  });
});
