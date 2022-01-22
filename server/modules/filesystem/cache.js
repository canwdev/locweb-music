const {MUSIC_LYRICS_PATH} = require('../../config')
const fs = require('fs-extra');
const {nodeBus, BUS_UPDATE_LYRIC_CACHE} = require('../../utils/node-bus')

// init lyric files cache pool
let lyricFileCache = []
const refreshLyrics = () => {
  lyricFileCache = fs.readdirSync(MUSIC_LYRICS_PATH)
}
refreshLyrics()

nodeBus.on(BUS_UPDATE_LYRIC_CACHE, (event) => {
  refreshLyrics()
})

module.exports = {
  lyricFileCache,
  refreshLyrics
}
