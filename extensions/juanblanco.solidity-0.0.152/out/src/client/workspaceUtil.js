"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolidityRemappings = exports.getCurrentWorkspaceRootFolder = exports.getCurrentWorkspaceRootFsPath = exports.getCurrentProjectInWorkspaceRootFsPath = void 0;
const vscode = require("vscode");
const util_1 = require("../common/util");
const projectService_1 = require("../common/projectService");
function getCurrentProjectInWorkspaceRootFsPath() {
    const monoreposupport = vscode.workspace.getConfiguration('solidity').get('monoRepoSupport');
    var currentRootPath = getCurrentWorkspaceRootFsPath();
    if (monoreposupport) {
        var editor = vscode.window.activeTextEditor;
        const currentDocument = editor.document.uri;
        var projectFolder = projectService_1.findFirstRootProjectFile(currentRootPath, currentDocument.fsPath);
        if (projectFolder == null) {
            return currentRootPath;
        }
        else {
            return projectFolder;
        }
    }
    else {
        return currentRootPath;
    }
}
exports.getCurrentProjectInWorkspaceRootFsPath = getCurrentProjectInWorkspaceRootFsPath;
function getCurrentWorkspaceRootFsPath() {
    return getCurrentWorkspaceRootFolder().uri.fsPath;
}
exports.getCurrentWorkspaceRootFsPath = getCurrentWorkspaceRootFsPath;
function getCurrentWorkspaceRootFolder() {
    var editor = vscode.window.activeTextEditor;
    const currentDocument = editor.document.uri;
    return vscode.workspace.getWorkspaceFolder(currentDocument);
}
exports.getCurrentWorkspaceRootFolder = getCurrentWorkspaceRootFolder;
function getSolidityRemappings() {
    const remappings = vscode.workspace.getConfiguration('solidity').get('remappings');
    if (process.platform === 'win32') {
        return util_1.replaceRemappings(remappings, vscode.workspace.getConfiguration('solidity').get('remappingsWindows'));
    }
    else {
        return util_1.replaceRemappings(remappings, vscode.workspace.getConfiguration('solidity').get('remappingsUnix'));
    }
}
exports.getSolidityRemappings = getSolidityRemappings;
//# sourceMappingURL=workspaceUtil.js.map