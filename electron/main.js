const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const si = require('systeminformation');
const { machineIdSync } = require('node-machine-id');

function getDeviceInfoCachePath() {
  try {
    return path.join(app.getPath('userData'), 'device-info.json');
  } catch {
    return path.join(os.tmpdir(), 'device-info.json');
  }
}

async function buildDeviceInfo() {
  const [system, osInfo, cpu, mem, memLayout, diskLayout, fsSize, bios, baseboard, graphics, networkInterfaces] = await Promise.all([
    si.system(),
    si.osInfo(),
    si.cpu(),
    si.mem(),
    si.memLayout(),
    si.diskLayout(),
    si.fsSize(),
    si.bios(),
    si.baseboard(),
    si.graphics(),
    si.networkInterfaces(),
  ]);

  const cpus = os.cpus() || [];
  const network = os.networkInterfaces();
  const userInfo = os.userInfo();

  return {
    platform: osInfo.platform,
    release: osInfo.release,
    arch: os.arch(),
    hostname: os.hostname(),
    distro: osInfo.distro,
    build: osInfo.build,
    kernel: osInfo.kernel,
    system,
    user: {
      username: userInfo?.username,
      homedir: userInfo?.homedir,
      shell: userInfo?.shell,
    },
    cpu: {
      manufacturer: cpu.manufacturer,
      brand: cpu.brand,
      speed: cpu.speed, // GHz
      physicalCores: cpu.physicalCores,
      cores: cpu.cores,
      processors: cpu.processors,
      cache: cpu.cache,
    },
    cpus, // raw node snapshot
    memory: {
      totalBytes: mem.total,
      freeBytes: mem.free,
      usedBytes: mem.used,
      active: mem.active,
      available: mem.available,
      swaptotal: mem.swaptotal,
      swapused: mem.swapused,
      swapfree: mem.swapfree,
      layout: memLayout,
    },
    disks: fsSize,
    diskLayout,
    bios,
    baseboard,
    graphics,
    network,
    networkInterfaces,
    versions: process.versions,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  };
}

async function collectAndCacheDeviceInfo() {
  try {
    const data = await buildDeviceInfo();
    const payload = { data, fetchedAt: Date.now() };
    const cachePath = getDeviceInfoCachePath();
    fs.writeFile(cachePath, JSON.stringify(payload), { encoding: 'utf-8' }, () => {
      // notify renderer non-blocking
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('device-info:ready');
      }
    });
  } catch (e) {
    // Silent fail to avoid disturbing startup
  }
}
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Window control handlers for frameless window
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Helper to run shell command and capture output (Windows WMI / wmic)
function runCmd(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { windowsHide: true }, (error, stdout) => {
      if (error) return resolve('');
      resolve(stdout.toString());
    });
  });
}

// Collect detailed device information using systeminformation
ipcMain.handle('device-info:get', async () => {
  return buildDeviceInfo();
});

ipcMain.handle('device-info:get-cached', async () => {
  try {
    const cachePath = getDeviceInfoCachePath();
    if (fs.existsSync(cachePath)) {
      const txt = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(txt);
    }
  } catch {}
  return null;
});

ipcMain.handle('device-info:refresh', async () => {
  // Trigger background refresh without blocking
  collectAndCacheDeviceInfo();
  return true;
});

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Remove window frame for frameless design
    titleBarStyle: 'hidden', // Hide title bar on macOS
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/vite.svg'), // You can change this to your app icon
    show: false, // Don't show until ready-to-show
    transparent: false, // Keep false for better performance, set to true if you need transparency
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true
  });

  // Load the app
  if (isDev) {
    // In development, load from localhost
    mainWindow.loadURL('http://localhost:5174');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize(); // Always start maximized
    
    // Focus on window on creation
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window maximize/unmaximize events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  // Kick off background device info collection without awaiting
  collectAndCacheDeviceInfo();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, url) => {
    navigationEvent.preventDefault();
    // You can handle external URLs here if needed
  });
});

// Set application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Device ID (machine id) IPC
function getMachineIdSafe() {
  try {
    // Prefer original machine id when possible
    return machineIdSync(true);
  } catch (_) {
    try {
      return machineIdSync();
    } catch {
      return '';
    }
  }
}

ipcMain.handle('device-id:get', async () => {
  return getMachineIdSafe();
});