const express = require('express');
const router = express.Router();
const controlador = require('../controllers/ejemplo.controller');

router.get('/', controlador.getTodos);
router.post('/', controlador.crear);

module.exports = router;
