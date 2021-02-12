console.log('Database initializing...')
const mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/locweb_music');
  mongoose.set('debug', true);
}

require('./modules/Music')
console.log('Database initialized')
