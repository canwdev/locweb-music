const pkg = require('../package.json')

module.exports = {
  async info(req, res, next) {
    try {
      res.sendData({
        title: 'Locweb Music',
        name: pkg.name,
        version: pkg.version,
      })
    } catch (error) {
      next(error)
    }
  }
}
