const mongoose = require('mongoose');

// Subdocumento para productos recetados
const productoSchema = new mongoose.Schema({
  nombreComercial: { type: String, required: true },           // Ej: EUGOCLON
  principioActivo: { type: String, required: true },           // Ej: Glibenclamida
  dosis: { type: String, required: true },                     // Ej: 5mg
  formaFarmaceutica: { type: String, required: true },         // Ej: COMP, TAB, CPD
  cantidadPorEnvase: { type: Number, required: true },         // Ej: 30 (comprimidos por caja)
  cantidadRecetada: { type: Number, required: true }           // Ej: 1 (envase)
}, { _id: false });



const recetaElectronicaSchema = new mongoose.Schema({
  id_receta: { type: String, required: true, unique: true },

  paciente: {
    nombreCompleto: { type: String, required: true },
    numeroBeneficiario: { type: String, required: true }
  },

  medico: {
    nombreCompleto: { type: String, required: true },
    matricula: { type: String, required: true }
  },

  fechaEmision: { type: Date, required: true },

  productosRecetados: [productoSchema],

  estado: {
    type: String,
    enum: ['activa', 'autorizada', 'vencida'],
    default: 'activa'
  }
});

module.exports = mongoose.model('RecetaElectronica', recetaElectronicaSchema);
