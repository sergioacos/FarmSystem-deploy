const User = require("../models/User");

// Para buscar todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// para buscar un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// para crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const newUser = new User({ nombre, email, password, rol });
    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
};

// para actualizar un usuario 
const updateUser = async (req, res) => {
  try {
    const { nombre, email, rol, estado } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol, estado },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
