const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  id_categ: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
