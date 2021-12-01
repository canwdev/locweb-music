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

const migrateMedia = async (item) => {
  const { filepathOrigin } = item
  const absPath = getMediaPath(filepathOrigin)
  const hash = await calcFileHash(absPath)
  const { suffix } = parseFileName(filepathOrigin)
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
        console.log('taskHandler', item.filepathOrigin)
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
  mediaQueue
}