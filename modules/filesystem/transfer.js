const {
  getMusicExactPath,
  getMusicPath
} = require('../../utils/fs-tool')
const fs = require('fs-extra')
const path = require('path')

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

    sampleFile = req.files.sampleFile

    uploadPath = getMusicPath('/uploads/' + sampleFile.name)
    fs.ensureDirSync(path.dirname(uploadPath))

    sampleFile.mv(uploadPath, (err) => {
      if (err) {
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
