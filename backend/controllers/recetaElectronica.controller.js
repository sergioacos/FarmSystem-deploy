const express = require('express');
// const router = express.Router();
const RecetaElectronica = require('../models/RecetaElectronica');

// POST /api/recetas-electronicas
// router.post('/', async (req, res) => {
exports.crear = async (req, res) => {    
  try {
    const recetaData = req.body;

    // Validación mínima (puedes agregar más validaciones según necesidad)
    if (!recetaData.id_receta || !recetaData.paciente || !recetaData.medico || !recetaData.fechaEmision || !recetaData.productosRecetados) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const receta = new RecetaElectronica(recetaData);
    await receta.save();

    res.status(201).json({ mensaje: 'Receta electrónica cargada con éxito', receta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar la receta', error });
  }
};



exports.getRecetaById = async (req, res) => {
  try {
    const receta = await RecetaElectronica.findOne({ id_receta: req.params.id });

    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }

    res.json(receta);
  } catch (error) {
    console.error('Error al buscar receta:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
}




