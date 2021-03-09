const path = require('path');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const {DATA_PATH, MUSIC_LIBRARY_PATH, MUSIC_LYRICS_PATH} = require('./config')
const {IMAGE_PATH} = require('./config/enum')
const {normalizePort} = require('./utils')
const isProduction = process.env.NODE_ENV === 'production';

// HTTP request logger middleware
app.use(require('morgan')('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json())

if (!isProduction) {
  app.use(errorhandler());
}

app.use(express.static(path.join(__dirname, 'public')));
// Vue dist directory
app.use('/', express.static(path.join(__dirname, 'frontend-dist')));
// Cover images
app.use('/images', express.static(IMAGE_PATH));
// Expose library filesystem
app.use('/mfs', express.static(MUSIC_LIBRARY_PATH, {dotfiles:'allow'}));
console.log(`Serving /mfs from ${MUSIC_LIBRARY_PATH}`)
app.use('/lrc', express.static(MUSIC_LYRICS_PATH));

// Create Router
app.use('/', require('./routes/index'));

// Start server
const port = normalizePort(process.env.PORT || '12021')
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
