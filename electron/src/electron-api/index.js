const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const wmPreload = require('./wm-preload')
const {shell} = require('electron')

const self = {
  ...ipcHelper,
  ...wmPreload,
  openExternal: shell.openExternal,
  getClientHostPort() {
    return ipcHelper.ipcSendEventSync('IPC_GET_PORT')
  }
}

module.exports = self
