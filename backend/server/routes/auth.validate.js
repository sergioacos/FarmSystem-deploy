const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegurate de tener el modelo
const verifyToken = require('../middleware/verifyToken'); // Se cambio el verifyToken por el verify Admin

router.get('/auth/validate', verifyToken, async (req, res) => { // Se cambio el verifyToken por el verify Admin
  try {
    const user = await User.findById(req.user._id).select('-password'); // Excluye contraseña
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ valid: true, user });
  } catch (error) {
    console.error("Error al validar token:", error);
    return res.status(500).json({ message: "Error al validar token" });
  }
});

module.exports = router;
