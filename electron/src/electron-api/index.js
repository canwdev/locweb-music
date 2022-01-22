const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const wmPreload = require('./wm-preload')

const self = {
  ...ipcHelper,
  ...wmPreload,
}

module.exports = self
