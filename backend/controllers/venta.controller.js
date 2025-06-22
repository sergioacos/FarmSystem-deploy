const Venta = require('../models/Venta');
const Receta = require('../models/RecetaElectronica')
const Producto = require('../models/Producto')

// Crear una nueva venta
// exports.crearVenta = async (req, res) => {
//   try {
//     const venta = new Venta(req.body);
//     const ventaGuardada = await venta.save();
//     res.status(201).json(ventaGuardada);
//     // Después de guardar la venta
//     await Receta.findOneAndUpdate(
//   { id_receta: req.body.receta_id },
//   { estado: 'autorizada' }
// );
//   } catch (error) {
//     console.error('Error al crear venta:', error);
//     res.status(500).json({ error: 'Error al crear la venta' });
//   }
// };

exports.crearVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    const ventaGuardada = await venta.save();

    // Descontar stock por cada producto vendido
    for (const item of req.body.productos) {
      const producto = await Producto.findById(item.producto_id);

      if (!producto) {
        return res.status(404).json({ error: `Producto no encontrado: ${item.nombre}` });
      }

      if (producto.stock_actual < item.cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente para ${producto.nombre} (Disponible: ${producto.stock_actual}, Solicitado: ${item.cantidad})`
        });
      }

      await Producto.findByIdAndUpdate(
        item.producto_id,
        { $inc: { stock_actual: -item.cantidad } }
      );
    }

    // Cambiar estado de receta si aplica
    if (req.body.receta_id) {
      await Receta.findOneAndUpdate(
        { id_receta: req.body.receta_id },
        { estado: 'autorizada' }
      );
    }

    res.status(201).json(ventaGuardada);
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


