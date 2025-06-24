const Lote = require('../models/Lote');

const getAllLotes = async (req, res) => {
  try {
    const lotes = await Lote.find();
    res.json(lotes);
  } catch (error) {
    console.error('Error al obtener lotes:', error);
    res.status(500).json({ message: 'Error al obtener los lotes.' });
  }
};


const createLote = async (req, res) => {
  try {
    const { numero_lote, fecha_caducidad, cantidad, productos } = req.body;

    const newLote = new Lote({
      numero_lote,
      fecha_caducidad,
      cantidad,
      productos
    });

    const savedLote = await newLote.save();
    res.status(201).json(savedLote);
  } catch (error) {
    console.error('Error al crear lote:', error);
    res.status(500).json({ message: 'Error al crear el lote.' });
  }
};


module.exports = {
  getAllLotes,
  createLote,
};
