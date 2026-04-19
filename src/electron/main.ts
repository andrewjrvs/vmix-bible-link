import { app, BrowserWindow, ipcMain } from 'electron';
import { getAppUrl, getAssetUrl, resolveElectronPath } from './utility';
import { randomUUID  } from 'crypto';
import { BibleService } from './bible-service';
import { VmixService } from './vmix-service';
import fs from 'fs';
import path from 'path';

// prevent Chromium from throttling or degrading background/occluded windows
// this should be set as early as possible, before the app is ready
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
// Force GPU rasterization even when Windows performance settings reduce GPU usage,
// preventing Chromium from falling back to software rendering (which causes blur).
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');


const logFile = path.join(app.getPath('userData'), 'app.log');
function log(message: string) {
  const entry = `[${new Date().toISOString()}] ${message}`;
  console.log(entry);
  fs.appendFileSync(logFile, entry + '\n');
}

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;
let bibleService: BibleService;
let vmixService: VmixService;


function createWindow() {
  const windowKey = randomUUID();
  const preloadPath = resolveElectronPath('preload.js');
  const iconPath = getAssetUrl('favicon.ico');
  log(`Creating window: preload=${preloadPath} icon=${iconPath}`);
  log(`Preload exists: ${fs.existsSync(preloadPath)}`);
  log(`Icon exists: ${fs.existsSync(iconPath)}`);

  // read the user preference for transparency; defaults to true if not set
  const isTransparent = bibleService?.getWindowTransparency ? bibleService.getWindowTransparency() : true;

  const rtnWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,       // Hides the native title bar and frame
    transparent: isTransparent,  // respect user preference
    show: false,        // don't show until content is ready
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      additionalArguments: [`--window-id=${windowKey}`]
    }
  });
  rtnWindow.removeMenu()

  rtnWindow.once('ready-to-show', () => {
    rtnWindow.show();
  });

  const route = getAppUrl()
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

app.on('ready', async () => {
  log(`App ready. userData=${app.getPath('userData')}`);
  log(`__dirname=${__dirname}`);
  log(`process.argv=${JSON.stringify(process.argv)}`);
  log(`process.cwd=${process.cwd()}`);
  log(`process.resourcesPath=${process.resourcesPath}`);

  // Start window creation immediately while services initialize in parallel
  bibleService = new BibleService();
  vmixService = new VmixService();
  mainWindow = createWindow();

  // Initialize services in the background
  try {
    await bibleService.initialize();
    log('BibleService initialized');
  } catch (err) {
    log(`BibleService failed: ${(err as Error).message}`);
  }
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

// window transparency preference handlers
ipcMain.handle('getWindowTransparency', () => {
  return bibleService ? bibleService.getWindowTransparency() : true;
});

ipcMain.handle('setWindowTransparency', (_event, enabled: boolean) => {
  if (bibleService) {
    bibleService.setWindowTransparency(enabled);
  }

  // if the main window already exists, recreate it so the new option takes effect
  if (mainWindow) {
    const maximized = mainWindow.isMaximized();
    // preserve size/position if desired
    mainWindow.close();
    mainWindow = createWindow();
    if (maximized) {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('getWindowBounds', () => {
  return mainWindow ? mainWindow.getBounds() : { x:0,y:0,width:800,height:600 };
});

ipcMain.handle('setWindowBounds', (_event, bounds: { x:number; y:number; width:number; height:number }) => {
  if (mainWindow) {
    mainWindow.setBounds(bounds);
  }
});

// Bible API handlers
ipcMain.handle('uploadBible', (event, bibleJson: any) => {
  try {
    bibleService.uploadBible(bibleJson);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('isBibleLoaded', async () => {
  await bibleService.ready;
  return bibleService.isBibleLoaded();
});

ipcMain.handle('getBooks', async () => {
  await bibleService.ready;
  return bibleService.getBooks();
});

ipcMain.handle('clearBible', () => {
  try {
    bibleService.clearBible();
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('getChapterCount', (event, bookName: string) => {
  const book = bibleService.getBook(bookName);
  return book ? book.chapters.length : 0;
});

ipcMain.handle('getChapterVerses', (event, bookName: string, chapter: number) => {
  const chapterData = bibleService.getChapter(bookName, chapter);
  if (!chapterData) {
    return [];
  }
  return chapterData.verses.map(v => ({
    verse: v.verse,
    text: v.text
  }));
});

ipcMain.handle('openVerseWindow', (event, bookName: string, chapter: number, selectedVerses: number[]) => {
  const isTransparent = bibleService?.getWindowTransparency ? bibleService.getWindowTransparency() : true;
  const verseWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    frame: false,
    transparent: isTransparent,
    icon: getAssetUrl('favicon.ico'),
    webPreferences: {
      preload: resolveElectronPath('preload.js')
    }
  });
  verseWindow.removeMenu();

  // Encode parameters for URL
  const params = new URLSearchParams({
    book: bookName,
    chapter: chapter.toString(),
    verses: selectedVerses.join(',')
  });

  const route = getAppUrl(`verses?${params.toString()}`);
  verseWindow.loadURL(route);

  verseWindow.on('closed', () => {
    verseWindow.destroy();
  });
});

ipcMain.handle('sendVerseSelection', (event, bookName: string, chapter: number, verses: any[]) => {
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
ipcMain.handle('saveVerseGroup', (event, group: any) => {
  return bibleService.saveVerseGroup(group);
});

ipcMain.handle('getVerseGroups', () => {
  return bibleService.getVerseGroups();
});

ipcMain.handle('updateVerseGroup', (event, group: any) => {
  return bibleService.updateVerseGroup(group);
});

ipcMain.handle('deleteVerseGroup', (event, id: string) => {
  bibleService.deleteVerseGroup(id);
});

// vMix API
ipcMain.handle('getVmixSettings', () => {
  return bibleService.getVmixSettings();
});

ipcMain.handle('saveVmixSettings', (event, settings: any) => {
  bibleService.saveVmixSettings(settings);
});

ipcMain.handle('getVmixInputs', async (event, host: string, port: number) => {
  return vmixService.fetchInputs(host, port);
});

ipcMain.handle('getVmixState', async () => {
  try {
    const settings = bibleService.getVmixSettings();
    if (!settings.host) {
      return { active: 0, preview: 0, inputName: '', inputStatus: 'unknown' };
    }
    return vmixService.fetchState(settings.host, settings.port, settings.inputKey, settings.overlay || 1);
  } catch {
    return { active: 0, preview: 0, inputName: '', inputStatus: 'unknown' };
  }
});

ipcMain.handle('sendToVmix', async (event, title: string, body: string) => {
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
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('sendToVmixAndShow', async (event, title: string, body: string) => {
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
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});