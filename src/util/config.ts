// One typed place for GESStabs settings access, replacing the ad-hoc
// `vscode.workspace.getConfiguration('gesstabs').get('<x>')` reads that
// were scattered across every provider (each re-typing the key string and
// its default).
//
// 0.99.4 collapsed nine flat `hover.*` booleans into three settings:
//   gesstabs.hover.enabled          — master on/off (unchanged)
//   gesstabs.hover.show             — { keywords, variables, tableDefaults: boolean;
//                                       macros: "short" | "full" }
//   gesstabs.hover.variableContent  — { definition, text, title, valueLabels: boolean }
// The pre-0.99.4 flat keys are still honoured as a fallback when the new
// object isn't set, so an existing settings.json keeps working — see
// LEGACY_* below. Remove that fallback once no one has the old keys.
//
// The remaining accessors below (diagnosticsEnabled/autocompleteEnabled/
// hoverLanguage/entryScriptPatterns) finish that centralization for the
// handful of ad hoc reads that were left outside the hover settings —
// `debugMode` is deliberately not included here, since `src/util/logger.ts`
// owns reading that one directly.

import * as vscode from 'vscode';

const cfg = () => vscode.workspace.getConfiguration('gesstabs');

export type MacroHoverStyle = 'short' | 'full';
export type HoverSection = 'keywords' | 'variables' | 'tableDefaults';
export type VariableContentPart =
  | 'definition'
  | 'text'
  | 'title'
  | 'valueLabels';

// pre-0.99.4 flat boolean key for each `hover.show` section.
const LEGACY_SECTION_KEY: Record<HoverSection, string> = {
  keywords: 'hover.keywords',
  variables: 'hover.variables',
  tableDefaults: 'hover.effectiveElements',
};

export function hoverEnabled(): boolean {
  return cfg().get<boolean>('hover.enabled', true) !== false;
}

// A `hover.show` section (other than macros). On unless explicitly turned
// off — via the new object, or the old flat key if that's all the user has.
export function hoverShows(section: HoverSection): boolean {
  const show = cfg().get<Record<string, unknown>>('hover.show');
  if (show && typeof show[section] === 'boolean') {
    return show[section] as boolean;
  }
  return cfg().get<boolean>(LEGACY_SECTION_KEY[section]) !== false;
}

// `hover.show.macros`: "short" (trim blank/comment lines) | "full" (verbatim).
// Falls back to the old `hover.macroExpansionStyle` ("short" | "normal").
export function macroHoverStyle(): MacroHoverStyle {
  const show = cfg().get<Record<string, unknown>>('hover.show');
  const v = show?.macros;
  if (v === 'short' || v === 'full') return v;
  return cfg().get<string>('hover.macroExpansionStyle') === 'normal'
    ? 'full'
    : 'short';
}

// A block of the variable hover. `definition` (the origin line) has no
// pre-0.99.4 toggle — it was always shown; the other three were the single
// `hover.variableAnnotations` flag.
export function variableContentShows(part: VariableContentPart): boolean {
  const content = cfg().get<Record<string, unknown>>('hover.variableContent');
  if (content && typeof content[part] === 'boolean') {
    return content[part] as boolean;
  }
  if (part === 'definition') return true;
  return cfg().get<boolean>('hover.variableAnnotations') !== false;
}

// `gesstabs.diagnostics.enabled` — master switch for the F2 diagnostics
// pass (both the document-scoped checks and the model-based ones).
export function diagnosticsEnabled(): boolean {
  return cfg().get<boolean>('diagnostics.enabled', true) !== false;
}

// `gesstabs.autocomplete.enabled` — master switch for both completion
// providers (symbol completion and keyword completion).
export function autocompleteEnabled(): boolean {
  return cfg().get<boolean>('autocomplete.enabled', true) !== false;
}

// `gesstabs.hover.language` — "auto" | "de" | "en" for the keyword hover/
// completion's documentation language. Not validated against
// KeywordLanguage here (that would need importing the keywords module into
// this generic util) — resolveKeywordLanguage (keywords/keywordDatabaseTypes.ts)
// already falls back safely for any unrecognised value, "auto" included.
export function hoverLanguage(): string {
  return cfg().get<string>('hover.language', 'auto');
}

// `gesstabs.dataInput.entryScriptPatterns` — glob patterns identifying a
// workspace file as an "entry script" (a real compile root, e.g.
// `main.tab`). `fallback` is the caller's own default (entryScripts.ts'
// DEFAULT_ENTRY_SCRIPT_PATTERNS) — kept as a parameter rather than
// hardcoded here so this generic util doesn't need to import from core.
export function entryScriptPatterns(fallback: string[]): string[] {
  const raw = cfg().get<string[]>('dataInput.entryScriptPatterns', fallback);
  return Array.isArray(raw) && raw.every((s) => typeof s === 'string')
    ? raw
    : fallback;
}
