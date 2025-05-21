const mongoose = require('mongoose');

const ejemploSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String
}, { timestamps: true });

module.exports = mongoose.model('Ejemplo', ejemploSchema);
