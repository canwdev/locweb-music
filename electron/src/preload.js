const {contextBridge} = require('electron')

const electronAPI = require('./electron-api')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', function () {
//     window.electronAPI = new electronAPI()
// })

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', electronAPI
)
