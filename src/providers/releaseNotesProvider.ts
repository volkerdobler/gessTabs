// Shows a release-notes webview on activation for the newest bundled
// release-notes/<version>.md file — not necessarily the installed version,
// since a quick patch release doesn't get (or need) its own notes file when
// it has nothing worth announcing; it just keeps shipping the previous one.
// Silently does nothing when no notes file exists at all. Mirrors the
// sibling gessQ extension's own src/infra/releaseNotes.ts: same
// release-notes/<version>.md convention, the same "show newest" + dev-only
// "reset" commands, and the same releaseNotes.showOnUpdate setting — so the
// two extensions behave alike, and a future change to one translates
// easily to the other.
//
// One thing intentionally does NOT match gessQ (yet): the panel's own
// "don't show this again" checkbox (checked by default). gessQ tracks a
// single "last version shown" value, which can't express "keep showing me
// this every start until I check the box" — gesstabs instead tracks a
// per-version suppress flag in globalState, set from the checkbox when the
// panel closes, not by editing the shipped .md file (so it keeps working
// regardless of whether the extension's install directory is writable).
// Deliberately a real vscode.window.createWebviewPanel rather than the
// built-in Markdown preview for this reason: the checkbox needs to be an
// interactive part of the same window, and its state needs to reach
// extension code, neither of which the stock preview offers.

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  latestVersion,
  releaseNotesPath,
  shouldShowReleaseNotes,
} from '../core/releaseNotes';
import { renderReleaseNotesMarkdown } from '../core/releaseNotesMarkdown';
import { releaseNotesShowOnUpdate } from '../util/config';
import * as logger from '../util/logger';

export const SHOW_RELEASE_NOTES_COMMAND = 'gesstabs.showReleaseNotes';
export const RESET_RELEASE_NOTES_COMMAND = 'gesstabs.resetReleaseNotesState';

const SUPPRESS_KEY_PREFIX = 'gesstabs.releaseNotes.suppressed.';

function releaseNotesFilePath(
  context: vscode.ExtensionContext,
  version: string
): string {
  return path.join(
    context.extensionPath,
    ...releaseNotesPath(version).split('/')
  );
}

// Versions with a release-notes/<v>.md file bundled in this install.
function availableVersions(context: vscode.ExtensionContext): string[] {
  const dir = path.join(context.extensionPath, 'release-notes');
  try {
    return fs
      .readdirSync(dir)
      .map((name) => /^(\d+\.\d+\.\d+)\.md$/.exec(name)?.[1])
      .filter((v): v is string => v !== undefined);
  } catch {
    return [];
  }
}

function getNonce(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 32; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

function renderPanelHtml(
  webview: vscode.Webview,
  version: string,
  markdown: string
): string {
  const nonce = getNonce();
  const body = renderReleaseNotesMarkdown(markdown);
  const csp = [
    `default-src 'none'`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<style>
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    padding: 0 24px 24px;
    max-width: 800px;
  }
  h1, h2, h3 { color: var(--vscode-foreground); }
  a { color: var(--vscode-textLink-foreground); }
  code {
    font-family: var(--vscode-editor-font-family);
    background: var(--vscode-textCodeBlock-background);
    padding: 0 4px;
    border-radius: 3px;
  }
  .checkbox-row {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--vscode-panel-border);
  }
  .checkbox-row label { cursor: pointer; }
</style>
</head>
<body>
<h1>Release Notes — GESStabs ${version}</h1>
${body}
<div class="checkbox-row">
  <label>
    <input type="checkbox" id="dontShowAgain" checked>
    Don't show this again for version ${version}
  </label>
</div>
<script nonce="${nonce}">
  const vscodeApi = acquireVsCodeApi();
  document.getElementById('dontShowAgain').addEventListener('change', (e) => {
    vscodeApi.postMessage({ type: 'dontShowAgain', value: e.target.checked });
  });
</script>
</body>
</html>`;
}

function showReleaseNotesPanel(
  context: vscode.ExtensionContext,
  version: string,
  markdown: string,
  suppressKey: string
): void {
  const panel = vscode.window.createWebviewPanel(
    'gesstabsReleaseNotes',
    `Release Notes — GESStabs ${version}`,
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  // The checkbox starts checked (see renderPanelHtml) — closing the panel
  // without touching it suppresses this version going forward, matching
  // the checkbox's own visible default.
  let dontShowAgain = true;
  panel.webview.onDidReceiveMessage(
    (message: { type?: string; value?: boolean }) => {
      if (message?.type === 'dontShowAgain') {
        dontShowAgain = !!message.value;
      }
    }
  );

  panel.webview.html = renderPanelHtml(panel.webview, version, markdown);

  panel.onDidDispose(() => {
    context.globalState.update(suppressKey, dontShowAgain);
  });

  context.subscriptions.push(panel);
}

/**
 * Register the release-notes commands and, unless
 * `gesstabs.releaseNotes.showOnUpdate` is off, open the newest bundled
 * `release-notes/<version>.md` once per version — not necessarily the
 * version currently installed, since a quick patch release doesn't need
 * (and won't ship) its own notes file. A version already shown and
 * dismissed doesn't repeat, and with no notes file at all this is a no-op.
 */
export function activateReleaseNotes(context: vscode.ExtensionContext): void {
  try {
    const suppressKey = (v: string) => SUPPRESS_KEY_PREFIX + v;
    const devMode = context.extensionMode !== vscode.ExtensionMode.Production;

    context.subscriptions.push(
      vscode.commands.registerCommand(SHOW_RELEASE_NOTES_COMMAND, () => {
        const version = latestVersion(availableVersions(context));
        if (version === undefined) {
          vscode.window.showInformationMessage(
            'GESStabs: no release notes available.'
          );
          return;
        }
        const markdown = fs.readFileSync(
          releaseNotesFilePath(context, version),
          'utf8'
        );
        showReleaseNotesPanel(context, version, markdown, suppressKey(version));
      })
    );

    // Development / test only — gates the palette entry (see the
    // `menus.commandPalette` "when" in package.json) and the handler itself.
    vscode.commands.executeCommand('setContext', 'gesstabs.devMode', devMode);
    if (devMode) {
      context.subscriptions.push(
        vscode.commands.registerCommand(RESET_RELEASE_NOTES_COMMAND, () => {
          availableVersions(context).forEach((v) =>
            context.globalState.update(suppressKey(v), undefined)
          );
          vscode.window.showInformationMessage(
            'GESStabs: release-notes state reset — reload the window to ' +
              'see them again automatically.'
          );
        })
      );
    }

    const version = latestVersion(availableVersions(context));
    if (version === undefined) return;
    if (
      !shouldShowReleaseNotes(
        releaseNotesShowOnUpdate(),
        context.globalState.get<boolean>(suppressKey(version))
      )
    ) {
      return;
    }

    const markdown = fs.readFileSync(
      releaseNotesFilePath(context, version),
      'utf8'
    );
    showReleaseNotesPanel(context, version, markdown, suppressKey(version));
  } catch (e) {
    logger.error(`gesstabs: release notes failed: ${e}`);
  }
}
