import { app, BrowserWindow, ipcMain } from 'electron';
import { getAppUrl, getAssetUrl, resolveElectronPath } from './utility';
import { randomUUID  } from 'crypto';
import { BibleService } from './bible-service';

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;
let bibleService: BibleService;


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

app.on('ready', async () => {
  bibleService = new BibleService();
  await bibleService.initialize();
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

// Bible API handlers
ipcMain.handle('uploadBible', (event, bibleJson: any) => {
  try {
    bibleService.uploadBible(bibleJson);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('isBibleLoaded', () => {
  return bibleService.isBibleLoaded();
});

ipcMain.handle('getBooks', () => {
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
  const verseWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    frame: false,
    transparent: true,
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