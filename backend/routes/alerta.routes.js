const express = require('express');
const alertaController = require('../controllers/alerta.controller');
const router = express.Router();

// Ruta para obtener lotes próximos a vencer con descuento sugerido
router.get('/alerta-vencimientos', alertaController.obtenerAlertasVencimientos);

module.exports = router;
