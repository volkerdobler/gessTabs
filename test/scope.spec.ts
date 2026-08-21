import { expect } from 'chai';
import { Scope, ScopeEnum } from '../src/scope';

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
const Uri = { file: (s: string) => ({ fsPath: s }) };

function makeDoc(text: string): any {
  const lines = text.split('\n');
  return {
    uri: Uri.file('test'),
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
      "var x = 1\n{ this is comment }\nname = 'a string'\n// rest comment",
    );
    const s = new Scope(doc as any);
    expect(s.isNormalScope(0, 0)).to.be.true;
    expect(s.isCommentScope(1, 0)).to.be.true;
    expect(s.isStringScope(2, 12)).to.be.true;
    expect(s.isCommentScope(3, 0)).to.be.true;
  });
});
