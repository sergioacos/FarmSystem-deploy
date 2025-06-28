const Lote = require('../models/Lote');

// Función para calcular el descuento basado en la proximidad al vencimiento
function calcularDescuento(fechaCaducidad) {
  const hoy = new Date();
  const diffTime = Math.abs(fechaCaducidad - hoy);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convierte la diferencia en días
  
  if (diffDays <= 7) {
    return 25; // 25% descuento si vence en los próximos 7 días
  } else if (diffDays <= 14) {
    return 20; // 20% descuento si vence entre 8 y 14 días
  } else if (diffDays <= 30) {
    return 10; // 10% descuento si vence entre 15 y 30 días
  }
  return 0; // Sin descuento si el vencimiento es más allá de 30 días
}

// Función para obtener lotes próximos a vencer
async function obtenerAlertasVencimientos(req, res) {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 8); // Hasta 7 días
   
    const lotesVencimientoCercano = await Lote.find({
      fecha_caducidad: { $lte: fechaLimite }
    }).populate('productos.producto_id');  

    lotesVencimientoCercano.forEach(lote => {
      lote.descuento = calcularDescuento(lote.fecha_caducidad);
    });
    
    res.json(lotesVencimientoCercano);
  } catch (err) {
    console.error('Error al obtener lotes próximos a vencer:', err);
    res.status(500).json({ error: 'Error al obtener los lotes' });
  }
}

module.exports = {
  obtenerAlertasVencimientos
};
