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
  mediaQueue,
  deleteMusic
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
        ['sort', 'ASC'],
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

router.post('/update-playlist', userAuth, async (req, res, next) => {
  try {
    const {
      pid,
      title,
      desc,
      cover
    } = req.body

    if (!pid) {
      return res.sendError({message: 'pid can not be empty'})
    }

    await Playlist.update({
      title,
      desc,
      cover
    }, {
      where: {
        id: pid
      }
    })

    return res.sendData({})
  } catch (error) {
    next(error)
  }
})

const removePlaylistItem = async (pItem) => {
  if (!pItem) {
    throw new Error('pItem not found')
    return
  }

  const music_id = pItem.music_id

  console.log('del pItem')
  await pItem.destroy()

  const remainItems = await PlaylistItem.findAndCountAll({
    where: {music_id}
  })

  if (!remainItems.count) {
    await deleteMusic(music_id)
  }
}

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

    for (let i = 0; i < idsToDelete.length; i++) {
      const playlistId = idsToDelete[i]
      // TODO: Batch delete
      const playlistItems = await PlaylistItem.findAll({
        where: {
          'playlist_id': playlistId
        }
      })

      for (let j = 0; j < playlistItems.length; j++) {
        const pItem = playlistItems[j]
        await removePlaylistItem(pItem)
      }
    }

    await Playlist.destroy({
      where: {
        id: idsToDelete
      }
    })

    return res.sendData()
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

/**
 * Remove playlist music
 */
router.post('/remove-music', userAuth, async (req, res, next) => {
  try {
    const {
      id,
    } = req.body

    try {
      const pItem = await PlaylistItem.findOne({
        where: {
          id
        }
      })
      await removePlaylistItem(pItem)
    } catch (e) {
      return res.sendError({message: e.message})
    }


    return res.sendData()
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
