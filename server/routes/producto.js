const express = require('express')
const { verifyToken } = require('../helpers/middlewares/auth')
const _ = require('underscore')

const Producto = require('../models/Producto')

const app = express()

app.get('/producto', async (req, res) => {

  try {
    const productos = await Producto.find({})
      .sort('nombre')
      .populate('categoria', 'descripcion')
      .populate('usuario', 'nombre email')

    Producto.countDocuments({}).exec()
      .then(productAmount => res.json({ ok: true, productos, productAmount }))
      .catch(err => res.status(400).json({ ok: false, err }))
  }
  catch (err_1) {
    return res.status(400).json({ ok: false, err_1 })
  }
})

app.get('/producto/:id', verifyToken, (req, res) => {
  const { id } = req.params
  Producto.findById(id)
    .then(product => res.json({ ok: true, product }))
    .catch(err => res.status(500).json({ ok: false, err }))
})

app.post('/producto', verifyToken, (req, res) => {
  const { _id: usuario } = req.user

  let newProduct = new Producto({ ...req.body, usuario })

  newProduct.save()
    .then(product => res.json({ ok: true, product }))
    .catch(err => res.status(500).json({ ok: false, err }))
})

app.put('/producto/:id', verifyToken, (req, res) => {
  const { id } = req.params

  Producto.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(product => res.json({ ok: true, product }))
    .catch(err => res.status(500).json({ ok: false, err }))
})

app.delete('/producto/:id', verifyToken, (req, res) => {
  const { id } = req.params
  Producto.findByIdAndRemove(id)
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
