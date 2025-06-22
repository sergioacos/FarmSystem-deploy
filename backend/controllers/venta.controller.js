const Venta = require('../models/Venta');
const Receta = require('../models/RecetaElectronica')

// Crear una nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    const ventaGuardada = await venta.save();
    res.status(201).json(ventaGuardada);
    // Después de guardar la venta
    await Receta.findOneAndUpdate(
  { id_receta: req.body.receta_id },
  { estado: 'autorizada' }
);
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: 'Error al crear la venta' });
  }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('productos.producto_id');
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};


