const isProduction = process.env.NODE_ENV === 'production';
const router = require('express').Router()
const fs = require('fs-extra');
const path = require('path');
const mm = require('music-metadata')
const chokidar = require('chokidar');
const sanitize = require("sanitize-filename");
const {
  enableModify
} = require('../config')
const userAuth = require('../routes/middleware/user-auth')


const {MUSIC_LIBRARY_PATH, MUSIC_LYRICS_PATH} = require('../config')
const getMusicPath = (p = '') => {
  return path.join(MUSIC_LIBRARY_PATH, p)
}
const getLyricsPath = (p = '') => {
  return path.join(MUSIC_LYRICS_PATH, p)
}
const {
  getMetadata,
  getLyricFile,
  saveLyricFile
} = require('../utils/music-tool')
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

router.get('/detail', async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      filename,
      updatePlayStat = false,
      updateStatOnly = false // only update play status
    } = req.query

    let filePath, currentMusicDir

    try {
      const res = getMusicExactPath(musicPath, filename)
      filePath = res.filePath
      currentMusicDir = res.currentMusicDir
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
        const lyricFile = filename.substring(0, filename.lastIndexOf('.')) + '.lrc'
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

const FileAction = {
  RENAME: 'RENAME',
  DELETE: 'DELETE',
  CREATE_FOLDER: 'CREATE_FOLDER',
}

router.post('/action', userAuth, async (req, res, next) => {
  try {
    if (!enableModify) {
      return res.sendError({code: 403, message: 'Modify not allowed'})
    }

    const {
      path: musicPath = '',
      filename,
      action,
      actionValue
    } = req.body

    let filePath

    if (action === FileAction.CREATE_FOLDER) {
      const curPath = getMusicPath(musicPath)
      const dir = path.join(curPath, sanitize(actionValue, {replacement: '_'}))
      await fs.mkdirp(dir)
      return res.sendData()
    }

    try {
      const res = getMusicExactPath(musicPath, filename)
      filePath = res.filePath
    } catch (e) {
      return res.sendError(e)
    }

    if (filePath === MUSIC_LIBRARY_PATH) {
      return res.sendError({message: 'Invalid dir'})
    }

    if (action === FileAction.RENAME) {
      if (!actionValue) {
        return res.sendError({message: 'Rename: Filename cannot be empty'})
      }
      const newName = sanitize(actionValue, {replacement: '_'})
      const newPath = getMusicPath(path.join(musicPath, newName))

      try {
        await fs.move(filePath, newPath)
      } catch (e) {
        return res.sendError(e)
      }
      return res.sendData({newName})

    } else if (action === FileAction.DELETE) {
      await fs.remove(filePath)
    }

    return res.sendData()
  } catch (error) {
    next(error)
  }
})

router.post('/save-lyric', userAuth, async (req, res, next) => {
  try {
    if (!enableModify) {
      return res.sendError({code: 403, message: 'Modify not allowed'})
    }

    const {
      filename,
      lyric
    } = req.body

    const {
      filename: saveFilename
    } = saveLyricFile(filename, lyric)

    return res.sendData({
      saveFilename
    })
  } catch (error) {
    next(error)
  }
})

router.get('/download', async (req, res, next) => {
  try {
    const {
      filename,
      path: musicPath = ''
    } = req.query

    const {filePath} = getMusicExactPath(musicPath, filename)

    return res.download(filePath, filename, {
      dotfiles: 'allow'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
