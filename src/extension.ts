"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "gesstabs" is now active!');

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "gesstabs", scheme: "file" },
      new GessTabsDocumentSymbolProvider()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

function validCheck(first: number, second: number, noComment: number = 1): boolean {
  let zurueck: boolean = true;

  if (noComment === 0) {
    zurueck = false;
  }

  if (first > -1) {
    // ist der reguläre Ausdruck vorhanden
    if (second > -1) {
      // gibt es einen Kommentar in der Zeile
      if (first < second) {
        // ist der reguläre Ausdruck noch vor dem Kommentar-Start
        return zurueck;
      } else {
        return !zurueck; // regulärer Ausdruck ist vorhanden, aber nach dem Kommentar-Start
      }
    } else {
      return true; // regulärer Ausdruck vorhanden und kein Kommentar in Zeile
    }
  } else {
    return false; // regulärer Ausdruck nicht vorhanden
  }
}

class GessTabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      var symbols = [];
      var labelRe = new RegExp(
        /\b(vartext|vartitle|valuelabels|text|title|labels)\b\s*(["']?)([\w\.]*)\2\s*(((["']?)([\w\.]*)\6\s*)*)=/i
      );
      var variableRe = new RegExp(
        /\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups)\b\s*(["']?)([\w\.]*)\2\s*=/i
      );

      let noComment: number = 1;
			let switchComment: number = 0;

      for (var i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (line.text.length === 0) {
          continue;
        }

        let startComment: number = line.text.search("//");

        if (validCheck(line.text.search("{"), startComment)) {
          startComment = line.text.search("{");
          noComment = 0;
					switchComment = -1;
        }

        if (line.text.search("}") > -1 && noComment < 1) {
          startComment = line.text.search("}");
          noComment = 0;
					switchComment = 1;
        };

        if (
          validCheck(line.text.search(labelRe), startComment, noComment) &&
          noComment > -1
        ) {
          let lineMatch = line.text.match(labelRe);
          if (lineMatch.length > 2 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.String,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase()
            });
          }
          if (lineMatch.length >= 4 && lineMatch[4].length > 0) {
            lineMatch[4]
              .replace(/\"/g, "")
              .split(" ")
              .forEach(function(elem, index) {
                if (elem.length > 0) {
                  symbols.push({
                    name: elem,
                    kind: vscode.SymbolKind.String,
                    location: new vscode.Location(document.uri, line.range),
                    containerName: lineMatch[1].toLocaleLowerCase()
                  });
                }
              });
          }
        }
        if (
          validCheck(line.text.search(variableRe), startComment, noComment) &&
          noComment > -1
        ) {
          let lineMatch = line.text.match(variableRe);
          if (lineMatch.length >= 3 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.String,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase()
            });
          }
        };
				if (noComment === 0) {
          noComment = switchComment;
				};
      }
      if (symbols.length > 0) {
        resolve(symbols);
      } else {
        resolve(null);
      }
    });
  }
}
