const { contextBridge, ipcRenderer } = require('electron');

// Expose các API cần thiết cho renderer process
contextBridge.exposeInMainWorld('electron', {
  // Gửi thông điệp từ renderer đến main process
  send: (channel, data) => {
    // Whitelist channels
    const validChannels = ['message-from-renderer'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // Nhận thông điệp từ main process
  on: (channel, func) => {
    const validChannels = ['message-from-main'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  // Gửi thông điệp đồng bộ từ renderer đến main process
  sendSync: (channel, data) => {
    const validChannels = ['sync-message'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data);
    }
    return null;
  },
  // Gửi thông điệp và nhận kết quả thông qua Promise
  invoke: (channel, data) => {
    const validChannels = ['invoke-message'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.resolve(null);
  }
});

// Tất cả các API Node.js đều có sẵn trong quá trình preload.
// Nó có cùng sandbox với Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency] || 'not available');
  }
}); 