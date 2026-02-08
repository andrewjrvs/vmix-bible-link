import { contextBridge, ipcRenderer } from 'electron'
import { Api } from './api';

const windowIdArg = process.argv.find(arg => arg.startsWith('--window-id='));
const windowId = windowIdArg ? windowIdArg.split('=')[1] : null;

// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    sayHello: (param: string) => ipcRenderer.invoke('sayHello', param),
    closeApp: () => ipcRenderer.invoke('closeApp'),
    closeWindow: () => ipcRenderer.invoke('closeWindow', windowId),
    toggleWindow: () => ipcRenderer.invoke('toggleMaximizeWindow', windowId),
    toggleDevTools: () => ipcRenderer.invoke('toggleDevTools', windowId),
    // Bible API
    uploadBible: (bibleJson: any) => ipcRenderer.invoke('uploadBible', bibleJson),
    isBibleLoaded: () => ipcRenderer.invoke('isBibleLoaded'),
    getBooks: () => ipcRenderer.invoke('getBooks'),
    clearBible: () => ipcRenderer.invoke('clearBible'),
    getChapterCount: (bookName: string) => ipcRenderer.invoke('getChapterCount', bookName),
    getChapterVerses: (bookName: string, chapter: number) => ipcRenderer.invoke('getChapterVerses', bookName, chapter),
    openVerseWindow: (bookName: string, chapter: number, selectedVerses: number[]) => ipcRenderer.invoke('openVerseWindow', bookName, chapter, selectedVerses),
    sendVerseSelection: (bookName: string, chapter: number, verses: any[]) => ipcRenderer.invoke('sendVerseSelection', bookName, chapter, verses),
    onVerseSelection: (callback: (data: any) => void) => {
        ipcRenderer.on('verse-selection', (_event, data) => callback(data));
    }
} as Api);

