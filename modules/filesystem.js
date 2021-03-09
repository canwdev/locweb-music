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
const mfpTool = require('../utils/mfp-tool')

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
      path: musicPath = '',
      getPlayStat = false
    } = req.query
    const dir = getMusicPath(musicPath)
    const files = await fs.readdir(dir)

    const list = files.map((filename, index) => {
      const stat = fs.statSync(path.join(dir, filename))
      return {
        id: index,
        filename,
        isDirectory: stat.isDirectory(),
        path: musicPath,
        size: stat.size
      }
    })

    let playStat
    if (getPlayStat) {
      playStat = await mfpTool.parseFromFolder(dir)
    }

    return res.sendData({
      playStat,
      list
    })
  } catch (error) {
    next(error)
  }
})

router.get('/detail', async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      filename,
      updatePlayStat = false,
      updateStatOnly = false // only update play status
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

    if (updatePlayStat) {
      const stat = fs.statSync(filePath)
      mfpTool.writeToFolder(dir, {
        position: 0,
        filesize: stat.size,
        file: filename
      })
      if (updateStatOnly) {
        console.log('updateStatOnly')
        return res.sendData({})
      }
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
      lyric,
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
