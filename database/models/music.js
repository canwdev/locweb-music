const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('musics', {
  pid: {type: Sequelize.NUMBER, allowNull: false},
  title: Sequelize.STRING,
  artists: Sequelize.STRING,
  cover: Sequelize.STRING,
  desc: Sequelize.STRING,
  tags: Sequelize.STRING,
  file: Sequelize.STRING, // Relative file path
  sort: Sequelize.NUMBER,
  rank: Sequelize.NUMBER,
}, { timestamps: false })

sequelize.sync()

module.exports = Model
