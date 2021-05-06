const path = require('path')
const {DATA_PATH} = require('./index')

module.exports = {
  IMAGE_PATH: path.join(DATA_PATH, 'images'),
  JWT_TOKEN: 'token_secret_j3478n68o23ui',
  JWT_TOKEN_EXPIRE: '7 days',
  CODE_TOKEN_EXPIRE: 401,
  CODE_CLIENT_FORBIDDEN: 403,
}
