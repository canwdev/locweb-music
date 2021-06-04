const Playlist = require('../database/models/playlist')
const Music = require('../database/models/music')
// const Op = require('sequelize').Op
const router = require('express').Router()

/**
 * Get playlists
 */
router.get('/list', async (req, res, next) => {
  try {
    const {offset, limit} = req.query
    let paginationQuery = limit ? {
      offset: parseInt(offset) || 0,
      limit: parseInt(limit),
    } : {}

    let result = await Playlist.findAndCountAll({
      ...paginationQuery,
      order: [
        // ['sort', 'ASC'],
        ['id', 'DESC'],
      ]
    })

    return res.sendData({
      list: result.rows,
      count: result.count
    })
  } catch (error) {
    next(error)
  }
})

router.post('/add', async (req, res, next) => {
  try {
    const {
      pid,
      title,
      desc,
      cover
    } = req.body

    if (!title) {
      return res.sendError({message: 'Title can not be empty'})
    }

    const data = await Playlist.create({
      title
    })

    return res.sendData(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
