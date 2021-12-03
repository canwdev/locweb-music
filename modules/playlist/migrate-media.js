const fs = require('fs-extra');
const {
  getMediaPath,
  parseFileName,
  copyToMediaVault
} = require('../../utils/fs-tool')

const { calcFileHash } = require('../../utils')
const { TaskQueue } = require('../../utils/task-queue')
const { getMetadata } = require('../../utils/music-tool')
const Music = require('../../database/models/music')
const PlaylistItem = require('../../database/models/playlist-item')
const Path = require('path')
const {_mediaVaultPathRelative} = require('../../config')

// 移除重复的Music，并修改相应外键值
const removeDuplication = async (existMusic, newItem) => {
  await PlaylistItem.update({
    music_id: existMusic.id,
  }, {
    where: {
      music_id: newItem.id
    }
  })
  await newItem.destroy()
}

const deleteMusic = async (id) => {
  const music = await Music.findOne({
    where: {id}
  })
  if (!music) {
    return
  }
  console.log('del music', id)
  await music.destroy()

  if (music.filepath) {
    const absPath = getMediaPath(Path.join(_mediaVaultPathRelative, music.filepath))
    if (await fs.exists(absPath)) {
      console.log('rm', absPath)
      await fs.rm(absPath)
    }
  }

}

const migrateMedia = async (item) => {
  const { filepath_origin } = item
  const absPath = getMediaPath(filepath_origin)
  const hash = await calcFileHash(absPath)

  const existMusic = await Music.findOne({
    where: {
      hash
    }
  })
  if (existMusic) {
    await removeDuplication(existMusic, item)
    return
  }

  const { suffix } = parseFileName(filepath_origin)
  const newFilename = `${hash}${suffix}`

  await copyToMediaVault(absPath, newFilename)
  const {
    metadata,
    coverFileName
  } = await getMetadata(absPath)


  const { common } = metadata

  Music.update({
    hash,
    filepath: newFilename,
    cover: coverFileName,
    title: common.title,
    artists: common.artists,
    album: common.album,
    disk: common.disk,
    track: common.track,
    year: common.year,
    genre: common.genre,
  }, {
    where: {
      id: item.id
    }
  })
}

const mediaQueue = new TaskQueue({
  concurrent: 3,
  taskHandler: (task) => {
    return new Promise(async (resolve, reject) => {
      const {data: item} = task
      try {
        console.log('taskHandler', item.filepath_origin)
        await migrateMedia(item)
        resolve(task)
      } catch (e) {
        console.error('[mediaQueue] error', e)
        reject(e)
      }
    })
  }
})


module.exports = {
  migrateMedia,
  mediaQueue,
  deleteMusic
}
