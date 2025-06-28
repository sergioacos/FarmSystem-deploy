const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const { crearVenta, obtenerVentas, ventasExcesivasUltimas24Horas } = require('../controllers/venta.controller');

// Ruta para crear una venta
router.post('/', crearVenta);

// Ruta para listar todas las ventas
router.get('/', obtenerVentas);

// Ruta para obtener las ventas de las últimas 24 horas y verificar ventas inusuales
router.get('/ultimas-24-horas', ventasExcesivasUltimas24Horas);

module.exports = router;
