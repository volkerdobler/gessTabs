import { expect } from 'chai';
import { macroDefRe, expandDefRe } from '../src/core/regex';

describe('regex factories', () => {
  it('macroDefRe matches "#macro #name("', () => {
    const r = macroDefRe('mymacro');
    expect(r.test('#macro #mymacro(x)')).to.be.true;
    expect(r.test('#macro #othermacro(x)')).to.be.false;
  });

  it('macroDefRe with empty word matches any macro name', () => {
    const r = macroDefRe('');
    expect(r.test('#macro #anything(x)')).to.be.true;
  });

  it('caches regexes for identical inputs', () => {
    expect(macroDefRe('cacheme')).to.equal(macroDefRe('cacheme'));
  });

  it('expandDefRe matches "#expand #name"', () => {
    const r = expandDefRe('foo');
    expect(r.test('#expand #foo')).to.be.true;
    expect(r.test('#expand #bar')).to.be.false;
  });

  it('expandDefRe with empty word matches any #expand name', () => {
    const r = expandDefRe('');
    expect(r.test('#expand #anything')).to.be.true;
  });
});
