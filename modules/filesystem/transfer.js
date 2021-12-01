const {
  getExactPath,
  getMediaPath,
  getSafeFilename
} = require('../../utils/fs-tool')
const fs = require('fs-extra')
const Path = require('path')
const {getSafePath} = require("../../utils/fs-tool")
const Archiver = require('archiver')

const downloadFile = async (req, res, next) => {
  try {
    const {
      filename,
      path: musicPath = ''
    } = req.query

    const {filePath} = getExactPath(musicPath, filename)

    const stat = await fs.lstat(filePath)

    if (stat.isDirectory()) {
      const archive = Archiver('zip', {
        zlib: { level: 9 }
      })
      archive.directory(filePath, filename);
      res.header('Content-Disposition', `attachment; filename="${filename}.zip"`);
      archive.pipe(res)
      archive.finalize()
      return
    }

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

    uploadPath = getMediaPath(getSafePath(musicPath) + '/' + filename)
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
