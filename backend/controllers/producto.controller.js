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