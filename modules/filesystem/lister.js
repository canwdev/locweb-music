const {
  getMusicExactPath,
  getMusicPath,
  getLyricsPath
} = require('../../utils/fs-tool')
const {
  lyricFileCache
} = require('./cache')
const {
  enableAuth,
  showHiddenFiles
} = require('../../config')
const fs = require('fs-extra');
const path = require('path');
const {
  loginOnlyFileName
} = require('../../config/enum')
const mfpTool = require('../../utils/mfp-tool')
const {getSafePath} = require("../../utils/fs-tool")

const {
  getMetadata,
  getLyricFile,
} = require('../../utils/music-tool')

/**
 * Get file list
 */
const listFiles = async (req, res, next) => {
  try {
    const {
      path: musicPath = '',
      getPlayStat = false
    } = req.query
    const dir = getMusicPath(musicPath)
    if (enableAuth && fs.existsSync(path.join(dir, loginOnlyFileName))) {
      if (!req.__userid) {
        return res.sendData({message: 'You are not authorized', list: []})
      }
    }

    if (!fs.existsSync(dir)) {
      return res.sendError({message: 'Dir not found', code: 404})
    }
    console.log('dir',dir)
    let files = await fs.readdir(dir)

    const _folders = [], _files = []
    if (!showHiddenFiles) {
      files = files.filter(name => {
        return !/\.db$/.test(name) && !/^\./.test(name) && name !== '@eaDir'
      })
    }
    files.forEach((name, index) => {
      try {
        const stat = fs.statSync(path.join(dir, name))
        const isDirectory = stat.isDirectory()
        const f = {
          id: index,
          filename: name,
          isDirectory,
          path: musicPath,
        }
        if (isDirectory) {
          _folders.push(f)
        } else {
          _files.push(f)
        }
      } catch (e) {
        console.log('fs stat error', e)
      }

    })

    const list = [..._folders, ..._files]

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
}

const getDetail = async (req, res, next) => {
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
      const lyricFile = getLyricFile(lyricFileCache, filename)
      if (lyricFile) {
        lyricText = await fs.readFile(getLyricsPath(lyricFile), {encoding: 'utf-8'})
      } else {
        // try load lyric from same folder
        const lyricFile = filename.substring(0, filename.lastIndexOf('.')) + '.lrc'
        const lyricPath = path.join(currentMusicDir, getSafePath(lyricFile))
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
      if (fs.existsSync(path.join(currentMusicDir, getSafePath(localCoverFilename)))) {
        sendData.cover = `/mfs/${musicPath}${localCoverFilename}`
      }
    }
    return res.sendData(sendData)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listFiles,
  getDetail
}
