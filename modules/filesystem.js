const router = require('express').Router()
const fs = require('fs-extra');
const path = require('path');
const mm = require('music-metadata')
const chokidar = require('chokidar');
const {MUSIC_LIBRARY_PATH, MUSIC_LYRICS_PATH} = require('../config')
const getMusicPath = (dir = '') => {
  return path.join(MUSIC_LIBRARY_PATH, dir)
}
const getLyricsPath = (dir = '') => {
  return path.join(MUSIC_LYRICS_PATH, dir)
}
const {getMetadata, getLyricFile} = require('../utils/music-tool')


let lyrics = []
const refreshLyrics = async () => {
  lyrics = await fs.readdir(MUSIC_LYRICS_PATH)
}
refreshLyrics()

console.log('watch', MUSIC_LYRICS_PATH)
chokidar.watch(MUSIC_LYRICS_PATH, {
  ignoreInitial: true
}).on('all', (event, path) => {
  console.log(event, path)
  refreshLyrics()
});

/**
 * get file list
 */
router.get('/list', async (req, res, next) => {
  try {
    const {
      path: musicPath = ''
    } = req.query
    const dir = getMusicPath(musicPath)
    const files = await fs.readdir(dir)

    const result = files.map((filename, index) => {
      const stat = fs.statSync(path.join(dir, filename))
      return {
        id: index,
        filename,
        isDirectory: stat.isDirectory(),
        path: musicPath,
        size: stat.size
      }
    })

    return res.sendData(result)
  } catch (error) {
    next(error)
  }
})

router.get('/detail', async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      filename
    } = req.query

    if (!filename) {
      return res.sendError({
        message: 'filename can not be empty'
      })
    }

    const dir = getMusicPath(musicPath)
    const filePath = path.join(dir, filename)

    if (!fs.existsSync(filePath)) {
      return res.sendError({
        message: 'file not exist'
      })
    }

    const {
      metadata,
      coverFileName
    } = await getMetadata(filePath)

    delete metadata.native

    // get lyric
    let lyric
    try {
      const lyricFile = getLyricFile(lyrics, filename)
      if (lyricFile) {
        lyric = await fs.readFile(getLyricsPath(lyricFile), {encoding: 'utf-8'})
      }
    } catch (e) {
      console.log('Get lyric error', e)
    }

    const sendData = {
      filePath,
      metadata: metadata,
      lyric
    }

    if (coverFileName) {
      sendData.cover = `/images/${coverFileName}`

    }
    return res.sendData(sendData)
  } catch (error) {
    next(error)
  }
})

module.exports = router
