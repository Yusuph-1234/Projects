'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileActiveContract = exports.initDiagnosticCollection = void 0;
const vscode = require("vscode");
const path = require("path");
const contractsCollection_1 = require("../common/model/contractsCollection");
const projectService_1 = require("../common/projectService");
const util_1 = require("../common/util");
const workspaceUtil = require("./workspaceUtil");
let diagnosticCollection;
function initDiagnosticCollection(diagnostics) {
    diagnosticCollection = diagnostics;
}
exports.initDiagnosticCollection = initDiagnosticCollection;
function compileActiveContract(compiler, overrideDefaultCompiler = null) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // We need something open
    }
    if (path.extname(editor.document.fileName) !== '.sol') {
        vscode.window.showWarningMessage('This not a solidity file (*.sol)');
        return;
    }
    // Check if is folder, if not stop we need to output to a bin folder on rootPath
    if (workspaceUtil.getCurrentWorkspaceRootFolder() === undefined) {
        vscode.window.showWarningMessage('Please open a folder in Visual Studio Code as a workspace');
        return;
    }
    const contractsCollection = new contractsCollection_1.ContractCollection();
    const contractCode = editor.document.getText();
    const contractPath = editor.document.fileName;
    const packageDefaultDependenciesDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesDirectory');
    const packageDefaultDependenciesContractsDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesContractsDirectory');
    const compilationOptimisation = vscode.workspace.getConfiguration('solidity').get('compilerOptimization');
    const remappings = workspaceUtil.getSolidityRemappings();
    const project = projectService_1.initialiseProject(workspaceUtil.getCurrentProjectInWorkspaceRootFsPath(), packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    const contract = contractsCollection.addContractAndResolveImports(contractPath, contractCode, project);
    let packagesPath = null;
    if (project.packagesDir != null) {
        packagesPath = util_1.formatPath(project.packagesDir);
    }
    return compiler.compile(contractsCollection.getDefaultContractsForCompilation(compilationOptimisation), diagnosticCollection, project.projectPackage.build_dir, project.projectPackage.absoluletPath, null, packagesPath, contract.absolutePath, overrideDefaultCompiler);
}
exports.compileActiveContract = compileActiveContract;
//# sourceMappingURL=compileActive.js.map