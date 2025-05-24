const jwt = require('jsonwebtoken');
const User = require("../models/user"); 

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtengo el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ message: "No autenticado" });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const userId = decoded.id;  
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        
        req.user = user;  // Añado los datos del usuario a la solicitud

        next(); 
    } catch (error) {
        console.error("Error al verificar token JWT:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = verifyAdmin;