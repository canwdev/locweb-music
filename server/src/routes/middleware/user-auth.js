const jwt = require('jsonwebtoken')
const {CODE_CLIENT_FORBIDDEN} = require('../../config/enum')
const {jwtToken, enableAuth, authUsers} = require('../../config')

const checkAuth = (token) => {
  if (!token) {
    return null
  }
  const raw = String(token)
  const {id} = jwt.verify(raw, jwtToken)

  const hasUser = Boolean(authUsers[id])

  // console.log({
  //   hasUser,
  //   id
  // })

  return {
    hasUser,
    id,
  }
}

const handleError = (error, res) => {
  console.log(error)

  if (error.message === 'jwt expired') {
    return res.sendError({
      code: CODE_CLIENT_FORBIDDEN,
      message: 'Token expired (2)',
    })
  }

  return res.status(500).send({
    message: error.message,
  })
}

async function getUserId(req, res, next) {
  try {
    req.__userid = null
    let token = req.headers.authorization

    if (token) {
      const {id} = checkAuth(token)
      req.__userid = id
    }

    next()
  } catch (e) {
    return handleError(e, res)
  }
}

/**
 * 验证登录中间件
 * 需要验证的路由，需要在请求头加入 authorization 字段，值为登录成功获取的token
 * 会向下级传递 __userid 作为登录用户的id
 */
async function userAuth(req, res, next) {
  // 必须先登录
  try {
    if (!enableAuth) {
      req.__userid = null
      return next()
    }

    let token = req.headers.authorization

    if (token) {
      const {hasUser, id} = checkAuth(token)

      if (!hasUser)
        return res.sendError({
          code: CODE_CLIENT_FORBIDDEN,
          message: 'Token expired (1)',
        })

      // 向下一级传值
      req.__userid = id
      next()
    } else {
      return res.status(CODE_CLIENT_FORBIDDEN).send({
        message: 'This action needs login',
      })
    }
  } catch (e) {
    return handleError(e, res)
  }
}

module.exports = {
  userAuth,
  getUserId,
}
