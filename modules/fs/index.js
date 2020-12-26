const fs = require('fs-extra');
const path = require('path');
const {MUSIC_LIBRARY_PATH} = require('../../config')

module.exports = {
  /**
   * get table list
   */
  async list(req, res, next) {
    try {
      const files = await fs.readdir(MUSIC_LIBRARY_PATH)
      console.log(files)
      return res.sendData({
        files
      })
    } catch (error) {
      next(error)
    }
  },
  async detail(req, res, next) {
    try {
      const {id} = req.query
      return res.sendData({
        id:id
      })
    } catch (error) {
      next(error)
    }
  }
}
