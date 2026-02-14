"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const windowIdArg = process.argv.find(arg => arg.startsWith('--window-id='));
const windowId = windowIdArg ? windowIdArg.split('=')[1] : null;
// Expose ipcRenderer.invoke via preload
electron_1.contextBridge.exposeInMainWorld('api', {
    sayHello: (param) => electron_1.ipcRenderer.invoke('sayHello', param),
    closeApp: () => electron_1.ipcRenderer.invoke('closeApp'),
    closeWindow: () => electron_1.ipcRenderer.invoke('closeWindow', windowId),
    toggleWindow: () => electron_1.ipcRenderer.invoke('toggleMaximizeWindow', windowId),
    toggleDevTools: () => electron_1.ipcRenderer.invoke('toggleDevTools', windowId),
    // Bible API
    uploadBible: (bibleJson) => electron_1.ipcRenderer.invoke('uploadBible', bibleJson),
    isBibleLoaded: () => electron_1.ipcRenderer.invoke('isBibleLoaded'),
    getBooks: () => electron_1.ipcRenderer.invoke('getBooks'),
    clearBible: () => electron_1.ipcRenderer.invoke('clearBible'),
    getChapterCount: (bookName) => electron_1.ipcRenderer.invoke('getChapterCount', bookName),
    getChapterVerses: (bookName, chapter) => electron_1.ipcRenderer.invoke('getChapterVerses', bookName, chapter),
    openVerseWindow: (bookName, chapter, selectedVerses) => electron_1.ipcRenderer.invoke('openVerseWindow', bookName, chapter, selectedVerses),
    sendVerseSelection: (bookName, chapter, verses) => electron_1.ipcRenderer.invoke('sendVerseSelection', bookName, chapter, verses),
    onVerseSelection: (callback) => {
        electron_1.ipcRenderer.on('verse-selection', (_event, data) => callback(data));
    },
    // Verse Groups API
    saveVerseGroup: (group) => electron_1.ipcRenderer.invoke('saveVerseGroup', group),
    getVerseGroups: () => electron_1.ipcRenderer.invoke('getVerseGroups'),
    updateVerseGroup: (group) => electron_1.ipcRenderer.invoke('updateVerseGroup', group),
    deleteVerseGroup: (id) => electron_1.ipcRenderer.invoke('deleteVerseGroup', id),
    // vMix API
    getVmixSettings: () => electron_1.ipcRenderer.invoke('getVmixSettings'),
    saveVmixSettings: (settings) => electron_1.ipcRenderer.invoke('saveVmixSettings', settings),
    getVmixInputs: (host, port) => electron_1.ipcRenderer.invoke('getVmixInputs', host, port),
    sendToVmix: (title, body) => electron_1.ipcRenderer.invoke('sendToVmix', title, body),
    getVmixState: () => electron_1.ipcRenderer.invoke('getVmixState'),
});
