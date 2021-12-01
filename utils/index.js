const fs = require('fs-extra');
const crypto = require('crypto');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
function calcFileHash(filename, algorithm = 'sha1') {
  return new Promise((resolve, reject) => {
    let sum = crypto.createHash(algorithm);
    try {
      let s = fs.ReadStream(filename)
      s.on('data', function (data) {
        sum.update(data)
      })
      // making digest
      s.on('end', function () {
        const hash = sum.digest('hex')
        return resolve(hash);
      })
    } catch (error) {
      return reject(error);
    }
  })
}

function calcBufferHash(buffer, algorithm = 'sha1') {
  return new Promise((resolve, reject) => {
    let sum = crypto.createHash(algorithm);
    try {
      sum.update(buffer)
      const hash = sum.digest('hex')
      return resolve(hash)
    } catch (error) {
      return reject(error)
    }
  })
}

const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

module.exports = {
  normalizePort,
  calcFileHash,
  calcBufferHash,
  guid
}
