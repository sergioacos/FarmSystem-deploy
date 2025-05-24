const Producto = require('../models/Producto');


exports.getTodos = async (req, res) => {
  const items = await Producto.find();
  res.json(items);
};

exports.crear = async (req, res) => {
  const nuevo = new Producto(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
};