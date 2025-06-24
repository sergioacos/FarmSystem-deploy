const express = require('express');
const router = express.Router();
const loteController = require('../controllers/lote.controller');

router.get('/', loteController.getAllLotes);
router.post('/', loteController.createLote);


module.exports = router;
