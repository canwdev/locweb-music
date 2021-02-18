const pkg = require('../package.json')
const router = require('express').Router()

router.get('/', async (req, res, next) => {
  try {
    res.sendData({
      title: 'Locweb Music',
      name: pkg.name,
      version: pkg.version,
      author: pkg.author
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
