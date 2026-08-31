import { expect } from 'chai';
import {
  wordDefRe,
  singleVarDefRe,
  multiVarDefRe,
  multiVarRe,
  computeDefRe,
  macroDefRe,
  macroOwnDefRe,
  expandDefRe,
  expandRe,
  tableHeadRe,
  tableAxisRe,
  usageRe,
} from '../src/regex';

describe('regex factories', () => {
  it('wordDefRe matches exact word and quoted', () => {
    const r = wordDefRe('alpha');
    expect(r.test('alpha')).to.be.true;
    expect(r.test('"alpha"')).to.be.true;
    expect(r.test("'alpha'")).to.be.true;
    expect(r.test('alphabet')).to.be.false;
  });

  it('singleVarDefRe builds case-insensitive regex with var name', () => {
    const r = singleVarDefRe('myVar');
    // Should match pattern like 'variable myVar ='
    expect(r.test('variable myVar = 1')).to.be.true;
    // Should be case-insensitive
    expect(r.test('Variable "myVar" = 1')).to.be.true;
  });

  it('caches regexes for identical inputs', () => {
    expect(wordDefRe('cacheme')).to.equal(wordDefRe('cacheme'));
    expect(singleVarDefRe('cacheme')).to.equal(singleVarDefRe('cacheme'));
  });

  it('multiVarDefRe matches "variables <word> ... ="', () => {
    const r = multiVarDefRe('myVar');
    expect(r.test('variables myVar = 1, 2, 3')).to.be.true;
    expect(r.test('somethingelse myVar = 1')).to.be.false;
  });

  it('multiVarDefRe with empty word matches a variable list before "="', () => {
    const r = multiVarDefRe('');
    expect(r.test('variables a b c = 1')).to.be.true;
    expect(r.test('variables =')).to.be.false;
  });

  it('multiVarRe matches known keywords with a variable name', () => {
    const r = multiVarRe('myVar');
    expect(r.test("labels myVar = 'x'")).to.be.true;
    expect(r.test('title myVar = 1')).to.be.true;
    expect(r.test('unrelated myVar = 1')).to.be.false;
  });

  it('computeDefRe requires an option keyword between the verb and the variable', () => {
    const r = computeDefRe('myVar');
    // The pattern chains two separate `\s+` groups around an optional option
    // keyword (add/alpha/.../autoalign). Because of how the `\b` boundary
    // between them is anchored, a bare "compute myVar" never matches — no
    // amount of whitespace bridges the gap — only an actual option keyword
    // does. This looks unintentional but is the current, tested behavior.
    expect(r.test('compute myVar = 1')).to.be.false;
    expect(r.test('compute   myVar = 1')).to.be.false;
    expect(r.test('compute add myVar = 1')).to.be.true;
    expect(r.test('fcompute add myVar = 2')).to.be.true;
    expect(r.test('weightcells autoalign myVar = 3')).to.be.true;
    expect(r.test('notcompute add myVar = 1')).to.be.false;
  });

  it('macroDefRe matches "#macro #name("', () => {
    const r = macroDefRe('mymacro');
    expect(r.test('#macro #mymacro(x)')).to.be.true;
    expect(r.test('#macro #othermacro(x)')).to.be.false;
  });

  it('macroDefRe with empty word matches any macro name', () => {
    const r = macroDefRe('');
    expect(r.test('#macro #anything(x)')).to.be.true;
  });

  it('macroOwnDefRe matches the makemulti/makeskalavar/skalatab families', () => {
    const r = macroOwnDefRe('foo');
    expect(r.test('#makemulti(foo)')).to.be.true;
    expect(r.test('#makemulti2(foo)')).to.be.true;
    expect(r.test('#makeskalavar(foo)')).to.be.true;
    expect(r.test('#skalatab(foo)')).to.be.true;
    expect(r.test('#somethingelse(foo)')).to.be.false;
  });

  it('macroOwnDefRe with empty word never matches (unmatchable placeholder)', () => {
    const r = macroOwnDefRe('');
    expect(r.test('#makemulti(foo)')).to.be.false;
  });

  it('expandDefRe matches "#expand #name"', () => {
    const r = expandDefRe('foo');
    expect(r.test('#expand #foo')).to.be.true;
    expect(r.test('#expand #bar')).to.be.false;
  });

  it('expandRe matches a bare "#name" reference', () => {
    const r = expandRe('foo');
    expect(r.test('#foo')).to.be.true;
    expect(r.test('#foobar')).to.be.false;
  });

  it('tableHeadRe matches the head side of "table = <word> by ..."', () => {
    const r = tableHeadRe('myVar');
    expect(r.test('table = myVar by group')).to.be.true;
    expect(r.test('table = otherVar by group')).to.be.false;
  });

  it('tableHeadRe with empty word matches any head variable list', () => {
    const r = tableHeadRe('');
    expect(r.test('table = a b by c')).to.be.true;
  });

  it('tableAxisRe matches the axis side of "table = ... by <word>"', () => {
    const r = tableAxisRe('myVar');
    expect(r.test('table = group by myVar')).to.be.true;
    expect(r.test('table = group by otherVar')).to.be.false;
  });

  it('tableAxisRe with empty word matches any axis variable list', () => {
    const r = tableAxisRe('');
    expect(r.test('table = group by a b')).to.be.true;
  });

  it('usageRe matches a bare token occurrence anywhere on the line', () => {
    const r = usageRe('f24');
    expect(r.test('if (not ([1:2] in f24)) then f24 = 2;')).to.be.true;
    expect(r.test('compute add x = f24 + 1;')).to.be.true;
    expect(r.test('(f24)')).to.be.true;
    expect(r.test('f24')).to.be.true;
  });

  it('usageRe is case-insensitive', () => {
    expect(usageRe('f24').test('if (F24 gt 0) then x = 1;')).to.be.true;
  });

  it('usageRe does not match a longer identifier or a qualified/macro name', () => {
    const r = usageRe('f24');
    expect(r.test('if (f240 gt 0) then x = 1;')).to.be.false;
    expect(r.test('if (xf24 gt 0) then x = 1;')).to.be.false;
    expect(r.test('region.f24 = 1;')).to.be.false;
    expect(r.test('#f24(a b)')).to.be.false;
    expect(r.test('&f24')).to.be.false;
  });
});
