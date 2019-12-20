"use strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import path = require('path');
import fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "gesstabs" is now active!');

  context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
      { language: "gesstabs", scheme: "file" }, new GessTabsDocumentSymbolProvider() )
  );

  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
      {language: "gesstabs", scheme: "file" }, new GessTabsDefinitionProvider()
  ));


  context.subscriptions.push(vscode.languages.registerReferenceProvider(
      {language: "gesstabs", scheme: "file"}, new GessTabsReferenceProvider()
  ));

  context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(
      new GessTabsWorkspaceSymbolProvider()));

}

// this method is called when your extension is deactivated
export function deactivate() {}

// Workaround for issue in https://github.com/Microsoft/vscode/issues/9448#issuecomment-244804026
function fixDriveCasingInWindows(pathToFix: string): string {
	return (process.platform === 'win32' && pathToFix) ? pathToFix.substr(0, 1).toUpperCase() + pathToFix.substr(1) : pathToFix;
}

function getWorkspaceFolderPath(fileUri?: vscode.Uri): string {
	if (fileUri) {
		const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
		if (workspace) {
			return fixDriveCasingInWindows(workspace.uri.fsPath);
		}
	}

	// fall back to the first workspace
	const folders = vscode.workspace.workspaceFolders;
	if (folders && folders.length) {
		return fixDriveCasingInWindows(folders[0].uri.fsPath);
	}
}

function adjustWordPosition(document: vscode.TextDocument, position: vscode.Position): [boolean, string, vscode.Position] {
    const wordRange = document.getWordRangeAtPosition(position,/(#?[\w\.]+)\b/);
    const word = wordRange ? document.getText(wordRange) : '';
    if (!wordRange) {
        return [false, null, null];
    }
    if (position.isEqual(wordRange.end) && position.isAfter(wordRange.start)) {
        position = position.translate(0, -1);
    }

    return [true, word, position];
};

function getAllFiles(dir: string, ftype: string): any[] {
  let results = [];
  let regEXP = new RegExp("\\."+ftype+"$","i");
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '\\' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
    /* Recurse into a subdirectory */
      results = results.concat(getAllFiles(file, ftype));
    } else { 
    /* Is a file */
      // results.push(file);
      if (file.match(regEXP)) {
        results.push(file);
      };
    }
  });
  return results;
}

class clComment {
  oneLine: number;       // position of // in line
  start: number;         // position of { in line
  end: number;           // position of } in line
  status: number;        // 1 = not in Comment; -1 = in Comment
  changing: number;      // 1 ending comment in line; -1 starting comment in line; 0 no comment-char in line
  
  constructor (oneC: number = -1, startC: number = -1, endC: number = -1) {
    this.oneLine = oneC;
    this.start = startC;
    this.end = endC;
    this.status = 1;
    this.changing = 0;
  };
  
  checkCommentsInLine(oneC: number, startC: number, endC: number) {
    this.oneLine = oneC;
    this.start = startC;
    this.end = endC;
  };
  
  checkIfInComment(command: number) : boolean {
    
    if (this.status === -1 && this.end === -1) {        // wir befinden uns in einem Kommentarbereich
      return false;
    };
    
    if (command > -1) {                      // ist der reguläre Ausdruck vorhanden
      if (this.start > -1) {                 // es wird ein Kommentar eröffnet
        if (this.end > -1) {                 // es wird ein Kommentar geschlossen
          if (this.start > this.end) {
            if (command < this.start && command > this.end && (this.oneLine === -1 || (this.oneLine > -1 && command < this.oneLine))) {
              return true
            } else {
              return false;
            };
          } else {
            if ((command < this.start || command > this.end) && (this.oneLine === -1 || (this.oneLine > -1 && command < this.oneLine))) {  // entweder vor oder nach dem Kommentar
              return true;
            } else {
              return false;
            };
          };
        } else {                       // nur Kommentar eröffnet
          if (command < this.start && (this.oneLine === -1 || (this.oneLine > -1 && command < this.oneLine))) {
            return true;
          } else {
            return false;
          }
        }
      } else {                         // kein Kommentar wird eröffnet
        if (this.end > -1) {         // Kommentar wird geschlossen
          if (this.oneLine > this.end) {
            if (command > this.end && command < this.oneLine) {
              return true
            } else {
              return false;
            };
          } else {
            if (command > this.end) {
              return true;
            } else {
              return false;
            };
          }
        } else {                       // kein Kommentar wird geschlossen
          if (this.oneLine > -1) {
            if (command < this.oneLine) {
              return true;
            } else {
              return false;
            };
          } else {
            if (this.status < 0) {     // wir befinden uns bereits in einem Kommentar
              return false;
            } else {
              return true;               // nicht in einem Kommentar
            }
          }
        }
      }
    } else {
      return false;  // es gibt keinen passenden Text in der Zeile, deshalb false zurückgeben
    };
  };
  
  switchCommentStatus() {
    if (this.start > -1 && ((this.oneLine === -1) || (this.oneLine > -1 && this.start < this.oneLine))) {
      this.status = -1;
    };
    if (this.end > -1 && ((this.oneLine === -1) || (this.oneLine > -1 && this.end < this.oneLine))) {
      this.status = 1;
    }
  };
};

class GessTabsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    
    return new Promise((resolve, reject) => {
      
      var symbols = [];
      
      var labelRe = new RegExp(/\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels)\b\s*(["']?)([\w\.]*)\2\s*(((["']?)([\w\.]*)\6\s*)*)=/i);
      var variableRe = new RegExp(/\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\b\s*(["']?)([\w\.]*)\2\s*=/i);
      var computeWithRe = new RegExp(/\b(compute\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init)\b)\s*([\w\.]+)\b\s*=/i);
      var macroRe = new RegExp(/(?!(?:#macro)\s+)(#[\w\.]+)\b\s*\(/i);
      var expandRe = new RegExp(/(?:#expand)\s+(#[\w\.]+)\b/i);
      var tableRe = new RegExp(/\b(table)\b(?:[^=]*)=\s*[\w\.\s]*([\w\.]+)|\b(table)\b(?:[^=]*)=.+by\s+([\w\.]+)/i);

      let comments = new clComment();
      
      for (let i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (line.text.length === 0) {
          continue;
        }

        comments.checkCommentsInLine(line.text.search("//"),line.text.search("{"),line.text.search("}"));

        if (comments.checkIfInComment(line.text.search(labelRe))) {
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
        };
        if (comments.checkIfInComment(line.text.search(variableRe))) {
          let lineMatch = line.text.match(variableRe);
          if (lineMatch.length >= 3 && lineMatch[3].length > 0) {
            symbols.push({
              name: lineMatch[3],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase()
            });
          }
        };
        if (comments.checkIfInComment(line.text.search(computeWithRe))) {
          let lineMatch = line.text.match(computeWithRe);
          if (lineMatch.length >= 2 && lineMatch[2].length > 0) {
            symbols.push({
              name: lineMatch[2],
              kind: vscode.SymbolKind.Variable,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[1].toLocaleLowerCase()
            });
          }
        };
        if (comments.checkIfInComment(line.text.search(macroRe))) {
          let lineMatch = line.text.match(macroRe);
          if (lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: "macro"
            });
          }
        };
        if (comments.checkIfInComment(line.text.search(expandRe))) {
          let lineMatch = line.text.match(expandRe);
          if (lineMatch.length >= 1 && lineMatch[1].length > 0) {
            symbols.push({
              name: lineMatch[1],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: "expand"
            });
          }
        };
        if (comments.checkIfInComment(line.text.search(tableRe))) {
          let lineMatch = line.text.match(tableRe);
          if (lineMatch.length >= 2 && lineMatch[2].length > 0) {
            symbols.push({
              name: lineMatch[2],
              kind: vscode.SymbolKind.Function,
              location: new vscode.Location(document.uri, line.range),
              containerName: lineMatch[2].toLocaleLowerCase()
            });
          }
        };
        comments.switchCommentStatus();
      };
      
      resolve(symbols);

    });
  }
}

function getDefLocationInDocument(filename: string, word: string) {
  
  var variableRe = new RegExp("\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\\b\\s*([\"\']?)("+word+")\\2\\s*=", "i");
  var computeWithRe = new RegExp("\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*("+word+")\\b\\s*=", "i");
  var macroRe = new RegExp("#macro\\s*("+word+")\\b\\s*\\(|#[\\w\\.]+\\b\\s*\\(.*\\b("+word+")\\b","i");
  var expandRe = new RegExp("#expand\\s+("+word+")\\b","i");
  
  let locPosition: vscode.Location = null;

  return vscode.workspace.openTextDocument(filename).then((content) => {
    
    let comments = new clComment();
    
    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);
      
      comments.checkCommentsInLine(line.text.search("//"),line.text.search("{"),line.text.search("}"));
      
      if (comments.checkIfInComment(line.text.search(variableRe)) || 
          comments.checkIfInComment(line.text.search(computeWithRe)) ||
          comments.checkIfInComment(line.text.search(macroRe)) ||
          comments.checkIfInComment(line.text.search(expandRe)) ) {
        locPosition = new vscode.Location(content.uri, line.range);
      };
      comments.switchCommentStatus();
    };
    return(locPosition);
  });
};

class GessTabsDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(document: vscode.TextDocument, position: vscode.Position, 
          token: vscode.CancellationToken): Thenable<vscode.Location> {

    const adjustedPos = adjustWordPosition(document, position);

    return new Promise((resolve) => {
      
      if (!adjustedPos[0]) {
        return Promise.resolve(null);
      }

      const word = adjustedPos[1];

      let wsfolder = getWorkspaceFolderPath(document.uri) || fixDriveCasingInWindows(path.dirname(document.fileName));
      let fileNames: string[] = [];
      
      fileNames = getAllFiles(wsfolder,"(tab|inc)");
      
      let locations = fileNames.map(file => getDefLocationInDocument(file,word) );
      Promise.all(locations).then(function(content) {
        let locPos: vscode.Location = null;
        
        content.forEach(loc => {
          if (loc != null) {
            locPos = loc;
          };
        });
        
        return(locPos);
      }).then(result => {
        resolve(result);
      });
    });
  };
};

function getAllLocationInDocument(filename: string, word: string) {
  
  var labelRe = new RegExp("\\b(vartext|vartitle|valuelabels|text|title|labels|copylabels|uselabels)\\b\\s*.*([\"']?)("+word+")\\2.*=","i");
  var variableRe = new RegExp("\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance|excludevalues|includevalues)\\b\\s*([\"\']?)("+word+")\\2\\s*", "i");
  var computeWithRe = new RegExp("\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*("+word+")\\b\\s*", "i");
  var macroRe = new RegExp("#macro\\s*("+word+")\\b\\s*\\(|#[\\w\\.]+\\b\\s*\\(.*\\b("+word+")\\b","i");
  var expandRe = new RegExp("#expand\\s+("+word+")\\b","i");
  var tableRe = new RegExp("\\b(table)\\b(?:[^=]*)=\\s*[\\w\\.\\s]*("+word+"[^\\s]*)\\b|\\b(table)\\b(?:[^=]*)=.+by\\s*[\\w\\.\\s]*("+word+"[^\\s]*)\\b","i");
  let wordRe = new RegExp("(in)\\s*\\b("+word+"[^\\s]*)\\b|\\b("+word+"[^\\s]*)\\s*\\b(eq|ne|le|ge|lt|gt)\\b", "i");
  
  let locArray: vscode.Location[] = [];

  return vscode.workspace.openTextDocument(filename).then((content) => {

    let comments = new clComment();
    
    for (let i = 0; i < content.lineCount; i++) {
      let line = content.lineAt(i);
      
      comments.checkCommentsInLine(line.text.search("//"),line.text.search("{"),line.text.search("}"));
      
      if (comments.checkIfInComment(line.text.search(labelRe)) || 
          comments.checkIfInComment(line.text.search(variableRe)) || 
          comments.checkIfInComment(line.text.search(computeWithRe)) || 
          comments.checkIfInComment(line.text.search(macroRe)) ||
          comments.checkIfInComment(line.text.search(expandRe)) ||
          comments.checkIfInComment(line.text.search(tableRe)) ||
          comments.checkIfInComment(line.text.search(wordRe)) ) {
        locArray.push(new vscode.Location(content.uri, line.range));
      };
      comments.switchCommentStatus();
    };
    return(locArray);
  });
};

class GessTabsReferenceProvider implements vscode.ReferenceProvider {
    public provideReferences(
        document: vscode.TextDocument, position: vscode.Position,
        options: { includeDeclaration: boolean }, token: vscode.CancellationToken):
        Thenable<vscode.Location[]> {

      const adjustedPos = adjustWordPosition(document, position);

      return new Promise((resolve) => {
        
        if (!adjustedPos[0]) {
          return Promise.resolve(null);
        }
        const word = adjustedPos[1];
        
        let loclist: vscode.Location[] = [];
        
        let wsfolder = getWorkspaceFolderPath(document.uri) || fixDriveCasingInWindows(path.dirname(document.fileName));
        let fileNames: string[] = [];
        
        fileNames = getAllFiles(wsfolder,"(tab|inc)");

        let locations = fileNames.map(file => getAllLocationInDocument(file,word) );
        Promise.all(locations).then(
          function(content) {
            content.forEach(loc => {
              if (loc != null && loc[0] != null) {
                loc.forEach(arr => {
                  loclist.push(arr);
                })
              };
            });
            return(loclist);
          }).then(result => {
            resolve(result);
          }).catch(e => {
            resolve(null);
          });
    })
  };
};

class GessTabsWorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {

  public provideWorkspaceSymbols(query: string, token: vscode.CancellationToken):
    Thenable<vscode.SymbolInformation[]> {

    if (query.length === 0) {
      return(null);
    };
    
    var symbols = [];

    var variableRe = new RegExp("\\b(singleq|variable|varfamily|multiq|familyvar|makefamily|indexvar|invindexvar|combinedvar|vargroup|dichoq|groupvar|makegroup|spssgroup|init|groups|count|simplevar|bcdvar|bitgroup|mean|sum|min|max|stddev|variance)\\b\\s*([\"\']?)("+query+")\\2\\s*=", "i");
    var computeWithRe = new RegExp("\\b(compute\\s+(?:copy|swap|load|ascend|descend|shuffle|add|eliminate|init))\\b\\s*("+query+")\\b\\s*=", "i");
    var macroRe = new RegExp("#macro\\s+(#"+query+")\\b\\s*\\(","i");
    var expandRe = new RegExp("#expand\\s+(#"+query+")\\b","i");
    var tableRe = new RegExp("\\b(table)\\b(?:[^=]*)=\\s*[\\w\\.\\s]*\\b("+query+"[^\\s]*)\\b|\\b(table)\\b(?:[^=]*)=.+by\\s*[\\w\\.\\s]*\\b("+query+"[^\\s]*)\\b","i");
    let wordRe = new RegExp("(in)\\s*\\b("+query+"[^\\s]*)\\b|\\b("+query+"[^\\s]*)\\s*\\b(eq|ne|le|ge|lt|gt)\\b", "i");

    const wsfolder = getWorkspaceFolderPath(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri) || fixDriveCasingInWindows(path.dirname(vscode.window.activeTextEditor.document.fileName));

    return new Promise((resolve) => {
      getAllFiles(wsfolder,"(tab|inc)").forEach(file => {
        vscode.workspace.openTextDocument(wsfolder + "\\" + file).then(
          function(content) {
            let comments = new clComment();
            
            for (let i = 0; i < content.lineCount; i++) {
              let line = content.lineAt(i);
              comments.checkCommentsInLine(line.text.search("//"),line.text.search("{"),line.text.search("}"));
              
              if (line.text.search(query) > -1) {
                if (comments.checkIfInComment(line.text.search(variableRe))) {
                  symbols.push({
                      name: line.text.match(variableRe)[3],
                      kind: vscode.SymbolKind.Function,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: line.text.match(variableRe)[1]
                  });
                };
                if (comments.checkIfInComment(line.text.search(tableRe))) {
                  let nameStr: string;
                  let commandStr: string;
                  if (line.text.match(tableRe)[3] == null) {
                    nameStr = line.text.match(tableRe)[2];
                    commandStr = line.text.match(tableRe)[1];
                  } else {
                    nameStr = line.text.match(tableRe)[4];
                    commandStr = line.text.match(tableRe)[3];
                  }
                  symbols.push({
                      name: nameStr,
                      kind: vscode.SymbolKind.Function,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: commandStr
                  });
                };
                if (comments.checkIfInComment(line.text.search(wordRe))) {
                  let nameStr: string;
                  let commandStr: string;
                  if (line.text.match(wordRe)[3] == null) {
                    nameStr = line.text.match(wordRe)[2];
                    commandStr = line.text.match(wordRe)[1];
                  } else {
                    nameStr = line.text.match(wordRe)[3];
                    commandStr = line.text.match(wordRe)[4];
                  }
                  symbols.push({
                      name: nameStr,
                      kind: vscode.SymbolKind.Function,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: commandStr
                  });
                };
                if (comments.checkIfInComment(line.text.search(computeWithRe)) ||
                    comments.checkIfInComment(line.text.search(macroRe)) ||
                    comments.checkIfInComment(line.text.search(expandRe)) ) {
                  symbols.push({
                      name: line.text.match(computeWithRe)[2],
                      kind: vscode.SymbolKind.Function,
                      location: new vscode.Location(content.uri, line.range),
                      containerName: line.text.match(computeWithRe)[1]
                  });
                };
              };
            };
            return(symbols);
          }
        ).then(result => {
          resolve(result);
        });
      })
    });
  }
};
