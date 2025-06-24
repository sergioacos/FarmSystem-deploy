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

// Obtener ventas de las últimas 24 horas y verificar si hay ventas inusuales
exports.ventasExcesivasUltimas24Horas = async (req, res) => {
  const diaLimite = new Date(Date.now() - 24 * 60 * 60 * 1000); 

  try {
    // Obtener las ventas de las últimas 24 horas
    const ventas = await Venta.find({ fecha_venta: { $gte: diaLimite } })
      .populate('productos.producto_id'); 

    let alerta = false;
    const productosExcesivos = [];
    const ventasPorProducto = {};

    // Procesar las ventas y contar las cantidades vendidas por producto
    ventas.forEach(venta => {
      venta.productos.forEach(item => {
        const producto = item.producto_id;
        if (!ventasPorProducto[producto._id]) {
          ventasPorProducto[producto._id] = 0;
        }
        ventasPorProducto[producto._id] += item.cantidad;
      });
    });

    // Comparar las cantidades vendidas con los umbrales
    for (let producto_id in ventasPorProducto) {
      const cantidadVendida = ventasPorProducto[producto_id];
      const producto = await Producto.findById(producto_id);  // Obtener el producto para ver el tipo de rotación

      // Definir el umbral según el tipo de producto
      const umbralVentas = producto.alta_rotacion ? 50 : 10; // 50 para alta rotación, 10 para baja rotación

      if (cantidadVendida > umbralVentas) {
        productosExcesivos.push({
          nombre: producto.nombre,
          cantidadVendida,
          umbral: umbralVentas
        });
        alerta = true;
      }
    }

    res.json({ alerta, productos: productosExcesivos });

  } catch (error) {
    console.error('Error al verificar ventas excesivas:', error);
    res.status(500).json({ error: 'Error al verificar las ventas excesivas' });
  }
};

