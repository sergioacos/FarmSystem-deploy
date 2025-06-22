import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "user",
    estado: "activo",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        alert("No se pudo cargar el usuario.");
      }
    };

    fetchUsuario();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Usuario actualizado correctamente");
      navigate("/usuarios");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("Error al guardar cambios.");
    }
  };

  return (
    <div className="usuarios-box">
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Rol:</label>
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="user">Usuario</option>
        </select>

        <label>Estado:</label>
        <select name="estado" value={formData.estado} onChange={handleChange}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

<div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
  <button type="submit">Guardar cambios</button>
  <button type="button" onClick={() => navigate("/usuarios")}>Cancelar</button>
</div>
      </form>
    </div>
  );
};

export default EditarUsuario;
