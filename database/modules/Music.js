const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const MusicSchema = new mongoose.Schema({
  filename: String,
  title: String,
  artist: String,
  album: String,
  cover: String,
  path: String,
}, {timestamps: false, usePushEach: true});

mongoose.model('Music', MusicSchema);
