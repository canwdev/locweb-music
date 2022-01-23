const sh = require('shelljs')
const Fs = require('fs-extra')
const Path = require('path')
const Utils = require('./utils')
const {Dirs} = require('./enum')
const tar = require('tar')
const fg = require('fast-glob')

const buildFrontend = async () => {
  Utils.colorLog(Dirs.FRONTEND, 'Build Frontend', 'green')
  Utils.cd(Dirs.FRONTEND)
  Utils.exec(`yarn run build`)
}

const buildElectron = async () => {
  // Build and copy frontend
  await buildFrontend()
  Fs.removeSync(Dirs.SERVER_FRONTEND_DIST)
  Fs.copySync(Dirs.FRONTEND_DIST, Dirs.SERVER_FRONTEND_DIST)

  // Copy server code
  await buildServer()
  Fs.removeSync(Dirs.ELECTRON_SERVER_DIST)
  Fs.ensureDirSync(Dirs.ELECTRON_SERVER_DIST)
  await tar.x({
    C: Dirs.ELECTRON_SERVER_DIST,
    file: Path.join(Dirs.SERVER, 'dist.tar')
  })

  // Build client
  Utils.colorLog(Dirs.ELECTRON, 'Build Client', 'yellow')
  Utils.cd(Dirs.ELECTRON)
  Utils.exec(`yarn run build:electron-dir`)
}

const buildServer = async () => {
  Utils.colorLog(Dirs.SERVER, 'Build Server', 'blue')
  Utils.cd(Dirs.SERVER)
  const entries = await fg(['**', '!node_modules', '!data', '!*.tar'], {
    dot: false,
    onlyFiles: false,
    deep: 1
  })
  await tar.c({
    C: Dirs.SERVER,
    file: 'dist.tar',
    filter: (path) => {
      if (path === 'config/config.json') {
        return false
      }
      return true
    }
  }, entries)
}

buildElectron()
