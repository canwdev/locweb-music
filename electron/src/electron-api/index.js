const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const wmPreload = require('./wm-preload')
const {shell} = require('electron')

const self = {
  ...ipcHelper,
  ...wmPreload,
  openExternal: shell.openExternal,
}

module.exports = self
