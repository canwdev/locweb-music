const {
  getMusicExactPath
} = require('./utils')

const downloadMusic = async (req, res, next) => {
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

module.exports = {
  downloadMusic
}
