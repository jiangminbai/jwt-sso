const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = 'my_access_token_secret'
const REFRESH_TOKEN_SECRET = 'my_refresh_token_secret'

exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET
exports.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET

exports.generateAccessToken = function (user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

exports.generateRefreshToken = function (user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET)
}

// 验证access token 中间件
exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers['authorazition']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token)

  if (!token) return res.status(401).send()
  
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.status(403).send()
    
    req.user = user
    next()
  })
}