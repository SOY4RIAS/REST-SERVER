const express = require('express')
const { verifyToken, verifyAdminUser } = require('../helpers/middlewares/auth')

const Categoria = require('../models/Categoria')

const app = express()

app.get('/categoria', async (req, res) => {

  const { init, limit } = req

  try {
    const categorias = await Categoria.find({})
      .skip(init || 0)
      .limit(limit || 5)

    Categoria.countDocuments({}).exec()
      .then(categoriesAmount => res.json({ ok: true, categorias, categoriesAmount }))
      .catch(err => res.status(400).json({ ok: false, err }))
  }
  catch (err_1) {
    return res.status(400).json({ ok: false, err_1 })
  }
})

app.get('/categoria/:id', verifyToken, (req, res) => {
  const { id } = req.params
  Categoria.findById(id)
    .then(category => res.json({ ok: true, category }))
    .catch(err => res.status(500).json({ ok: false, err }))
})

app.post('/categoria', verifyToken, (req, res) => {
  const { descripcion } = req.body
    , { _id: usuario } = req.user

  let newCategory = new Categoria({ descripcion, usuario })

  newCategory.save()
    .then(user => res.json({ ok: true, user }))
    .catch(err => res.status(500).json({ ok: false, err }))
})


app.put('/categoria/:id', verifyToken, (req, res) => {
  const { descripcion } = req.body
    , { id } = req.params

  Categoria.findByIdAndUpdate(id, { descripcion }, { new: true })
    .then(category => res.json({ ok: true, category }))
    .catch(err => res.status(500).json({ ok: false, err }))
})

app.delete('/categoria/:id', [verifyToken, verifyAdminUser], (req, res) => {
  const { id } = req.params
  Categoria.findByIdAndRemove(id)
    .then(deleted => {

      const err = {
        message: 'no se encuentra el registro'
      }

      return deleted ?
        res.json({ ok: true, deleted }) :
        res.status(400).json({ ok: false, err })
    })
    .catch(err => res.status(400).json({ ok: false, err }))
})

module.exports = app;
