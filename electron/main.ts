import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Xác định __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null;

console.log('Environment:', process.env.NODE_ENV);
console.log('isDev:', isDev);
console.log('Working directory:', process.cwd());
console.log('App path:', app.getAppPath());

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Xóa menu mặc định
  Menu.setApplicationMenu(null);

  if (isDev) {
    // Trong môi trường phát triển, kết nối với dev server
    const url = 'http://localhost:5173';
    console.log('Loading URL:', url);
    mainWindow.loadURL(url);
    // Mở DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // Trong sản xuất, thử nhiều đường dẫn có thể có
    const possiblePaths = [
      path.join(__dirname, '../release/build/index.html'),
      path.join(__dirname, '../dist/index.html'),
      path.join(app.getAppPath(), 'index.html'),
      path.join(process.cwd(), 'index.html')
    ];
    
    console.log('Possible index.html paths:');
    possiblePaths.forEach((p, i) => console.log(`[${i}] ${p}`));
    
    // Try to debug current paths
    try {
      console.log("Files in app root:", fs.readdirSync(app.getAppPath()));
    } catch (err: any) {
      console.log("Cannot list files in app root:", err.message);
    }
    
    // Find index.html in possible paths
    let indexPath = null;
    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          indexPath = p;
          console.log('Found index.html at:', indexPath);
          break;
        }
      } catch (err: any) {
        console.log('Error checking path:', p, err.message);
      }
    }
    
    if (indexPath) {
      console.log('Loading file:', indexPath);
      mainWindow.loadFile(indexPath);
      
      // Log content for debugging
      try {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        console.log('File content length:', indexContent.length);
      } catch (err: any) {
        console.error('Error reading file:', err.message);
      }
      
      // Open DevTools in production for debugging
      // mainWindow.webContents.openDevTools(); // Tắt DevTools mặc định trong production
    } else {
      console.error('Error: index.html not found in any location');
      // Show error message
      mainWindow.loadURL(`data:text/html,<h1>Error: File Not Found</h1><p>Cannot find index.html</p>`);
      // mainWindow.webContents.openDevTools(); // Tắt DevTools mặc định trong production
    }
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Xử lý các sự kiện IPC từ renderer process
ipcMain.on('message-from-renderer', (event, arg) => {
  console.log(arg);
  event.reply('message-from-main', 'Hello from main process');
});

// Xử lý tin nhắn đồng bộ
ipcMain.on('sync-message', (event, arg) => {
  console.log(arg);
  event.returnValue = 'Sync response from main process';
});

// Xử lý tin nhắn invoke
ipcMain.handle('invoke-message', async (event, arg) => {
  console.log(arg);
  return 'Invoke response from main process';
}); 