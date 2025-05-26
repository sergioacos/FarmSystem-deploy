const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");


//ruta inicio de sesión
router.post("/login", login);



module.exports = router;
