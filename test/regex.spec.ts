import { expect } from 'chai';
import { wordDefRe, singleVarDefRe, constTokenVarName } from '../src/regex';

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
});
