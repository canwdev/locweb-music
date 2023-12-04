const router = require('express').Router()
router.use('/', require('../../components/server'))

router.use('/music', require('../../components/filesystem'))

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
