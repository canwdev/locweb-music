const {
  downloadMusic
} = require('./transfer')
const {
  saveLyric,
  handleAction
} = require('./actions')
const {
  listFiles,
  getDetail
} = require('./lister')

const router = require('express').Router()

const {
  userAuth,
  getUserId
} = require('../../routes/middleware/user-auth')


// Handle routers

router.get('/list', getUserId, listFiles)

router.get('/detail', getDetail)

router.post('/action', userAuth, handleAction)

router.post('/save-lyric', userAuth, saveLyric)

router.get('/download', downloadMusic)

module.exports = router
