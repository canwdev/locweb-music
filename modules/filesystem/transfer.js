const {
  getMusicExactPath,
  getMusicPath,
  getSafeFilename
} = require('../../utils/fs-tool')
const fs = require('fs-extra')
const Path = require('path')
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
    let file
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.')
      return
    }

    let {
      filename,
      path: musicPath = ''
    } = req.body

    file = req.files.file
    filename = getSafePath(getSafeFilename(filename) || file.name)

    console.log('>>> filename: ',filename)

    uploadPath = getMusicPath(getSafePath(musicPath) + '/' + filename)
    fs.ensureDirSync(Path.dirname(uploadPath))

    console.log('>>> uploadPath: ',uploadPath)

    file.mv(uploadPath, (err) => {
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
