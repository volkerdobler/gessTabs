// One typed place for the GESStabs hover settings, replacing the ad-hoc
// `vscode.workspace.getConfiguration('gesstabs').get('hover.<x>')` reads
// that were scattered across every provider (each re-typing the key string
// and its default).
//
// 0.99.4 collapsed nine flat `hover.*` booleans into three settings:
//   gesstabs.hover.enabled          — master on/off (unchanged)
//   gesstabs.hover.show             — { keywords, variables, tableDefaults: boolean;
//                                       macros: "short" | "full" }
//   gesstabs.hover.variableContent  — { definition, text, title, valueLabels: boolean }
// The pre-0.99.4 flat keys are still honoured as a fallback when the new
// object isn't set, so an existing settings.json keeps working — see
// LEGACY_* below. Remove that fallback once no one has the old keys.

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
