const Path = require('path')

const ROOT_PATH = Path.join(__dirname, '../')

const FRONTEND = Path.join(ROOT_PATH, 'frontend')
const FRONTEND_DIST = Path.join(FRONTEND, 'dist')
const ELECTRON = Path.join(ROOT_PATH, 'electron')
const ELECTRON_FRONTEND_DIST = Path.join(ELECTRON, 'frontend-dist')
const ELECTRON_SERVER_DIST = Path.join(ELECTRON, 'server-dist')
const SERVER = Path.join(ROOT_PATH, 'server')

const Dirs = {
  FRONTEND,
  FRONTEND_DIST,
  ELECTRON,
  ELECTRON_FRONTEND_DIST,
  ELECTRON_SERVER_DIST,
  SERVER
}

module.exports = {
  ROOT_PATH,
  Dirs
}
