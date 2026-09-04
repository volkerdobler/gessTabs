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
import { WorkspaceIndex } from './symbolIndex';
import { toLogicalStatements, LogicalStatement } from './statements';
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
  annotations: ModelAnnotation[];
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
  at(file: string, line: number): ProgramPointView;
  resolve(
    name: string,
    atFile: string,
    atLine: number
  ): VariableSymbol | undefined;
  currentVariableAt(file: string, line: number): string | undefined;
  references(name: string): VariableReference[];
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

// Locate an offset within a joined statement text back to its resolved
// line and the character offset within that line.
function locate(
  stmt: LogicalStatement,
  offset: number
): { line: ResolvedLine; character: number } {
  let consumed = 0;
  for (let i = 0; i < stmt.lines.length; i += 1) {
    const piece = stmt.lines[i];
    const len = i === 0 ? stmt.text.split('\n')[0].length : piece.text.length;
    if (offset <= consumed + len) {
      return { line: piece, character: Math.max(0, offset - consumed) };
    }
    consumed += len + 1; // + '\n'
  }
  const last = stmt.lines[stmt.lines.length - 1];
  return { line: last, character: 0 };
}

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
  // "die aktuelle Variable" after statement i (index into statements).
  const currentAfter: (string | undefined)[] = new Array(statements.length);

  PREDEFINED.forEach((p) => {
    symbols.set(p.name, {
      name: p.name,
      displayName: p.name,
      kind: 'atomic',
      origin: 'predefined',
      definitions: [],
      annotations: [],
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
      const loc = locate(stmt, span.rawStart);
      const existing = symbols.get(span.name);
      if (existing && existing.origin !== 'predefined') {
        existing.definitions.push(loc.line);
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
        definitions: [locate(stmt, span.rawStart).line],
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
    if (cls.kind === 'annotation' || cls.kind === 'overcode') {
      const annKind = ANNOTATION_KIND[cls.keyword] ?? 'other';
      let targets: string[];
      if (cls.usesCurrentVariable) {
        targets = current ? [current] : [];
      } else {
        targets = cls.references
          .filter((r) => r.mode === 'always')
          .map((r) => r.span.name);
      }
      targets.forEach((t) => {
        const sym = symbols.get(t);
        if (!sym) return;
        sym.annotations.push({
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
          const loc = locate(stmt, span.rawStart);
          out.push({
            line: loc.line,
            character: loc.character,
            span,
            inKeyword: cls.keyword,
          });
        }
      );
    });
    return out;
  };

  return {
    all: () => [...symbols.values()],
    at: (file, line) => viewAt(stmtIndexAt(file, line)),
    resolve: (name, atFile, atLine) =>
      viewAt(stmtIndexAt(atFile, atLine)).resolve(name),
    currentVariableAt: (file, line) =>
      viewAt(stmtIndexAt(file, line)).currentVariable(),
    references: (name) => {
      const key = name.toLowerCase();
      return allReferences().filter((r) => r.span.name === key);
    },
  };
}
