const express = require('express');
const router = express.Router();
const controlador = require('../controllers/recetaElectronica.controller');


router.post('/', controlador.crear);
router.get('/:id', controlador.getRecetaById )

module.exports = router;