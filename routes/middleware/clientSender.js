/**
 * 统一处理客户端返回
 */
module.exports = async function clientSender (req, res, next) {
  res.sendData = data => {
    return res.json(data)
  }
  next()
}
