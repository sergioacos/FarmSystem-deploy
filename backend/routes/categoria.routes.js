const express = require('express');
const router = express.Router();
const controlador = require('../controllers/categoria.controller');

router.get('/', controlador.getTodos);
router.post('/', controlador.crear);

module.exports = router;