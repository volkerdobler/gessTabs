'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gesstabs" is now active!');

	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
		{language: "gesstabs", scheme: "file"}, new GessTabsDocumentSymbolProvider()
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
			var variableRe = new RegExp("\\b(vartext|vartitle|varlabels|text|title|labels)\\b\\s*(([\"\']?\\w+[\"\']?)\\s*)+","gi");

			for (var i = 0; i < document.lineCount; i++) {
				var line = document.lineAt(i);
				if (line.text.search(variableRe) > -1) {
					symbols.push({
						name: line.text.match(variableRe)[1],
						kind: vscode.SymbolKind.Method,
						location: new vscode.Location(document.uri, line.range),
						containerName: line.text.match(variableRe)![0]
					})
				}
			};

			resolve(symbols);
		});
	}
}
