const mm = require('music-metadata')
const {calcBufferHash} = require('./index')
const {getLyricsPath,getSafePath} = require('./fs-tool')
const mime = require('mime-types')
const path = require('path');
const fs = require('fs-extra');
const {IMAGE_PATH} = require('../config')
const {nodeBus, BUS_UPDATE_LYRIC_CACHE} = require('./node-bus')

/**
 * Get music metadata and extract cover
 * @param filePath
 * @returns {Promise<{coverFileName: string, metadata: IAudioMetadata}>}
 */
const getMetadata = async (filePath) => {
  const metadata = await mm.parseFile(filePath)
  const {common} = metadata
  delete metadata.quality
  // console.log(util.inspect(metadata, {showHidden: false, depth: null}));

  // Extract cover
  if (common.picture && common.picture[0]) {
    const picture = common.picture[0]
    const coverBuffer = picture.data
    const coverHash = await calcBufferHash(coverBuffer)
    const coverFileName = `${coverHash}.${mime.extension(picture.format)}`
    const coverSavePath = path.join(IMAGE_PATH, getSafePath(coverFileName))
    if (!fs.existsSync(coverSavePath)) {
      await fs.writeFile(coverSavePath, coverBuffer, "binary")
    }

    delete common.picture
    delete common.comment

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

const filterLyricFilename = (filename, options = {}) => {
  const {
    isExact = false,
  } = options
  // Remove suffix
  filename = filename.slice(0, filename.lastIndexOf('.'))

  if (!isExact) {
    // "05. Eagles - 加州旅馆" => "Eagles - 加州旅馆"
    filename = filename.replace(/^[\d]{1,8}.\s/, '')
  }
  return filename
}

/**
 * 遍历歌词数组获取歌词文件名
 * @param lyricFileList List contains lyric filenames
 * @param filename Music filename
 * @param options
 */
const traverseLyrics = (lyricFileList, filename) => {
  console.log('>>> [traverseLyrics]', filename)

  for (let i = 0; i < lyricFileList.length; i++) {
    const lyric = lyricFileList[i]
    // 此处文件可能有特殊字符，不能用正则表达式
    const mLyric = lyric.slice(0, lyric.lastIndexOf('.'))
    if (filename === mLyric) {
      console.log('<<< [traverseLyrics] OK', lyric)
      return lyric
    }
  }
  console.log('<<< [traverseLyrics] not found')
}

const saveLyricFile = async (filename, lyric, options = {}) => {
  filename = filterLyricFilename(filename, options) + '.lrc'

  const savePath = getLyricsPath(filename)
  // console.log('Save lyric', savePath)
  await fs.writeFile(savePath, lyric, {encoding: 'utf8'})
  nodeBus.emit(BUS_UPDATE_LYRIC_CACHE, savePath)
  return {
    savePath,
    filename
  }
}

module.exports = {
  getMetadata,
  filterLyricFilename,
  traverseLyrics,
  saveLyricFile,
}
