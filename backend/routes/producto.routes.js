const express = require('express');
const router = express.Router();
const controlador = require('../controllers/producto.controller');

router.get('/', controlador.obtenerProductos);
router.post('/', controlador.crear);

module.exports = router;
