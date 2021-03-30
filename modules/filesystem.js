const isProduction = process.env.NODE_ENV === 'production';
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

// init lyric files pool
let lyricFileList = []
const refreshLyrics = async () => {
  lyricFileList = await fs.readdir(MUSIC_LYRICS_PATH)
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


/**
 * Get file list
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
      try {
        const stat = fs.statSync(path.join(dir, filename))
        return {
          id: index,
          filename,
          isDirectory: stat.isDirectory(),
          path: musicPath,
          size: stat.size
        }
      } catch (e) {
        console.log('fs stat error', e)
        return {
          id: index,
          filename: filename + '.error',
          isDirectory: false,
          path: null,
          size: 0
        }
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

const getMusicExactPath = (musicPath, filename) => {
  if (!filename) {
    throw new Error('Filename can not be empty')
  }

  const currentMusicDir = getMusicPath(musicPath)
  const filePath = path.join(currentMusicDir, filename)

  if (!fs.existsSync(filePath)) {
    throw new Error('File not exist')
  }

  return filePath
}

router.get('/detail', async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      filename,
      updatePlayStat = false,
      updateStatOnly = false // only update play status
    } = req.query

    let filePath

    try {
      filePath = getMusicExactPath(musicPath, filename)
    } catch (e) {
      return res.sendError(e)
    }

    // update play status
    if (updatePlayStat) {
      try {
        const stat = fs.statSync(filePath)
        mfpTool.writeToFolder(currentMusicDir, {
          position: 0,
          filesize: stat.size,
          file: filename
        })
      } catch (e) {
        console.error('MFP tool error', e)
      }
      if (updateStatOnly) {
        // console.log('updateStatOnly')
        return res.sendData()
      }
    }

    const {
      metadata,
      coverFileName
    } = await getMetadata(filePath)

    delete metadata.native

    // get lyric
    let lyricText
    try {
      const lyricFile = getLyricFile(lyricFileList, filename)
      if (lyricFile) {
        lyricText = await fs.readFile(getLyricsPath(lyricFile), {encoding: 'utf-8'})
      } else {
        // try load lyric from same folder
        const lyricFile = filename.substring(0, filename.lastIndexOf('.'))+'.lrc'
        const lyricPath = path.join(currentMusicDir, lyricFile)
        if (fs.existsSync(lyricPath)) {
          lyricText = await fs.readFile(lyricPath, {encoding: 'utf-8'})
          console.log('Same dir lyric found')
        }
      }
    } catch (e) {
      console.log('Get lyric error', e)
    }

    const sendData = {
      filePath,
      metadata: metadata,
      lyric: lyricText
    }

    if (coverFileName) {
      sendData.cover = `/images/${coverFileName}`
    } else {
      const localCoverFilename = 'cover.jpg'
      if (fs.existsSync(path.join(currentMusicDir, localCoverFilename))) {
        sendData.cover = `/mfs/${musicPath}${localCoverFilename}`
      }
    }
    return res.sendData(sendData)
  } catch (error) {
    next(error)
  }
})

router.get('/rename', async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      filename,
      newName,
    } = req.query

    let filePath

    try {
      filePath = getMusicExactPath(musicPath, filename)
    } catch (e) {
      return res.sendError(e)
    }

    return res.sendData({filePath, newName})
  } catch (error) {
    next(error)
  }
})


module.exports = router
