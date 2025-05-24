const express = require('express');
const cors = require('cors');

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en los requests



// Rutas
const ejemploRoutes = require('./routes/ejemplo.routes');
app.use('/api/ejemplo', ejemploRoutes);

const productoRoutes = require('./routes/producto.routes');
app.use('/api/productos', productoRoutes);

const categoriaRoutes = require('./routes/categoria.routes');

app.get('/', (req, res) => {
  res.send('Servidor funcionando en la raíz /');
});


app.use('/api/producto', productoRoutes);
app.use('/api/categoria', categoriaRoutes)

app.use("/api/usuarios", userRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;
