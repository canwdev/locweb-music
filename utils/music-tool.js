const {IMAGE_PATH} = require('../config/enum')
const mm = require('music-metadata')
const {calcBufferHash} = require('./index')
const mime = require('mime-types')
const util = require('util')
const path = require('path');
const fs = require('fs-extra');

/**
 * Get music metadata and extract cover
 * @param filePath
 * @returns {Promise<{coverFileName: string, metadata: IAudioMetadata}>}
 */
const getMetadata = async (filePath) => {
  const metadata = await mm.parseFile(filePath)
  const {common} = metadata
  // console.log(util.inspect(metadata, {showHidden: false, depth: null}));

  // Extract cover
  if (common.picture && common.picture[0]) {
    const picture = common.picture[0]
    const coverBuffer = picture.data
    const coverHash = await calcBufferHash(coverBuffer)
    const coverFileName = `${coverHash}.${mime.extension(picture.format)}`
    const coverSavePath = path.join(IMAGE_PATH, coverFileName)
    if (!fs.existsSync(coverSavePath)) {
      await fs.writeFile(coverSavePath, coverBuffer, "binary")
    }

    delete common.picture

    return {
      metadata,
      coverSavePath,
      coverFileName
    }
  }


  return {
    metadata
  }
}

module.exports = {
  getMetadata
}
