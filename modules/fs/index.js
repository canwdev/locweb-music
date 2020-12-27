const fs = require('fs-extra');
const path = require('path');
const {MUSIC_LIBRARY_PATH} = require('../../config')

module.exports = {
  /**
   * get table list
   */
  async list(req, res, next) {
    try {
      const {path: _path = ''} = req.query
      const dir = path.join(MUSIC_LIBRARY_PATH, _path)
      const files = await fs.readdir(dir)

      const result = files.map(file => {
        const stat = fs.statSync(path.join(dir, file))
        return {
          name: file,
          isDirectory: stat.isDirectory(),
          path: _path,
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
      const {id} = req.query
      return res.sendData({
        id: id
      })
    } catch (error) {
      next(error)
    }
  }
}
