const fs = require('fs-extra');
const {
  getMediaPath,
  parseFileName,
  copyToMediaVault
} = require('../../utils/fs-tool')

const { calcFileHash } = require('../../utils')
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
  console.dir(common)

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


module.exports = {
  migrateMedia
}