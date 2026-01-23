"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose ipcRenderer.invoke via preload
electron_1.contextBridge.exposeInMainWorld('api', {
    sayHello: (param) => electron_1.ipcRenderer.invoke('sayHello', param)
});
