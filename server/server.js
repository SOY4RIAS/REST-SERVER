require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const { PORT, urlDB } = process.env

/**DB */
mongoose.connect(urlDB, { useCreateIndex: true, useNewUrlParser: true })
  .then(res => console.log('Base de datos Conectada'))
  .catch(err => console.log(err))

/** Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Global Routes */
app.use(require('./routes/index'))

/** Public Folder */
app.use(express.static(path.resolve(__dirname, '../public')))

app.listen(PORT, () => console.log(`escuchando en ${PORT}`))
