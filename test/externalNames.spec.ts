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
  ExternalNamesIO,
} from '../src/core/externalNames';

const ROOT = path.resolve('/ext-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

function order(file: string, lines: string[]): ResolvedLine[] {
  return lines.map((text, i) => ({ file, line: i, text }));
}

function io(files: Record<string, Uint8Array | string>): ExternalNamesIO {
  return {
    readBytes(absPath: string) {
      const f = files[absPath];
      if (f === undefined) return undefined;
      return typeof f === 'string'
        ? Uint8Array.from(Buffer.from(f, 'utf8'))
        : f;
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

  it('marks a column-fixed DATAFILE (no ; or ,) unresolved', () => {
    const st = findDataSourceStatements(
      order(p('main.tab'), ['DATAFILE = fixed.dat;'])
    );
    const [s] = resolveExternalNames(
      st,
      io({ [p('fixed.dat')]: '0001JOHN    0034\n0002JANE    0029\n' })
    );
    expect(s.names).to.equal('unresolved');
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
});
