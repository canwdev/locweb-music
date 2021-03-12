const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('playlists', {
  title: Sequelize.STRING,
}, { timestamps: false })

sequelize.sync({
  force: true,
  alter: true
})

module.exports = Model
