if (process.env.SERVER_CONFIG_PATH) {
  console.warn('using env path', process.env.SERVER_CONFIG_PATH)
  return
}

const {app} = require('electron')
const Fs = require('fs-extra')
const Path = require('path')

const USER_DATA_PATH = app.getPath('userData')
const SERVER_CONFIG_PATH = Path.join(USER_DATA_PATH, 'server-config.json')
const LOCAL_LIBRARY_PATH = Path.join(USER_DATA_PATH, 'Library')

Fs.ensureDirSync(LOCAL_LIBRARY_PATH)

const initConfig = {
  MUSIC_LIBRARY_PATH: LOCAL_LIBRARY_PATH
}

if (!Fs.existsSync(SERVER_CONFIG_PATH)) {
  console.warn('creating server config...')
  Fs.writeFileSync(SERVER_CONFIG_PATH, JSON.stringify(initConfig, null, 2), {encoding: 'utf-8'})
}

process.env.SERVER_CONFIG_PATH = SERVER_CONFIG_PATH
