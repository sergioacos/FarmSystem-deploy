const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas } = require('../controllers/venta.controller');

// Ruta para crear una venta
router.post('/', crearVenta);

// Ruta para listar todas las ventas
router.get('/', obtenerVentas);

module.exports = router;
