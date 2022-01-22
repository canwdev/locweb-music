const Sequelize = require('sequelize')
const path = require('path')
const {
  MUSIC_LIBRARY_PATH
} = require('../config')

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: path.join(MUSIC_LIBRARY_PATH, 'locweb-music.db'),
  // disable logging; default: console.log
  logging: false
})

module.exports = sequelize
