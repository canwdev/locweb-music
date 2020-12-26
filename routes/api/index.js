const router = require('express').Router()
const music = require('../../db/modules/music')
const service = require('../../db/modules/service')

router.get('/', service.info)

router.get('/music/list', music.list);
router.get('/music/detail', music.detail);

router.use((err, req, res, next) => {
  return next(err)
})

module.exports = router
