const Sequelize = require('sequelize')
const sequelize = require('../../sequelize')

// Table schema
const Model = sequelize.define('music', {
  title: Sequelize.STRING,
  artist: Sequelize.STRING,
  album: Sequelize.STRING,
  track: Sequelize.STRING,
  year: Sequelize.STRING,
  hash: Sequelize.STRING,
  coverImage: Sequelize.STRING,
  filepath: Sequelize.STRING,
  rating: Sequelize.STRING,
}, { timestamps: false })

sequelize.sync()

module.exports = Model
