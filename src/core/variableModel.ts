// The symbol table — one program-order pass over the INCLUDE-resolved line
// list that turns the statement classifier's per-statement facts
// (src/core/variableStatements.ts) into a queryable model of every
// variable: its kind, where it is declared, what annotates it, and — the
// thing the eleven regex factories could never do — which occurrences of a
// name are genuine references once the quoted-token rule is applied
// against the names actually known at that program point.
//
// Phase 2 scope (docs/variable-model-design.md §8): `declared` +
// `predefined` origins only. `external` (phase 4), `macro-produced`
// (phase 5) and on-demand `$`-member synthesis (§9 Q2) are not wired yet;
// the shapes below leave room for them.
//
// PURE — takes a WorkspaceIndex, returns a plain object. The vscode-facing
// consumers (hover first, then go-to-def / references / rename / the F2
// diagnostics) are migrated onto this in phases 2–3.

import { ResolvedLine } from './includeGraph';
import { WorkspaceIndex, findAllWordRangesInLine } from './symbolIndex';
import {
  toLogicalStatements,
  locateInStatement,
  LogicalStatement,
} from './statements';
import {
  classifyStatement,
  ClassifiedStatement,
  NameSpan,
  NameMode,
  VariableKind,
} from './variableStatements';

export type VariableOrigin =
  | 'declared'
  | 'external'
  | 'predefined'
  | 'virtual'
  | 'macro-produced';

export interface ModelAnnotation {
  kind: 'vartitle' | 'vartext' | 'valuelabels' | 'overcode' | 'other';
  keyword: string;
  file: string;
  line: number;
  // the whole annotation statement, start line through the terminating `;`.
  statement: string;
  // set when this annotation was aliased onto the symbol by a
  // COPYTITLE/COPYTEXT/COPYLABELS `‹targets› = ‹source›` — the name of
  // `‹source›`, whose real VARTITLE/VARTEXT/VALUELABELS this is.
  copiedFrom?: string;
}

export interface VariableSymbol {
  // canonical (lower-cased) — the lookup key.
  name: string;
  // first-seen casing, for display.
  displayName: string;
  kind: VariableKind;
  origin: VariableOrigin;
  // usually one; more than one for an #ifdef-per-branch or a re-definition.
  definitions: ResolvedLine[];
  // the full statement text for each entry in `definitions`, parallel array.
  definitionStatements: string[];
  annotations: ModelAnnotation[];
  // doc string for a `predefined` system variable.
  predefinedDoc?: string;
  // atomic members of a family / group, when the declaration lists them.
  members?: string[];
  // declared slot count for MAKEFAMILY/MAKEGROUP `= ‹n›`.
  memberCount?: number;
  // POSTPROCESS / overcode virtuals are visible only within this range.
  scope?: { file: string; startLine: number; endLine: number };
}

export interface VariableReference {
  line: ResolvedLine;
  character: number;
  span: NameSpan;
  // the statement keyword the reference sits in (for callers that filter).
  inKeyword: string;
}

export interface ProgramPointView {
  resolve(name: string): VariableSymbol | undefined;
  all(): VariableSymbol[];
  currentVariable(): string | undefined;
}

export interface VariableModel {
  all(): VariableSymbol[];
  // every logical statement, in program order (reused by consumers that
  // need statement context, e.g. the hover widening a definition line).
  statements: LogicalStatement[];
  at(file: string, line: number): ProgramPointView;
  resolve(
    name: string,
    atFile: string,
    atLine: number
  ): VariableSymbol | undefined;
  currentVariableAt(file: string, line: number): string | undefined;
  references(name: string): VariableReference[];
  // every annotation naming `name` — a declared symbol's own, plus
  // "orphan" VARTITLE/VARTEXT/VALUELABELS on a name the script never
  // declares (a raw dataset variable).
  annotationsFor(name: string): ModelAnnotation[];
  // ignores program order — the symbol for `name` wherever it is declared
  // in the resolved program (the whole-index fallback the old
  // findDefinitionLine(-1) provided).
  resolveAnywhere(name: string): VariableSymbol | undefined;
}

// ---------------------------------------------------------------------------

// Manual: Systemvariablen. Declaring one of these is a syntax error
// (a phase-6 diagnostic); they are always resolvable.
const PREDEFINED: { name: string; doc: string }[] = [
  { name: 'sysmiss', doc: 'always MISSING' },
  { name: 'nil', doc: 'empty variable, handy in TABLE ADD' },
  { name: 'systemfileno', doc: 'current dataset number' },
  { name: 'systemweight', doc: 'current case weight' },
  { name: 'systemcaseno', doc: '1-based case number' },
];

const ANNOTATION_KIND: Record<string, ModelAnnotation['kind']> = {
  vartitle: 'vartitle',
  title: 'vartitle',
  vartext: 'vartext',
  text: 'vartext',
  valuelabels: 'valuelabels',
  labels: 'valuelabels',
};

// COPYTITLE/COPYTEXT/COPYLABELS `‹targets› = ‹source›` don't give the
// targets their own annotation — they alias the source's.
const COPY_ANNOT_KIND: Record<string, 'vartitle' | 'vartext' | 'valuelabels'> =
  {
    copytitle: 'vartitle',
    copytext: 'vartext',
    copylabels: 'valuelabels',
  };

const currentAsList = (c: string | undefined): string[] => (c ? [c] : []);

function memberSpans(cls: ClassifiedStatement): string[] | undefined {
  if (
    cls.targetKind === 'family' ||
    cls.targetKind === 'alphafamily' ||
    cls.targetKind === 'group' ||
    cls.targetKind === 'crossvar'
  ) {
    const names = cls.references
      .filter((r) => r.mode === 'always')
      .map((r) => r.span.name);
    return names.length ? names : undefined;
  }
  return undefined;
}

export function buildVariableModel(index: WorkspaceIndex): VariableModel {
  const statements = toLogicalStatements(index.order);
  const classified: (ClassifiedStatement | undefined)[] = statements.map((s) =>
    classifyStatement(s.text)
  );

  const symbols = new Map<string, VariableSymbol>();
  // program index at which each symbol first becomes visible (-1 = seeded).
  const firstSeen = new Map<string, number>();
  // VARTITLE/VARTEXT/VALUELABELS naming a variable the script never
  // declares — usually a raw dataset variable. Kept so the hover can still
  // show its annotations even though there is no `declared` symbol.
  const orphanAnnotations = new Map<string, ModelAnnotation[]>();
  const addAnnotation = (name: string, a: ModelAnnotation) => {
    const sym = symbols.get(name);
    if (sym) {
      sym.annotations.push(a);
      return;
    }
    const list = orphanAnnotations.get(name) ?? [];
    list.push(a);
    orphanAnnotations.set(name, list);
  };
  // "die aktuelle Variable" after statement i (index into statements).
  const currentAfter: (string | undefined)[] = new Array(statements.length);

  PREDEFINED.forEach((p) => {
    symbols.set(p.name, {
      name: p.name,
      displayName: p.name,
      kind: 'atomic',
      origin: 'predefined',
      definitions: [],
      definitionStatements: [],
      annotations: [],
      predefinedDoc: p.doc,
    });
    firstSeen.set(p.name, -1);
  });

  let current: string | undefined;

  statements.forEach((stmt, i) => {
    const cls = classified[i];
    if (!cls) {
      currentAfter[i] = current;
      return;
    }

    const members = memberSpans(cls);

    cls.defines.forEach((span) => {
      const loc = locateInStatement(stmt, span.rawStart);
      const existing = symbols.get(span.name);
      if (existing && existing.origin !== 'predefined') {
        existing.definitions.push(loc.line);
        existing.definitionStatements.push(stmt.text);
        if (cls.targetKind && cls.targetKind !== 'unknown') {
          existing.kind = cls.targetKind;
        }
        if (members) existing.members = members;
      } else if (!existing) {
        symbols.set(span.name, {
          name: span.name,
          displayName: span.raw.replace(/^["']|["']$/g, ''),
          kind: cls.targetKind ?? 'unknown',
          origin: 'declared',
          definitions: [loc.line],
          definitionStatements: [stmt.text],
          annotations: [],
          ...(members ? { members } : {}),
        });
        firstSeen.set(span.name, i);
      }
    });

    (cls.virtualDefines ?? []).forEach((span) => {
      if (symbols.has(span.name)) return;
      symbols.set(span.name, {
        name: span.name,
        displayName: span.raw.replace(/^["']|["']$/g, ''),
        kind: 'atomic',
        origin: 'virtual',
        definitions: [locateInStatement(stmt, span.rawStart).line],
        definitionStatements: [stmt.text],
        annotations: [],
        scope: {
          file: stmt.file,
          startLine: stmt.startLine,
          endLine: stmt.lines[stmt.lines.length - 1].line,
        },
      });
      firstSeen.set(span.name, i);
    });

    // annotations
    const copyKind = COPY_ANNOT_KIND[cls.keyword];
    if (copyKind) {
      const refs = cls.references.filter((r) => r.mode === 'always');
      const source = refs[refs.length - 1]?.span.name;
      const targets = cls.usesCurrentVariable
        ? currentAsList(current)
        : refs.slice(0, -1).map((r) => r.span.name);
      const srcAnns = source
        ? symbols.get(source)?.annotations ??
          orphanAnnotations.get(source) ??
          []
        : [];
      const copied = srcAnns.filter((a) => a.kind === copyKind);
      targets.forEach((t) => {
        copied.forEach((a) => addAnnotation(t, { ...a, copiedFrom: source }));
      });
    } else if (cls.kind === 'annotation' || cls.kind === 'overcode') {
      const annKind = ANNOTATION_KIND[cls.keyword] ?? 'other';
      const targets = cls.usesCurrentVariable
        ? currentAsList(current)
        : cls.references
            .filter((r) => r.mode === 'always')
            .map((r) => r.span.name);
      targets.forEach((t) => {
        addAnnotation(t, {
          kind: cls.kind === 'overcode' ? 'overcode' : annKind,
          keyword: cls.keyword,
          file: stmt.file,
          line: stmt.startLine,
          statement: stmt.text,
        });
      });
    }

    // current-variable tracking
    if (cls.bindsCurrentVariable && cls.defines.length > 0) {
      current = cls.defines[cls.defines.length - 1].name;
    }
    currentAfter[i] = current;
  });

  // ---- program-point helpers ----------------------------------------

  // statement index whose span contains (file,line), else the last
  // statement that ends before it (-1 if the point precedes everything).
  const stmtIndexAt = (file: string, line: number): number => {
    let last = -1;
    for (let i = 0; i < statements.length; i += 1) {
      const s = statements[i];
      const hit = s.lines.some((l) => l.file === file && l.line === line);
      if (hit) return i;
      const startsBefore = s.file === file && s.startLine <= line;
      if (startsBefore) last = i;
    }
    return last;
  };

  const viewAt = (pointIndex: number): ProgramPointView => {
    const visible = (): VariableSymbol[] =>
      [...symbols.values()].filter(
        (s) => (firstSeen.get(s.name) ?? Infinity) <= pointIndex
      );
    return {
      all: visible,
      resolve: (name: string) => {
        const s = symbols.get(name.toLowerCase());
        if (!s) return undefined;
        return (firstSeen.get(s.name) ?? Infinity) <= pointIndex
          ? s
          : undefined;
      },
      currentVariable: () =>
        pointIndex >= 0 ? currentAfter[pointIndex] : undefined,
    };
  };

  // ---- references --------------------------------------------------

  const allReferences = (): VariableReference[] => {
    const out: VariableReference[] = [];
    statements.forEach((stmt, i) => {
      const cls = classified[i];
      if (!cls) return;
      cls.references.forEach(
        ({ span, mode }: { span: NameSpan; mode: NameMode }) => {
          if (mode === 'never') return;
          if (mode === 'ifKnown' && span.quoted) {
            // a quoted token is a name only if a variable of that name is
            // known at this point (the manual's rule)
            if ((firstSeen.get(span.name) ?? Infinity) > i) return;
          }
          const loc = locateInStatement(stmt, span.rawStart);
          out.push({
            line: loc.line,
            character: loc.character,
            span,
            inKeyword: cls.keyword,
          });
        }
      );

      // §9 Q2's non-pattern `‹a› TO ‹b›` form: "every variable declared
      // between `a` and `b`, in program order" — `a`/`b` need not share a
      // name pattern, so only the model (which knows declaration order)
      // can resolve this, unlike the numeric-suffix form the classifier
      // already expands on its own. `‹b›` declared before `‹a›` (§9 Q2's
      // open sub-question) is resolved here as: swap silently, favouring a
      // useful answer over a silent no-op. Members are anchored at the
      // whole range phrase, same as expandNameRange's own synthetic spans
      // — no literal token of their own, but a real, reusable line+range.
      cls.unresolvedRanges?.forEach(({ from, to }) => {
        const fromIdx = firstSeen.get(from.name);
        const toIdx = firstSeen.get(to.name);
        if (fromIdx === undefined || toIdx === undefined) return;
        const lo = Math.min(fromIdx, toIdx);
        const hi = Math.max(fromIdx, toIdx);
        const phraseStart = Math.min(from.rawStart, to.rawStart);
        const phraseEnd = Math.max(
          from.rawStart + from.rawLength,
          to.rawStart + to.rawLength
        );
        const loc = locateInStatement(stmt, phraseStart);
        symbols.forEach((sym) => {
          const idx = firstSeen.get(sym.name);
          if (idx === undefined || idx <= lo || idx >= hi) return;
          out.push({
            line: loc.line,
            character: loc.character,
            span: {
              name: sym.name,
              raw: sym.displayName,
              rawStart: phraseStart,
              rawLength: phraseEnd - phraseStart,
              quoted: false,
              synthetic: true,
            },
            inKeyword: cls.keyword,
          });
        });
      });
    });
    return out;
  };

  return {
    all: () => [...symbols.values()],
    statements,
    at: (file, line) => viewAt(stmtIndexAt(file, line)),
    resolve: (name, atFile, atLine) =>
      viewAt(stmtIndexAt(atFile, atLine)).resolve(name),
    currentVariableAt: (file, line) =>
      viewAt(stmtIndexAt(file, line)).currentVariable(),
    references: (name) => {
      const key = name.toLowerCase();
      return allReferences().filter((r) => r.span.name === key);
    },
    resolveAnywhere: (name) => symbols.get(name.toLowerCase()),
    annotationsFor: (name) => {
      const k = name.toLowerCase();
      return [
        ...(symbols.get(k)?.annotations ?? []),
        ...(orphanAnnotations.get(k) ?? []),
      ];
    },
  };
}

export interface VariableOccurrence {
  line: ResolvedLine;
  character: number;
  length: number;
  // false for a range-phrase hit (§9 Q2: a numeric-suffix `‹a› TO ‹b›`
  // member the classifier synthesised — `name` never appears as literal
  // text here, `character`/`length` span the whole "‹a› TO ‹b›" phrase
  // instead). Find-references can still show these — they're a genuine
  // usage — but **rename must skip non-literal occurrences**: there is no
  // text to substitute without corrupting the range's other endpoint.
  literal: boolean;
}

// Every occurrence of `name` across the resolved program that counts as a
// variable reference, with an exact character range — the source for
// find-references and rename. A bare token is always a reference in this
// grammar; a quoted token is one only on a line the model actually
// resolves `name` as a name (the manual's quoted-token rule — this is what
// leaves label / title text that merely reads like a variable name
// alone). Comment-scoped hits are dropped. `excludeDefinitions` skips the
// statement lines that declare `name` (references' `!includeDeclaration`).
//
// Also includes non-literal hits from a numeric-suffix `‹a› TO ‹b›` range
// `name` is only a member of (§9 Q2) — `findAllWordRangesInLine` can never
// find these (there's no literal `name` text on that line at all), so
// they're added separately from `model.references(name)`'s own
// already-resolved, already-`locateInStatement`-anchored entries. Callers
// building a rename edit MUST filter to `literal` occurrences only.
export function collectVariableOccurrences(
  index: WorkspaceIndex,
  name: string,
  excludeDefinitions = false
): VariableOccurrence[] {
  const model = buildVariableModel(index);
  const modelRefs = model.references(name);
  const refLineKeys = new Set(
    modelRefs.map((r) => `${r.line.file}:${r.line.line}`)
  );
  const defLineKeys = new Set(
    (model.resolveAnywhere(name)?.definitions ?? []).map(
      (d) => `${d.file}:${d.line}`
    )
  );

  const out: VariableOccurrence[] = [];
  index.order.forEach((rl) => {
    const lineKey = `${rl.file}:${rl.line}`;
    if (excludeDefinitions && defLineKeys.has(lineKey)) return;
    // a quoted token counts as the name here only on a line the model
    // resolves it — a reference line, or the line that declares it.
    const nameOnThisLine = refLineKeys.has(lineKey) || defLineKeys.has(lineKey);
    const scope = index.scopes.get(rl.file);
    findAllWordRangesInLine(rl.text, name).forEach(([start, end]) => {
      if (scope && !scope.isNotInComment(rl.line, start)) return;
      const quoted = !!scope && scope.isStringScope(rl.line, start);
      if (quoted && !nameOnThisLine) return;
      out.push({
        line: rl,
        character: start,
        length: end - start,
        literal: true,
      });
    });
  });

  modelRefs
    .filter((r) => r.span.synthetic)
    .forEach((r) => {
      const lineKey = `${r.line.file}:${r.line.line}`;
      if (excludeDefinitions && defLineKeys.has(lineKey)) return;
      out.push({
        line: r.line,
        character: r.character,
        length: r.span.rawLength,
        literal: false,
      });
    });

  return out;
}
