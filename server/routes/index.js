const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json('')
})

app.use(require('./usuario'))
app.use(require('./login'))

module.exports = app
