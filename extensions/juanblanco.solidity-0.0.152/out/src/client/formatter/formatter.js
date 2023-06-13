"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDocument = void 0;
const vscode = require("vscode");
const prettier = require("./prettierFormatter");
const forge = require("./forgeFormatter");
function formatDocument(document, context) {
    const formatter = vscode.workspace.getConfiguration('solidity').get('formatter');
    console.log(formatter);
    switch (formatter) {
        case 'prettier':
            return Promise.resolve(prettier.formatDocument(document, context));
        case 'forge':
            return forge.formatDocument(document, context);
        default:
            return null;
    }
}
exports.formatDocument = formatDocument;
//# sourceMappingURL=formatter.js.map