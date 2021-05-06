const path = require('path')
const fs = require('fs')

const defaultDataPath = path.join(__dirname, '../data')

// default config
let config = {
  DATA_PATH: defaultDataPath,
  MUSIC_LIBRARY_PATH: defaultDataPath, // music library base path
  MUSIC_LYRICS_PATH: path.join(defaultDataPath, 'lyrics'),
  enableModify: true, // Allow modify/delete files
  enableAuth: true,
  authUsers: {'admin': 'admin'}
}

const configPath = path.join(__dirname, 'config.json')
if (fs.existsSync(configPath)) {
  const userConfig = require(configPath)
  config = {
    ...config,
    ...userConfig
  }
}

module.exports = config
