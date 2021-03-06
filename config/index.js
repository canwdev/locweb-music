const path = require('path')
const fs = require('fs-extra')

const defaultDataPath = path.join(__dirname, '../data')

// default config
let config = {
  PORT: '12021', // Server port
  DATA_PATH: defaultDataPath,
  MUSIC_LIBRARY_PATH: path.join(defaultDataPath, 'music'), // Music library base path
  MUSIC_LYRICS_PATH: path.join(defaultDataPath, 'lyrics'),
  IMAGE_PATH: path.join(defaultDataPath, 'images'), // Cover cache
  enableModify: true, // Allow modify/delete files
  enableAuth: true,
  authUsers: {'admin': 'admin'},
  jwtToken: 'token_secret_j3478n68o23ui',
  jwtTokenExpire: '49d',
  showHiddenFiles: false
}

const configPath = path.join(__dirname, 'config.json')
if (fs.existsSync(configPath)) {
  try {
    const userConfig = require(configPath)
    config = {
      ...config,
      ...userConfig
    }
  } catch (e) {
    console.warn('config.json SyntaxError')
  }

}

fs.mkdirpSync(config.MUSIC_LIBRARY_PATH)
fs.mkdirpSync(config.MUSIC_LYRICS_PATH)
fs.mkdirpSync(config.IMAGE_PATH)

module.exports = config
