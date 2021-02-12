const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const MusicSchema = new mongoose.Schema({
  filename: String,
  hash: String,
  cover: String,
  metadata: Object,
  path: String,
}, {timestamps: false, usePushEach: true});

mongoose.model('Music', MusicSchema);
