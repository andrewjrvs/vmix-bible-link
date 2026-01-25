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
} as Api);

