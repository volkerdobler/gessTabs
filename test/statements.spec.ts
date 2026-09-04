import { expect } from 'chai';
import { ResolvedLine } from '../src/core/includeGraph';
import {
  toLogicalStatements,
  locateInStatement,
  findLogicalStatement,
} from '../src/core/statements';

const lines = (file: string, text: string): ResolvedLine[] =>
  text.split('\n').map((t, i) => ({ file, line: i, text: t }));

describe('toLogicalStatements', () => {
  it('joins a statement that spans several lines into one', () => {
    const out = toLogicalStatements(
      lines('a.tab', 'groups g =\n | "x" : v eq 1\n | "y" : v eq 2 ;')
    );
    expect(out).to.have.length(1);
    expect(out[0].text).to.contain('groups g =');
    expect(out[0].text).to.contain('"y"');
    expect(out[0].lines.map((l) => l.line)).to.deep.equal([0, 1, 2]);
    expect(out[0].terminated).to.be.true;
  });

  it('splits several statements sharing one physical line', () => {
    const out = toLogicalStatements(
      lines('a.tab', 'compute a = 1; compute b = 2;')
    );
    expect(out.map((s) => s.text)).to.deep.equal([
      'compute a = 1;',
      'compute b = 2;',
    ]);
  });

  it('does not treat a ; inside a string as a terminator', () => {
    const out = toLogicalStatements(
      lines('a.tab', 'valuelabels v = 1 "a; b" 2 "c";')
    );
    expect(out).to.have.length(1);
    expect(out[0].text).to.contain('"a; b"');
  });

  it('flushes an unterminated statement at a file boundary as not terminated', () => {
    const out = toLogicalStatements([
      { file: 'a.tab', line: 0, text: 'compute a =' },
      { file: 'b.tab', line: 0, text: 'variable b = 1;' },
    ]);
    expect(out).to.have.length(2);
    expect(out[0].terminated).to.be.false;
    expect(out[1].terminated).to.be.true;
  });

  it('records the starting file and line', () => {
    const out = toLogicalStatements(lines('a.tab', 'x;\ny;'));
    expect(out[0]).to.include({ file: 'a.tab', startLine: 0 });
    expect(out[1]).to.include({ file: 'a.tab', startLine: 1 });
  });
});

describe('findLogicalStatement', () => {
  it('finds the statement touching a given (file, line)', () => {
    const stmts = toLogicalStatements(
      lines('a.tab', 'compute a = 1;\ngroups g =\n | "x" : a eq 1;')
    );
    expect(findLogicalStatement(stmts, 'a.tab', 0)?.text).to.contain(
      'compute a'
    );
    expect(findLogicalStatement(stmts, 'a.tab', 2)?.text).to.contain(
      'groups g'
    );
    expect(findLogicalStatement(stmts, 'a.tab', 99)).to.be.undefined;
  });
});

describe('locateInStatement', () => {
  it('accounts for leading whitespace trimmed off the first line', () => {
    const stmts = toLogicalStatements(lines('a.tab', '    compute x = 1;'));
    const stmt = stmts[0];
    // offset 0 in the trimmed text ("compute…") is really column 4
    const loc = locateInStatement(stmt, 0);
    expect(loc.line.line).to.equal(0);
    expect(loc.character).to.equal(4);
  });

  it('is exact on a later line of a multi-line statement', () => {
    const stmts = toLogicalStatements(
      lines('a.tab', '  groups g =\n   | "x" : v eq 1;')
    );
    const stmt = stmts[0];
    const vOffset = stmt.text.indexOf('v eq');
    const loc = locateInStatement(stmt, vOffset);
    expect(loc.line.line).to.equal(1);
    expect(loc.character).to.equal('   | "x" : '.length);
  });
});
