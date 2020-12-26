const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path');
const {DATA_BASE_PATH} = require('./config')
const {IMAGE_DIR} = require('./config/enum')
const {normalizePort} = require('./utils')

// 解决 req.body undefined
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'frontend-dist')));
app.use('/images', express.static(path.join(DATA_BASE_PATH, IMAGE_DIR)));

// Create Router
app.use('/', require('./routes/index'));

const port = normalizePort(process.env.PORT || '12021')
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}/api`);
});
