const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");

// Ruta de login
router.post("/login", login);

// Ruta para validar el token (usa tu middleware genérico)
router.get("/validate", verifyToken, (req, res) => {
  // Aquí simplemente devolvemos al usuario sin contraseña
  const { _id, nombre, email, rol, estado } = req.user;
  res.json({ user: { _id, nombre, email, rol, estado } });
});

module.exports = router;
