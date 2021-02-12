const router = require('express').Router()
// const music = require('../../db/modules/music')
const filesystem = require('../../modules/filesystem')
const service = require('../../modules/service')

router.get('/', service.info)

router.get('/music/list', filesystem.list);
router.get('/music/detail', filesystem.detail);

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
