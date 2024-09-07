const express = require('express')

const {authenticateToken} = require('../utils')

const app = express()
app.use(express.static('./static-app1'))
app.use(authenticateToken)

app.get('/info', (req, res) => {
  res.send({
    user: {username: req.user?.username}
  })
})

app.listen(3001, () => {
  console.log('http://127.0.0.1:3001')
})