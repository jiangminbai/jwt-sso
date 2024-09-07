const jwt = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = 'my_access_token_secret'
const REFRESH_TOKEN_SECRET = 'my_access_token_secret'

function generateAccessToken (user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

function generateRefreshToken (user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET)
}

const accessToken = generateAccessToken({username: 'a'})
const refreshToken = generateRefreshToken({username: 'a'})
console.log(accessToken)
console.log(refreshToken)