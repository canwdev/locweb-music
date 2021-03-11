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
  } else {
    // try use same dir cover.jpg
  }


  return {
    metadata
  }
}

/**
 * Get lyric file from list
 * @param lyricFileList List contains lyric filenames
 * @param filename Music filename
 * @param options
 */
const getLyricFile = (lyricFileList, filename, options = {}) => {
  const {
    isExact = false,
  } = options
  // Remove suffix
  filename = filename.slice(0, filename.lastIndexOf('.'))

  if (!isExact) {
    // remove "05. Eagles - 加州旅馆" 's "05. "
    filename = filename.replace(/^[\d]{1,8}.\s/, '')
  }

  console.log('search for:', filename)

  for (let i = 0; i < lyricFileList.length; i++) {
    const lyric = lyricFileList[i]
    const mLyric = lyric.slice(0, lyric.lastIndexOf('.'))
    if (filename === mLyric) {
      console.log('lyric found:', lyric)
      return lyric
    }
  }
  console.log('lyric in list not found')
}

module.exports = {
  getMetadata,
  getLyricFile
}
