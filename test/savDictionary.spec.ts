import { expect } from 'chai';
import { readSavDictionary } from '../src/core/savDictionary';

// Builds a minimal but format-valid little-endian .sav dictionary in memory:
// the 176-byte header, a type-2 record per variable, an optional
// type-7/subtype-13 long-name map, then the 999 terminator. No case data.
interface Var {
  name: string; // <= 8 chars, space-padded to write
  type: number; // 0 numeric, >0 string width
  label?: string;
}

function buildSav(vars: Var[], longNames?: Record<string, string>): Uint8Array {
  const chunks: number[] = [];
  const i32 = (v: number) => {
    const b = Buffer.alloc(4);
    b.writeInt32LE(v, 0);
    chunks.push(...b);
  };
  const ascii = (s: string, len: number) => {
    const b = Buffer.alloc(len, 0x20); // space-padded
    Buffer.from(s, 'latin1').copy(b, 0, 0, Math.min(s.length, len));
    chunks.push(...b);
  };

  // --- 176-byte header ---
  ascii('$FL2', 4);
  ascii('@(#) IBM SPSS STATISTICS', 60);
  i32(2); // layout_code (offset 64)
  i32(vars.length); // nominal_case_size (rough)
  i32(0); // compression
  i32(0); // weight_index
  i32(-1); // ncases
  // bias (float64) + creation_date(9) + creation_time(8) + file_label(64) + pad(3)
  chunks.push(...Buffer.alloc(8));
  ascii('01 Jan 24', 9);
  ascii('00:00:00', 8);
  ascii('', 64);
  chunks.push(0, 0, 0);

  // --- variable records ---
  vars.forEach((v) => {
    i32(2); // rec_type
    i32(v.type);
    i32(v.label ? 1 : 0);
    i32(0); // n_missing
    i32(0); // print
    i32(0); // write
    ascii(v.name, 8);
    if (v.label) {
      i32(v.label.length);
      const padded = Math.ceil(v.label.length / 4) * 4;
      ascii(v.label, padded);
    }
  });

  // --- type 7 / subtype 13: long variable names ---
  if (longNames) {
    const map = Object.entries(longNames)
      .map(([s, l]) => `${s}=${l}`)
      .join('\t');
    i32(7);
    i32(13);
    i32(1); // size
    i32(map.length); // count
    ascii(map, map.length);
  }

  // --- 999 terminator ---
  i32(999);
  i32(0);

  return Uint8Array.from(chunks);
}

describe('readSavDictionary', () => {
  it('reads variable names and types from the type-2 records', () => {
    const sav = buildSav([
      { name: 'AGE', type: 0 },
      { name: 'REGION', type: 0, label: 'Wohnregion' },
      { name: 'OPENTEXT', type: 40 },
    ]);
    const res = readSavDictionary(sav);
    if (res.kind !== 'ok') throw new Error(res.reason);
    expect(res.names).to.deep.equal(['AGE', 'REGION', 'OPENTEXT']);
    expect(res.types).to.deep.equal({
      age: 'numeric',
      region: 'numeric',
      opentext: 'string',
    });
  });

  it('skips string-continuation segments (type -1)', () => {
    const sav = buildSav([
      { name: 'LONGSTR', type: 255 },
      { name: 'LONGSTR0', type: -1 },
      { name: 'LONGSTR1', type: -1 },
      { name: 'AGE', type: 0 },
    ]);
    const res = readSavDictionary(sav);
    if (res.kind !== 'ok') throw new Error(res.reason);
    expect(res.names).to.deep.equal(['LONGSTR', 'AGE']);
  });

  it('replaces short names with the subtype-13 long-name map', () => {
    const sav = buildSav(
      [
        { name: 'AGE', type: 0 },
        { name: 'V2', type: 0 },
      ],
      { AGE: 'AgeInYears', V2: 'HouseholdIncomeMonthly' }
    );
    const res = readSavDictionary(sav);
    if (res.kind !== 'ok') throw new Error(res.reason);
    expect(res.names).to.deep.equal(['AgeInYears', 'HouseholdIncomeMonthly']);
    expect(res.types).to.deep.equal({
      ageinyears: 'numeric',
      householdincomemonthly: 'numeric',
    });
  });

  it('rejects a non-.sav buffer', () => {
    const res = readSavDictionary(
      Uint8Array.from(
        Buffer.from(
          'not a sav file at all, really not, padding padding'.repeat(4)
        )
      )
    );
    expect(res.kind).to.equal('error');
  });

  it('rejects a too-small buffer', () => {
    expect(readSavDictionary(Uint8Array.from([1, 2, 3])).kind).to.equal(
      'error'
    );
  });
});
