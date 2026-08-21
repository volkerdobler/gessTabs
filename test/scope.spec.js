"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vscode = __importStar(require("vscode"));
const scope_1 = require("../src/scope");
function makeDoc(text) {
    // Create a fake TextDocument-like object minimal for tests
    const lines = text.split('\n');
    return {
        uri: vscode.Uri.file('test'),
        lineCount: lines.length,
        lineAt: (n) => ({
            text: lines[n],
            range: new vscode.Range(new vscode.Position(n, 0), new vscode.Position(n, lines[n].length)),
        }),
    };
}
describe('Scope', () => {
    it('detects comments and strings', () => {
        const doc = makeDoc("var x = 1\n{ this is comment }\nname = 'a string'\n// rest comment");
        const s = new scope_1.Scope(doc);
        (0, chai_1.expect)(s.isNormalScope(0, 0)).to.be.true;
        (0, chai_1.expect)(s.isCommentScope(1, 0)).to.be.true;
        (0, chai_1.expect)(s.isStringScope(2, 12)).to.be.true;
        (0, chai_1.expect)(s.isCommentScope(3, 0)).to.be.true;
    });
});
//# sourceMappingURL=scope.spec.js.map