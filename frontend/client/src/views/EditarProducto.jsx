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

  const [categorias, setCategorias] = useState([]);

  // Cargar producto con la ID que corresponda
  useEffect(() => {
    const fetchProducto = async () => {
      console.log("Cargando producto con ID:", id);

      if (!id) {
        console.error("ID no válido");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/producto/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Producto obtenido:", res.data);
        if (res.data) {
          setFormData(res.data);
        } else {
          console.error("El producto no fue encontrado.");
          alert("Producto no encontrado.");
        }
      } catch (err) {
        console.error("Error al cargar producto:", err.response ? err.response.data : err);
        alert("No se pudo cargar el producto.");
      }
    };

    // Cargar categorías
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categoria`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(res.data); 
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        alert("No se pudieron cargar las categorías.");
      }
    };

    if (id) {
      fetchProducto();
    }
    fetchCategorias(); 
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

    const dataToSend = { 
      ...formData,
      categoria: formData.categoria, 
    };

    console.log("Datos a enviar:", dataToSend);  

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/producto/${id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Producto actualizado correctamente");
      navigate("/productosadmin");
    } catch (err) {
      console.error("Error al actualizar producto:", err.response ? err.response.data : err);
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
        <select
          name="categoria"
          value={formData.categoria} 
          onChange={handleChange}
        >
          {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria._id}>
              {categoria.nombre} {/* Mostrar el nombre de la categoría */}
            </option>
          ))}
        </select>

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
