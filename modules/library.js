const router = require('express').Router()
const mongoose = require('mongoose')
const Music = mongoose.model('Music')

router.get('/list', async (req, res, next) => {
  try {
    const {
      limit = 20,
      offset = 0
    } = req.params

    const list = await Music.find({}, '-__v', {lean: true})
      .limit(Number(limit))
      .skip(Number(offset))

    // console.log(list)
    return res.sendData(list.map(item => {
      const obj = {
        id: item._id,
        ...item,
      }
      delete obj._id
      return obj
    }))
  } catch (error) {
    next(error)
  }
})

module.exports = router
