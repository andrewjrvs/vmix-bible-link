"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppUrl = getAppUrl;
exports.getAssetUrl = getAssetUrl;
exports.resolveElectronPath = resolveElectronPath;
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importDefault(require("url"));
const path_1 = tslib_1.__importDefault(require("path"));
function getAppUrl(route = '') {
    if (process.argv.includes('--dev')) {
        return `http://localhost:4200/#/${route}`;
    }
    return url_1.default.format({
        pathname: path_1.default.join(__dirname, 'browser/index.html'),
        protocol: 'file',
        slashes: true
    }) + `#/${route}`;
}
function getAssetUrl(asset) {
    const isDev = process.argv.includes('--dev');
    return path_1.default.resolve(__dirname, isDev ? '../src/assets' : 'browser/assets', asset);
}
function resolveElectronPath(file) {
    return path_1.default.resolve(__dirname, file);
}
