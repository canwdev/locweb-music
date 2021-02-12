const mongoose = require('mongoose')
const Music = mongoose.model('Music')
const fs = require('fs-extra');
const path = require('path');
const mm = require('music-metadata')
const {MUSIC_LIBRARY_PATH} = require('../config')
const {IMAGE_PATH} = require('../config/enum')
const getRealPath = (dir) => {
  return path.join(MUSIC_LIBRARY_PATH, dir)
}
const util = require('util')
const {calcBufferHash} = require('../utils')
const mime = require('mime-types')

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
      const metadata = await mm.parseFile(filePath)
      const {common} = metadata
      // console.log(util.inspect(common, {showHidden: false, depth: null}));

      // Extract cover
      const picture = common.picture[0]
      const coverBuffer = picture.data
      const coverHash = await calcBufferHash(coverBuffer)
      const coverFileName = `${coverHash}.${mime.extension(picture.format)}`
      const coverPath = path.join(IMAGE_PATH, coverFileName)
      if (!fs.existsSync(coverPath)) {
        await fs.writeFile(coverPath, coverBuffer, "binary")
      }

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
