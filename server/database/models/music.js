const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

const genJsonGetSet = (name, defaultJSON = '[]') => {
  return {
    type: Sequelize.STRING,
    get() {
      return JSON.parse(this.getDataValue(name) || defaultJSON)
    },
    set(val) {
      this.setDataValue(name, JSON.stringify(val));
    }
  }
}

// Table schema
const Model = sequelize.define('musics', {
  title: {type: Sequelize.STRING, },
  artists: genJsonGetSet('artists'),
  album: {type: Sequelize.STRING, },
  year: {type: Sequelize.STRING },
  genre: genJsonGetSet('genre'),
  disk: genJsonGetSet('disk', '{}'),
  track: genJsonGetSet('track', '{}'),
  desc: {type: Sequelize.STRING, },
  tags: {type: Sequelize.STRING, },
  rank: {type: Sequelize.NUMBER},
  // sort: {type: Sequelize.NUMBER, defaultValue: 0},
  cover: {type: Sequelize.STRING, },
  lyric: {type: Sequelize.STRING, },
  filepath_origin: {
    type: Sequelize.STRING,
    unique: true
  }, // 原始文件位置（相对 MUSIC_LIBRARY_PATH 路径）
  filepath: {type: Sequelize.STRING}, // 当前文件位置（相对 MEDIA_VAULT_PATH 路径）
  hash: {
    type: Sequelize.STRING,
    unique: true
  },
}, {timestamps: true})

sequelize.sync({
  // force: false,
  // alter: true
})

module.exports = Model
