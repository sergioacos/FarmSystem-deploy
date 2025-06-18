import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Ventas.css";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  // const [indiceEditando, setIndiceEditando] = useState(null);
  // const [nuevaCantidad, setNuevaCantidad] = useState(1);



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
  const itemExistente = carrito.find((item) => item.producto_id === producto._id);

  if (itemExistente) {
    alert("Este producto ya está en el carrito. Editá la cantidad desde la lista.");
    return;
  }

  const item = {
    producto_id: producto._id,
    nombre: producto.nombre,
    cantidad: 1,
    precio_unitario: producto.precio
  };

  setCarrito([...carrito, item]);
};


const enviarVenta = async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }



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

const eliminarDelCarrito = (index) => {
  const nuevoCarrito = carrito.filter((_, i) => i !== index);
  setCarrito(nuevoCarrito);
};


// const iniciarEdicion = (index, cantidadActual) => {
//   setIndiceEditando(index);
//   setNuevaCantidad(cantidadActual);
// };

// const cancelarEdicion = () => {
//   setIndiceEditando(null);
//   setNuevaCantidad(1);
// };

// const guardarCantidadEditada = (index) => {
//   if (nuevaCantidad <= 0) {
//     alert("Cantidad inválida.");
//     return;
//   }

//   const nuevoCarrito = [...carrito];
//   nuevoCarrito[index].cantidad = nuevaCantidad;
//   setCarrito(nuevoCarrito);

//   cancelarEdicion(); // limpiar estados
// };



  return (
    <div className="productos-container">
      <div className="productos-box">
        <button
          className="agregar-button"
          onClick={() => navigate("/historialVentas")}
        >
          Ver Historial de Ventas
        </button>
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

        <button className="back-button" onClick={() => navigate('/menu')}>
          Volver al Menú Principal
        </button>
      </div>


      <div className="carrito-box">
  <h3>Productos en la venta:</h3>
  {carrito.length === 0 ? (
    <p>No hay productos agregados.</p>
  ) : (
    <>
     
      {/* <ul>
        {carrito.map((item, index) => (
          <li key={index}>
            {item.nombre} - Precio unitario: ${item.precio_unitario} -

            {indiceEditando === index ? (
              <>
                <input
                  type="number"
                  min="1"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(Number(e.target.value))}
                  style={{ width: "60px", marginLeft: "10px" }}
                />
                <button onClick={() => guardarCantidadEditada(index)}>Guardar</button>
                <button onClick={() => cancelarEdicion()}>Cancelar</button>
              </>
            ) : (
              <>
                Cantidad: {item.cantidad}
                <button onClick={() => iniciarEdicion(index, item.cantidad)}>Editar</button>
                <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul> */}

      <ul>
        {carrito.map((item, index) => (
          <li key={item.producto_id}>
            {item.nombre} - Precio unitario: ${item.precio_unitario} -
            <label style={{ marginLeft: '10px' }}>
              Cantidad:
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => {
                  const nuevaCantidad = Number(e.target.value);
                  if (nuevaCantidad > 0) {
                    setCarrito((prevCarrito) =>
                      prevCarrito.map((prod, i) =>
                        i === index ? { ...prod, cantidad: nuevaCantidad } : prod
                      )
                    );
                  }
                }}
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </label>
            <button onClick={() => eliminarDelCarrito(index)} style={{ marginLeft: "10px" }}>
              Eliminar
            </button>
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