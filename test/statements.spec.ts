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

  it('a whitespace-only tail after a ; (a blanked trailing comment) does not become the next statement\'s start line', () => {
    // `document = "";` on line 1 ends with a blanked `// comment` tail;
    // lines 2-4 are dropped by the include resolver (comments / #ifdef),
    // so the next line the scanner sees is `spssinfile = ...;` on line 5.
    // The blanked tail must NOT anchor that statement to line 1.
    const out = toLogicalStatements([
      { file: 'a.tab', line: 0, text: 'header = "x";' },
      { file: 'a.tab', line: 1, text: 'document = "";        ' },
      { file: 'a.tab', line: 5, text: 'spssinfile = "d.sav";' },
    ]);
    expect(out.map((s) => s.startLine)).to.deep.equal([0, 1, 5]);
    expect(out[2].text).to.equal('spssinfile = "d.sav";');
  });

  // A column-1 macro/preprocessor call (#name(...), #DOMACRO(...) & co.) is
  // self-terminating at its own balanced ")" and, per the real reported
  // case, must NOT be followed by a ";" — without this, the scan below
  // would swallow every real statement up to the next accidental ";" it
  // finds, corrupting all of them.
  describe('a column-1 macro call ends at its own ")", not the next ";"', () => {
    it('does not swallow the statements that follow it', () => {
      const out = toLogicalStatements(
        lines(
          'a.tab',
          '#makemulti2( f71_16mult f71_m1.16.1 f71_m2.16.1 )\ncompute x = 0;\ntext x = "y";'
        )
      );
      expect(out.map((s) => s.text)).to.deep.equal([
        '#makemulti2( f71_16mult f71_m1.16.1 f71_m2.16.1 )',
        'compute x = 0;',
        'text x = "y";',
      ]);
      expect(out[0].terminated).to.be.true;
    });

    it('leaves a (redundant) trailing ";" as its own harmless empty statement', () => {
      // classifyStatement (variableStatements.ts) returns undefined for a
      // lone ";" fragment — every consumer already guards on that, so this
      // extra entry is inert, not a regression.
      const out = toLogicalStatements(
        lines('a.tab', '#mymacro( a b );\ncompute x = 0;')
      );
      expect(out.map((s) => s.text)).to.deep.equal([
        '#mymacro( a b )',
        ';',
        'compute x = 0;',
      ]);
    });

    it('tracks nested parens inside the call', () => {
      const out = toLogicalStatements(
        lines('a.tab', '#mymacro( (a b) c )\ncompute x = 0;')
      );
      expect(out[0].text).to.equal('#mymacro( (a b) c )');
      expect(out[1].text).to.equal('compute x = 0;');
    });

    it('ignores parens inside a quoted argument', () => {
      const out = toLogicalStatements(
        lines('a.tab', '#domacro3( name, "a(b).csv" )\ncompute x = 0;')
      );
      expect(out[0].text).to.equal('#domacro3( name, "a(b).csv" )');
      expect(out[1].text).to.equal('compute x = 0;');
    });

    it('tolerates leading indentation before the "#"', () => {
      const out = toLogicalStatements(
        lines('a.tab', '  #mymacro( a b )\ncompute x = 0;')
      );
      expect(out[0].text).to.equal('#mymacro( a b )');
      expect(out[1].text).to.equal('compute x = 0;');
    });

    it('is a known limitation: a "#name(" sharing a line with a preceding statement is not recognized as column-1', () => {
      // Matches the same "always a column-1 construct" convention the
      // macro hover/expansion engine already assumes (macroExpansion.ts's
      // own callStartRe) — real gessTabs scripts don't write it this way,
      // so the old "scan for the next ;" behavior still applies here.
      const out = toLogicalStatements(
        lines('a.tab', 'compute a = 1; #mymacro( b )\ncompute c = 2;')
      );
      expect(out.map((s) => s.text)).to.deep.equal([
        'compute a = 1;',
        '#mymacro( b )\ncompute c = 2;',
      ]);
    });
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
