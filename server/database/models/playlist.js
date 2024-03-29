const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('playlists', {
  pid: {type: Sequelize.NUMBER, allowNull: false, defaultValue: -1}, // Parent id
  last_play_id: {type: Sequelize.NUMBER},
  title: {type: Sequelize.STRING, defaultValue: ''},
  desc: {type: Sequelize.STRING, defaultValue: ''},
  cover: {type: Sequelize.STRING, defaultValue: ''},
  sort: {type: Sequelize.NUMBER, defaultValue: ''},
}, {timestamps: true})

sequelize.sync({
  // force: false,
  // alter: true
}).then(async () => {
  const count = await Model.count()
  if (count === 0) {
    Model.create({
      title: 'Default List'
    })
  }

})


module.exports = Model
