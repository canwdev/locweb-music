const path = require('path')
const fs = require('fs-extra')

const defaultDataPath = path.join(__dirname, '../data')

// default config
let config = {
  PORT: '12021', // Server port
  MUSIC_LIBRARY_PATH: defaultDataPath, // Music library base path
  MUSIC_LYRICS_PATH: '.lyrics',
  MEDIA_VAULT_PATH: '.media_vault',
  IMAGE_PATH: '.images', // Cover cache
  useAbsolutePath: false,
  allowModify: true, // Allow modify/delete files
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

if (!config.useAbsolutePath) {
  const basePath = config.MUSIC_LIBRARY_PATH
  config.MUSIC_LYRICS_PATH = path.join(basePath, config.MUSIC_LYRICS_PATH)
  config.IMAGE_PATH = path.join(basePath, config.IMAGE_PATH)
  
  config._mediaVaultPathRelative = config.MEDIA_VAULT_PATH
  config.MEDIA_VAULT_PATH = path.join(basePath, config.MEDIA_VAULT_PATH)
} else {
  config._mediaVaultPathRelative = config.MEDIA_VAULT_PATH.split('/').pop()
}

fs.ensureDirSync(config.MUSIC_LIBRARY_PATH)
fs.ensureDirSync(config.MUSIC_LYRICS_PATH)
fs.ensureDirSync(config.IMAGE_PATH)
fs.ensureDirSync(config.MEDIA_VAULT_PATH)

module.exports = config
