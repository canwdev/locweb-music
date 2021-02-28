const path = require('path')
const fs = require('fs')

const defaultPath = path.join(__dirname, '../data')

let config = {
  DATA_PATH: defaultPath,
  MUSIC_LIBRARY_PATH: defaultPath, // music library base path
  MUSIC_LYRICS_PATH: defaultPath
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
