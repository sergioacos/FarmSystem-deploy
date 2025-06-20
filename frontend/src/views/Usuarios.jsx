import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const regex = new RegExp(`\\b${filtro.toLowerCase()}`, "i");
    return regex.test(usuario.nombre.toLowerCase());
  });

  const handleEditar = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/usuarios/${id}`);
        setUsuarios(usuarios.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un problema al eliminar el usuario.");
      }
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-box">
        <h2>Gestión de Usuarios</h2>

        <div className="search-container">
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por nombre de usuario"
            className="search-input"
          />
        </div>

        <div className="tabla-usuarios-wrapper">
          {usuariosFiltrados.length > 0 ? (
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.estado}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-button" onClick={() => handleEditar(usuario._id)}>Editar</button>
                        <button className="delete-button" onClick={() => handleEliminar(usuario._id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay usuarios disponibles o no coinciden con la búsqueda.</p>
          )}
        </div>

        <button className="back-button" onClick={() => navigate("/menuadmin")}>
          Volver al Menú Principal
        </button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Usuarios;
