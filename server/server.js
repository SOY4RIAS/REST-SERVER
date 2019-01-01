require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

app.listen(PORT, () => console.log(`escuchando en ${PORT}`))
