const path = require('path');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const {DATA_BASE_PATH, MUSIC_LIBRARY_PATH} = require('./config')
const {IMAGE_DIR} = require('./config/enum')
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
app.use('/images', express.static(path.join(DATA_BASE_PATH, IMAGE_DIR)));
// Expose library filesystem
app.use('/mfs', express.static(MUSIC_LIBRARY_PATH));

// Create Router
app.use('/', require('./routes/index'));

// Start server
const port = normalizePort(process.env.PORT || '12021')
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}/api`);
});
