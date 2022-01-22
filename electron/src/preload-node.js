// 用于 nodeIntegration: true 的情况
const electronAPI = require('./electron-api')
window.electronAPI = electronAPI
console.log('electronAPI loaded', electronAPI)
