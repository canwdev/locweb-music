const pkg = require('../package.json')
const fs = require('fs-extra')
const path = require('path')
const router = require('express').Router()
const {enableAuth, authUsers} = require('../config')
const jwt = require('jsonwebtoken')
const {
  jwtToken,
  jwtTokenExpire
} = require('../config')

let changelogTxt = ''
try {
  changelogTxt = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md'), {encoding: 'utf8'})
} catch (e) {
  console.warn('Changelog not found', e.message)
}

router.get('/', async (req, res, next) => {
  try {
    res.sendData({
      package: {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        repository: pkg.repository,
      },
      changelog: changelogTxt
    })
  } catch (error) {
    next(error)
  }
})

router.post('/auth', async (req, res, next) => {
  try {
    const data = req.body
    if (!data.username || !data.password) {
      return res.sendError({message: 'Username or password is required'})
    }

    const {username, password} = data
    const user = authUsers[username]

    if (!user) {
      return res.sendError({message: 'Login Failed (1)'})
    }

    const isPasswordValid = password === user
    if (!isPasswordValid) {
      return res.sendError({message: 'Username or password is invalid'})
    }

    // Generate token
    // jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
    const token = jwt.sign({id: String(username)}, jwtToken, {
      expiresIn: jwtTokenExpire
    })

    return res.sendData({
      message: 'Login success',
      token,
      username
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router
