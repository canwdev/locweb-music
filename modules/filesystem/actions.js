const {
  enableModify,
} = require('../../config')
const {
  getMusicExactPath,
  getMusicPath
} = require('../../utils/fs-tool')
const {
  saveLyricFile
} = require('../../utils/music-tool')
const fs = require('fs-extra');
const path = require('path');
const sanitize = require("sanitize-filename");
const {getSafePath} = require("../../utils/fs-tool")
const {MUSIC_LIBRARY_PATH} = require('../../config')


const saveLyric = async (req, res, next) => {
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
}

const FileAction = {
  RENAME: 'RENAME',
  DELETE: 'DELETE',
  CREATE_FOLDER: 'CREATE_FOLDER',
}

const handleAction = async (req, res, next) => {
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
      const dir = path.join(curPath, getSafePath(sanitize(actionValue, {replacement: '_'})))
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
      const newPath = getMusicPath(path.join(musicPath, getSafePath(newName)))

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
}

module.exports = {
  saveLyric,
  handleAction
}
