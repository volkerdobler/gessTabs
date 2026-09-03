// Minimal SPSS system-file (.sav) dictionary reader: variable NAMES and
// TYPE only, from the front-of-file dictionary records. Never touches the
// case data. See docs/variable-model-design.md §11.4.
//
// Deliberately not read in v1 (see §11.7): value-label sets (record type
// 3/4), variable labels, measurement level (extension subtype 11).
//
// The dictionary is uncompressed in both plain ($FL2) and ZSAV ($FL3)
// files — only the case data differs — so both magics are handled.
//
// Format reference: the GNU PSPP "System File Format" chapter (the public
// description of the otherwise-undocumented SPSS format).

import { TextDecoder } from 'util';

export type SavVarType = 'numeric' | 'string';

export type SavDictionaryResult =
  | {
      kind: 'ok';
      names: string[];
      types: Record<string, SavVarType>; // keyed by lower-cased name
      encoding?: string;
    }
  | { kind: 'error'; reason: string };

const HEADER_SIZE = 176;
const MAX_RECORDS = 100000;

class Cursor {
  constructor(
    private readonly view: DataView,
    public offset: number,
    private readonly le: boolean
  ) {}

  get remaining(): number {
    return this.view.byteLength - this.offset;
  }

  i32(): number {
    const v = this.view.getInt32(this.offset, this.le);
    this.offset += 4;
    return v;
  }

  u8(): number {
    const v = this.view.getUint8(this.offset);
    this.offset += 1;
    return v;
  }

  bytes(n: number): Uint8Array {
    const start = this.view.byteOffset + this.offset;
    const out = new Uint8Array(this.view.buffer, start, n);
    this.offset += n;
    return out;
  }

  skip(n: number): void {
    this.offset += n;
  }
}

function roundUp(n: number, multiple: number): number {
  return Math.ceil(n / multiple) * multiple;
}

// Names/labels: try UTF-8, fall back to Windows-1252. SPSS short names are
// ASCII; long names (extension subtype 13) are UTF-8 in modern files.
function decode(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

function magicOf(bytes: Uint8Array): string {
  return String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
}

export function readSavDictionary(bytes: Uint8Array): SavDictionaryResult {
  if (bytes.length < HEADER_SIZE + 8) {
    return { kind: 'error', reason: 'Datei zu klein für ein SPSS-Systemfile' };
  }
  const magic = magicOf(bytes);
  if (magic !== '$FL2' && magic !== '$FL3') {
    return {
      kind: 'error',
      reason: `keine SPSS-.sav-Datei (Signatur "${magic}")`,
    };
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // layout_code (offset 64) is 2 or 3; if it only reads sane as big-endian,
  // the whole file is big-endian.
  let le = true;
  const layoutLE = view.getInt32(64, true);
  if (layoutLE !== 2 && layoutLE !== 3) {
    const layoutBE = view.getInt32(64, false);
    if (layoutBE === 2 || layoutBE === 3) {
      le = false;
    } else {
      return {
        kind: 'error',
        reason: 'SPSS-Header nicht lesbar (layout code)',
      };
    }
  }

  const cur = new Cursor(view, HEADER_SIZE, le);

  const names: string[] = [];
  const types: Record<string, SavVarType> = {};
  let longNameMap: string | undefined;
  let encoding: string | undefined;

  try {
    for (let r = 0; r < MAX_RECORDS; r += 1) {
      if (cur.remaining < 4) break;
      const recType = cur.i32();

      if (recType === 999) {
        cur.i32(); // filler
        break;
      }

      if (recType === 2) {
        const varType = cur.i32();
        const hasLabel = cur.i32();
        const nMissing = cur.i32();
        cur.i32(); // print format
        cur.i32(); // write format
        const nameBytes = cur.bytes(8);

        if (hasLabel === 1) {
          const labelLen = cur.i32();
          cur.skip(roundUp(labelLen, 4));
        }
        if (nMissing !== 0) {
          cur.skip(Math.abs(nMissing) * 8);
        }

        // varType === -1 is a continuation segment of a long string var —
        // not its own variable.
        if (varType === -1) continue;

        const decoded = decode(nameBytes);
        const cut = decoded.indexOf(String.fromCharCode(0));
        const name = (cut === -1 ? decoded : decoded.slice(0, cut)).trim();
        if (!name) continue;
        names.push(name);
        types[name.toLowerCase()] = varType === 0 ? 'numeric' : 'string';
        continue;
      }

      if (recType === 3) {
        const count = cur.i32();
        for (let i = 0; i < count; i += 1) {
          cur.skip(8); // value (double)
          const len = cur.u8();
          cur.skip(roundUp(len + 1, 8) - 1);
        }
        continue;
      }

      if (recType === 4) {
        const varCount = cur.i32();
        cur.skip(varCount * 4);
        continue;
      }

      if (recType === 6) {
        const nLines = cur.i32();
        cur.skip(nLines * 80);
        continue;
      }

      if (recType === 7) {
        const subtype = cur.i32();
        const size = cur.i32();
        const count = cur.i32();
        const total = size * count;
        if (subtype === 13) {
          longNameMap = decode(cur.bytes(total));
        } else if (subtype === 20) {
          encoding = decode(cur.bytes(total)).trim() || undefined;
        } else {
          cur.skip(total);
        }
        continue;
      }

      return {
        kind: 'error',
        reason: `unbekannter SPSS-Record-Typ ${recType}`,
      };
    }
  } catch (e) {
    return {
      kind: 'error',
      reason: `SPSS-Dictionary unerwartet zu Ende (${(e as Error).message})`,
    };
  }

  if (names.length === 0) {
    return {
      kind: 'error',
      reason: 'keine Variablen im SPSS-Dictionary gefunden',
    };
  }

  // Replace short names with their real (case-preserving, up to 64-char)
  // form from the long-name map — "SHORT=Long\tSHORT=Long\t...".
  if (longNameMap) {
    const longByShort = new Map<string, string>();
    longNameMap.split('\t').forEach((entry) => {
      const eq = entry.indexOf('=');
      if (eq > 0) {
        longByShort.set(
          entry.slice(0, eq).trim().toLowerCase(),
          entry.slice(eq + 1).trim()
        );
      }
    });
    for (let i = 0; i < names.length; i += 1) {
      const long = longByShort.get(names[i].toLowerCase());
      if (long) {
        const type = types[names[i].toLowerCase()];
        delete types[names[i].toLowerCase()];
        names[i] = long;
        types[long.toLowerCase()] = type;
      }
    }
  }

  return { kind: 'ok', names, types, encoding };
}
