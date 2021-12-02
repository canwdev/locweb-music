const Playlist = require('../../database/models/playlist')
const PlaylistItem = require('../../database/models/playlist-item')
const Music = require('../../database/models/music')
const Op = require('sequelize').Op
const router = require('express').Router()
const {
  userAuth,
  getUserId
} = require('../../routes/middleware/user-auth')
const {
  mediaQueue
} = require('./migrate-media')
const {
  _mediaVaultPathRelative
} = require('../../config')

/**
 * Get playlists
 */
router.get('/list', async (req, res, next) => {
  try {
    const {
      pid,
      offset,
      limit,
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

    return res.sendData({
      list: resPlaylist.rows,
      count: resPlaylist.count
    })
  } catch (error) {
    next(error)
  }
})

router.get('/list-music', async (req, res, next) => {
  try {
    const {
      pid,
      offset,
      limit,
    } = req.query

    let paginationQuery = limit ? {
      offset: parseInt(offset) || 0,
      limit: parseInt(limit),
    } : {}

    const where = {}
    if (pid) {
      where.pid = Number(pid)
    }

    const resItems = await PlaylistItem.findAndCountAll({
      ...paginationQuery,
      where: {
        playlist_id: pid
      },
      order: [
        ['id', 'DESC'],
      ],
      include: Music // 联表查询
    })

    return res.sendData({
      list: resItems.rows,
      count: resItems.count,
      path: _mediaVaultPathRelative
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Create playlist
 */
router.post('/create-playlist', userAuth, async (req, res, next) => {
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
router.post('/delete-playlist', userAuth, async (req, res, next) => {
  try {
    const {
      id,
    } = req.body
    if (!id) {
      return res.sendError({message: 'id can not be empty'})
    }

    // 移除子播放列表项
    const findList = []
    const recursiveFind = async (id) => {
      const list = await Playlist.findAll({
        where: {pid: id}
      })

      for (const key in list) {
        const node = list[key]
        findList.push(node)
        await recursiveFind(node.id)
      }
    }
    await recursiveFind(id)

    let idsToDelete = findList.map(item => item.id)
    idsToDelete = [id, ...idsToDelete]
    
    // TODO: Delete musics
    await PlaylistItem.destroy({
      where: {
        playlist_id: idsToDelete
      }
    })

    const resData = await Playlist.destroy({
      where: {
        id: idsToDelete
      }
    })

    return res.sendData(resData)
  } catch (error) {
    next(error)
  }
})

const doMigrateMedia = async () => {
  const data = await Music.findAll({
    where: {
      hash: {
        [Op.is]: null
      }
    }
  })

  if (data.length) {
    mediaQueue.addTasks(data)
  }

  return data
}

/**
 * Add music to playlist
 */
router.post('/add-music', userAuth, async (req, res, next) => {
  try {
    const {
      musics = [],
      pid
    } = req.body

    if (!pid) {
      return res.sendError({message: 'pid can not be empty'})
    }

    // 去重添加Music
    const listMap = {}
    const addList = musics.map(item => {
      const newItem = {
        filepath_origin: item.filepath,
      }
      listMap[item.filepath] = newItem
      return newItem
    })

    // console.log('>>> listMap', listMap)
    // console.log('>>> addList', addList)

    const existMusics = await Music.findAll({
      where: {
        filepath_origin: Object.keys(listMap)
      }
    })

    // console.log('>>> existMusics')
    // console.dir(existMusics)

    existMusics.forEach(item => {
      if (listMap[item.filepath_origin]) {
        listMap[item.filepath_origin].id = item.id
      }
    })

    const musicRes = await Music.bulkCreate(addList.filter(item => {
      return !item.id
    }))
    await doMigrateMedia()

    // console.log('>>> musicRes')
    // console.dir(musicRes)

    musicRes.forEach(item => {
      if (listMap[item.filepath_origin]) {
        listMap[item.filepath_origin].id = item.id
      }
    })

    const playlistItemRes = await PlaylistItem.bulkCreate(addList.map(item => {
      return {
        music_id: item.id,
        playlist_id: pid,
      }
    }))

    // console.log('>>> playlistItemRes')
    // console.dir(playlistItemRes)

    return res.sendData(playlistItemRes)
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

router.get('/migrate-media', userAuth, async (req, res, next) => {
  try {
    await doMigrateMedia()
    
    return res.sendData({})
  } catch (error) {
    next(error)
  }
})

module.exports = router
