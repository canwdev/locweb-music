const pkg = require('../package.json')
const router = require('express').Router()

router.get('/', async (req, res, next) => {
  try {
    res.sendData({
      title: 'Locweb Music',
      name: pkg.name,
      version: pkg.version,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
