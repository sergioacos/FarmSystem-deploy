import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/EditarProducto.css";

const EditarProducto = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    laboratorio: "",
    precio: "",
    estado: "activo",
    stock_minimo: "",
    stock_actual: "",
    alta_rotacion: false,
    categoria: "",
  });

  // Cargar producto con la ID correspondiente
  useEffect(() => {
    const fetchProducto = async () => {
      console.log("Cargando producto con ID:", id);  // Verifica el id que se pasa por la URL
      try {
        // Asegúrate de que el endpoint de productos esté bien configurado
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Producto obtenido:", res.data);  // Verifica si obtienes los datos correctamente
        setFormData(res.data);  // Si es correcto, actualiza el formulario
      } catch (err) {
        console.error("Error al cargar producto:", err);
        alert("No se pudo cargar el producto.");
      }
    };

    if (id) {
      fetchProducto();  // Solo lo ejecutamos si tenemos un id válido
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/productos/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Producto actualizado correctamente");
      navigate("/productosadmin");  // Redirige a la página de administración de productos
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      alert("Error al guardar cambios.");
    }
  };

  return (
    <div className="productos-box">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Código:</label>
        <input
          type="text"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
        />

        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />

        <label>Laboratorio:</label>
        <input
          type="text"
          name="laboratorio"
          value={formData.laboratorio}
          onChange={handleChange}
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
        />

        <label>Estado:</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <label>Stock mínimo:</label>
        <input
          type="number"
          name="stock_minimo"
          value={formData.stock_minimo}
          onChange={handleChange}
        />

        <label>Stock actual:</label>
        <input
          type="number"
          name="stock_actual"
          value={formData.stock_actual}
          onChange={handleChange}
        />

        <label>Alta rotación:</label>
        <input
          type="checkbox"
          name="alta_rotacion"
          checked={formData.alta_rotacion}
          onChange={handleChange}
        />

        <label>Categoría:</label>
        <input
          type="text"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
        />

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => navigate("/productosadmin")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarProducto;
