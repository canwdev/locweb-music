const Sequelize = require('sequelize')
const path = require('path')
const config = require('../config')

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: path.join(config.DATA_BASE_PATH, 'database.db'),
  // disable logging; default: console.log
  logging: false
})

module.exports = sequelize
