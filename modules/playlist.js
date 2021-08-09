const Playlist = require('../database/models/playlist')
const Music = require('../database/models/music')
// const Op = require('sequelize').Op
const router = require('express').Router()
const {
  userAuth,
  getUserId
} = require('../routes/middleware/user-auth')

/**
 * Get playlists
 */
router.get('/list', async (req, res, next) => {
  try {
    const {
      pid,
      offset,
      limit,
      showMusic = false,
    } = req.query
    let paginationQuery = limit ? {
      offset: parseInt(offset) || 0,
      limit: parseInt(limit),
    } : {}

    const where = {}
    if (pid) {
      where.pid = Number(pid)
    }

    let resPlaylist = await Playlist.findAndCountAll({
      ...paginationQuery,
      where,
      order: [
        // ['sort', 'ASC'],
        ['id', 'DESC'],
      ]
    })

    let resMusic
    // TODO: List musics
    if (showMusic) {
      resMusic = await Music.findAndCountAll({
        where: {
          pid: pid
        },
        order: [
          ['id', 'DESC'],
        ]
      })
    }

    return res.sendData({
      list: resPlaylist.rows,
      musics: resMusic && resMusic.rows,
      count: resPlaylist.count
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Add playlist
 */
router.post('/add', userAuth, async (req, res, next) => {
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

    const resData = await Playlist.create({
      title,
      pid: Number(pid) || -1,
      desc,
      cover
    })

    return res.sendData(resData)
  } catch (error) {
    next(error)
  }
})

/**
 * Delete playlist recursively
 */
router.post('/delete', userAuth, async (req, res, next) => {
  try {
    const {
      id,
    } = req.body
    if (!id) {
      return res.sendError({message: 'id can not be empty'})
    }

    const findList = []
    const recursiveFind = async (id) => {
      const list = await Playlist.findAll({
        where: {pid: id}
      })

      for (const key in list) {
        const node = list[key]
        findList.push(node)
        await recursiveFind(node.id)
        // TODO: Delete musics
      }
    }
    await recursiveFind(id)

    const ids = findList.map(item => item.id)
    const resData = await Playlist.destroy({
      where: {
        id: [id, ...ids]
      }
    })

    return res.sendData(resData)
  } catch (error) {
    next(error)
  }
})

/**
 * Add music to playlist
 */
router.post('/add-music', userAuth, async (req, res, next) => {
  try {
    // const {
    //   pid,
    //   title,
    //   artists,
    //   cover,
    //   desc,
    //   tags,
    //   file,
    //   sort,
    //   rank,
    // } = req.body

    const resData = await Music.create(req.body)

    return res.sendData(resData)
  } catch (error) {
    next(error)
  }
})

const deleteMusics = (ids) => {
  console.log('deleteMusics', ids)
  return Music.destroy({
    where: {
      id: [...ids]
    }
  })
}

/**
 * Remove playlist music
 */
router.post('/remove-music', userAuth, async (req, res, next) => {
  try {
    const {
      ids,
    } = req.body

    const resData = await deleteMusics(ids)

    return res.sendData(resData)
  } catch (error) {
    next(error)
  }
})

module.exports = router
