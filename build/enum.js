const Path = require('path')

const ROOT_PATH = Path.join(__dirname, '../')

const FRONTEND = Path.join(ROOT_PATH, 'frontend')
const FRONTEND_DIST = Path.join(FRONTEND, 'dist')
const ELECTRON = Path.join(ROOT_PATH, 'electron')
const ELECTRON_SERVER_DIST = Path.join(ELECTRON, 'server-dist')
const SERVER = Path.join(ROOT_PATH, 'server')
const SERVER_FRONTEND_DIST = Path.join(SERVER, 'frontend-dist')

const Dirs = {
  FRONTEND,
  FRONTEND_DIST,
  ELECTRON,
  ELECTRON_SERVER_DIST,
  SERVER,
  SERVER_FRONTEND_DIST,
}

module.exports = {
  ROOT_PATH,
  Dirs
}
