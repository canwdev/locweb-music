const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('playlist_items', {
  pid: Sequelize.NUMBER,
  title: Sequelize.STRING,
  file: Sequelize.STRING,
  sort: Sequelize.NUMBER,
  rank: Sequelize.NUMBER,
}, { timestamps: false })

sequelize.sync()

module.exports = Model
