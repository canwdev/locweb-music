const router = require('express').Router()
router.use('/', require('../../modules/server'))

router.use('/music', require('../../modules/filesystem'))

// router.use('/playlist', require('../../modules/playlist'))

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
