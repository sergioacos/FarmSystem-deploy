const mongoose = require('mongoose');

const loteSchema = new mongoose.Schema({
  numero_lote: { type: String, required: true },
  fecha_caducidad: { type: Date, required: true },
  cantidad: { type: Number, required: true },
  productos: [{
    producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad_asociada: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lote', loteSchema);
