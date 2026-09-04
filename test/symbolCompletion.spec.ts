import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { buildWorkspaceIndex } from '../src/core/symbolIndex';
import { buildVariableModel } from '../src/core/variableModel';
import { collectCompletionNames } from '../src/core/symbolCompletion';

const ROOT = path.resolve('/gesstabs-completion-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

const modelOf = (main: string) => {
  const reader: FileReader = (fp) =>
    fp === p('main.tab') ? main.split('\n') : undefined;
  const index = buildWorkspaceIndex([p('main.tab')], reader);
  return buildVariableModel(index);
};

// Only the declared (non-predefined) names, for readability — the model
// always also includes the five system variables (SysMiss, NIL, ...).
const declaredNames = (names: string[]) =>
  names.filter((n) => !/^(sysmiss|nil|system)/i.test(n));

describe('collectCompletionNames', () => {
  it('collects a variable defined on an earlier line', () => {
    const m = modelOf('variable x = 1;\nvariable y = 2;');
    const names = declaredNames(collectCompletionNames(m, p('main.tab'), 2));
    expect(names.sort()).to.deep.equal(['x', 'y']);
  });

  it('excludes a variable defined on or after the cursor line (no forward references)', () => {
    const m = modelOf('variable x = 1;\nvariable y = 2;');
    const names = declaredNames(collectCompletionNames(m, p('main.tab'), 1));
    expect(names).to.deep.equal(['x']);
  });

  it('deduplicates repeated definitions of the same name', () => {
    const m = modelOf('variable x = 1;\ncompute x = x + 1;');
    const names = declaredNames(collectCompletionNames(m, p('main.tab'), 2));
    expect(names).to.deep.equal(['x']);
  });

  it('returns only the always-available predefined names when nothing is defined before the cursor', () => {
    const m = modelOf('variable x = 1;');
    const names = declaredNames(collectCompletionNames(m, p('main.tab'), 0));
    expect(names).to.deep.equal([]);
  });

  it('always includes the predefined system variables', () => {
    const m = modelOf('variable x = 1;');
    const names = collectCompletionNames(m, p('main.tab'), 0);
    expect(names).to.include('sysmiss');
  });

  it('returns each name in its first-seen display casing', () => {
    const m = modelOf('variable MyVar = 1;\ncompute myvar = myvar + 1;');
    const names = collectCompletionNames(m, p('main.tab'), 2);
    expect(names).to.include('MyVar');
    expect(names).to.not.include('myvar');
  });
});
