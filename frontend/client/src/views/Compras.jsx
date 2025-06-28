import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Compras.css";

const Compras = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [lote, setLote] = useState({
    numero_lote: "",
    fecha_caducidad: "",
    cantidad: 0, 
    productos: []
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1); 

  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos con validaciones
  const productosFiltrados = productos.filter((producto) => {
    const filtroLower = filtro ? filtro.toLowerCase() : '';  
    const nombreProductoLower = producto.nombre ? producto.nombre.toLowerCase() : ''; 
    const regex = new RegExp(`\\b${filtroLower}`, "i");
    return regex.test(nombreProductoLower);
  });

  // Función para manejar la selección de un producto
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1); // Restablecer la cantidad cuando un nuevo producto sea seleccionado
  };

  // Agregar el producto seleccionado al lote con la cantidad elegida
  const agregarAlLoteConCantidad = () => {
    if (!productoSeleccionado) return;

    const productoExistente = lote.productos.find((item) => item.producto_id === productoSeleccionado._id);

    if (productoExistente) {
      alert("Este producto ya está en el lote. Editá la cantidad.");
      return;
    }

    const item = {
      producto_id: productoSeleccionado._id,
      nombre: productoSeleccionado.nombre,
      cantidad_asociada: cantidad
    };

    const nuevosProductos = [...lote.productos, item];

    // Calcular la nueva cantidad total del lote sumando las cantidades de los productos
    const nuevaCantidad = nuevosProductos.reduce((acc, item) => acc + item.cantidad_asociada, 0);

    setLote({
      ...lote,
      productos: nuevosProductos,
      cantidad: nuevaCantidad // Actualiza la cantidad total del lote
    });

    // Restablecer el producto seleccionado y la cantidad
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  // Enviar lote al backend
  const enviarLote = async () => {
    if (lote.productos.length === 0) {
      alert("El lote está vacío.");
      return;
    }

    const nuevoLote = {
      numero_lote: lote.numero_lote,
      fecha_caducidad: lote.fecha_caducidad,
      cantidad: lote.cantidad, 
      productos: lote.productos
    };

    try {
      // Registrar el lote
      await axios.post(`${import.meta.env.VITE_API_URL}/lotes`, nuevoLote);

      // Actualizar el stock de los productos
      for (let producto of lote.productos) {
        const productoId = producto.producto_id;
        const cantidadComprada = producto.cantidad_asociada;

        // Enviar solicitud para sumar al stock del producto
        await axios.patch(`${import.meta.env.VITE_API_URL}/producto/${productoId}/stock`, {
          cantidad: cantidadComprada // Sumar la cantidad al stock
        });
      }

      alert("Lote registrado y stock actualizado con éxito.");
      setLote({ numero_lote: "", fecha_caducidad: "", cantidad: 0, productos: [] });
    } catch (error) {
      console.error("Error al registrar el lote o actualizar el stock:", error);
    }
  };

  // Eliminar producto del lote
  const eliminarDelLote = (index) => {
    const nuevoLote = lote.productos.filter((_, i) => i !== index);
    setLote({ ...lote, productos: nuevoLote });

    // Recalcular la cantidad total del lote después de eliminar un producto
    const nuevaCantidad = nuevoLote.reduce((acc, item) => acc + item.cantidad_asociada, 0);
    setLote((prevLote) => ({
      ...prevLote,
      cantidad: nuevaCantidad
    }));
  };

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Gestión de Compras</h2>

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
                  <button onClick={() => seleccionarProducto(producto)}>Seleccionar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos disponibles o no coinciden con la búsqueda.</p>
        )}

        {/* Mostrar campo de cantidad solo si un producto ha sido seleccionado */}
        {productoSeleccionado && (
          <div className="cantidad-container">
            <h3>Seleccionaste: {productoSeleccionado.nombre}</h3>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min="1"
              style={{ width: "60px", marginRight: "10px" }}
            />
            <button className="back-button" onClick={agregarAlLoteConCantidad}>Agregar al Lote</button>
          </div>
        )}

        {/* Mostrar productos del lote */}
        {lote.productos.length > 0 && (
          <div className="productos-lote">
            <h3>Productos en el Lote:</h3>
            <ul>
              {lote.productos.map((item, index) => (
                <li key={item.producto_id}>
                  {item.nombre} - {item.cantidad_asociada} unidades
                  <button onClick={() => eliminarDelLote(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulario para el lote */}
        <div className="lote-form">
          <input
            type="text"
            placeholder="Número de Lote"
            value={lote.numero_lote}
            onChange={(e) => setLote({ ...lote, numero_lote: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de Caducidad"
            value={lote.fecha_caducidad}
            onChange={(e) => setLote({ ...lote, fecha_caducidad: e.target.value })}
          />
        </div>

        {/* Botones de acción */}
        <div className="botones-container">
          <button className="back-button" onClick={enviarLote} style={{ marginRight: '20px' }}>
            Comprar Lote
          </button>
          <button className="back-button" onClick={() => navigate('/menu')}>
            Volver al Menú Principal
          </button>
        </div>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Compras;
