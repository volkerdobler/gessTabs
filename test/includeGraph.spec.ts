import { expect } from 'chai';
import * as path from 'path';
import { resolveIncludeGraph, FileReader } from '../src/includeGraph';
import { findMacroDefinitions } from '../src/macroExpansion';

// Paths are derived through path.resolve/path.join (not hardcoded literal
// strings) so they match what the module's own path.resolve/path.dirname
// calls produce, regardless of OS path conventions.
const ROOT = path.resolve('/gesstabs-test-root');
const p = (...segments: string[]) => path.join(ROOT, ...segments);

function makeReader(files: Record<string, string>): FileReader {
  return (filePath: string) => {
    const text = files[filePath];
    return text === undefined ? undefined : text.split('\n');
  };
}

function texts(result: { order: { text: string }[] }): string[] {
  return result.order.map((l) => l.text);
}

describe('resolveIncludeGraph', () => {
  it('returns just the entry file lines when there are no includes', () => {
    const reader = makeReader({
      [p('main.tab')]: 'variable a = 1;\nvariable b = 2;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;', 'variable b = 2;']);
    expect(result.files).to.deep.equal([p('main.tab')]);
    expect(result.errors).to.deep.equal([]);
  });

  it('splices an included file in at the INCLUDE line, in place', () => {
    const reader = makeReader({
      [p('main.tab')]: 'variable a = 1;\nINCLUDE = child.inc;\nvariable c = 3;',
      [p('child.inc')]: 'variable b = 2;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal([
      'variable a = 1;',
      'variable b = 2;',
      'variable c = 3;',
    ]);
    expect(result.files).to.deep.equal([p('main.tab'), p('child.inc')]);
  });

  it('resolves INCLUDE paths relative to the including file, not the entry file', () => {
    const reader = makeReader({
      [p('main.tab')]: 'INCLUDE = sub/child.inc;',
      [p('sub', 'child.inc')]: 'variable x = 1;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable x = 1;']);
  });

  it('supports multiple sibling includes in one file', () => {
    const reader = makeReader({
      [p('main.tab')]: 'INCLUDE = a.inc;\nINCLUDE = b.inc;',
      [p('a.inc')]: 'variable a = 1;',
      [p('b.inc')]: 'variable b = 2;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;', 'variable b = 2;']);
  });

  it('supports nested includes (INCLUDE inside an INCLUDE-file)', () => {
    const reader = makeReader({
      [p('main.tab')]: 'INCLUDE = a.inc;',
      [p('a.inc')]: 'INCLUDE = b.inc;',
      [p('b.inc')]: 'variable deep = 1;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable deep = 1;']);
    expect(result.files).to.deep.equal([p('main.tab'), p('a.inc'), p('b.inc')]);
  });

  it('accepts an unquoted or quoted INCLUDE filename', () => {
    const reader = makeReader({
      [p('main.tab')]: 'INCLUDE = "a.inc";\nINCLUDE = b.inc;',
      [p('a.inc')]: 'variable a = 1;',
      [p('b.inc')]: 'variable b = 2;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;', 'variable b = 2;']);
  });

  it('reports and skips a missing include file without crashing', () => {
    const reader = makeReader({
      [p('main.tab')]:
        'variable a = 1;\nINCLUDE = missing.inc;\nvariable c = 3;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;', 'variable c = 3;']);
    expect(result.errors).to.have.length(1);
    expect(result.errors[0].kind).to.equal('include-not-found');
  });

  it('detects a direct include cycle without hanging', () => {
    const reader = makeReader({
      [p('main.tab')]: 'INCLUDE = a.inc;',
      [p('a.inc')]: 'variable a = 1;\nINCLUDE = b.inc;',
      [p('b.inc')]: 'variable b = 1;\nINCLUDE = a.inc;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;', 'variable b = 1;']);
    expect(result.errors).to.have.length(1);
    expect(result.errors[0].kind).to.equal('include-cycle');
  });

  it('detects a self-include without hanging', () => {
    const reader = makeReader({
      [p('main.tab')]: 'variable a = 1;\nINCLUDE = main.tab;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable a = 1;']);
    expect(result.errors).to.have.length(1);
    expect(result.errors[0].kind).to.equal('include-cycle');
  });

  it('stops recursing and reports once maxDepth is exceeded', () => {
    const files: Record<string, string> = {};
    const depth = 25;
    for (let i = 0; i < depth; i++) {
      files[p(`f${i}.inc`)] = `variable v${i} = 1;\nINCLUDE = f${i + 1}.inc;`;
    }
    files[p(`f${depth}.inc`)] = `variable v${depth} = 1;`;

    const result = resolveIncludeGraph(p('f0.inc'), makeReader(files), {
      maxDepth: 5,
    });
    expect(result.errors.some((e) => e.kind === 'max-depth-exceeded')).to.be
      .true;
    // only the first few levels (0..5) should have been visited
    expect(result.files.length).to.be.lessThan(depth);
  });

  it('respects #ifdef / #else / #end', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '#ifdef a4\nvariable landscape = 1;\n#else\nvariable portrait = 1;\n#end',
    });
    const withoutDefine = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(withoutDefine)).to.deep.equal(['variable portrait = 1;']);

    const withDefine = resolveIncludeGraph(p('main.tab'), reader, {
      externalDefines: ['a4'],
    });
    expect(texts(withDefine)).to.deep.equal(['variable landscape = 1;']);
  });

  it('respects #ifndef', () => {
    const reader = makeReader({
      [p('main.tab')]: '#ifndef ascii\nvariable ps = 1;\n#end',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal(['variable ps = 1;']);

    const withDefine = resolveIncludeGraph(p('main.tab'), reader, {
      externalDefines: ['ascii'],
    });
    expect(texts(withDefine)).to.deep.equal([]);
  });

  it('supports #ifdef [ a b c ] as OR', () => {
    const reader = makeReader({
      [p('main.tab')]: '#ifdef [ def1 def2 def3 ]\ncompute xx = 1;\n#end',
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([]);
    expect(
      texts(
        resolveIncludeGraph(p('main.tab'), reader, {
          externalDefines: ['def2'],
        })
      )
    ).to.deep.equal(['compute xx = 1;']);
  });

  it('supports nested #ifdef as AND', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '#ifdef a4\n#ifdef quer\nvariable a4quer = 1;\n#end\n#end',
    });
    expect(
      texts(
        resolveIncludeGraph(p('main.tab'), reader, { externalDefines: ['a4'] })
      )
    ).to.deep.equal([]);
    expect(
      texts(
        resolveIncludeGraph(p('main.tab'), reader, {
          externalDefines: ['a4', 'quer'],
        })
      )
    ).to.deep.equal(['variable a4quer = 1;']);
  });

  it('honors #define / #undefine occurring in program order', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '#define xyz\n#ifdef xyz\nvariable a = 1;\n#end\n#undefine xyz\n#ifdef xyz\nvariable b = 1;\n#end',
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
      'variable a = 1;',
    ]);
  });

  it('treats #define/#ifdef names as case-sensitive by default', () => {
    const reader = makeReader({
      [p('main.tab')]: '#define xyz\n#ifdef XYZ\nvariable a = 1;\n#end',
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([]);
  });

  it('honors #ignorecase = yes; for subsequent comparisons', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '#define xyz\n#ignorecase = yes;\n#ifdef XYZ\nvariable a = 1;\n#end',
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
      'variable a = 1;',
    ]);
  });

  it('ignores INCLUDE/#define/#ifdef text that appears inside a comment or string', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '// INCLUDE = fake.inc;\n{ #define fakedef }\nvariable a = "#ifdef also not real";\nvariable b = 1;',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal([
      'variable a = "#ifdef also not real";',
      'variable b = 1;',
    ]);
    expect(result.files).to.deep.equal([p('main.tab')]);
  });

  it('blanks out a trailing line-comment on an otherwise-real line, rather than including it verbatim', () => {
    const line =
      'variable a = 1; // old version used #macro #foo( &x ) #endmacro here';
    const reader = makeReader({ [p('main.tab')]: line });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(result.order).to.have.length(1);
    // the comment is blanked (spaces), not removed, so offsets/length
    // within the line stay aligned with the real document
    expect(result.order[0].text.trimEnd()).to.equal('variable a = 1;');
    expect(result.order[0].text.length).to.equal(line.length);
  });

  it('blanks out a multi-line block comment that starts mid-line, without excluding the real code before it', () => {
    const lines = [
      'variable a = 1; { old:',
      '#macro #foo( &x )',
      '#endmacro',
      '}',
      'variable b = 2;',
    ];
    const reader = makeReader({ [p('main.tab')]: lines.join('\n') });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result).map((t) => t.trimEnd())).to.deep.equal([
      'variable a = 1;',
      'variable b = 2;',
    ]);
    expect(result.order[0].text.length).to.equal(lines[0].length);
  });

  it('an old macro version commented out with an unbalanced #MACRO/#ENDMACRO count does not break a later real macro (end-to-end with findMacroDefinitions)', () => {
    const reader = makeReader({
      [p('main.tab')]: [
        '{ old approach, kept for reference:',
        '#macro #scorecard( &oldparam )',
        'compute x = 1;',
        '}',
        '#macro #scorecard( &chapter &text &filter &complet )',
        'chaptertitle = "&chapter";',
        '#endmacro',
      ].join('\n'),
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    const defs = findMacroDefinitions(result.order);
    expect(defs).to.have.length(1);
    expect(defs[0].params).to.deep.equal([
      'chapter',
      'text',
      'filter',
      'complet',
    ]);
  });

  it('does not exclude content inside #ifempty/#ifexist branches (unevaluated, conservatively active)', () => {
    const reader = makeReader({
      [p('main.tab')]:
        '#ifempty "&2"\nvariable optional = 1;\n#end\n#ifexist somevar\nvariable other = 1;\n#end',
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal([
      'variable optional = 1;',
      'variable other = 1;',
    ]);
  });

  it('handles a single-line #ifnempty … #else … #end without leaking a frame', () => {
    // The inline #END must close the inline #IFNEMPTY, so the enclosing
    // #ifdef block still ends where its own #end says — otherwise every
    // line after it (a later #MACRO definition, say) is wrongly treated
    // as still inside #ifdef PowerChart and dropped when it's not set.
    const reader = makeReader({
      [p('main.tab')]: [
        '#ifdef PowerChart',
        'position = | rows #ifnempty "&rows" &rows #else 1:99 #end',
        '#end // #ifdef PowerChart',
        '#macro #fillSlide68left ( &sp1 &zeilen "&var" "&text" )',
        'x;',
        '#endmacro',
      ].join('\n'),
    });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(texts(result)).to.deep.equal([
      '#macro #fillSlide68left ( &sp1 &zeilen "&var" "&text" )',
      'x;',
      '#endmacro',
    ]);
    expect(
      findMacroDefinitions(
        result.order.map((rl) => ({
          file: rl.file,
          line: rl.line,
          text: rl.text,
        }))
      ).map((d) => d.name)
    ).to.include('fillSlide68left');
  });

  it('handles a single-line #ifdef … #end and pairs two closers on one line', () => {
    const reader = makeReader({
      [p('main.tab')]: [
        '#ifdef A x-inside #end',
        'after;',
        '#ifdef A',
        '#ifdef B',
        'deep;',
        '#end #end',
        'tail;',
      ].join('\n'),
    });
    // A/B undefined: the single-line block is inactive, everything else
    // (which is at file scope) stays.
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
      'after;',
      'tail;',
    ]);
  });

  it('ignores a directive keyword inside a string or trailing comment', () => {
    const reader = makeReader({
      [p('main.tab')]: [
        'title = "chapter #end of section";',
        '#end // stray #ifdef note',
        'variable a = 1;',
      ].join('\n'),
    });
    // The string #end and the comment #ifdef are not directives; the bare
    // #end on line 2 is a real (unmatched) closer that pops an empty
    // stack — harmless here — and line 3 stays active.
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
      'title = "chapter #end of section";',
      'variable a = 1;',
    ]);
  });
});
