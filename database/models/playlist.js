const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('playlists', {
  title: Sequelize.STRING,
  sort: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
  }
}, { timestamps: false })

sequelize.sync({
  force: true,
  alter: true
})

module.exports = Model
