import { expect } from 'chai';
import { findVariableAnnotations, collectStatement } from '../src/core/variableInfo';
import { ResolvedLine } from '../src/core/includeGraph';

function order(lines: string[], file = '/main.tab'): ResolvedLine[] {
  return lines.map((text, i) => ({ file, line: i, text }));
}

describe('findVariableAnnotations', () => {
  it('finds VARTITLE/VARTEXT/VALUELABELS lines naming the variable', () => {
    const lines = order([
      'singleq f24 = 1 to 5;',
      'vartitle f24 = "Age group";',
      'vartext f24 = "How old are you?";',
      'valuelabels f24 = 1 "18-29" 2 "30-44";',
      'vartitle f25 = "Something else";',
    ]);
    const result = findVariableAnnotations(lines, 'f24');
    expect(result.map((a) => a.kind)).to.deep.equal([
      'vartitle',
      'vartext',
      'valuelabels',
    ]);
    expect(result.map((a) => a.line)).to.deep.equal([1, 2, 3]);
    expect(result[0].statement).to.equal('vartitle f24 = "Age group";');
    expect(result[0].file).to.equal('/main.tab');
  });

  it('gathers a multi-line VALUELABELS statement through its terminating ;', () => {
    const lines = order([
      'valuelabels f1 = 1 "eins"',
      '  2 "zwei"',
      '  3 "drei";',
      'vartitle f2 = "next";',
    ]);
    const result = findVariableAnnotations(lines, 'f1');
    expect(result).to.have.length(1);
    expect(result[0].statement).to.equal(
      'valuelabels f1 = 1 "eins"\n  2 "zwei"\n  3 "drei";'
    );
  });

  it('recognizes the bare TITLE/TEXT/LABELS synonyms', () => {
    const lines = order([
      'title f1 = "T";',
      'text f1 = "X";',
      'labels f1 = 1 "a";',
    ]);
    const result = findVariableAnnotations(lines, 'f1');
    expect(result.map((a) => a.kind)).to.deep.equal([
      'vartitle',
      'vartext',
      'valuelabels',
    ]);
  });

  it('matches a quoted variable name and a name in a multi-variable list', () => {
    const lines = order([
      'vartitle "my var" = "T";',
      'vartext f1 f2 f3 = "shared";',
    ]);
    expect(findVariableAnnotations(lines, 'my var')).to.have.length(1);
    expect(findVariableAnnotations(lines, 'f2')).to.have.length(1);
  });

  it('does not match a longer identifier or a label-text occurrence', () => {
    const lines = order([
      'vartitle f240 = "other";',
      'vartitle f1 = "mentions f24 in the text";',
    ]);
    expect(findVariableAnnotations(lines, 'f24')).to.have.length(0);
  });

  it('honours the isNotInComment callback', () => {
    const lines = order(['vartitle f1 = "T";']);
    expect(findVariableAnnotations(lines, 'f1', () => false)).to.have.length(0);
  });

  it('ignores an empty-varlist annotation (no variable named)', () => {
    const lines = order(['vartitle = "binds to last variable";']);
    expect(findVariableAnnotations(lines, 'f1')).to.have.length(0);
  });
});

describe('collectStatement', () => {
  it('joins lines from the start through the first ;', () => {
    const lines = order(['a = 1', 'b = 2;', 'c = 3;']);
    expect(collectStatement(lines, '/main.tab', 0)).to.equal('a = 1\nb = 2;');
  });

  it('stops at a file boundary even without a ;', () => {
    const lines = [
      ...order(['valuelabels x = 1 "a"'], '/a.inc'),
      ...order(['vartitle y = "z";'], '/b.inc'),
    ];
    expect(collectStatement(lines, '/a.inc', 0)).to.equal(
      'valuelabels x = 1 "a"'
    );
  });

  it('returns "" for a start line not in the order', () => {
    expect(collectStatement(order(['a;']), '/main.tab', 9)).to.equal('');
  });
});
