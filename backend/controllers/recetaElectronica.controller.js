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

// GET /api/recetas-electronicas/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const receta = await RecetaElectronica.findOne({ id_receta: req.params.id });

//     if (!receta) {
//       return res.status(404).json({ mensaje: 'Receta no encontrada' });
//     }

//     res.json(receta);
//   } catch (error) {
//     console.error('Error al buscar receta:', error);
//     res.status(500).json({ mensaje: 'Error del servidor' });
//   }
// });

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

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, "-password");
//     if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener el usuario", error });
//   }
// };


