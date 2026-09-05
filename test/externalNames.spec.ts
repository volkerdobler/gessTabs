import { expect } from 'chai';
import * as path from 'path';
import { ResolvedLine } from '../src/core/includeGraph';
import {
  findDataSourceStatements,
  parseDelimitedHeader,
  interpretDelimiter,
  decodeText,
  resolveExternalNames,
  readExternalNames,
  collectExternalNames,
  hasVardefStatements,
  findEncodingOverride,
  ExternalNamesIO,
} from '../src/core/externalNames';

const ROOT = path.resolve('/ext-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

function order(file: string, lines: string[]): ResolvedLine[] {
  return lines.map((text, i) => ({ file, line: i, text }));
}

function io(
  files: Record<string, Uint8Array | string>,
  dirs: Record<string, string[]> = {}
): ExternalNamesIO {
  return {
    readBytes(absPath: string) {
      const f = files[absPath];
      if (f === undefined) return undefined;
      return typeof f === 'string'
        ? Uint8Array.from(Buffer.from(f, 'utf8'))
        : f;
    },
    listFiles(dirAbsPath: string) {
      return dirs[dirAbsPath] ?? [];
    },
  };
}

describe('findDataSourceStatements', () => {
  it('finds CSVINFILE / SPSSINFILE / DATAFILE with path, FILEKEY and delimiter', () => {
    const o = order(p('main.tab'), [
      'title = "x";',
      'CSVINFILE FILEKEY w1 ";" = "..\\data\\w1.csv";',
      'SPSSINFILE = survey.sav ;',
      "DATAFILE FILEKEY 2017 = 'sub/old.dat';",
      'variable a = 1;',
    ]);
    const st = findDataSourceStatements(o);
    expect(st.map((s) => s.kind)).to.deep.equal(['csv', 'spss', 'datafile']);
    expect(st[0]).to.include({
      rawPath: '..\\data\\w1.csv',
      fileKey: 'w1',
      delimiterToken: '";"',
      line: 1,
    });
    expect(st[1]).to.include({ rawPath: 'survey.sav', fileKey: undefined });
    expect(st[2]).to.include({ rawPath: 'sub/old.dat', fileKey: '2017' });
  });

  it('ignores an occurrence inside a comment-blanked line', () => {
    // includeGraph blanks comment text to spaces before it reaches here.
    const o = order(p('m.tab'), ['                       CSVINFILE = x.csv;']);
    // leading run of spaces then the statement is still real code here;
    // a truly commented one would have the keyword blanked out:
    const commented = order(p('m.tab'), [
      `${'          '.repeat(3)}         `, // nothing
    ]);
    expect(findDataSourceStatements(o)).to.have.length(1);
    expect(findDataSourceStatements(commented)).to.have.length(0);
  });

  it('treats INFILE as a documented synonym for DATAFILE', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['INFILE = old.dat;'])
    );
    expect(st).to.have.length(1);
    expect(st[0]).to.include({ kind: 'datafile', rawPath: 'old.dat' });
  });

  it('finds a statement wrapped across several physical lines and locates the path token', () => {
    const o = order(p('main.tab'), [
      'CSVINFILE',
      '  FILEKEY w1',
      '  = "data/w1.csv";',
    ]);
    const st = findDataSourceStatements(o);
    expect(st).to.have.length(1);
    expect(st[0]).to.include({
      kind: 'csv',
      rawPath: 'data/w1.csv',
      fileKey: 'w1',
      line: 0, // the statement starts on line 0 ...
      pathLine: 2, // ... but the path token itself sits on line 2
    });
    expect(st[0].pathChar).to.equal(
      o[2].text.indexOf('data/w1.csv')
    );
  });
});

describe('interpretDelimiter', () => {
  it('handles a quoted single char, a bare char and named tokens', () => {
    expect(interpretDelimiter('";"')).to.equal(';');
    expect(interpretDelimiter(';')).to.equal(';');
    expect(interpretDelimiter('TAB')).to.equal('\t');
    expect(interpretDelimiter('KOMMA')).to.equal(',');
    expect(interpretDelimiter(undefined)).to.equal(undefined);
    expect(interpretDelimiter('weird')).to.equal(undefined);
  });
});

describe('parseDelimitedHeader', () => {
  it('auto-detects ; and strips a BOM and quotes', () => {
    const h = parseDelimitedHeader('﻿"id";"Alter";"region "');
    expect(h).to.deep.equal({
      names: ['id', 'Alter', 'region'],
      delimiter: ';',
    });
  });

  it('auto-detects , when there is no ;', () => {
    const h = parseDelimitedHeader('id,age,region');
    expect(h?.delimiter).to.equal(',');
    expect(h?.names).to.deep.equal(['id', 'age', 'region']);
  });

  it('prefers the more frequent of ; and ,', () => {
    expect(parseDelimitedHeader('a;b;c,d')?.delimiter).to.equal(';');
    expect(parseDelimitedHeader('a,b,c;d')?.delimiter).to.equal(',');
  });

  it('returns null when neither ; nor , is present and no explicit delimiter', () => {
    expect(parseDelimitedHeader('id age region')).to.equal(null);
  });

  it('honours an explicit delimiter even without ; or ,', () => {
    expect(parseDelimitedHeader('id\tage\tregion', '\t')?.names).to.deep.equal([
      'id',
      'age',
      'region',
    ]);
  });
});

describe('decodeText', () => {
  it('decodes UTF-8 and falls back to Windows-1252 for invalid bytes', () => {
    expect(decodeText(Uint8Array.from(Buffer.from('Größe', 'utf8')))).to.equal(
      'Größe'
    );
    // 0xF6 alone is not valid UTF-8; it is 'ö' in Windows-1252 / Latin-1.
    expect(
      decodeText(Uint8Array.from([0x47, 0x72, 0xf6, 0xdf, 0x65]))
    ).to.equal('Größe');
  });
});

describe('resolveExternalNames', () => {
  it('reads a CSV header relative to the statement file', () => {
    const st = findDataSourceStatements(
      order(p('sub', 'main.tab'), ['CSVINFILE = ../data/w1.csv;'])
    );
    const sources = resolveExternalNames(
      st,
      io({ [p('data', 'w1.csv')]: 'id;age;region\n1;2;3\n' })
    );
    expect(sources[0].names).to.deep.equal(['id', 'age', 'region']);
    expect(sources[0].columnIndex).to.deep.equal({ id: 0, age: 1, region: 2 });
  });

  it('records each header name\'s character range for a header-cell go-to-definition jump', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['CSVINFILE = w1.csv;'])
    );
    const [s] = resolveExternalNames(
      st,
      io({ [p('w1.csv')]: '"id";"Alter";region\n1;2;3\n' })
    );
    const firstLine = '"id";"Alter";region';
    expect(s.columnRanges?.id).to.deep.equal({
      start: firstLine.indexOf('id'),
      end: firstLine.indexOf('id') + 2,
    });
    expect(s.columnRanges?.alter).to.deep.equal({
      start: firstLine.indexOf('Alter'),
      end: firstLine.indexOf('Alter') + 5,
    });
    expect(s.columnRanges?.region).to.deep.equal({
      start: firstLine.indexOf('region'),
      end: firstLine.indexOf('region') + 6,
    });
  });

  it('marks a missing data file unresolved with a reason', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['CSVINFILE = missing.csv;'])
    );
    const [s] = resolveExternalNames(st, io({}));
    expect(s.names).to.equal('unresolved');
    expect(s.reason).to.match(/nicht gefunden/);
  });

  it('marks a non-static path (#EXPAND / wildcard) unresolved', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['CSVINFILE = "data&land&.csv";'])
    );
    expect(resolveExternalNames(st, io({}))[0].reason).to.match(/statisch/);
  });

  it('marks a column-fixed DATAFILE (no ; or ,, a VARNAME vardef present) unresolved', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = fixed.dat;'])
    );
    const [s] = resolveExternalNames(
      st,
      io({ [p('fixed.dat')]: '0001JOHN    0034\n0002JANE    0029\n' }),
      { hasVardefInclude: true }
    );
    expect(s.names).to.equal('unresolved');
    expect(s.reason).to.match(/spaltenfixiert/);
  });

  it('marks a DATAFILE with no ; or , and no VARNAME vardef unresolved with a different reason', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = fixed.dat;'])
    );
    const [s] = resolveExternalNames(
      st,
      io({ [p('fixed.dat')]: '0001JOHN    0034\n' })
    );
    expect(s.names).to.equal('unresolved');
    expect(s.reason).to.match(/kann nicht bestimmt/);
  });

  it('readExternalNames detects a VARNAME vardef anywhere in the whole order', () => {
    const o = order(p('main.tab'), [
      'DATAFILE = fixed.dat;',
      'VARNAME = Alter 101 1;',
    ]);
    expect(hasVardefStatements(o)).to.equal(true);
    const [s] = readExternalNames(
      o,
      io({ [p('fixed.dat')]: '0001JOHN    0034\n' })
    );
    expect(s.reason).to.match(/spaltenfixiert/);
  });

  it('reads a delimited DATAFILE like a CSV', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = w.dat;'])
    );
    const [s] = resolveExternalNames(st, io({ [p('w.dat')]: 'id,age\n1,2\n' }));
    expect(s.names).to.deep.equal(['id', 'age']);
  });

  it('routes SPSSINFILE through the .sav dictionary parser', () => {
    // minimal valid little-endian .sav: 176-byte header, two type-2 var
    // records, then the 999 terminator.
    const chunks: number[] = [];
    const i32 = (v: number) => {
      const b = Buffer.alloc(4);
      b.writeInt32LE(v, 0);
      chunks.push(...b);
    };
    const ascii = (str: string, len: number) => {
      const b = Buffer.alloc(len, 0x20);
      Buffer.from(str, 'latin1').copy(b, 0, 0, Math.min(str.length, len));
      chunks.push(...b);
    };
    ascii('$FL2', 4);
    ascii('prod', 60);
    i32(2); // layout_code @64
    chunks.push(...Buffer.alloc(176 - chunks.length));
    ['AGE', 'REGION'].forEach((name) => {
      i32(2);
      i32(0); // numeric
      i32(0);
      i32(0);
      i32(0);
      i32(0);
      ascii(name, 8);
    });
    i32(999);
    i32(0);

    const st = findDataSourceStatements(
      order(p('main.tab'), ['SPSSINFILE = survey.sav;'])
    );
    const [s] = resolveExternalNames(
      st,
      io({ [p('survey.sav')]: Uint8Array.from(chunks) })
    );
    expect(s.names).to.deep.equal(['AGE', 'REGION']);
  });

  it('unions names across sequential waves and reports unresolved waves', () => {
    const o = order(p('main.tab'), [
      'CSVINFILE FILEKEY a = w1.csv;',
      'CSVINFILE FILEKEY b = w2.csv;',
      'CSVINFILE FILEKEY c = w3.csv;',
    ]);
    const sources = readExternalNames(
      o,
      io({
        [p('w1.csv')]: 'id;age\n',
        [p('w2.csv')]: 'id;age;newvar\n',
        // w3 missing
      })
    );
    const { names, hasUnresolved } = collectExternalNames(sources);
    expect(names).to.deep.equal(['id', 'age', 'newvar']);
    expect(hasUnresolved).to.equal(true);
  });

  it('resolves an OS-wildcard DATAFILE path to the union of every matching file, alphabetically', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = "WELLE.*";'])
    );
    const [s] = resolveExternalNames(
      st,
      io(
        {
          [p('WELLE.1')]: 'id;age\n',
          [p('WELLE.2')]: 'id;age;region\n',
          [p('WELLE.10')]: 'id;newest\n',
        },
        { [p()]: ['WELLE.2', 'WELLE.10', 'WELLE.1', 'unrelated.txt'] }
      )
    );
    // union in alphabetical match order (WELLE.1, WELLE.10, WELLE.2) — each
    // file's new names appended the first time they're seen.
    expect(s.names).to.deep.equal(['id', 'age', 'newest', 'region']);
    // alphabetically first match ("WELLE.1") supplies absPath/columnIndex.
    expect(s.absPath).to.equal(p('WELLE.1'));
    expect(s.matchedPaths).to.deep.equal([
      p('WELLE.1'),
      p('WELLE.10'),
      p('WELLE.2'),
    ]);
  });

  it('marks a wildcard path with no filesystem matches unresolved', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = "WELLE.*";'])
    );
    const [s] = resolveExternalNames(st, io({}, { [p()]: ['unrelated.txt'] }));
    expect(s.names).to.equal('unresolved');
    expect(s.reason).to.match(/Wildcard/);
  });

  it('marks a wildcard path unresolved when the I/O has no listFiles', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = "WELLE.*";'])
    );
    const [s] = resolveExternalNames(st, {
      readBytes: () => undefined,
    });
    expect(s.names).to.equal('unresolved');
  });
});

describe('findEncodingOverride', () => {
  it('finds the last ENCODING DATAFILE = ...; override in program order', () => {
    const o = order(p('main.tab'), [
      'ENCODING DATAFILE = LATIN1;',
      'DATAFILE = a.dat;',
      'ENCODING DATAFILE = UTF8;',
    ]);
    expect(findEncodingOverride(o, 'DATAFILE')).to.equal('utf8');
    expect(findEncodingOverride(o, 'OPENQFILE')).to.equal(undefined);
  });

  it('is applied when reading a delimited DATAFILE header, overriding auto-detection', () => {
    const o = order(p('main.tab'), [
      'ENCODING DATAFILE = LATIN1;',
      'DATAFILE = w.dat;',
    ]);
    // Valid UTF-8 bytes for "Größe;age" — auto-detection alone would read
    // this correctly as UTF-8. Forcing the LATIN1 override instead
    // mis-decodes the multi-byte characters as separate Windows-1252
    // characters, proving the override — not the auto-fallback — is what
    // fired. The mis-decoded form is computed via decodeText itself
    // (not hand-guessed), just called directly with the override.
    const bytes = Uint8Array.from(Buffer.from('Größe;age\n', 'utf8'));
    const mojibake = decodeText(bytes, 'latin1').split(/\r?\n/)[0];
    const sources = readExternalNames(o, io({ [p('w.dat')]: bytes }));
    expect(sources[0].names).to.deep.equal([mojibake.split(';')[0], 'age']);
    expect(sources[0].names[0]).to.not.equal('Größe');
  });
});
