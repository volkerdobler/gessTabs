import { expect } from 'chai';
import {
  isTableOrOverviewStatement,
  extractElementsValue,
  findEffectiveElements,
} from '../src/tableElements';
import { ResolvedLine } from '../src/includeGraph';

function order(lines: string[], file = '/main.tab'): ResolvedLine[] {
  return lines.map((text, i) => ({ file, line: i, text }));
}

describe('isTableOrOverviewStatement', () => {
  it('recognizes TABLE/TABLE STRUCTURE/TABLE ADD/OVERVIEW/XOVERVIEW', () => {
    [
      'table = f1 by f2;',
      'TABLE STRUCTURE = #k BY dummy_0001;',
      'TABLE ADD = #k BY 1;',
      'OVERVIEW = k BY MEAN(a11);',
      'XOVERVIEW = MEAN(a11) by k;',
    ].forEach((line) => {
      expect(isTableOrOverviewStatement(line), line).to.be.true;
    });
  });

  it('does not match TABLEFORMAT/TABLETITLE/TABLECOUNTSWITCH (different keywords)', () => {
    [
      'TABLEFORMAT = +GLOBALSORT;',
      'TABLETITLE = "Some title";',
      'TABLECOUNTSWITCH = NOADDINFRAMEX;',
    ].forEach((line) => {
      expect(isTableOrOverviewStatement(line), line).to.be.false;
    });
  });

  it('does not match an unrelated statement', () => {
    expect(isTableOrOverviewStatement('CELLELEMENTS = COLUMNPERCENT;')).to.be
      .false;
  });
});

describe('extractElementsValue', () => {
  it('extracts the value of a CELLELEMENTS assignment', () => {
    expect(
      extractElementsValue('CELLELEMENTS = COLUMNPERCENT ABSOLUTE;', 'cellelements')
    ).to.equal('COLUMNPERCENT ABSOLUTE');
  });

  it('extracts the value of a FRAMEELEMENTS assignment', () => {
    expect(
      extractElementsValue('FRAMEELEMENTS = ABSROW TOTALCOLUMN;', 'frameelements')
    ).to.equal('ABSROW TOTALCOLUMN');
  });

  it('returns an empty string for an intentionally empty assignment', () => {
    expect(extractElementsValue('FRAMEELEMENTS =;', 'frameelements')).to.equal(
      ''
    );
  });

  it('does not match the inline per-table CELLELEMENTS( ... ) clause', () => {
    expect(
      extractElementsValue(
        'table = f1 by f2 cellelements( absolute );',
        'cellelements'
      )
    ).to.equal('');
  });
});

describe('findEffectiveElements', () => {
  it('finds the nearest preceding CELLELEMENTS/FRAMEELEMENTS assignment', () => {
    const lines = order([
      'CELLELEMENTS = COLUMNPERCENT;',
      'FRAMEELEMENTS = ABSROW;',
      'TABLETITLE = "t1";',
      'TABLE = f1 by f2;', // line 3
    ]);
    const result = findEffectiveElements(lines, '/main.tab', 3);
    expect(result.cellElements?.text).to.equal('CELLELEMENTS = COLUMNPERCENT;');
    expect(result.frameElements?.text).to.equal('FRAMEELEMENTS = ABSROW;');
  });

  it('uses the most recent assignment, not the first', () => {
    const lines = order([
      'CELLELEMENTS = ABSOLUTE;',
      'TABLE = f1 by f2;',
      'CELLELEMENTS = COLUMNPERCENT;',
      'TABLE = f3 by f4;', // line 3
    ]);
    const result = findEffectiveElements(lines, '/main.tab', 3);
    expect(result.cellElements?.line).to.equal(2);
  });

  it('returns undefined for a setting never assigned', () => {
    const lines = order(['TABLE = f1 by f2;']);
    const result = findEffectiveElements(lines, '/main.tab', 0);
    expect(result.cellElements).to.be.undefined;
    expect(result.frameElements).to.be.undefined;
  });

  it('finds a setting across an INCLUDE boundary (different file, earlier in order)', () => {
    const lines = [
      ...order(['CELLELEMENTS = ABSOLUTE;'], '/options.inc'),
      ...order(['TABLE = f1 by f2;'], '/main.tab'),
    ];
    const result = findEffectiveElements(lines, '/main.tab', 0);
    expect(result.cellElements?.file).to.equal('/options.inc');
  });
});
