const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en los requests



// Rutas
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const ventaRoutes = require('./routes/venta.routes')
const recetaRoutes = require('./routes/recetaElectronica.routes')
const reporteRoutes = require("./routes/reporte.routes");

app.use('/api/producto', productoRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/venta', ventaRoutes);
app.use('/api/recetaElectronica', recetaRoutes)
app.use('/api',require('./routes/auth.validate'))
app.use("/api/usuarios", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", reporteRoutes);
module.exports = app;
