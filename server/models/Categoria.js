const { Schema, model } = require('mongoose')

let Categoria = new Schema({
  descripcion: { type: String, unique: true, required: [true, 'Descripción es obligatoria'] },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
})

module.exports = model('Categoria', Categoria)
