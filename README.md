# gesstabs README

VS Code language support for the gess.Tab tabulation language from [gessgroup.de](https://www.gessgroup.de/).

## Features

- **Syntax highlighting** and **snippets** for `.tab` and `.inc` files.
- **Go to Definition** — jump from a variable/macro/expand usage to where it's defined, searching all `.tab`/`.inc` files in the workspace.
- **Document Symbols** (`Ctrl+Shift+O`) — list variables, computes, macros, expands, and table head/axis definitions in the current file.
- **Workspace Symbol Search** (`Ctrl+T`) — find a symbol definition across every `.tab`/`.inc` file in the open folder.

> **Find All References** is currently disabled pending a rewrite (the previous implementation could hang indefinitely) — see [TODO.md](TODO.md).

## Requirements

No requirements or dependencies.

## Extension Settings

- `gesstabs.debugMode` (boolean, default `false`) — enable debug messages in the Output console.

## Known Issues

See [TODO.md](TODO.md) for known issues and planned improvements.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md).
