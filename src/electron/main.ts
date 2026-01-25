import { app, BrowserWindow, ipcMain } from 'electron';
import { getAppUrl, getAssetUrl, resolveElectronPath } from './utility';
import { randomUUID  } from 'crypto';

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;


function createWindow() {
  const windowKey = randomUUID();
  const rtnWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,       // Hides the native title bar and frame
    transparent: true,  // Makes the window background transparent    
    icon: getAssetUrl('favicon.ico'),
    webPreferences: {
      preload: resolveElectronPath('preload.js'),
      additionalArguments: [`--window-id=${windowKey}`]
    }
  });
  rtnWindow.removeMenu()

  const route = getAppUrl()

  rtnWindow.loadURL(route)

  rtnWindow.on('closed', () => {
    rtnWindow.destroy()
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

app.on('ready', () => {
  mainWindow = createWindow();
  //createUpdateWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Listen for events with ipcMain.handle
ipcMain.handle('sayHello', (event, param: string) => {
  return "Hello " + param
});

ipcMain.handle('closeWindow', (event, windowId: string) => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('toggleMaximizeWindow', (event, windowId: string) => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});
ipcMain.handle('toggleDevTools', (event, windowId: string) => {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools();
  }
});