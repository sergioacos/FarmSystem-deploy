import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto`);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar cuando se dan coincidencias en el inicio de alguna palabra
  const productosFiltrados = productos.filter((producto) => {
    const regex = new RegExp(`\\b${filtro.toLowerCase()}`, "i"); 
    return regex.test(producto.nombre.toLowerCase());
  });

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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos disponibles o no coinciden con la búsqueda.</p>
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
