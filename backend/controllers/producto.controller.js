const Producto = require('../models/Producto');

exports.obtenerProductos = async (req, res) => {
  try{
  const items = await Producto.find();
  res.json(items);
  } catch(error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

exports.crear = async (req, res) => {
  try{
  const nuevo = new Producto(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear producto:', error)
       if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: 'Datos inválidos', errores: error.errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
    }

    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
  
};

// Buscar un producto por nombre (exacto o parcial)
exports.buscarPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ mensaje: "Falta el parámetro 'nombre'" });
  }

  try {
    // Búsqueda insensible a mayúsculas/minúsculas y con coincidencia parcial
    const regex = new RegExp(nombre, 'i');
    const productos = await Producto.find({ nombre: { $regex: regex } });

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró ningún producto con ese nombre" });
    }

    res.json(productos);
  } catch (error) {
    console.error("Error al buscar producto por nombre:", error);
    res.status(500).json({ mensaje: "Error al buscar producto" });
  }
};
