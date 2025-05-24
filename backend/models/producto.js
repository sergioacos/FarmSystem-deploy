const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo:{ type: String, required: true },
  nombre: { type: String, required: true },
  laboratorio: { type: String, required: true },
  precio: { type: Number, required: true },
  estado: { type: Array, required: true },
  stock_minimo: { type: Number, required: true },
  stock_actual: { type: Number, required: true },
  descripcion: String
}, { timestamps: true });
const Producto=mongoose.model('Producto', productoSchema);
module.exports = Producto;
