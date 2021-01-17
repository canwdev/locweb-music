const fs = require('fs-extra');
const path = require('path');
const mm = require('music-metadata')
const {MUSIC_LIBRARY_PATH} = require('../../config')
const getRealPath = (dir) => {
  return path.join(MUSIC_LIBRARY_PATH, dir)
}

module.exports = {
  /**
   * get table list
   */
  async list(req, res, next) {
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
  },
  async detail(req, res, next) {
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

      const metadata = await mm.parseFile(filePath)

      return res.sendData({
        filePath,
        metadata
      })
    } catch (error) {
      next(error)
    }
  }
}
