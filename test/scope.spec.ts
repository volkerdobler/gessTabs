import { expect } from 'chai';
import { Scope, getCachedScope, clearScopeCache } from '../src/core/scope';

// Minimal runtime mocks for VS Code types used in Scope
class Position {
  public line: number;

  public character: number;

  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;
  }
}
class Range {
  public start: Position;

  public end: Position;

  constructor(start: Position, end: Position) {
    this.start = start;
    this.end = end;
  }
}
const Uri = {
  file: (s: string) => ({ fsPath: s, toString: () => `file://${s}` }),
};

function makeDoc(text: string, uriPath = 'test', version = 1): any {
  const lines = text.split('\n');
  return {
    uri: Uri.file(uriPath),
    version,
    lineCount: lines.length,
    lineAt: (n: number) => ({
      text: lines[n],
      range: new Range(new Position(n, 0), new Position(n, lines[n].length)),
    }),
  };
}

describe('Scope', () => {
  it('detects comments and strings', () => {
    const doc = makeDoc(
      "var x = 1\n{ this is comment }\nname = 'a string'\n// rest comment"
    );
    const s = new Scope(doc as any);
    expect(s.isNormalScope(0, 0)).to.be.true;
    expect(s.isCommentScope(1, 0)).to.be.true;
    expect(s.isStringScope(2, 12)).to.be.true;
    expect(s.isCommentScope(3, 0)).to.be.true;
  });

  it('does not support nested block comments: the first "}" closes the comment', () => {
    const line = '{ a { b } c }';
    const doc = makeDoc(line);
    const s = new Scope(doc as any);

    expect(s.isCommentScope(0, 0)).to.be.true; // opening '{'
    expect(s.isCommentScope(0, line.indexOf('a'))).to.be.true;
    // the inner '{' is plain comment text, not a new nested comment start
    expect(s.isCommentScope(0, line.indexOf('{', 1))).to.be.true;
    const firstClose = line.indexOf('}');
    expect(s.isCommentScope(0, firstClose)).to.be.true; // closes the comment here
    expect(s.isNormalScope(0, firstClose + 1)).to.be.true; // back to normal right after
    expect(s.isNormalScope(0, line.indexOf('c'))).to.be.true;
    // the trailing, now-unmatched '}' is inert normal text
    expect(s.isNormalScope(0, line.lastIndexOf('}'))).to.be.true;
  });

  it('tracks a string across multiple lines until the closing quote', () => {
    const line0 = "name = 'first line";
    const line1 = "still string' more";
    const doc = makeDoc(`${line0}\n${line1}`);
    const s = new Scope(doc as any);

    const quoteStart = line0.indexOf("'");
    expect(s.isStringScope(0, quoteStart)).to.be.true;
    expect(s.isStringScope(0, line0.length - 1)).to.be.true; // still open at EOL

    expect(s.isStringScope(1, 0)).to.be.true; // scope carries into the next line

    const closingQuote = line1.indexOf("'");
    expect(s.isStringScope(1, closingQuote)).to.be.true;
    expect(s.isNormalScope(1, line1.indexOf('more'))).to.be.true;
  });

  it('handles empty lines without crashing and reports no scope', () => {
    const doc = makeDoc('a\n\nb');
    const s = new Scope(doc as any);
    expect(s.isNormalScope(1, 0)).to.be.false;
    expect(s.isCommentScope(1, 0)).to.be.false;
    expect(s.isStringScope(1, 0)).to.be.false;
  });

  it('isNormalScope (and friends) return false for out-of-range positions instead of throwing', () => {
    const doc = makeDoc('abc');
    const s = new Scope(doc as any);
    expect(() => s.isNormalScope(-1, 0)).to.not.throw();
    expect(s.isNormalScope(-1, 0)).to.be.false; // line before start
    expect(s.isNormalScope(5, 0)).to.be.false; // line past end
    expect(s.isNormalScope(0, -1)).to.be.false; // column before start
    expect(s.isNormalScope(0, 100)).to.be.false; // column past end
    expect(s.isNormalScope(0, 1)).to.be.true; // sanity check: in range
  });
});

describe('getCachedScope / clearScopeCache', () => {
  it('returns the same Scope instance across calls while the document version is unchanged', () => {
    const doc = makeDoc('a', 'doc-a', 1);
    const first = getCachedScope(doc);
    const second = getCachedScope(doc);
    expect(second).to.equal(first);
  });

  it('recomputes once the document version changes', () => {
    const doc = makeDoc('a', 'doc-b', 1);
    const first = getCachedScope(doc);
    const bumped = makeDoc('b', 'doc-b', 2);
    const second = getCachedScope(bumped);
    expect(second).to.not.equal(first);
  });

  it('clearScopeCache(document) forces the next call to recompute even at the same version', () => {
    const doc = makeDoc('a', 'doc-c', 1);
    const first = getCachedScope(doc);
    clearScopeCache(doc);
    const second = getCachedScope(doc);
    expect(second).to.not.equal(first);
  });

  it('clearScopeCache() with no argument clears every cached document', () => {
    const docX = makeDoc('a', 'doc-x', 1);
    const docY = makeDoc('a', 'doc-y', 1);
    const firstX = getCachedScope(docX);
    const firstY = getCachedScope(docY);
    clearScopeCache();
    expect(getCachedScope(docX)).to.not.equal(firstX);
    expect(getCachedScope(docY)).to.not.equal(firstY);
  });

  it('keeps separate cache entries per document (by uri)', () => {
    const docX = makeDoc('a', 'doc-p', 1);
    const docY = makeDoc('a', 'doc-q', 1);
    const scopeX = getCachedScope(docX);
    const scopeY = getCachedScope(docY);
    expect(scopeX).to.not.equal(scopeY);
    // still cached independently
    expect(getCachedScope(docX)).to.equal(scopeX);
    expect(getCachedScope(docY)).to.equal(scopeY);
  });
});
