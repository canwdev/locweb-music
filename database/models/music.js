const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('musics', {
  pid: {type: Sequelize.NUMBER, defaultValue: -1}, // Playlist id
  title: {type: Sequelize.STRING, defaultValue: ''},
  artists: {
    type: Sequelize.STRING,
    defaultValue: '',
    get() {
      return JSON.parse(this.getDataValue('artists') || '[]')
    },
    set(val) {
      this.setDataValue('artists', JSON.stringify(val));
    }
  },
  cover: {type: Sequelize.STRING, defaultValue: ''},
  desc: {type: Sequelize.STRING, defaultValue: ''},
  album: {type: Sequelize.STRING, defaultValue: ''},
  tags: {type: Sequelize.STRING, defaultValue: ''},
  filename: {type: Sequelize.STRING, defaultValue: ''},
  path: {type: Sequelize.STRING, defaultValue: ''},
  filepath: {type: Sequelize.STRING, defaultValue: '', allowNull: false}, // Relative file path (filepath = path+filename)
  sort: {type: Sequelize.NUMBER, defaultValue: 0},
  rank: {type: Sequelize.NUMBER, defaultValue: 0},
}, {timestamps: true})

sequelize.sync()

module.exports = Model
