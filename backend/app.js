const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en los requests

// Rutas
const ejemploRoutes = require('./routes/ejemplo.routes');
app.use('/api/ejemplo', ejemploRoutes);

module.exports = app;
