const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: { type: String, unique: true, required: true },
  nombre: { type: String, required: true },
  laboratorio: { type: String },
  precio: { type: Number, required: true, min:0 },
  estado: [{
  type: String,
  enum: ['activo', 'vencido', 'suspendido'], //  posibles valores
  default: 'activo'
}], // Ej: ["activo", "vencido"]
  stock_minimo: { type: Number }, //agregar  required: true cuando genere la bd final
  stock_actual: { type: Number }, //agregar  required: true cuando genere la bd final
  alta_rotacion: { type: Boolean, default: false },
  // Relación con Categoría
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);
