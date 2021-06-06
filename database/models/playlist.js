const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('playlists', {
  pid: {type: Sequelize.NUMBER, allowNull: false, defaultValue: -1},
  title: Sequelize.STRING,
  desc: Sequelize.STRING,
  cover: Sequelize.STRING,
  sort: Sequelize.NUMBER,
}, {timestamps: true})

sequelize.sync({
  force: false,
  alter: true
})

module.exports = Model
