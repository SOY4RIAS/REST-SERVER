const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

const Usuario = require('./../models/Usuario')
const { signToken } = require('./../helpers/utils/functions')

const app = express()

const client = new OAuth2Client(process.env.CLIENT_ID)

const route = '/login'

app.post(`${route}`, (req, res) => {
  const { body } = req

  let { email, password } = body

  const err = { message: 'Usuario| O Contraseña incorrecto' }

  Usuario.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ ok: false, err })

    let compare = bcrypt.compareSync(password, user.password)

    if (!compare) return res.status(400).json({ ok: false, err })

    let token = signToken(user);

    res.json({
      ok: true,
      user,
      token
    })

  })
    .catch(error => res.status(500).json({ ok: false, err: error }))

})

//Google Auth Config
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  })
  const payload = ticket.getPayload()

  let { name: nombre, email, picture: img } = payload

  return { nombre, email, img, google: true }
}

app.post(`${route}/google`, async (req, res) => {

  let { idtoken } = req.body
    , googleUser = await verify(idtoken)
      .catch(err => res.status(403).json({
        ok: false, err
      }))

  Usuario.findOne({ email: googleUser.email })
    .then(user => {
      let token

      if (!user) {
        let newUser = new Usuario()

        newUser.nombre = googleUser.nombre
        newUser.email = googleUser.email
        newUser.img = googleUser.imge
        newUser.google = googleUser.google
        newUser.password = '://'

        return newUser.save()
          .then(user => {
            token = signToken(user)
            return res.json({ ok: true, user, token, idtoken })
          })
          .catch(err => res.status(500).json({ ok: false, err }))
      }

      if (!user.google) {
        return res.status(400).json({ ok: false, err: { message: 'Debe Ingresar con otro metodo de autenticacion' } })
      }

      token = signToken(user);

      return res.json({ ok: true, user, token, idtoken })
    })
    .catch(err => res.status(500).json({ ok: false, err }))
})

module.exports = app
