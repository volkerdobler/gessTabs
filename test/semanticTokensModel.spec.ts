import { expect } from 'chai';
import { Scope } from '../src/core/scope';
import {
  collectModelSemanticTokens,
  SemanticToken,
} from '../src/core/semanticTokens';

// A minimal document-like object — Scope only needs lineCount + lineAt,
// the same shape includeGraph.ts's own makeScopeDoc uses. Avoid importing
// the real 'vscode' module in tests (unresolvable outside the Extension
// Host), matching scope.spec.ts's own convention.
function scopeOf(lines: string[]): Scope {
  const doc = {
    lineCount: lines.length,
    lineAt: (n: number) => ({ text: lines[n] }),
  };
  return new Scope(doc as ConstructorParameters<typeof Scope>[0]);
}

function tokensOf(lines: string[]): SemanticToken[] {
  return collectModelSemanticTokens(lines, scopeOf(lines));
}

const varTokens = (tokens: SemanticToken[]) =>
  tokens.filter((t) => t.type === 'variable');

describe('collectModelSemanticTokens', () => {
  it('tags a single-variable definition', () => {
    const tokens = tokensOf(['variable x = 1;']);
    expect(varTokens(tokens)).to.deep.equal([
      { line: 0, startChar: 9, length: 1, type: 'variable' },
    ]);
  });

  it('tags COMPUTE without a sub-keyword — the regex layer never covered this', () => {
    const tokens = tokensOf(['compute umsatz = preis * menge;']);
    expect(varTokens(tokens).map((t) => t.length)).to.deep.equal([6]);
  });

  it('tags EVERY name in a multi-target VARIABLES declaration, not just the last', () => {
    const tokens = tokensOf(['variables a b c = 1;']);
    const names = varTokens(tokens).map((t) => t.startChar);
    expect(names).to.deep.equal([10, 12, 14]);
  });

  it('tags EVERY name in a multi-target COMPUTE (a b c = 0)', () => {
    const tokens = tokensOf(['compute a b c = 0;']);
    expect(varTokens(tokens)).to.have.length(3);
  });

  it('tags EVERY name in a VARTITLE varlist', () => {
    const tokens = tokensOf(['vartitle a b c = "Titel";']);
    expect(varTokens(tokens)).to.have.length(3);
  });

  it('tags EVERY name in a multi-variable TABLE head and axis', () => {
    const tokens = tokensOf(['table = a b by c d;']);
    expect(varTokens(tokens)).to.have.length(4);
  });

  it('tags a WEIGHTCELLS reference', () => {
    const tokens = tokensOf(['weightcells gewicht = 1 : 50%;']);
    expect(varTokens(tokens).map((t) => t.length)).to.deep.equal([7]);
  });

  it('tags a FILTER varlist but not its condition (ifKnown, not always)', () => {
    const tokens = tokensOf(['filter west = region eq 1;']);
    expect(varTokens(tokens)).to.have.length(1);
  });

  it('tags an OVERCODE virtual name', () => {
    const tokens = tokensOf(['overcode ost 1 2 "Ost";']);
    expect(varTokens(tokens).map((t) => t.length)).to.deep.equal([3]);
  });

  it('does not tag anything inside a block comment', () => {
    const tokens = tokensOf(['{ variable x = 1; }']);
    expect(varTokens(tokens)).to.be.empty;
  });

  it('does not tag a plain COMPUTE expression operand (still curated, not exhaustive)', () => {
    const tokens = tokensOf(['compute z = a + b;']);
    // only the declared target "z", not the operands a/b
    expect(varTokens(tokens)).to.have.length(1);
  });

  it('positions the token correctly on an indented statement', () => {
    const tokens = tokensOf(['    variable x = 1;']);
    expect(varTokens(tokens)).to.deep.equal([
      { line: 0, startChar: 13, length: 1, type: 'variable' },
    ]);
  });

  it('still tags #MACRO / macro-call names (unrelated to the variable model)', () => {
    const tokens = tokensOf(['#macro #example( &p )', '#example( 1 )']);
    const macroTokens = tokens.filter((t) => t.type === 'macro');
    expect(macroTokens).to.have.length(2);
  });
});
