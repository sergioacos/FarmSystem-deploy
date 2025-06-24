const express = require('express');
const router = express.Router();
const controlador = require('../controllers/producto.controller');

router.get('/', controlador.obtenerProductos);
router.post('/', controlador.crear);
router.get('/buscar',controlador.buscarPorNombre);
router.get('/:id', controlador.obtenerProductoPorId);
router.put('/:id', controlador.actualizarProducto);
router.patch('/:id/stock', controlador.sumarStock);



module.exports = router;
