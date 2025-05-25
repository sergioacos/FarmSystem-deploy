import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Productos.css";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);



  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/producto");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
  const nuevoTotal = carrito.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );
  setTotal(nuevoTotal);
}, [carrito]);


  // Filtrar cuando se dan coincidencias en el inicio de alguna palabra
  const productosFiltrados = productos.filter((producto) => {
    const regex = new RegExp(`\\b${filtro.toLowerCase()}`, "i"); 
    return regex.test(producto.nombre.toLowerCase());
  });

  const agregarAlCarrito = (producto) => {
  const cantidad = parseInt(prompt(`¿Cuántas unidades de ${producto.nombre}?`), 10);
  if (isNaN(cantidad) || cantidad <= 0) return;

  const item = {
    producto_id: producto._id,
    nombre: producto.nombre,
    cantidad,
    precio_unitario: producto.precio // puedes permitir que el usuario edite esto si querés
  };

  setCarrito([...carrito, item]);
};

const enviarVenta = async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

//   const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);

  const nuevaVenta = {
    productos: carrito,
    total,
    tipo_pago: "efectivo" // o permitir seleccionar desde un <select>
  };

  try {
    await axios.post("http://localhost:5000/api/venta", nuevaVenta);
    alert("Venta registrada con éxito.");
    setCarrito([]);
  } catch (error) {
    console.error("Error al registrar la venta:", error);
  }
};



  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Gestión de Ventas</h2>
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
                  <button onClick={() => agregarAlCarrito(producto)}>Comprar</button>

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


      <div className="carrito-box">
  <h3>Productos en la venta:</h3>
  {carrito.length === 0 ? (
    <p>No hay productos agregados.</p>
  ) : (
    <>
      <ul>
        {carrito.map((item, index) => (
          <li key={index}>
            Producto: {item.nombre} - Cantidad: {item.cantidad} - Precio unitario: ${item.precio_unitario}
          </li>
        ))}
      </ul>
      <p><strong>Total: ${total.toFixed(2)}</strong></p>
      <button onClick={enviarVenta}>Confirmar Venta</button>
    </>
  )}
</div>


      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>

      <br />
      <br />
      <br />
    </div>

    
  );
};

export default Ventas;