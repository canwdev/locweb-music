const mongoose = require('mongoose')
const Music = mongoose.model('Music')
const fs = require('fs-extra');
const path = require('path');
const {MUSIC_LIBRARY_PATH} = require('../config')
const getRealPath = (dir) => {
  return path.join(MUSIC_LIBRARY_PATH, dir)
}
const {getMetadata} = require('../utils/music-tool')

const lsFiles = async (parentPath = '') => {
  await Music.deleteMany()

  const dir = getRealPath(parentPath)
  const files = await fs.readdir(dir)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(dir, file)
    let data = {
      filename: file,
      path: filePath
    }

    try {
      const {
        metadata,
        coverFileName
      } = await getMetadata(filePath)
      const {common} = metadata

      // metadata
      data.cover = coverFileName
      data.title = common.title
      data.artist = common.artist
      data.album = common.album
    } catch (e) {
      console.error(e)
    }

    const musicItem = new Music(data)
    await musicItem.save()
  }
}

// lsFiles()
