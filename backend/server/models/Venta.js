// models/Venta.js
const mongoose = require('mongoose');

const productoVentaSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true },
});

const ventaSchema = new mongoose.Schema({
  // cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  productos: [productoVentaSchema],  //es como el carrito de productos
  fecha_venta: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  tipo_pago: { type: String, enum: ['efectivo', 'tarjeta', 'obra_social'], required: true },
  // vendedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  // receta_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Receta', default: null },
});

module.exports = mongoose.model('Venta', ventaSchema);
