const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const Music = require('./music')
const Playlist = require('./playlist')

// Table schema
const Model = sequelize.define('playlist_items', {
  playlist_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Playlist,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  music_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Music,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  desc: {type: Sequelize.STRING, },
  tags: {type: Sequelize.STRING, },
  sort: {type: Sequelize.NUMBER},
  rank: {type: Sequelize.NUMBER},
}, {timestamps: true})

Music.hasOne(Model, { foreignKey: 'music_id' })
Model.belongsTo(Music, { foreignKey: 'music_id' })

sequelize.sync({
  // force: false,
  // alter: true
})

module.exports = Model
