const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore')

const Usuario = require('./../models/Usuario')

const app = express()

app.get('/', (req, res) => {
  res.json('root')
})

app.get('/usuario', (req, res) => {

  let { init, limit } = req.query

  init = Number(init)
  limit = Number(limit)

  const condition = { estado: true }

  return Usuario.find(condition)
    .skip(init || 0)
    .limit(limit || 5)
    .then(usuarios => {

      Usuario.count(condition).exec()
        .then(usersAmount => res.json({ ok: true, usuarios, usersAmount }))
        .catch(err => res.status(400).json({ ok: false, ...err }))

    })
    .catch(err => res.status(400).json({ ok: false, ...err }))

})

app.post('/usuario', (req, res) => {
  let { body: persona } = req

  let usuario = new Usuario({
    nombre: persona.nombre,
    email: persona.email,
    password: bcrypt.hashSync(persona.password, 10),
    role: persona.role
  })

  usuario.save((err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        ...err
      })
    }

    delete usuarioDB.password

    return res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.put('/usuario/:id', (req, res) => {

  let { body, params } = req
    , { id } = params
    , omits = ['password', 'google']

  body = _.omit(body, omits)

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        ...err
      })
    }

    return res.json({
      ok: true,
      usuario: usuarioDB
    })

  })
})

app.delete('/usuario/:id', (req, res) => {
  let { id } = req.params
    , changeState = { estado: false }

  Usuario
    .findByIdAndUpdate(id, changeState, { new: true })
    .then(user => res.json({ ok: true, user }))
    .catch(err => res.status(400).json({ ok: false, err }))
})

module.exports = app
