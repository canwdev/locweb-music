const {MUSIC_LYRICS_PATH} = require('../../config')
const fs = require('fs-extra');
const chokidar = require('chokidar');
const isProduction = process.env.NODE_ENV === 'production';

// init lyric files cache pool
let lyricFileCache = []
const refreshLyrics = async () => {
  lyricFileCache = await fs.readdir(MUSIC_LYRICS_PATH)
}
refreshLyrics()

if (isProduction) {
  console.log('Watching lrc folder', MUSIC_LYRICS_PATH)
  chokidar.watch(MUSIC_LYRICS_PATH, {
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log(event, path)
    refreshLyrics()
  });
} else {
  console.log('Dev mode will NOT watch', MUSIC_LYRICS_PATH)
}

module.exports = {
  lyricFileCache,
  refreshLyrics
}
