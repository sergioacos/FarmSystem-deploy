const Categoria = require('../models/Categoria');

exports.getTodos = async (req, res) => {
  const items = await Categoria.find();
  res.json(items);
};

exports.crear = async (req, res) => {
  const nuevo = new Categoria(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
};