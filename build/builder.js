const sh = require('shelljs')
const Fs = require('fs-extra')
const Path = require('path')
const Utils = require('./utils')
const {Dirs} = require('./enum')
const tar = require('tar')
const fg = require('fast-glob')

const args = process.argv.slice(2)
const buildType = args[0] || ''

const setupMirror = async () => {
  Utils.exec(`yarn config set registry https://registry.npm.taobao.org`)
  Utils.exec(`yarn config set disturl https://npm.taobao.org/dist`)
}

const buildFrontend = async () => {
  Utils.colorLog(Dirs.FRONTEND, 'Build Frontend', 'green')
  Utils.cd(Dirs.FRONTEND)
  Utils.exec(`yarn install`)
  Utils.exec(`yarn run build`)
}

const packupServer = async () => {
  Utils.colorLog(Dirs.SERVER, 'Build Server', 'blue')
  Utils.cd(Dirs.SERVER)
  Utils.exec(`yarn install`)
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

const buildServer = async () => {
  // Build and copy frontend
  await buildFrontend()
  Fs.removeSync(Dirs.SERVER_FRONTEND_DIST)
  Fs.copySync(Dirs.FRONTEND_DIST, Dirs.SERVER_FRONTEND_DIST)
  await packupServer()
  Fs.removeSync(Dirs.ELECTRON_SERVER_DIST)
  Fs.ensureDirSync(Dirs.ELECTRON_SERVER_DIST)
}

const buildServerDocker = async () => {
  // await buildServer()
  Utils.cd(Dirs.SERVER)
  Utils.exec(`./build-docker.sh`)
}

const buildElectron = async () => {
  await buildServer()
  // Copy server code
  await tar.x({
    C: Dirs.ELECTRON_SERVER_DIST,
    file: Path.join(Dirs.SERVER, 'dist.tar')
  })

  // Build client
  Utils.colorLog(Dirs.ELECTRON, 'Build Client', 'yellow')
  Utils.cd(Dirs.ELECTRON)
  Utils.exec(`yarn install`)
  Utils.exec(`yarn run build:electron-dir`)
}

const builder = async () => {
  switch (buildType) {
    case 'setupMirror':
      await setupMirror()
      break
    case 'frontend':
      await buildFrontend()
      break
    case 'server':
      await buildServer()
      break
    case 'serverDocker':
      await buildServerDocker()
      break
    case 'electron':
      await buildElectron()
      break
    default:
      throw new Error('buildType incorrect!')
  }
}

builder()
