// 全局唯一实例
const path = require('path')
const WindowManager = require('@canwdev/electron-window-manager')
const wm = new WindowManager({
  preloadDir: path.join(__dirname, '../'),
  isDebug: true
})
module.exports = wm
