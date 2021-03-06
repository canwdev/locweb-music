const {
  getMusicExactPath,
  getMusicPath,
  getSafeFilename
} = require('../../utils/fs-tool')
const fs = require('fs-extra')
const path = require('path')
const {getSafePath} = require("../../utils/fs-tool")

const downloadFile = async (req, res, next) => {
  try {
    const {
      filename,
      path: musicPath = ''
    } = req.query

    const {filePath} = getMusicExactPath(musicPath, filename)

    return res.download(filePath, filename, {
      dotfiles: 'allow'
    })
  } catch (error) {
    next(error)
  }
}

const uploadFile = async (req, res, next) => {
  try {
    let sampleFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.')
      return
    }

    let {
      filename,
      path: musicPath = ''
    } = req.body

    sampleFile = req.files.sampleFile
    filename = getSafePath(getSafeFilename(filename) || sampleFile.name)

    console.log('>>> filename: ',filename)

    uploadPath = getMusicPath(getSafePath(musicPath) + '/' + filename)
    fs.ensureDirSync(path.dirname(uploadPath))

    console.log('>>> uploadPath: ',uploadPath)

    sampleFile.mv(uploadPath, (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      }

      res.sendData({message: 'File uploaded'})
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  downloadFile,
  uploadFile
}
