const fs = require('fs-extra');
const sanitize = require("sanitize-filename");
const Path = require('path');

const getExactPath = (musicPath, filename) => {
  if (!filename) {
    throw new Error('getExactPath: Filename can not be empty')
  }

  const currentMusicDir = getMediaPath(musicPath)
  const filePath = Path.join(currentMusicDir, getSafePath(filename))

  if (!fs.existsSync(filePath)) {
    throw new Error('File not exist')
  }

  return {
    filePath,
    currentMusicDir
  }
}

const {
  MUSIC_LIBRARY_PATH, 
  MUSIC_LYRICS_PATH,
  MEDIA_VAULT_PATH
} = require('../config')

const getMediaPath = (p = '') => {
  return Path.join(MUSIC_LIBRARY_PATH, getSafePath(p))
}
const getLyricsPath = (p = '') => {
  return Path.join(MUSIC_LYRICS_PATH, getSafePath(p))
}

const getSafePath = (p) => {
  return Path.normalize(p).replace(/^(\.\.(\/|\\|$))+/, '')
}

const getSafeFilename = (n) => {
  return sanitize(n, {replacement: '_'})
}

const parseFileName = (n) => {
  let dotIndex = n.lastIndexOf('.')
  if (dotIndex < 0) {
    dotIndex = n.length
  }
  const prefix = n.substr(0, dotIndex)
  const suffix = n.substr(dotIndex, n.length)
  return {
    // dotIndex,
    prefix,
    suffix
  }
}

const copyToMediaVault = async (absPath, filename) => {
  const newPath = Path.join(MEDIA_VAULT_PATH, filename)
  if (await fs.exists(newPath)) {
    return
  }
  await fs.copyFile(absPath, newPath)
  console.log(`[copy] ${absPath} -> ${newPath}`);
}

module.exports = {
  getExactPath,
  getMediaPath,
  getLyricsPath,
  getSafePath,
  getSafeFilename,
  parseFileName,
  copyToMediaVault
}
