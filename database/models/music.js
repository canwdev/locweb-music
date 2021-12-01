const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

// Table schema
const Model = sequelize.define('musics', {
  pid: {type: Sequelize.NUMBER, defaultValue: -1}, // Playlist id
  title: {type: Sequelize.STRING, },
  artists: {
    type: Sequelize.STRING,
    get() {
      return JSON.parse(this.getDataValue('artists') || '[]')
    },
    set(val) {
      this.setDataValue('artists', JSON.stringify(val));
    }
  },
  cover: {type: Sequelize.STRING, },
  desc: {type: Sequelize.STRING, },
  album: {type: Sequelize.STRING, },
  tags: {type: Sequelize.STRING, },
  filename: {type: Sequelize.STRING, },
  filepathOrigin: {type: Sequelize.STRING}, // 原始文件位置（相对路径）
  filepath: {type: Sequelize.STRING}, // 当前文件位置（相对路径）
  sort: {type: Sequelize.NUMBER, defaultValue: 0},
  rank: {type: Sequelize.NUMBER, defaultValue: 0}
}, {timestamps: true})

sequelize.sync({
  // force: false,
  // alter: true
})

module.exports = Model
