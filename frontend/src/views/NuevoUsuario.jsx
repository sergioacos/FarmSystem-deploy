import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/NuevoUsuario.css";

const NuevoUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");
  const [estado, setEstado] = useState("activo");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, {
        nombre,
        email,
        password,
        rol,
        estado,
      });
      alert("Usuario creado con éxito");
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Crear Nuevo Usuario</h2>

        <form className="formulario-producto" onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Correo electrónico"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
          />

          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <div className="botones-formulario">
            <button type="submit" className="back-button">
              Crear Usuario
            </button>
            <button
              type="button"
              className="back-button cancelar"
              onClick={() => navigate("/usuarios")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default NuevoUsuario;
