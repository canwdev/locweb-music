const fs = require('fs-extra');

const getMusicExactPath = (musicPath, filename) => {
  if (!filename) {
    throw new Error('getMusicExactPath: Filename can not be empty')
  }

  const currentMusicDir = getMusicPath(musicPath)
  const filePath = path.join(currentMusicDir, filename)

  if (!fs.existsSync(filePath)) {
    throw new Error('File not exist')
  }

  return {
    filePath,
    currentMusicDir
  }
}
const path = require('path');
const {MUSIC_LIBRARY_PATH, MUSIC_LYRICS_PATH} = require('../../config')

const getMusicPath = (p = '') => {
  return path.join(MUSIC_LIBRARY_PATH, p)
}
const getLyricsPath = (p = '') => {
  return path.join(MUSIC_LYRICS_PATH, p)
}

module.exports = {
  getMusicExactPath,
  getMusicPath,
  getLyricsPath,
}
