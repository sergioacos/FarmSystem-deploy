const Usuario = require("../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

  const { email, password } = req.body;
  try {    
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // compara las contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // genera  el token JWT
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // devuelve todos los datos del usuario, menos la contraseña
    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor",error: error.message || error.toString() });
  }
};

module.exports = { login };
