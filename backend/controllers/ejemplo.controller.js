const Ejemplo = require('../models/producto');

exports.getTodos = async (req, res) => {
  const items = await Ejemplo.find();
  res.json(items);
};

exports.crear = async (req, res) => {
  const nuevo = new Ejemplo(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
};
