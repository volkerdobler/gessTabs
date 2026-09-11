import { expect } from 'chai';
import * as path from 'path';
import {
  resolveIncludeGraph,
  cleanedDocumentOrder,
  FileReader,
} from '../src/core/includeGraph';
import { findMacroDefinitions } from '../src/core/macroExpansion';
import { branchKey, branchPathsCompatible } from '../src/core/branchPaths';
import { toLogicalStatements } from '../src/core/statements';

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

  it('respects #ifdef / #else / #end once the switch is confidently known', () => {
    const ifdefElse =
      '#ifdef a4\nvariable landscape = 1;\n#else\nvariable portrait = 1;\n#end';
    // `#undefine a4` (never preceded by a #define) makes "a4" a known-but-
    // unset switch — same as a real #undefine reported by the maintainer
    // (TODO.md P1) — as opposed to a name never mentioned at all (see the
    // "uncertain" describe block below). A separate reader from the
    // externalDefines case below: an in-script `#undefine a4` would
    // otherwise cancel out that seeded external define (correctly, per
    // real program-order semantics — just not what that assertion means
    // to test).
    const withoutDefine = resolveIncludeGraph(
      p('main.tab'),
      makeReader({ [p('main.tab')]: `#undefine a4\n${ifdefElse}` })
    );
    expect(texts(withoutDefine)).to.deep.equal(['variable portrait = 1;']);

    // externalDefines alone (no in-script mention at all) already counts
    // as "known" — see resolveIncludeGraph's knownSwitchNames.
    const withDefine = resolveIncludeGraph(
      p('main.tab'),
      makeReader({ [p('main.tab')]: ifdefElse }),
      { externalDefines: ['a4'] }
    );
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
    const body = '#ifdef [ def1 def2 def3 ]\ncompute xx = 1;\n#end';
    // Known-but-unset (own reader — see the #ifdef/#else test above for
    // why this can't share a reader with the externalDefines case below).
    const known = makeReader({
      [p(
        'main.tab'
      )]: `#undefine def1\n#undefine def2\n#undefine def3\n${body}`,
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), known))).to.deep.equal([]);

    const reader = makeReader({ [p('main.tab')]: body });
    expect(
      texts(
        resolveIncludeGraph(p('main.tab'), reader, {
          externalDefines: ['def2'],
        })
      )
    ).to.deep.equal(['compute xx = 1;']);
  });

  it('supports nested #ifdef as AND', () => {
    const body = '#ifdef a4\n#ifdef quer\nvariable a4quer = 1;\n#end\n#end';
    // "quer" needs to be known-but-unset here (not just never mentioned)
    // for this to demonstrate AND-ness at all — otherwise the inner
    // #ifdef would be uncertain and include its content regardless of
    // "a4" alone. Own reader: an in-script #undefine would cancel out the
    // externalDefines seed of "quer" in the second assertion below.
    expect(
      texts(
        resolveIncludeGraph(
          p('main.tab'),
          makeReader({ [p('main.tab')]: `#undefine quer\n${body}` }),
          { externalDefines: ['a4'] }
        )
      )
    ).to.deep.equal([]);

    const reader = makeReader({ [p('main.tab')]: body });
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

  it('keeps BOTH arms of #ifempty/#ifexist when they have an #else (fixed 2026-09-05)', () => {
    // The fixed-conditionTrue trick this used to rely on only ever kept
    // the "if" arm once #else flipped inElse (!true = false) — a real,
    // previously undetected gap: no existing test exercised #ifempty/
    // #ifexist together with #else, only standalone.
    const reader = makeReader({
      [p('main.tab')]:
        '#ifempty "&2"\nvariable if_true = 1;\n#else\nvariable if_false = 1;\n#end',
    });
    expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
      'variable if_true = 1;',
      'variable if_false = 1;',
    ]);
  });

  describe('an #ifdef/#ifndef name never touched by #define/#undefine anywhere (uncertain)', () => {
    // TODO.md P1: such a switch is routinely set from outside the
    // analyzed script (a CLI -D flag, a different main*.tab variant, a
    // customer-specific include the workspace doesn't have) — nothing
    // here can say whether it's set, so both arms are kept instead of
    // silently defaulting to "not defined".
    it('keeps both arms of #ifdef/#else', () => {
      const reader = makeReader({
        [p('main.tab')]:
          '#ifdef neverMentioned\nvariable if_true = 1;\n#else\nvariable if_false = 1;\n#end',
      });
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'variable if_true = 1;',
        'variable if_false = 1;',
      ]);
    });

    it('keeps both arms of #ifndef/#else too', () => {
      const reader = makeReader({
        [p('main.tab')]:
          '#ifndef neverMentioned\nvariable if_true = 1;\n#else\nvariable if_false = 1;\n#end',
      });
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'variable if_true = 1;',
        'variable if_false = 1;',
      ]);
    });

    it('a single unknown name in an OR list makes the whole thing uncertain', () => {
      const reader = makeReader({
        [p('main.tab')]:
          '#ifdef [ neverMentioned ]\nx = 1;\n#else\ny = 1;\n#end',
      });
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'x = 1;',
        'y = 1;',
      ]);
    });

    it('is unaffected once #define/#undefine mentions the name anywhere, even without an #else', () => {
      const reader = makeReader({
        [p('main.tab')]: '#define known\n#ifdef known\nx = 1;\n#end',
      });
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'x = 1;',
      ]);
    });

    it('mixing one known name with an unknown one in an OR list still resolves confidently', () => {
      // A conservative first cut (TODO.md P1): only a list where EVERY
      // name is unknown is treated as uncertain.
      const reader = makeReader({
        [p('main.tab')]:
          '#undefine known\n#ifdef [ known neverMentioned ]\nx = 1;\n#else\ny = 1;\n#end',
      });
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'y = 1;',
      ]);
    });
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
        '#undefine A',
        '#undefine B',
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

  describe('conditionalsAllActive', () => {
    it('keeps both branches of #ifdef/#ifndef/#else and follows all INCLUDEs', () => {
      const reader = makeReader({
        [p('main.tab')]: [
          // Known-but-unset (see the "honors #define/#undefine" test) so
          // the "Normal" resolution below is confidently resolved, not
          // itself already both-branches-kept — that's what the second,
          // conditionalsAllActive assertion is specifically testing.
          '#undefine WIN',
          '#undefine DEBUG',
          '#ifdef WIN',
          'INCLUDE = win.inc;',
          '#else',
          'INCLUDE = unix.inc;',
          '#end',
          '#ifndef DEBUG',
          'x = 1;',
          '#else',
          'x = 2;',
          '#end',
        ].join('\n'),
        [p('win.inc')]: 'w = 1;',
        [p('unix.inc')]: 'u = 1;',
      });
      // Normal: WIN undefined -> unix branch; DEBUG undefined -> x = 1.
      expect(texts(resolveIncludeGraph(p('main.tab'), reader))).to.deep.equal([
        'u = 1;',
        'x = 1;',
      ]);
      // All-active: every branch kept, both INCLUDEs followed.
      expect(
        texts(
          resolveIncludeGraph(p('main.tab'), reader, {
            conditionalsAllActive: true,
          })
        )
      ).to.deep.equal(['w = 1;', 'u = 1;', 'x = 1;', 'x = 2;']);
    });

    it('surfaces a #MACRO / #EXPAND defined only in an inactive #ifdef branch', () => {
      const reader = makeReader({
        [p('main.tab')]: [
          '#undefine PowerChart',
          '#ifdef PowerChart',
          '#macro #fillSlide39 ( &a &b )',
          'table = x by &a;',
          '#endmacro',
          '#expand #pcKey pc-42',
          '#end',
          '#fillSlide39( 1 2 )',
        ].join('\n'),
      });
      const normal = resolveIncludeGraph(p('main.tab'), reader);
      expect(
        normal.order.some((l) => /#macro\s+#fillSlide39\b/i.test(l.text))
      ).to.equal(false);

      const all = resolveIncludeGraph(p('main.tab'), reader, {
        conditionalsAllActive: true,
      });
      const macros = findMacroDefinitions(
        all.order.map((l) => ({ file: l.file, line: l.line, text: l.text }))
      );
      expect(macros.map((m) => m.name)).to.include('fillSlide39');
      expect(
        all.order.some((l) => /#expand\s+#pcKey\b/i.test(l.text))
      ).to.equal(true);
    });

    it('still filters { ... } block comments and unclosed macros', () => {
      const reader = makeReader({
        [p('main.tab')]: [
          '{',
          '#macro #hidden ( &a )',
          'x;',
          '#endmacro',
          '}',
          'y;',
        ].join('\n'),
      });
      const all = resolveIncludeGraph(p('main.tab'), reader, {
        conditionalsAllActive: true,
      });
      expect(
        all.order.some((l) => /#macro\s+#hidden\b/i.test(l.text))
      ).to.equal(false);
      expect(texts(all)).to.deep.equal(['y;']);
    });
  });
});

describe('resolveIncludeGraph — branchPaths', () => {
  it('a line outside any conditional has an empty path', () => {
    const reader = makeReader({ [p('main.tab')]: 'compute x = 1;' });
    const result = resolveIncludeGraph(p('main.tab'), reader);
    expect(result.branchPaths.get(branchKey(p('main.tab'), 0))).to.deep.equal(
      []
    );
  });

  it('mutually exclusive #ifdef/#else arms of the same conditional get incompatible paths', () => {
    const reader = makeReader({
      [p('main.tab')]: [
        '#ifndef DEBUG',
        'x = 1;',
        '#else',
        'x = 2;',
        '#end',
      ].join('\n'),
    });
    const all = resolveIncludeGraph(p('main.tab'), reader, {
      conditionalsAllActive: true,
    });
    const x1Path = all.branchPaths.get(branchKey(p('main.tab'), 1));
    const x2Path = all.branchPaths.get(branchKey(p('main.tab'), 3));

    // DEBUG's #ifndef/#else — mutually exclusive.
    expect(branchPathsCompatible(x1Path!, x2Path!)).to.equal(false);
  });

  it('known limitation: a conditional does not carry across an INCLUDE boundary', () => {
    // Each visited file gets its own fresh stack (matching resolveIncludeGraph's
    // pre-existing per-file gating — an INCLUDE is only followed once its own
    // line is already known active, so the included file never needed its
    // caller's stack for *gating*). branchPaths inherits that same shape: a
    // conditional wrapping two different INCLUDEs of otherwise-unconditional
    // files is not recognised as making their content mutually exclusive —
    // both come back with an empty path, same as top-level code. Real-world
    // #ifdef/#else pairs almost always wrap the affected statements directly
    // rather than an INCLUDE of them, so this doesn't affect the reported
    // case (variableModel.spec.ts's "#ifdef/#else COMPUTE" tests) — flagged
    // here as a known, accepted gap rather than silently unhandled.
    const reader = makeReader({
      [p('main.tab')]: [
        '#ifdef WIN',
        'INCLUDE = win.inc;',
        '#else',
        'INCLUDE = unix.inc;',
        '#end',
      ].join('\n'),
      [p('win.inc')]: 'w = 1;',
      [p('unix.inc')]: 'u = 1;',
    });
    const all = resolveIncludeGraph(p('main.tab'), reader, {
      conditionalsAllActive: true,
    });
    expect(all.branchPaths.get(branchKey(p('win.inc'), 0))).to.deep.equal([]);
    expect(all.branchPaths.get(branchKey(p('unix.inc'), 0))).to.deep.equal([]);
  });

  it('a directive line itself never reaches order, so it has no branchPaths entry', () => {
    const reader = makeReader({
      [p('main.tab')]: ['#ifdef X', 'compute v = 1;', '#end'].join('\n'),
    });
    const all = resolveIncludeGraph(p('main.tab'), reader, {
      conditionalsAllActive: true,
    });
    expect(all.branchPaths.has(branchKey(p('main.tab'), 0))).to.equal(false);
    expect(all.branchPaths.get(branchKey(p('main.tab'), 1))).to.deep.equal([
      { group: 0, arm: 'if' },
    ]);
  });

  it('nested conditionals build a multi-level path', () => {
    const reader = makeReader({
      [p('main.tab')]: [
        '#ifdef X',
        '#ifdef Y',
        'compute v = 1;',
        '#end',
        '#end',
      ].join('\n'),
    });
    const all = resolveIncludeGraph(p('main.tab'), reader, {
      conditionalsAllActive: true,
    });
    expect(all.branchPaths.get(branchKey(p('main.tab'), 2))).to.deep.equal([
      { group: 0, arm: 'if' },
      { group: 1, arm: 'if' },
    ]);
  });
});

describe('cleanedDocumentOrder', () => {
  // Reproduces the reported bug: GesstabsFileReferenceLinkProvider /
  // GesstabsDataSourceLinkProvider build their own single-document
  // ResolvedLine[] (no wider INCLUDE graph to resolve) and feed it straight
  // into toLogicalStatements. Before cleanedDocumentOrder existed, that
  // per-line dump kept every #ifdef/#else/#end line (no ";", so it glued
  // onto the next statement) and every trailing "// …" comment (not
  // blanked, so its own non-whitespace tail became a bogus leading
  // statement fragment too) — between them, almost every INCLUDE in a
  // typical entry script like this one silently stopped resolving to a
  // link.
  it('keeps an INCLUDE right after #ifdef/#else/#end resolvable as its own statement', () => {
    const lines = [
      '#ifdef SPSSfile',
      'include = "a.inc"; // bei SPSS',
      '#else',
      'include = "b.inc";       // über den',
      'include = "c.inc";        // Syntaxbefehl erzeugte',
      '#end',
      '',
      'include = "d.inc";              // Enthält die DEFINE-Steuerungen',
      'include = "e.inc";   // Enthält Macros',
    ];
    const order = cleanedDocumentOrder(p('main.tab'), lines);
    const stmts = toLogicalStatements(order).map((s) => s.text);
    expect(stmts).to.deep.equal([
      'include = "a.inc";',
      'include = "b.inc";',
      'include = "c.inc";',
      'include = "d.inc";',
      'include = "e.inc";',
    ]);
  });

  it('drops a directive-only line but keeps #macro/#endmacro for toLogicalStatements own handling', () => {
    const lines = [
      '#define X',
      '#macro #m()',
      'compute &a = 1;',
      '#endmacro',
      'compute v = 1;',
    ];
    const order = cleanedDocumentOrder(p('main.tab'), lines);
    expect(order.map((l) => l.text.trim())).to.deep.equal([
      '#macro #m()',
      'compute &a = 1;',
      '#endmacro',
      'compute v = 1;',
    ]);
    // The macro body never leaks out as an ordinary statement — same
    // toLogicalStatements handling as resolveIncludeGraph's own `order`.
    const stmts = toLogicalStatements(order).map((s) => s.text);
    expect(stmts).to.deep.equal(['compute v = 1;']);
  });

  it('blanks a trailing comment rather than leaving it to glue onto the next statement', () => {
    const raw = 'include = "a.inc"; // note';
    const order = cleanedDocumentOrder(p('main.tab'), [raw]);
    expect(order[0].text.trimEnd()).to.equal('include = "a.inc";');
    expect(order[0].text.length).to.equal(raw.length);
    expect(order[0].text).to.not.include('note');
  });
});
