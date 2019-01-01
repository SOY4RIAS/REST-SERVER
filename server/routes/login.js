const express = require('express')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const Usuario = require('./../models/Usuario')

const app = express()

const route = '/login'

app.post(`${route}`, (req, res) => {
  const { body } = req

  let { email, password } = body

  const err = { message: 'Usuario| O Contraseña incorrecto' }

  Usuario.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ ok: false, err })

    let compare = bcrypt.compareSync(password, user.password)

    if (!compare) return res.status(400).json({ ok: false, err })

    let token = jwt.sign({ user }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE })

    res.json({
      ok: true,
      user,
      token
    })

  })
    .catch(error => res.status(500).json({ ok: false, err: error }))

})

module.exports = app
