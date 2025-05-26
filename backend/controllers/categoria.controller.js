const Categoria = require('../models/Categoria');

// exports.getTodos = async (req, res) => {
//   const items = await Categoria.find();
//   res.json(items);
// };

// exports.crear = async (req, res) => {
//   const nuevo = new Categoria(req.body);
//   const guardado = await nuevo.save();
//   res.status(201).json(guardado);
// };

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error('Error al crear categoría:', error.message);
    res.status(500).json({ error: 'No se pudo crear la categoría' });
  }
};

//Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

//Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la categoría' });
  }
};

// Editar categoría
exports.actualizarCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};