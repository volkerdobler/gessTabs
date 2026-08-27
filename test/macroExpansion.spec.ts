import { expect } from 'chai';
import {
  findMacroDefinitions,
  findMacroCalls,
  buildMacroIndex,
  expandMacro,
  expandLines,
  findParamReferenceAt,
  findExpandDefinitions,
  findHashNameAt,
  isReservedDirectiveKeyword,
  MacroSourceLine,
} from '../src/macroExpansion';

function src(text: string, file = '/main.tab'): MacroSourceLine[] {
  return text.split('\n').map((t, i) => ({ file, line: i, text: t }));
}

describe('findMacroDefinitions', () => {
  it('parses a single-parameter macro (handbook #example)', () => {
    const lines = src(
      '#macro #example( &parameter )\ncompute  &parameter = 1;\n#endmacro'
    );
    const defs = findMacroDefinitions(lines);
    expect(defs).to.have.length(1);
    expect(defs[0].name).to.equal('example');
    expect(defs[0].params).to.deep.equal(['parameter']);
    expect(defs[0].body).to.deep.equal(['compute  &parameter = 1;']);
    expect(defs[0].defLine).to.equal(0);
    expect(defs[0].endLine).to.equal(2);
  });

  it('parses a multi-line, multi-statement macro body (handbook #mitOC)', () => {
    const lines = src(
      [
        '#macro #mitOC( &varname )',
        'compute    &varname_OC  = &varname;',
        'copytext   &varname_OC  = &varname;',
        '#endmacro',
      ].join('\n')
    );
    const defs = findMacroDefinitions(lines);
    expect(defs[0].name).to.equal('mitOC');
    expect(defs[0].body).to.deep.equal([
      'compute    &varname_OC  = &varname;',
      'copytext   &varname_OC  = &varname;',
    ]);
  });

  it('parses multiple parameters', () => {
    const lines = src(
      '#macro #call( &index &namepart &macroname )\nsomething\n#endmacro'
    );
    expect(findMacroDefinitions(lines)[0].params).to.deep.equal([
      'index',
      'namepart',
      'macroname',
    ]);
  });

  it('accepts #macroend as a closing keyword', () => {
    const lines = src('#macro #x( &a )\nvariable &a = 1;\n#macroend');
    const defs = findMacroDefinitions(lines);
    expect(defs).to.have.length(1);
    expect(defs[0].body).to.deep.equal(['variable &a = 1;']);
  });

  it('parses multiple sibling macro definitions', () => {
    const lines = src(
      [
        '#macro #a( &x )',
        'table = #k1 by &x;',
        '#endmacro',
        '#macro #b( &x )',
        'table = #k2 by &x;',
        '#endmacro',
      ].join('\n')
    );
    const defs = findMacroDefinitions(lines);
    expect(defs.map((d) => d.name)).to.deep.equal(['a', 'b']);
  });

  it('does not let an unclosed #MACRO in one file swallow a later, real definition in a different file', () => {
    const brokenFile = src(
      '#macro #broken( &x )\ncompute &x = 1;\n// missing #endmacro',
      '/a.inc'
    );
    const goodFile = src(
      '#macro #scorecard( &chapter )\ncompute x = 1;\n#endmacro',
      '/b.inc'
    );
    const defs = findMacroDefinitions([...brokenFile, ...goodFile]);
    expect(defs.map((d) => d.name)).to.deep.equal(['scorecard']);
  });

  it('does not let an implausibly long unclosed #MACRO swallow later definitions in the same file', () => {
    const brokenBody = Array.from(
      { length: 305 },
      (_, i) => `compute x${i} = 1;`
    );
    const lines = src(
      [
        '#macro #broken( &x )',
        ...brokenBody,
        '#macro #scorecard( &chapter )',
        'compute x = 1;',
        '#endmacro',
      ].join('\n')
    );
    const defs = findMacroDefinitions(lines);
    expect(defs.map((d) => d.name)).to.deep.equal(['scorecard']);
  });
});

describe('findMacroCalls', () => {
  it('finds a plain call', () => {
    const calls = findMacroCalls('#example( frage1 )');
    expect(calls).to.have.length(1);
    expect(calls[0].name).to.equal('example');
    expect(calls[0].args).to.deep.equal(['frage1']);
  });

  it('does not mistake the macro definition line for a call', () => {
    expect(findMacroCalls('#macro #example( &parameter )')).to.deep.equal([]);
  });

  it('only recognizes a call starting in column 1 (leading whitespace allowed)', () => {
    expect(findMacroCalls('  #example( frage1 )')).to.have.length(1);
    expect(findMacroCalls('x = 1; #example( frage1 )')).to.deep.equal([]);
  });

  it('finds at most one call per line — anything after it is not a second call', () => {
    // "#b(2)" here is an #EXPAND reference per gessTabs' own rule (a
    // macro call must start in column 1), not a second macro call.
    const calls = findMacroCalls('#a(1) #b(2)');
    expect(calls.map((c) => c.name)).to.deep.equal(['a']);
  });

  it('finds the real closing paren when a quoted argument contains its own parentheses', () => {
    const line = '#scorecard ( "Total" "" "(1 eq 1)")';
    const calls = findMacroCalls(line);
    expect(calls).to.have.length(1);
    expect(calls[0].name).to.equal('scorecard');
    expect(calls[0].raw).to.equal(line);
    // quotes are a grouping device only — not part of the token value
    expect(calls[0].args).to.deep.equal(['Total', '', '(1 eq 1)']);
  });

  it('keeps a quoted argument as one token (without its quotes) even though it contains a space', () => {
    const calls = findMacroCalls('#f( "weiblich" "Weiblich" "(1 in s1)")');
    expect(calls[0].args).to.deep.equal(['weiblich', 'Weiblich', '(1 in s1)']);
  });

  it('accepts an unquoted token exactly as typed', () => {
    const calls = findMacroCalls('#f( Kinder weiblich 2 )');
    expect(calls[0].args).to.deep.equal(['Kinder', 'weiblich', '2']);
  });

  it('handles nested unquoted parentheses in an argument', () => {
    const calls = findMacroCalls('#f( ((1 eq 1) or (2 eq 2)) )');
    expect(calls[0].raw).to.equal('#f( ((1 eq 1) or (2 eq 2)) )');
  });
});

describe('expandMacro', () => {
  it('expands a call whose quoted filter argument contains parentheses, without the quotes', () => {
    const defs = findMacroDefinitions(
      src(
        [
          '#macro #scorecard( &title &subtitle &filter )',
          'compute x = 1; // &title &subtitle &filter',
          '#endmacro',
        ].join('\n')
      )
    );
    const index = buildMacroIndex(defs);
    const call = findMacroCalls('#scorecard ( "Total" "" "(1 eq 1)")')[0];
    const expanded = expandMacro(defs[0], call.args, index);
    // "" (an intentional empty &subtitle) contributes nothing, leaving
    // the template's own separating spaces around it — that's correct,
    // matching plain positional token substitution.
    expect(expanded).to.deep.equal(['compute x = 1; // Total  (1 eq 1)']);
  });

  it('substitutes a single parameter (handbook #example)', () => {
    const defs = findMacroDefinitions(
      src('#macro #example( &parameter )\ncompute  &parameter = 1;\n#endmacro')
    );
    const index = buildMacroIndex(defs);
    const expanded = expandMacro(defs[0], ['frage1'], index);
    expect(expanded).to.deep.equal(['compute  frage1 = 1;']);
  });

  it('substitutes a parameter that is immediately followed by a literal suffix (handbook #mitOC)', () => {
    const defs = findMacroDefinitions(
      src(
        [
          '#macro #mitOC( &varname )',
          'compute    &varname_OC  = &varname;',
          '#endmacro',
        ].join('\n')
      )
    );
    const index = buildMacroIndex(defs);
    const expanded = expandMacro(defs[0], ['F1'], index);
    expect(expanded).to.deep.equal(['compute    F1_OC  = F1;']);
  });

  it('recursively expands a nested call to another known macro', () => {
    const defs = findMacroDefinitions(
      src(
        [
          '#macro #typ_a( &var )',
          'table = #k1 by &var;',
          '#endmacro',
          '#macro #outer( &v )',
          '#typ_a( &v )',
          '#endmacro',
        ].join('\n')
      )
    );
    const index = buildMacroIndex(defs);
    const outer = defs.find((d) => d.name === 'outer')!;
    const expanded = expandMacro(outer, ['F1'], index);
    expect(expanded).to.deep.equal(['table = #k1 by F1;']);
  });

  it('does not expand a call to an unknown macro (leaves it as-is)', () => {
    const defs = findMacroDefinitions(
      src('#macro #a( &x )\n#unknownmacro( &x )\n#endmacro')
    );
    const index = buildMacroIndex(defs);
    const expanded = expandMacro(defs[0], ['1'], index);
    expect(expanded).to.deep.equal(['#unknownmacro( 1 )']);
  });

  it('does not infinite-loop on a self-recursive macro (depth-capped)', () => {
    const defs = findMacroDefinitions(
      src('#macro #loop( &x )\n#loop( &x )\n#endmacro')
    );
    const index = buildMacroIndex(defs);
    expect(() => expandMacro(defs[0], ['1'], index, 5)).to.not.throw();
  });

  it('matches macro names case-insensitively', () => {
    const defs = findMacroDefinitions(
      src('#macro #Example( &p )\ncompute &p = 1;\n#endmacro')
    );
    const index = buildMacroIndex(defs);
    expect(index.get('example')).to.exist;
  });
});

describe('expandLines', () => {
  it('preserves blank lines and comment-only lines verbatim, substituting params in both', () => {
    const index = buildMacroIndex([]);
    const rawBody = [
      '',
      '// uses &varname below',
      'compute &varname = 1;',
      '',
    ];
    const expanded = expandLines(rawBody, ['varname'], ['F1'], index);
    expect(expanded).to.deep.equal([
      '',
      '// uses F1 below',
      'compute F1 = 1;',
      '',
    ]);
  });

  it('is what expandMacro uses under the hood for a filtered body', () => {
    const defs = findMacroDefinitions(
      src('#macro #example( &parameter )\ncompute  &parameter = 1;\n#endmacro')
    );
    const index = buildMacroIndex(defs);
    const viaExpandMacro = expandMacro(defs[0], ['frage1'], index);
    const viaExpandLines = expandLines(
      defs[0].body,
      defs[0].params,
      ['frage1'],
      index
    );
    expect(viaExpandLines).to.deep.equal(viaExpandMacro);
  });
});

describe('isReservedDirectiveKeyword', () => {
  it('recognizes every documented preprocessor/macro-engine keyword', () => {
    [
      'define',
      'domacro',
      'domacro2',
      'domacro3',
      'domacro4',
      'else',
      'end',
      'endmacro',
      'expand',
      'expandinc',
      'expandindomacro',
      'expandintoken',
      'ifdef',
      'ifempty',
      'ifexist',
      'ifndef',
      'ifnempty',
      'ifnexists',
      'ignorecase',
      'macro',
      'macroend',
      'undefine',
    ].forEach((name) => {
      expect(isReservedDirectiveKeyword(name), name).to.be.true;
    });
  });

  it('is case-insensitive', () => {
    expect(isReservedDirectiveKeyword('ENDMACRO')).to.be.true;
    expect(isReservedDirectiveKeyword('EndMacro')).to.be.true;
  });

  it('does not flag an ordinary macro/expand name', () => {
    expect(isReservedDirectiveKeyword('scorecard')).to.be.false;
    expect(isReservedDirectiveKeyword('mitOC')).to.be.false;
  });
});

describe('findParamReferenceAt', () => {
  const lines = src(
    [
      '#macro #mitOC( &varname )',
      'compute &varname_OC = &varname;',
      '#endmacro',
    ].join('\n')
  );
  const defs = findMacroDefinitions(lines);

  it('resolves a &param reference inside the macro body to its definition', () => {
    const bodyLine = 'compute &varname_OC = &varname;';
    const charIndex = bodyLine.indexOf('&varname;') + 1; // inside the second &varname
    const ref = findParamReferenceAt(bodyLine, charIndex, defs, 1);
    expect(ref?.paramName).to.equal('varname');
    expect(ref?.def.name).to.equal('mitOC');
  });

  it('resolves a &param reference even when immediately followed by a literal suffix', () => {
    const bodyLine = 'compute &varname_OC = &varname;';
    const charIndex = bodyLine.indexOf('&varname_OC') + 1;
    const ref = findParamReferenceAt(bodyLine, charIndex, defs, 1);
    expect(ref?.paramName).to.equal('varname');
  });

  it('returns undefined outside any macro body', () => {
    expect(findParamReferenceAt('&varname', 1, defs, 10)).to.be.undefined;
  });

  it('returns undefined for a &token that is not a real parameter', () => {
    const ref = findParamReferenceAt('&notaparam', 1, defs, 1);
    expect(ref).to.be.undefined;
  });

  it('returns undefined when the cursor is not on a &token at all', () => {
    expect(findParamReferenceAt('compute x = 1;', 3, defs, 1)).to.be.undefined;
  });
});

describe('findExpandDefinitions', () => {
  it('parses "#expand #name value" and captures the rest of the line as the value', () => {
    const defs = findExpandDefinitions(
      src('#expand #land germany\nvariable a = 1;')
    );
    expect(defs.get('land')).to.equal('germany');
  });

  it('captures a multi-word value up to end of line', () => {
    const defs = findExpandDefinitions(src('#expand #greeting hello world'));
    expect(defs.get('greeting')).to.equal('hello world');
  });

  it('is case-sensitive on the name, unlike macro names', () => {
    const defs = findExpandDefinitions(src('#expand #Land germany'));
    expect(defs.get('Land')).to.equal('germany');
    expect(defs.get('land')).to.be.undefined;
  });

  it('does not match #expandinc/#expandintoken as a plain #expand definition', () => {
    const defs = findExpandDefinitions(
      src('#expandinc #counter 1\n#expandintoken #x foo')
    );
    expect(defs.size).to.equal(0);
  });
});

describe('findHashNameAt', () => {
  it('finds a bare "#name" token at the given position', () => {
    expect(findHashNameAt('DATAFILE = study_xyz#land.dat;', 22)).to.equal(
      'land'
    );
  });

  it('returns undefined when the cursor is not on a #token', () => {
    expect(findHashNameAt('variable a = 1;', 3)).to.be.undefined;
  });
});
