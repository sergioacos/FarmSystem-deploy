import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import "../styles/Ventas.css";
import { useAuth } from "../context/AuthContext";

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth(); 

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/venta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          setVentas(data);
        } else {
          console.error("La respuesta no es un array:", data);
          setVentas([]);
        }
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      }
    };

    fetchVentas();
  }, [token]);

  
  const handleGenerarReporte = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reporte-ventas`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_ventas.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("No se pudo generar el reporte.");
    }
  };

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Historial de Ventas</h2>

        {user?.rol === "admin" && (
          <>
            
            <button className="agregar-button button-pdf" onClick={handleGenerarReporte}>
              Generar PDF
            </button>
          </>
        )}

        <button
          className="agregar-button"
          onClick={() =>
            navigate(user?.rol === "admin" ? "/menuAdmin" : "/ventas")
          }
        >
          Volver
        </button>

        {ventas.length === 0 ? (
          <p>No hay ventas registradas.</p>
        ) : (
          <ul className="ventas-lista">
            {ventas.map((venta) => (
              <li key={venta._id} className="venta-item">
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(venta.fecha_venta).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ${venta.total}
                </p>
                <p>
                  <strong>Tipo de Pago:</strong> {venta.tipo_pago}
                </p>
                <p>
                  <strong>Productos:</strong>
                </p>
                <ul className="productos-lista">
                  {Array.isArray(venta.productos) ? (
                    venta.productos.map((producto, index) => {
                      const prod = producto.producto_id;
                      const prodNombre =
                        prod && typeof prod === "object"
                          ? prod.nombre || prod._id || "Sin nombre"
                          : prod;

                      return (
                        <li key={index}>
                          {prodNombre} — Cantidad: {producto.cantidad} — Precio Unitario: ${producto.precio_unitario}
                        </li>
                      );
                    })
                  ) : (
                    <li>No hay productos</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistorialVentas;
