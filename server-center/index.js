const express = require('express')
const storage = require('node-persist')
const session = require('express-session')
const jwt = require('jsonwebtoken')
storage.initSync()

const app = express()
app.use(express.static('./static-center'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  generateAccessToken,
  generateRefreshToken,
} = require('../utils')

app.post('/registry', async (req, res) => {
  const {
    username,
    password
  } = req.body
  await storage.setItem(
    username,
    password,
  )
  res.send({
    msg: 'success'
  })
})

app.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body
  const pass = await storage.getItem(username)
  if (pass === password) {
    req.session.user = username
    const accessToken = generateAccessToken({username})
    const refreshToken = generateRefreshToken({username})
    const allRefreshToken = await storage.getItem('refreshToken')
    await storage.setItem('refreshToken', [...(allRefreshToken || []), refreshToken])

    res.json({
      accessToken,
      refreshToken
    })
  } else {
    res.status(401).send({
      msg: 'fail'
    })
  }
})

app.post('/loginStatus', async (req, res) => {
  if (req.session.user) {
    const username = req.session.user
    const accessToken = generateAccessToken({username})
    const refreshToken = generateRefreshToken({username})
    const allRefreshToken = await storage.getItem('refreshToken')
    await storage.setItem('refreshToken', [...(allRefreshToken || []), refreshToken])
    
    res.send({
      accessToken,
      refreshToken
    })
  } else {
    res.status(403).send()
  }
})

app.post('/logout', async (req, res) => {
  const {token} = req.body
  const allRefreshToken = await storage.getItem('refreshToken')
  const index = allRefreshToken.findIndex(token)
  if (index > -1) {
    allRefreshToken.splice(index, 1)
    await storage.setItem('refreshToken', allRefreshToken)
  }

  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({msg: 'logout failed'})
    }
    res.clearCookie('connect.sid')
    res.send({
      msg: 'logout'
    })
  })
})

// 刷新access token
app.post('/token', async (req, res) => {
  const {token} = req.body
  const allRefreshToken = await storage.getItem('refreshToken')
  if (!allRefreshToken.includes(token)) return res.status(403) // 无效token
  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403) // 无效token
    const accessToken = generateAccessToken({username: user.username})
    res.send({accessToken})
  })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
