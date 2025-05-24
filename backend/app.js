const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en los requests



// Rutas

const ejemploRoutes = require('./routes/ejemplo.routes');
app.use('/api/ejemplo', ejemploRoutes);
const productoRoutes = require('./routes/Productos');
app.use('/api/productos', productoRoutes);
app.get('/', (req, res) => {
  res.send('Servidor funcionando en la raíz /');
});

module.exports = app;
