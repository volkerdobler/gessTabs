import { expect } from 'chai';
import * as path from 'path';
import { FileReader } from '../src/core/includeGraph';
import { buildWorkspaceIndex } from '../src/core/symbolIndex';
import { ExternalNameSource } from '../src/core/externalNames';
import { buildVariableModel } from '../src/core/variableModel';
import {
  checkUndefinedVariables,
  checkSystemVariableRedeclaration,
  checkDuplicateDeclarations,
  checkMacroDuplicateVariableDefinition,
} from '../src/core/modelDiagnostics';

const ROOT = path.resolve('/gesstabs-modeldiag-test');
const p = (...s: string[]) => path.join(ROOT, ...s);

const indexOf = (main: string, files: Record<string, string> = {}) => {
  const all = { [p('main.tab')]: main, ...files };
  const reader: FileReader = (fp) =>
    all[fp] === undefined ? undefined : all[fp].split('\n');
  return buildWorkspaceIndex(Object.keys(all), reader, {
    conditionalsAllActive: true,
  });
};

const externalSource = (
  names: string[] | 'unresolved',
  overrides: Partial<ExternalNameSource['statement']> = {}
): ExternalNameSource => ({
  statement: {
    kind: 'csv',
    file: p('main.tab'),
    line: 0,
    rawPath: 'data.csv',
    text: 'csvinfile = data.csv;',
    ...overrides,
  },
  names,
});

describe('checkUndefinedVariables', () => {
  it('does not flag a reference to a name declared in-script', () => {
    const idx = indexOf('singleq alter = 1;\ncompute y = alter + 1;');
    const model = buildVariableModel(idx);
    expect(checkUndefinedVariables(model, p('main.tab'))).to.be.empty;
  });

  it('flags a bare reference to a name declared nowhere', () => {
    const idx = indexOf('compute y = alter + 1;');
    const model = buildVariableModel(idx);
    const issues = checkUndefinedVariables(model, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      severity: 'warning',
      code: 'undefined-variable',
    });
    expect(issues[0].message).to.include('alter');
  });

  it('does not flag a name only known via an external (raw dataset) source, once passed', () => {
    const idx = indexOf('compute y = alter + 1;');
    const model = buildVariableModel(idx, {
      externalNames: [externalSource(['alter'])],
    });
    expect(checkUndefinedVariables(model, p('main.tab'))).to.be.empty;
  });

  it('does not flag a name only known via a macro-produced definition, once opted in', () => {
    const idx = indexOf(
      [
        '#macro #x( &fr )',
        'compute &fr = 2;',
        '#endmacro',
        '#x( alter )',
        'table t = #k by alter;',
      ].join('\n')
    );
    const model = buildVariableModel(idx, { macroExpansion: true });
    expect(checkUndefinedVariables(model, p('main.tab'))).to.be.empty;
  });

  it('still flags an undefined name even with externalNames/macroExpansion passed', () => {
    const idx = indexOf('compute y = totallyUnknownVar + 1;');
    const model = buildVariableModel(idx, {
      externalNames: [externalSource(['alter'])],
      macroExpansion: true,
    });
    const issues = checkUndefinedVariables(model, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0].message).to.include('totallyUnknownVar');
  });

  it("does not flag a quoted token that never resolves — label text, not a reference (the manual's quoted-token rule)", () => {
    const idx = indexOf('compute y = "just some text";');
    const model = buildVariableModel(idx);
    expect(checkUndefinedVariables(model, p('main.tab'))).to.be.empty;
  });

  it('an unresolved quoted operand is left alone even outside COMPUTE — an IF condition reference is ifKnown too', () => {
    // condition references are collected as 'ifKnown' throughout the
    // classifier (see collectExprRefs call sites) — this just confirms
    // the same quoted-token leniency applies there, not only in COMPUTE.
    const idx = indexOf('if "nichtvorhanden" eq 1 then x = 1;');
    const model = buildVariableModel(idx);
    expect(checkUndefinedVariables(model, p('main.tab'))).to.be.empty;
  });

  it('flags a bare (unquoted) IF condition operand that resolves nowhere — ifKnown mode still flags a non-quoted miss', () => {
    const idx = indexOf('if unknownCond eq 1 then x = 1;');
    const model = buildVariableModel(idx);
    const issues = checkUndefinedVariables(model, p('main.tab'));
    expect(issues.some((i) => i.message.includes('unknownCond'))).to.be.true;
  });

  it('honours no-forward-reference: a reference before the declaration is still undefined at that point', () => {
    const idx = indexOf('compute early = late;\nsingleq late = 1;');
    const model = buildVariableModel(idx);
    const issues = checkUndefinedVariables(model, p('main.tab'));
    expect(issues.some((i) => i.message.includes('late'))).to.be.true;
  });

  it('only reports issues for the requested file', () => {
    const idx = indexOf('include = vars.inc;\ncompute y = unknownVar;', {
      [p('vars.inc')]: 'compute z = alsoUnknown;',
    });
    const model = buildVariableModel(idx);
    const mainIssues = checkUndefinedVariables(model, p('main.tab'));
    const incIssues = checkUndefinedVariables(model, p('vars.inc'));
    expect(mainIssues.some((i) => i.message.includes('unknownVar'))).to.be.true;
    expect(mainIssues.some((i) => i.message.includes('alsoUnknown'))).to.be
      .false;
    expect(incIssues.some((i) => i.message.includes('alsoUnknown'))).to.be.true;
  });
});

describe('checkSystemVariableRedeclaration', () => {
  it('flags a real declaration of a predefined system variable', () => {
    const idx = indexOf('singleq SysMiss = 1;');
    const model = buildVariableModel(idx);
    const issues = checkSystemVariableRedeclaration(model, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      severity: 'error',
      code: 'system-variable-redeclaration',
    });
    expect(issues[0].message).to.include('SysMiss');
  });

  it('is case-insensitive', () => {
    const idx = indexOf('singleq sysmiss = 1;');
    const model = buildVariableModel(idx);
    expect(
      checkSystemVariableRedeclaration(model, p('main.tab'))
    ).to.have.length(1);
  });

  it('does not flag a mere reference/use of a system variable', () => {
    const idx = indexOf('compute x = SysMiss;');
    const model = buildVariableModel(idx);
    expect(checkSystemVariableRedeclaration(model, p('main.tab'))).to.be.empty;
  });

  it('also flags a COMPUTE target (§3.3: an assignment auto-creates a variable exactly like a declaration does)', () => {
    // regression: the manual says "generieren" (generate), not
    // "deklarieren" — COMPUTE generates a variable exactly as much as
    // SINGLEQ does, so this must be flagged too. Reported: real-world
    // `compute sysmiss = 1;` slipped through while `singleq sysmiss = 1;`
    // was caught.
    const idx = indexOf('compute SysMiss = 1;');
    const model = buildVariableModel(idx);
    expect(
      checkSystemVariableRedeclaration(model, p('main.tab'))
    ).to.have.length(1);
  });

  it('also flags an IF…THEN target naming a system variable', () => {
    const idx = indexOf('if x eq 1 then SysMiss = 2;');
    const model = buildVariableModel(idx);
    expect(
      checkSystemVariableRedeclaration(model, p('main.tab'))
    ).to.have.length(1);
  });

  it('does not flag a system variable used only as an IF condition (a reference, not a defines target)', () => {
    const idx = indexOf('if SysMiss eq 1 then x = 2;');
    const model = buildVariableModel(idx);
    expect(checkSystemVariableRedeclaration(model, p('main.tab'))).to.be.empty;
  });

  it('does not flag a normal variable declaration', () => {
    const idx = indexOf('singleq alter = 1;');
    const model = buildVariableModel(idx);
    expect(checkSystemVariableRedeclaration(model, p('main.tab'))).to.be.empty;
  });
});

describe('checkDuplicateDeclarations', () => {
  it('flags a variable declared twice', () => {
    const idx = indexOf('variable x = 1;\nvariable x = 2;');
    const model = buildVariableModel(idx);
    const issues = checkDuplicateDeclarations(model, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'duplicate-declaration',
    });
  });

  it('does not flag a VARTITLE re-mentioning an existing variable', () => {
    const idx = indexOf('variable x = 1;\nvartitle x = "Title";');
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.be.empty;
  });

  it('does not flag a WEIGHTCELLS re-mentioning an existing variable', () => {
    const idx = indexOf(
      [
        'singleq geschl = 1;',
        'weightcells geschl = 1:48% 2:52%;',
        'weightcells autoalign geschl = 1:48% 2:52%;',
      ].join('\n')
    );
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.be.empty;
  });

  it('is case-insensitive', () => {
    const idx = indexOf('variable X = 1;\nvariable x = 2;');
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.have.length(1);
  });

  it('does not flag COMPUTE ADD re-assigning an existing variable — legal, not a duplicate declaration (§9 Q3)', () => {
    const idx = indexOf('compute add x = 1;\ncompute add x = 2;');
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.be.empty;
  });

  it('does not flag a plain COMPUTE (no sub-keyword) re-assignment either', () => {
    const idx = indexOf('compute x = 1;\ncompute x = 2;');
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.be.empty;
  });

  it('does not flag an IF-THEN re-assignment of an already-declared variable', () => {
    const idx = indexOf('singleq x = 1;\nif x eq 1 then x = 2;');
    const model = buildVariableModel(idx);
    expect(checkDuplicateDeclarations(model, p('main.tab'))).to.be.empty;
  });

  it('flags a VARFAMILY declared twice — a declaration form the old regex pass never covered', () => {
    const idx = indexOf('varfamily f = a b c;\nvarfamily f = d e;');
    const model = buildVariableModel(idx);
    const issues = checkDuplicateDeclarations(model, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'duplicate-declaration',
    });
  });

  it('flags a same-file duplicate inside an INCLUDEd (non-entry) file', () => {
    const idx = indexOf('include = vars.inc;\nvariable y = 1;', {
      [p('vars.inc')]: 'variable x = 1;\nvariable x = 2;',
    });
    const model = buildVariableModel(idx);
    const issues = checkDuplicateDeclarations(model, p('vars.inc'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'duplicate-declaration',
    });
    expect(issues[0].message).to.include('line 1');
    expect(issues[0].message).not.to.include('vars.inc');
  });

  it('flags a duplicate whose first declaration lives in a different (INCLUDEd) file, naming that file', () => {
    const idx = indexOf('include = vars.inc;\nvariable x = 2;', {
      [p('vars.inc')]: 'variable x = 1;',
    });
    const model = buildVariableModel(idx);
    const mainIssues = checkDuplicateDeclarations(model, p('main.tab'));
    expect(mainIssues).to.have.length(1);
    expect(mainIssues[0].message).to.include('vars.inc:line 1');
    // The INCLUDEd file itself has no duplicate on its own side.
    expect(checkDuplicateDeclarations(model, p('vars.inc'))).to.be.empty;
  });
});

describe('checkMacroDuplicateVariableDefinition', () => {
  it('flags a fixed-name GROUPS declared inside a macro called more than once', () => {
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixedname = | "x" : v eq 1;',
        '#endmacro',
        '#x( a )',
        '#x( b )',
      ].join('\n')
    );
    const issues = checkMacroDuplicateVariableDefinition(idx, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({
      line: 1,
      code: 'macro-duplicate-variable-definition',
    });
    expect(issues[0].message).to.include('fixedname');
    expect(issues[0].message).to.include('#x');
  });

  it('flags a fixed-name (bare) COMPUTE declared inside a macro called more than once', () => {
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'compute fixedname = 1;',
        '#endmacro',
        '#x( a )',
        '#x( b )',
      ].join('\n')
    );
    expect(
      checkMacroDuplicateVariableDefinition(idx, p('main.tab'))
    ).to.have.length(1);
  });

  it('does not flag when the defined name depends on one of the macro parameters', () => {
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixed_&z = | "x" : v eq 1;',
        '#endmacro',
        '#x( a )',
        '#x( b )',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });

  it('does not flag a macro that is only called once', () => {
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixedname = | "x" : v eq 1;',
        '#endmacro',
        '#x( a )',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });

  it('does not flag an IF…THEN target inside the macro body, even with a fixed name', () => {
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'if v eq 1 then fixedname = 2;',
        '#endmacro',
        '#x( a )',
        '#x( b )',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });

  it('only reports for the file the macro is defined in', () => {
    const idx = indexOf(
      ['include = macros.inc;', '#x( a )', '#x( b )'].join('\n'),
      {
        [p('macros.inc')]: [
          '#macro #x( &z )',
          'groups fixedname = | "x" : v eq 1;',
          '#endmacro',
        ].join('\n'),
      }
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
    expect(
      checkMacroDuplicateVariableDefinition(idx, p('macros.inc'))
    ).to.have.length(1);
  });
});
