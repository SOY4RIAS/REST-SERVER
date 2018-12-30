const express = require('express')
const bodyParser = require('body-parser')
const app = express();

require('./config/config')

const { PORT } = process.env

/**middleware */

//parse application/x-www-form-urlencoded <- data inside post-like request
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json <- get request as json encoded
app.use(bodyParser.json())

/** routes */
app.get('/', (req, res) => {
  res.json('root')
})

app.get('/usuario', (req, res) => {
  res.json('hellow World')
})

app.post('/usuario', (req, res) => {

  let { body: persona } = req

  if (persona.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'el nombre es necesario'
    })
    return
  }

  res.json({ persona })
})

app.put('/usuario/:id', (req, res) => {

  let { id } = req.params

  res.json({ id })
})

app.delete('/usuario', (req, res) => {
  res.json('delete World')
})

app.listen(PORT, () => console.log(`escuchando en ${PORT}`))
