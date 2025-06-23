const express = require("express");
const router = express.Router();
const { generarReporteVentasPDF } = require("../controllers/reporte.controller");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/reporte-ventas", verifyAdmin, generarReporteVentasPDF);

module.exports = router;

