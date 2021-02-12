const router = require('express').Router()
router.use('/', require('../../modules/server'))

// const filesystem = require('../../modules/filesystem')
// router.get('/music/list', filesystem.list);
// router.get('/music/detail', filesystem.detail);

router.use('/music', require('../../modules/library'))

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
