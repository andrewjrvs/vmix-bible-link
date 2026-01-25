"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utility_1 = require("./utility");
const crypto_1 = require("crypto");
let mainWindow;
let updateWindow;
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
electron_1.app.on('ready', () => {
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
