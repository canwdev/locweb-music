const router = require('express').Router()
router.use('/', require('../../modules/server'))

router.use('/music', require('../../modules/filesystem'))

// router.use('/music', require('../../modules/library'))

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
