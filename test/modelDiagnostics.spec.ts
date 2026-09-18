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

  it('does not flag the <vartype> keyword in "IF <var> IS <vartype> THEN …" as undefined (regression)', () => {
    const idx = indexOf('singleq v1 = 1;\nif v1 is multiq then x = 1;');
    const model = buildVariableModel(idx);
    const issues = checkUndefinedVariables(model, p('main.tab'));
    expect(issues.some((i) => i.message.includes('multiq'))).to.be.false;
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
    // Points at the second call ('#x( b )', line index 4) — the one whose
    // expansion actually collides — not at the shared #MACRO body line.
    expect(issues[0]).to.deep.include({
      line: 4,
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

  it('does not flag when every call passes a distinct value for the target-defining parameter', () => {
    // The reported false-positive shape: SINGLEQ &fr = …; — the declared
    // name *is* the macro's own parameter, substituted per call. As long
    // as every call's argument differs, each expansion declares a
    // different name and there is no real collision.
    const idx = indexOf(
      [
        '#macro #x( &fr &3 )',
        'singleq &fr = ;',
        'compute &fr = SYSMISS;',
        '#endmacro',
        '#x( "f1" "1 eq 1" )',
        '#x( "f2" "1 eq 1" )',
        '#x( "f3" "1 eq 1" )',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });

  it('points at the specific colliding call when just some calls share an argument, without claiming "always" or suggesting parameterization that already exists', () => {
    const idx = indexOf(
      [
        '#macro #x( &fr &3 )',
        'singleq &fr = ;',
        '#endmacro',
        '#x( "f1" "1 eq 1" )', // line 3 — first to declare "f1"
        '#x( "f2" "1 eq 1" )', // line 4 — unrelated, declares "f2"
        '#x( "f1" "1 eq 1" )', // line 5 — collides with line 3
      ].join('\n')
    );
    const issues = checkMacroDuplicateVariableDefinition(idx, p('main.tab'));
    expect(issues).to.have.length(1);
    // Points at the actual colliding call (the second "f1" one), not the
    // #MACRO body line, and not the unrelated "f2" call in between.
    expect(issues[0]).to.deep.include({
      line: 5,
      code: 'macro-duplicate-variable-definition',
    });
    expect(issues[0].message).to.include('f1');
    expect(issues[0].message).to.include('line 4'); // 1-based: the earlier "f1" call at (0-based) line 3
    expect(issues[0].message).to.include('exact same arguments');
    expect(issues[0].message).to.not.include('always declares');
    expect(issues[0].message).to.not.include("macro's own parameters");
  });

  it('explains a collision between calls with different arguments without claiming they were identical', () => {
    const idx = indexOf(
      [
        '#macro #x( &fr &3 )',
        'singleq &fr = ;',
        '#endmacro',
        '#x( "f1" "1 eq 1" )', // line 3 — first "f1"
        '#x( "f1" "2 eq 2" )', // line 4 — same &fr, different &3 — still collides
        '#x( "f2" "1 eq 1" )', // line 5 — a third, differing call: proves the
        // name does normally vary (rules out the "neverVaries" / "always" case)
      ].join('\n')
    );
    const issues = checkMacroDuplicateVariableDefinition(idx, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 4 });
    expect(issues[0].message).to.include('f1');
    expect(issues[0].message).to.not.include('exact same arguments');
    expect(issues[0].message).to.not.include('always declares');
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

  it('reports at the colliding call site, even when the #MACRO itself is defined in a different (INCLUDEd) file', () => {
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
    // The two calls live in main.tab, so that's where the collision is
    // findable/fixable — not macros.inc, which only has the shared body.
    const issues = checkMacroDuplicateVariableDefinition(idx, p('main.tab'));
    expect(issues).to.have.length(1);
    expect(issues[0]).to.deep.include({ line: 2 }); // '#x( b )', the second call
    expect(
      checkMacroDuplicateVariableDefinition(idx, p('macros.inc'))
    ).to.be.empty;
  });

  it('does not flag two calls in mutually exclusive #ifdef / #else arms of the same conditional', () => {
    // Only one arm ever actually compiles on a real build, so the two
    // calls' declarations can never coexist — no real "declared twice".
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixedname = | "x" : v eq 1;',
        '#endmacro',
        '#ifdef switch',
        '#x( a )',
        '#else',
        '#x( b )',
        '#end',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });

  it('still flags two calls inside the same #ifdef arm', () => {
    // Both calls run together whenever "switch" is defined, so this is a
    // real collision, unlike the mutually-exclusive #else case above.
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixedname = | "x" : v eq 1;',
        '#endmacro',
        '#ifdef switch',
        '#x( a )',
        '#x( b )',
        '#end',
      ].join('\n')
    );
    expect(
      checkMacroDuplicateVariableDefinition(idx, p('main.tab'))
    ).to.have.length(1);
  });

  it('still flags a conditional call colliding with an unconditional one', () => {
    // Whenever "switch" is defined, both calls run: the #ifdef arm's and
    // the unconditional one after #end — a real collision on that build.
    const idx = indexOf(
      [
        '#macro #x( &z )',
        'groups fixedname = | "x" : v eq 1;',
        '#endmacro',
        '#ifdef switch',
        '#x( a )',
        '#end',
        '#x( b )',
      ].join('\n')
    );
    expect(
      checkMacroDuplicateVariableDefinition(idx, p('main.tab'))
    ).to.have.length(1);
  });

  it('does not flag mutually exclusive #ifdef / #else calls even when only some (parameterized) calls would otherwise collide', () => {
    // Same shape as the reported false positive (SINGLEQ &fr = …;), but
    // with the colliding pair split across #ifdef/#else — still no crash.
    const idx = indexOf(
      [
        '#macro #x( &fr &3 )',
        'singleq &fr = ;',
        '#endmacro',
        '#ifdef switch',
        '#x( "f1" "1 eq 1" )',
        '#else',
        '#x( "f1" "1 eq 1" )',
        '#end',
      ].join('\n')
    );
    expect(checkMacroDuplicateVariableDefinition(idx, p('main.tab'))).to.be
      .empty;
  });
});
