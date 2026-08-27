import { expect } from 'chai';
import { collectSemanticTokens, SemanticToken } from '../src/semanticTokens';

const alwaysCode = () => true;

function tokenOn(tokens: SemanticToken[], line: number) {
  return tokens.filter((t) => t.line === line);
}

describe('collectSemanticTokens', () => {
  it('tags a single-variable definition name as "variable"', () => {
    const tokens = collectSemanticTokens(['variable x = 1;'], alwaysCode);
    expect(tokens).to.deep.equal([
      { line: 0, startChar: 9, length: 1, type: 'variable' },
    ]);
  });

  it('tags a compute definition name as "variable"', () => {
    const tokens = collectSemanticTokens(
      ['compute add myVar = 1;'],
      alwaysCode
    );
    expect(tokens).to.deep.equal([
      { line: 0, startChar: 12, length: 5, type: 'variable' },
    ]);
  });

  it('tags a #MACRO definition name as "macro" (excluding the leading #)', () => {
    const tokens = collectSemanticTokens(
      ['#macro #example( &parameter )'],
      alwaysCode
    );
    expect(tokenOn(tokens, 0)).to.deep.equal([
      { line: 0, startChar: 8, length: 7, type: 'macro' },
    ]);
  });

  it('tags a macro call site as "macro"', () => {
    const tokens = collectSemanticTokens(['#example( 1 2 )'], alwaysCode);
    expect(tokens).to.deep.equal([
      { line: 0, startChar: 1, length: 7, type: 'macro' },
    ]);
  });

  it('tags a bare #EXPAND-shaped reference as "macro", alongside the variable it is used in', () => {
    const tokens = collectSemanticTokens(
      ['compute x = #myvalue + 1;'],
      alwaysCode
    );
    expect(tokens.sort((a, b) => a.startChar - b.startChar)).to.deep.equal([
      { line: 0, startChar: 8, length: 1, type: 'variable' },
      { line: 0, startChar: 13, length: 7, type: 'macro' },
    ]);
  });

  it('does not tag a reserved directive keyword as "macro"', () => {
    const tokens = collectSemanticTokens(
      ['#ifdef FOO', 'variable x = 1;', '#end'],
      alwaysCode
    );
    expect(tokenOn(tokens, 0)).to.be.empty;
    expect(tokenOn(tokens, 2)).to.be.empty;
  });

  it('does not double-tag a macro call name via the bare-#name scan', () => {
    const tokens = collectSemanticTokens(['#example( 1 )'], alwaysCode);
    expect(tokens).to.have.length(1);
  });

  it('only tags the last name of a multi-name list (documented limitation)', () => {
    const tokens = collectSemanticTokens(['variables a b c = 1;'], alwaysCode);
    expect(tokens).to.deep.equal([
      { line: 0, startChar: 14, length: 1, type: 'variable' },
    ]);
  });

  it('tags a single-name TABLE head and axis', () => {
    const tokens = collectSemanticTokens(['table = f1 by f2;'], alwaysCode);
    expect(tokens.sort((a, b) => a.startChar - b.startChar)).to.deep.equal([
      { line: 0, startChar: 8, length: 2, type: 'variable' },
      { line: 0, startChar: 14, length: 2, type: 'variable' },
    ]);
  });

  it('does not tag anything inside a comment', () => {
    const isNotInComment = () => false;
    const tokens = collectSemanticTokens(
      ['// variable x = 1; #example( 1 )'],
      isNotInComment
    );
    expect(tokens).to.be.empty;
  });

  it('returns nothing for a blank line', () => {
    expect(collectSemanticTokens([''], alwaysCode)).to.be.empty;
  });
});
