const router = require('express').Router()
const fs = require('fs-extra');
const path = require('path');
const mm = require('music-metadata')
const {MUSIC_LIBRARY_PATH} = require('../config')
const getRealPath = (dir) => {
  return path.join(MUSIC_LIBRARY_PATH, dir)
}
const {getMetadata} = require('../utils/music-tool')

/**
 * get file list
 */
router.get('/list', async (req, res, next) => {
  try {
    const {
      path: musicPath = ''
    } = req.query
    const dir = getRealPath(musicPath)
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

    const dir = getRealPath(musicPath)
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

    const sendData = {
      filePath,
      metadata: metadata
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
