const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en los requests



// Rutas
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');

app.use('/api/producto', productoRoutes);
app.use('/api/categoria', categoriaRoutes)

module.exports = app;
