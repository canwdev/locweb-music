const Model = require('./model')
// const Op = require('sequelize').Op

module.exports = {
  /**
   * get table list
   */
  async list(req, res, next) {
    try {
      const {offset, limit = 5} = req.query

      let paginationQuery = limit ? {
        offset: parseInt(offset) || 0,
        limit: parseInt(limit),
      } : {}

      // let result = await db.query('SELECT * FROM posts')
      let result = await Model.findAndCountAll({
        ...paginationQuery,
        order: [
          // ['priority', 'ASC'],
          ['id', 'DESC'],
        ]
      })


      return res.sendData({
        data: {
          list: result.rows,
          count: result.count
        },
      })
    } catch (error) {
      next(error)
    }
  },
  async detail(req, res, next) {
    try {
      const {id} = req.query

      if (!id) {
        return res.json({
          code: 404,
          message: 'Query id can not be empty'
        })
      }

      const pic = await Model.findOne({
        where: {
          id
        }
      })

      return res.sendData({
        data: pic
      })

    } catch (error) {
      next(error)
    }
  },
}
