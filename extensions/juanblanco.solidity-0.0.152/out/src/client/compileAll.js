'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileAllContracts = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const contractsCollection_1 = require("../common/model/contractsCollection");
const projectService_1 = require("../common/projectService");
const util_1 = require("../common/util");
const workspaceUtil = require("./workspaceUtil");
function compileAllContracts(compiler, diagnosticCollection) {
    // Check if is folder, if not stop we need to output to a bin folder on rootPath
    if (workspaceUtil.getCurrentWorkspaceRootFolder() === undefined) {
        vscode.window.showWarningMessage('Please open a folder in Visual Studio Code as a workspace');
        return;
    }
    const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
    const packageDefaultDependenciesDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesDirectory');
    const packageDefaultDependenciesContractsDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesContractsDirectory');
    const compilationOptimisation = vscode.workspace.getConfiguration('solidity').get('compilerOptimization');
    const remappings = workspaceUtil.getSolidityRemappings();
    const contractsCollection = new contractsCollection_1.ContractCollection();
    const project = projectService_1.initialiseProject(rootPath, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    let solidityPath = '**/*.sol';
    if (project.projectPackage.sol_sources !== undefined && project.projectPackage.sol_sources !== '') {
        solidityPath = project.projectPackage.sol_sources + '/' + solidityPath;
    }
    // TODO parse excluded files
    let excludePath = '**/bin/**';
    if (project.projectPackage.build_dir !== undefined || project.projectPackage.build_dir === '') {
        excludePath = '**/' + project.projectPackage.build_dir + '/**';
    }
    // Process open Text Documents first as it is faster (We might need to save them all first? Is this assumed?)
    vscode.workspace.textDocuments.forEach(document => {
        if (path.extname(document.fileName) === '.sol') {
            const contractPath = document.fileName;
            const contractCode = document.getText();
            contractsCollection.addContractAndResolveImports(contractPath, contractCode, project);
        }
    });
    // Find all the other sol files, to compile them (1000 maximum should be enough for now)
    const files = vscode.workspace.findFiles(solidityPath, excludePath, 1000);
    return files.then(documents => {
        documents.forEach(document => {
            const contractPath = document.fsPath;
            // have we got this already opened? used those instead
            if (!contractsCollection.containsContract(contractPath)) {
                const contractCode = fs.readFileSync(document.fsPath, 'utf8');
                contractsCollection.addContractAndResolveImports(contractPath, contractCode, project);
            }
        });
        const sourceDirPath = util_1.formatPath(project.projectPackage.getSolSourcesAbsolutePath());
        let packagesPath = null;
        if (project.packagesDir != null) {
            packagesPath = util_1.formatPath(project.packagesDir);
        }
        compiler.compile(contractsCollection.getDefaultContractsForCompilation(compilationOptimisation), diagnosticCollection, project.projectPackage.build_dir, project.projectPackage.absoluletPath, sourceDirPath, packagesPath);
    });
}
exports.compileAllContracts = compileAllContracts;
//# sourceMappingURL=compileAll.js.map