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
});
