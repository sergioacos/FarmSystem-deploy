import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/producto`),
          axios.get(`${import.meta.env.VITE_API_URL}/categoria`)
        ]);
        setProductos(prodRes.data);
        setCategorias(catRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  // Filtrar productos por nombre y categoría
  const productosFiltrados = productos.filter((producto) => {
    const regex = new RegExp(`\\b${filtro.toLowerCase()}`, "i");
    const nombreCoincide = regex.test(producto.nombre.toLowerCase());
    const categoriaCoincide = categoriaFiltro === "" || producto.categoria === categoriaFiltro;
    return nombreCoincide && categoriaCoincide;
  });

  // Función para obtener el nombre de la categoría a partir del _id
  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((cat) => cat._id === categoriaId);
    return categoria ? categoria.nombre : "Categoría no definida";
  };

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Gestión de Productos</h2>

        {/* Filtro por nombre */}
        <div className="search-container">
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por nombre de producto"
            className="search-input"
          />
        </div>

        {/* Filtro por categoría */}
        <div className="search-container">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="search-input"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Mostrar productos filtrados */}
        {productosFiltrados.length > 0 ? (
          <div className="productos-list">
            {productosFiltrados.map((producto) => (
              <div className="producto-card" key={producto._id}>
                <div className="producto-details">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.laboratorio}</p>
                  <p><strong>${producto.precio}</strong></p>
                  <p>{producto.stock_actual} en stock</p>
                  <p><em>{obtenerNombreCategoria(producto.categoria)}</em></p> {/* Mostrar nombre legible */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos disponibles o no coinciden con los filtros.</p>
        )}

        <button className="back-button" onClick={() => navigate('/menuadmin')}>
          Volver al Menú Principal
        </button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Productos;
