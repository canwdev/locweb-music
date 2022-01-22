const mitt = require('mitt')
const nodeBus = mitt()

module.exports = {
  nodeBus,
  BUS_UPDATE_LYRIC_CACHE: 'BUS_UPDATE_LYRIC_CACHE'
}
