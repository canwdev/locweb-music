const fs = require('fs-extra');
const { getMediaPath, parseFileName } = require('../../utils/fs-tool')
const { calcFileHash } = require('../../utils')

const migrateMedia = async (item) => {
  const { filepathOrigin } = item
  const fileHash = await calcFileHash(getMediaPath(filepathOrigin))
  console.log('fileHash', fileHash)
  const {suffix} = parseFileName(filepathOrigin)
  const newFilename = `${fileHash}${suffix}`

  console.log(newFilename);
}


module.exports = {
  migrateMedia
}