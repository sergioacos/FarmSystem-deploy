import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Vencimientos.css"; 
import { useAuth } from "../context/AuthContext";
import { calcularDescuento } from "../utils/calcularDescuento"
const Vencimientos = () => {
  const [lotes, setLotes] = useState([]);
  const [productosDetalles, setProductosDetalles] = useState({});
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/lotes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          // Ordenamos los lotes por fecha de vencimiento más cercana
          const sortedLotes = data.sort((a, b) => new Date(a.fecha_caducidad) - new Date(b.fecha_caducidad));
          setLotes(sortedLotes);

          // Ahora se obtienen los detalles de los productos de cada lote
          sortedLotes.forEach((lote) => {
            lote.productos.forEach((producto) => {
              fetchProductoDetails(producto.producto_id);
            });
          });
        } else {
          console.error("La respuesta no es un array:", data);
          setLotes([]);
        }
      } catch (error) {
        console.error("Error al obtener los lotes:", error);
      }
    };

    const fetchProductoDetails = async (productoId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto/${productoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductosDetalles((prevState) => ({
          ...prevState,
          [productoId]: response.data,
        }));
      } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
      }
    };

    fetchLotes();
  }, [token]);

  return (
    <div className="lotes-container">
      <div className="lotes-box">
        <h2>Vencimientos próximos</h2>

        <button
          className="agregar-button"
          onClick={() =>
            navigate(user?.rol === "usuario" ? "/menu" : "/vencimientos")
          }
        >
          Volver
        </button>

        {lotes.length === 0 ? (
          <p>No hay lotes registrados.</p>
        ) : (
          <ul className="lotes-lista">
            {lotes.map((lote) => (
              <li key={lote._id} className="lote-item">
                <p><strong>Número de Lote:</strong> {lote.numero_lote}</p>
                <p><strong>Fecha de Caducidad:</strong> {new Date(lote.fecha_caducidad).toLocaleDateString()}</p>
                <p><strong>Cantidad:</strong> {lote.cantidad}</p>
                <p><strong>Descuento a plicar:</strong> {calcularDescuento(lote.fecha_caducidad)}%</p>
                <p><strong>Productos:</strong></p>
                <ul className="productos-lote-lista">
                  {lote.productos.map((producto) => {
                    const productoDetails = productosDetalles[producto.producto_id];
                    return (
                      <li key={producto._id}>
                        {productoDetails ? (
                          <>
                            <strong>{productoDetails.nombre}</strong> — 
                            Cantidad: {producto.cantidad_asociada}
                          </>
                        ) : (
                          <span>Cargando producto...</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Vencimientos;
