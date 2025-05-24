const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Email inválido'] // valido que el mail sea user@dominio.com
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    enum: ["admin", "usuario"], 
    default: "usuario" 
  },
  estado: { 
    type: String, 
    enum: ["activo", "inactivo"], 
    default: "activo" 
  },
  fecha_creacion: { 
    type: Date, 
    default: Date.now 
  },
});

// encripta las constraseñas antes de guardarlas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// compara las contraseñas en el login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Usuario", userSchema);
