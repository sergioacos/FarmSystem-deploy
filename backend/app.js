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

app.use("/api/usuarios", userRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;
