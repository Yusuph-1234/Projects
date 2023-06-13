"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const parser = require("web-tree-sitter");
const jsonc = require("jsonc-parser");
const fs = require("fs");
const path = require("path");
// Grammar class
const parserPromise = parser.init();
class Grammar {
    // Constructor
    constructor(lang) {
        // Grammar
        this.simpleTerms = {};
        this.complexTerms = [];
        this.complexScopes = {};
        this.complexDepth = 0;
        this.complexOrder = false;
        // Parse grammar file
        this.lang = lang;
        const grammarFile = __dirname + "/../grammars/" + lang + ".json";
        const grammarJson = jsonc.parse(fs.readFileSync(grammarFile).toString());
        for (const t in grammarJson.simpleTerms)
            this.simpleTerms[t] = grammarJson.simpleTerms[t];
        for (const t in grammarJson.complexTerms)
            this.complexTerms[t] = grammarJson.complexTerms[t];
        for (const t in grammarJson.complexScopes)
            this.complexScopes[t] = grammarJson.complexScopes[t];
        for (const s in this.complexScopes) {
            const depth = s.split(">").length;
            if (depth > this.complexDepth)
                this.complexDepth = depth;
            if (s.indexOf("[") >= 0)
                this.complexOrder = true;
        }
        this.complexDepth--;
    }
    // Parser initialization
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Load wasm parser
            yield parserPromise;
            this.parser = new parser();
            let langFile = path.join(__dirname, "../parsers", this.lang + ".wasm");
            const langObj = yield parser.Language.load(langFile);
            this.parser.setLanguage(langObj);
        });
    }
    // Build syntax tree
    tree(doc) {
        return this.parser.parse(doc);
    }
    // Parse syntax tree
    parse(tree) {
        // Travel tree and peek terms
        let terms = [];
        let stack = [];
        let node = tree.rootNode.firstChild;
        while (stack.length > 0 || node) {
            // Go deeper
            if (node) {
                stack.push(node);
                node = node.firstChild;
            }
            // Go back
            else {
                node = stack.pop();
                let type = node.type;
                if (!node.isNamed())
                    type = '"' + type + '"';
                // Simple one-level terms
                let term = undefined;
                if (!this.complexTerms.includes(type)) {
                    term = this.simpleTerms[type];
                }
                // Complex terms require multi-level analyzes
                else {
                    // Build complex scopes
                    let desc = type;
                    let scopes = [desc];
                    let parent = node.parent;
                    for (let i = 0; i < this.complexDepth && parent; i++) {
                        let parentType = parent.type;
                        if (!parent.isNamed())
                            parentType = '"' + parentType + '"';
                        desc = parentType + " > " + desc;
                        scopes.push(desc);
                        parent = parent.parent;
                    }
                    // If there is also order complexity
                    if (this.complexOrder) {
                        let index = 0;
                        let sibling = node.previousSibling;
                        while (sibling) {
                            if (sibling.type === node.type)
                                index++;
                            sibling = sibling.previousSibling;
                        }
                        let rindex = -1;
                        sibling = node.nextSibling;
                        while (sibling) {
                            if (sibling.type === node.type)
                                rindex--;
                            sibling = sibling.nextSibling;
                        }
                        let orderScopes = [];
                        for (let i = 0; i < scopes.length; i++)
                            orderScopes.push(scopes[i], scopes[i] + "[" + index + "]", scopes[i] + "[" + rindex + "]");
                        scopes = orderScopes;
                    }
                    // Use most complex scope
                    for (const d of scopes)
                        if (d in this.complexScopes)
                            term = this.complexScopes[d];
                }
                // If term is found add it
                if (term) {
                    terms.push({
                        term: term,
                        range: new vscode.Range(new vscode.Position(node.startPosition.row, node.startPosition.column), new vscode.Position(node.endPosition.row, node.endPosition.column))
                    });
                }
                // Go right
                node = node.nextSibling;
            }
        }
        return terms;
    }
}
// Semantic token legend
const termMap = new Map();
function buildLegend() {
    // Terms vocabulary
    termMap.set("type", { type: "type" });
    termMap.set("scope", { type: "namespace" });
    termMap.set("function", { type: "function" });
    termMap.set("variable", { type: "variable" });
    termMap.set("number", { type: "number" });
    termMap.set("string", { type: "string" });
    termMap.set("comment", { type: "comment" });
    termMap.set("constant", { type: "variable", modifiers: ["readonly", "defaultLibrary"] });
    termMap.set("directive", { type: "macro" });
    termMap.set("control", { type: "keyword" });
    termMap.set("operator", { type: "operator" });
    termMap.set("modifier", { type: "type", modifiers: ["modification"] });
    termMap.set("punctuation", { type: "punctuation" });
    // Tokens and modifiers in use
    let tokens = [];
    let modifiers = [];
    termMap.forEach(t => {
        var _a;
        if (!tokens.includes(t.type))
            tokens.push(t.type);
        (_a = t.modifiers) === null || _a === void 0 ? void 0 : _a.forEach(m => {
            if (!modifiers.includes(m))
                modifiers.push(m);
        });
    });
    // Construct semantic token legend
    return new vscode.SemanticTokensLegend(tokens, modifiers);
}
const legend = buildLegend();
// Semantic token provider
class TokensProvider {
    constructor() {
        this.grammars = {};
        this.trees = {};
        this.supportedTerms = [];
        // Terms
        const availableTerms = [
            "type", "scope", "function", "variable", "number", "string", "comment",
            "constant", "directive", "control", "operator", "modifier", "punctuation",
        ];
        const enabledTerms = vscode.workspace.
            getConfiguration("syntax").get("highlightTerms");
        availableTerms.forEach(term => {
            if (enabledTerms.includes(term))
                this.supportedTerms.push(term);
        });
        if (!vscode.workspace.getConfiguration("syntax").get("highlightComment"))
            if (this.supportedTerms.includes("comment"))
                this.supportedTerms.splice(this.supportedTerms.indexOf("comment"), 1);
        this.debugDepth = vscode.workspace.getConfiguration("syntax").get("debugDepth");
    }
    // Provide document tokens
    provideDocumentSemanticTokens(doc, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Grammar
            const lang = doc.languageId;
            if (!(lang in this.grammars)) {
                this.grammars[lang] = new Grammar(lang);
                yield this.grammars[lang].init();
            }
            // Parse document
            const grammar = this.grammars[lang];
            const tree = grammar.tree(doc.getText());
            const terms = grammar.parse(tree);
            this.trees[doc.uri.toString()] = tree;
            // Build tokens
            const builder = new vscode.SemanticTokensBuilder(legend);
            terms.forEach((t) => {
                if (!this.supportedTerms.includes(t.term))
                    return;
                const type = termMap.get(t.term).type;
                const modifiers = termMap.get(t.term).modifiers;
                if (t.range.start.line === t.range.end.line)
                    return builder.push(t.range, type, modifiers);
                let line = t.range.start.line;
                builder.push(new vscode.Range(t.range.start, doc.lineAt(line).range.end), type, modifiers);
                for (line = line + 1; line < t.range.end.line; line++)
                    builder.push(doc.lineAt(line).range, type, modifiers);
                builder.push(new vscode.Range(doc.lineAt(line).range.start, t.range.end), type, modifiers);
            });
            return builder.build();
        });
    }
    // Provide hover tooltips
    provideHover(doc, pos, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = doc.uri.toString();
            if (!(uri in this.trees))
                return null;
            const grammar = this.grammars[doc.languageId];
            const tree = this.trees[uri];
            const xy = { row: pos.line, column: pos.character };
            let node = tree.rootNode.descendantForPosition(xy);
            if (!node)
                return null;
            let type = node.type;
            if (!node.isNamed())
                type = '"' + type + '"';
            let parent = node.parent;
            const depth = Math.max(grammar.complexDepth, this.debugDepth);
            for (let i = 0; i < depth && parent; i++) {
                let parentType = parent.type;
                if (!parent.isNamed())
                    parentType = '"' + parentType + '"';
                type = parentType + " > " + type;
                parent = parent.parent;
            }
            // If there is also order complexity
            if (grammar.complexOrder) {
                let index = 0;
                let sibling = node.previousSibling;
                while (sibling) {
                    if (sibling.type === node.type)
                        index++;
                    sibling = sibling.previousSibling;
                }
                let rindex = -1;
                sibling = node.nextSibling;
                while (sibling) {
                    if (sibling.type === node.type)
                        rindex--;
                    sibling = sibling.nextSibling;
                }
                type = type + "[" + index + "]" + "[" + rindex + "]";
            }
            return {
                contents: [type],
                range: new vscode.Range(node.startPosition.row, node.startPosition.column, node.endPosition.row, node.endPosition.column)
            };
        });
    }
}
// Extension activation
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Languages
        let availableGrammars = [];
        fs.readdirSync(__dirname + "/../grammars/").forEach(name => {
            availableGrammars.push(path.basename(name, ".json"));
        });
        let availableParsers = [];
        fs.readdirSync(__dirname + "/../parsers/").forEach(name => {
            availableParsers.push(path.basename(name, ".wasm"));
        });
        const enabledLangs = vscode.workspace.getConfiguration("syntax").get("highlightLanguages");
        let supportedLangs = [];
        availableGrammars.forEach(lang => {
            if (availableParsers.includes(lang) && enabledLangs.includes(lang))
                supportedLangs.push({ language: lang });
        });
        const engine = new TokensProvider();
        context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(supportedLangs, engine, legend));
        // Register debug hover providers
        // Very useful tool for implementation and fixing of grammars
        if (vscode.workspace.getConfiguration("syntax").get("debugHover"))
            for (const lang of supportedLangs)
                vscode.languages.registerHoverProvider(lang, engine);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map