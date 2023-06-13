'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitsAnyFileSync = exports.findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync = exports.replaceRemappings = exports.formatPath = void 0;
const fs = require("fs");
const path = require("path");
function formatPath(contractPath) {
    return contractPath.replace(/\\/g, '/');
}
exports.formatPath = formatPath;
/**
 * Replaces remappings in the first array with matches from the second array,
 * then it concatenates only the unique strings from the 2 arrays.
 *
 * It splits the strings by '=' and checks the prefix of each element
 * @param remappings first array of remappings strings
 * @param replacer second array of remappings strings
 * @returns an array containing unique remappings
 */
function replaceRemappings(remappings, replacer) {
    remappings.forEach(function (remapping, index) {
        const prefix = remapping.split('=')[0];
        for (const replaceRemapping of replacer) {
            const replacePrefix = replaceRemapping.split('=')[0];
            if (prefix === replacePrefix) {
                remappings[index] = replaceRemapping;
                break;
            }
        }
    });
    return [...new Set([...remappings, ...replacer])];
}
exports.replaceRemappings = replaceRemappings;
function findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync(filenames, currentDocument, rootPath) {
    let currentDir = path.dirname(path.resolve(currentDocument));
    while (currentDir !== rootPath) {
        if (exitsAnyFileSync(filenames, currentDir)) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}
exports.findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync = findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync;
function exitsAnyFileSync(filenames, dir) {
    for (const fileName of filenames) {
        const file = path.join(dir, fileName);
        if (fs.existsSync(file)) {
            return true;
        }
    }
    return false;
}
exports.exitsAnyFileSync = exitsAnyFileSync;
//# sourceMappingURL=util.js.map