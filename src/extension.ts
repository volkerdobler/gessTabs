'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "gessTabs" is now active!');

    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "gessTabs"}, new GessTabsDocumentSymbolProvider()
    ));

};

// this method is called when your extension is deactivated
export function deactivate() {
};

class GessTabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument,
            token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve, reject) => {
            var symbols = [];

            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                if (line.text.search(/\b(singleq|multiq|singlegridq|multigridq|openq|textq|numq) +(.+)\;/i) > -1) { //  startsWith("@")) {
                    symbols.push({
                        name: line.text.substr(0),
                        kind: vscode.SymbolKind.Field,
                        location: new vscode.Location(document.uri, line.range)
                    })
                }
            }

            resolve(symbols);
        });
    }
}
