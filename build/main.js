"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const utility_1 = require("./utility");
const crypto_1 = require("crypto");
const bible_service_1 = require("./bible-service");
const vmix_service_1 = require("./vmix-service");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const logFile = path_1.default.join(electron_1.app.getPath('userData'), 'app.log');
function log(message) {
    const entry = `[${new Date().toISOString()}] ${message}`;
    console.log(entry);
    fs_1.default.appendFileSync(logFile, entry + '\n');
}
let mainWindow;
let updateWindow;
let bibleService;
let vmixService;
function createWindow() {
    const windowKey = (0, crypto_1.randomUUID)();
    const preloadPath = (0, utility_1.resolveElectronPath)('preload.js');
    const iconPath = (0, utility_1.getAssetUrl)('favicon.ico');
    log(`Creating window: preload=${preloadPath} icon=${iconPath}`);
    log(`Preload exists: ${fs_1.default.existsSync(preloadPath)}`);
    log(`Icon exists: ${fs_1.default.existsSync(iconPath)}`);
    const rtnWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        frame: false, // Hides the native title bar and frame
        transparent: true, // Makes the window background transparent
        icon: iconPath,
        webPreferences: {
            preload: preloadPath,
            additionalArguments: [`--window-id=${windowKey}`]
        }
    });
    rtnWindow.removeMenu();
    const route = (0, utility_1.getAppUrl)();
    log(`Loading URL: ${route}`);
    rtnWindow.loadURL(route).then(() => {
        log('URL loaded successfully');
    }).catch((err) => {
        log(`Failed to load URL: ${err.message}`);
    });
    rtnWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
        log(`did-fail-load: code=${errorCode} desc=${errorDescription} url=${validatedURL}`);
    });
    rtnWindow.webContents.on('did-finish-load', () => {
        log('did-finish-load');
    });
    rtnWindow.webContents.on('render-process-gone', (_event, details) => {
        log(`render-process-gone: reason=${details.reason} exitCode=${details.exitCode}`);
    });
    rtnWindow.on('unresponsive', () => {
        log('Window became unresponsive');
    });
    rtnWindow.on('closed', () => {
        log('Window closed');
        rtnWindow.destroy();
    });
    return rtnWindow;
}
// function createUpdateWindow() {
//   updateWindow = new BrowserWindow({
//     height: 400,
//     width: 600,
//     frame: false,       // Hides the native title bar and frame
//     transparent: true,  // Makes the window background transparent
//     icon: getAssetUrl("favicon.ico"),
//     webPreferences: {
//       preload: resolveElectronPath('preload.js')
//     }
//   });
//     updateWindow.removeMenu();
//   const route = getAppUrl('update')
//   updateWindow.loadURL(route)
//   updateWindow.on('closed', () => {
//     updateWindow.destroy()
//   });
// }
electron_1.app.on('ready', async () => {
    log(`App ready. userData=${electron_1.app.getPath('userData')}`);
    log(`__dirname=${__dirname}`);
    log(`process.argv=${JSON.stringify(process.argv)}`);
    log(`process.cwd=${process.cwd()}`);
    log(`process.resourcesPath=${process.resourcesPath}`);
    try {
        bibleService = new bible_service_1.BibleService();
        await bibleService.initialize();
        log('BibleService initialized');
    }
    catch (err) {
        log(`BibleService failed: ${err.message}`);
    }
    try {
        vmixService = new vmix_service_1.VmixService();
        log('VmixService initialized');
    }
    catch (err) {
        log(`VmixService failed: ${err.message}`);
    }
    mainWindow = createWindow();
    //createUpdateWindow()
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// Listen for events with ipcMain.handle
electron_1.ipcMain.handle('sayHello', (event, param) => {
    return "Hello " + param;
});
electron_1.ipcMain.handle('closeWindow', (event, windowId) => {
    if (mainWindow) {
        mainWindow.close();
    }
});
electron_1.ipcMain.handle('toggleMaximizeWindow', (event, windowId) => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow.maximize();
        }
    }
});
electron_1.ipcMain.handle('toggleDevTools', (event, windowId) => {
    if (mainWindow) {
        mainWindow.webContents.toggleDevTools();
    }
});
// Bible API handlers
electron_1.ipcMain.handle('uploadBible', (event, bibleJson) => {
    try {
        bibleService.uploadBible(bibleJson);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('isBibleLoaded', () => {
    return bibleService.isBibleLoaded();
});
electron_1.ipcMain.handle('getBooks', () => {
    return bibleService.getBooks();
});
electron_1.ipcMain.handle('clearBible', () => {
    try {
        bibleService.clearBible();
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('getChapterCount', (event, bookName) => {
    const book = bibleService.getBook(bookName);
    return book ? book.chapters.length : 0;
});
electron_1.ipcMain.handle('getChapterVerses', (event, bookName, chapter) => {
    const chapterData = bibleService.getChapter(bookName, chapter);
    if (!chapterData) {
        return [];
    }
    return chapterData.verses.map(v => ({
        verse: v.verse,
        text: v.text
    }));
});
electron_1.ipcMain.handle('openVerseWindow', (event, bookName, chapter, selectedVerses) => {
    const verseWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1200,
        frame: false,
        transparent: true,
        icon: (0, utility_1.getAssetUrl)('favicon.ico'),
        webPreferences: {
            preload: (0, utility_1.resolveElectronPath)('preload.js')
        }
    });
    verseWindow.removeMenu();
    // Encode parameters for URL
    const params = new URLSearchParams({
        book: bookName,
        chapter: chapter.toString(),
        verses: selectedVerses.join(',')
    });
    const route = (0, utility_1.getAppUrl)(`verses?${params.toString()}`);
    verseWindow.loadURL(route);
    verseWindow.on('closed', () => {
        verseWindow.destroy();
    });
});
electron_1.ipcMain.handle('sendVerseSelection', (event, bookName, chapter, verses) => {
    // Send the selection to the main window
    if (mainWindow) {
        mainWindow.webContents.send('verse-selection', {
            book: bookName,
            chapter: chapter,
            verses: verses
        });
    }
});
// Verse Groups API
electron_1.ipcMain.handle('saveVerseGroup', (event, group) => {
    return bibleService.saveVerseGroup(group);
});
electron_1.ipcMain.handle('getVerseGroups', () => {
    return bibleService.getVerseGroups();
});
electron_1.ipcMain.handle('updateVerseGroup', (event, group) => {
    return bibleService.updateVerseGroup(group);
});
electron_1.ipcMain.handle('deleteVerseGroup', (event, id) => {
    bibleService.deleteVerseGroup(id);
});
// vMix API
electron_1.ipcMain.handle('getVmixSettings', () => {
    return bibleService.getVmixSettings();
});
electron_1.ipcMain.handle('saveVmixSettings', (event, settings) => {
    bibleService.saveVmixSettings(settings);
});
electron_1.ipcMain.handle('getVmixInputs', async (event, host, port) => {
    return vmixService.fetchInputs(host, port);
});
electron_1.ipcMain.handle('getVmixState', async () => {
    try {
        const settings = bibleService.getVmixSettings();
        if (!settings.host) {
            return { active: 0, preview: 0, inputName: '', inputStatus: 'unknown' };
        }
        return vmixService.fetchState(settings.host, settings.port, settings.inputKey, settings.overlay || 1);
    }
    catch {
        return { active: 0, preview: 0, inputName: '', inputStatus: 'unknown' };
    }
});
electron_1.ipcMain.handle('sendToVmix', async (event, title, body) => {
    try {
        const settings = bibleService.getVmixSettings();
        if (!settings.inputKey) {
            return { success: false, error: 'No vMix input configured' };
        }
        if (settings.titleField) {
            await vmixService.setText(settings.host, settings.port, settings.inputKey, settings.titleField, title);
        }
        if (settings.bodyField) {
            await vmixService.setText(settings.host, settings.port, settings.inputKey, settings.bodyField, body);
        }
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('sendToVmixAndShow', async (event, title, body) => {
    try {
        const settings = bibleService.getVmixSettings();
        if (!settings.inputKey) {
            return { success: false, error: 'No vMix input configured' };
        }
        if (settings.titleField) {
            await vmixService.setText(settings.host, settings.port, settings.inputKey, settings.titleField, title);
        }
        if (settings.bodyField) {
            await vmixService.setText(settings.host, settings.port, settings.inputKey, settings.bodyField, body);
        }
        const overlay = settings.overlay || 1;
        await vmixService.setOverlay(settings.host, settings.port, overlay, settings.inputKey);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
