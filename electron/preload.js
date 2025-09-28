const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  
  // Window controls for frameless window
  windowControls: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
  },

  // Window state event listeners
  onWindowMaximized: (callback) => {
    ipcRenderer.on('window-maximized', callback);
    // Return cleanup function
    return () => ipcRenderer.removeListener('window-maximized', callback);
  },
  
  onWindowUnmaximized: (callback) => {
    ipcRenderer.on('window-unmaximized', callback);
    // Return cleanup function  
    return () => ipcRenderer.removeListener('window-unmaximized', callback);
  },

  // Device info
  getDeviceInfo: () => ipcRenderer.invoke('device-info:get'),
  getDeviceInfoCached: () => ipcRenderer.invoke('device-info:get-cached'),
  refreshDeviceInfo: () => ipcRenderer.invoke('device-info:refresh'),
  onDeviceInfoReady: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('device-info:ready', handler);
    // Return cleanup
    return () => ipcRenderer.removeListener('device-info:ready', handler);
  },
  // Device ID (machine id)
  getDeviceId: () => ipcRenderer.invoke('device-id:get'),
  
  // Example IPC communication methods (currently empty, add as needed)
  // invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  // on: (channel, callback) => ipcRenderer.on(channel, callback),
  // removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Security: Remove Node.js global objects from renderer process
delete window.require;
delete window.exports;
delete window.module;