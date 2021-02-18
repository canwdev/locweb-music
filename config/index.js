const path = require('path')
const fs = require('fs')

let config = {
  DATA_PATH: path.join(__dirname, '../data'),
  MUSIC_LIBRARY_PATH: path.join(__dirname, '../data') // music library base path
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
