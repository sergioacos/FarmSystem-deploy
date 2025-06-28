const express = require('express');
const router = express.Router();
const controlador = require('../controllers/categoria.controller');

router.get('/', controlador.obtenerCategorias);
router.get('/', controlador.obtenerCategoriaPorId);
router.post('/', controlador.crearCategoria);
router.put('/', controlador.actualizarCategoria);
router.delete('/', controlador.eliminarCategoria)

module.exports = router;