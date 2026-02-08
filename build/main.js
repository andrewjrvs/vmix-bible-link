"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utility_1 = require("./utility");
const crypto_1 = require("crypto");
const bible_service_1 = require("./bible-service");
let mainWindow;
let updateWindow;
let bibleService;
function createWindow() {
    const windowKey = (0, crypto_1.randomUUID)();
    const rtnWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        frame: false, // Hides the native title bar and frame
        transparent: true, // Makes the window background transparent    
        icon: (0, utility_1.getAssetUrl)('favicon.ico'),
        webPreferences: {
            preload: (0, utility_1.resolveElectronPath)('preload.js'),
            additionalArguments: [`--window-id=${windowKey}`]
        }
    });
    rtnWindow.removeMenu();
    const route = (0, utility_1.getAppUrl)();
    rtnWindow.loadURL(route);
    rtnWindow.on('closed', () => {
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
    bibleService = new bible_service_1.BibleService();
    await bibleService.initialize();
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
