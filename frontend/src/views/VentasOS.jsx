import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Ventas.css";

const VentasObraSocial = () => {
  const [idReceta, setIdReceta] = useState("");
  const [obraSocial, setObraSocial] = useState("");
  const [receta, setReceta] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [sugerencias, setSugerencias] = useState({});
  const [cubreOS, setCubreOS] = useState(0);
  const [pagaCliente, setPagaCliente] = useState(0);

  const navigate = useNavigate();

  const COBERTURAS = {
  "PAMI Ambulatorio": 100,
  "PAMI Insulinas": 100,
  "IOSCOR": 70,
  "Unión Personal": 60,
  "OSDE": 80,
  "Swiss Medical": 90,
  "Otro": 50,
};

  const buscarReceta = async () => {
  if (!idReceta) return alert("Ingresá el número de receta");

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/recetaElectronica/${idReceta}`);
    const recetaData = response.data;
    if (recetaData.estado === "autorizada") {
  alert("Esta receta ya fue utilizada. No se puede volver a usar.");
  setReceta(null);
  return;
}
    setReceta(recetaData);
    setCarrito([]);
    setSugerencias({}); // Reiniciamos sugerencias

    // Buscar productos sugeridos solo después de obtener receta
    recetaData.productosRecetados.forEach((med, index) => {
      const clave = `${med.principioActivo}-${med.dosis}-${index}`;
      buscarProductoSugerido(clave, med);
    });

  } catch (error) {
    console.error("Error al buscar receta:", error);
    alert("No se encontró una receta con ese número.");
  }
};


  const buscarProductoSugerido = async (clave, med) => {
  try {
    const consulta = `${med.principioActivo} ${med.dosis}`;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto/buscar`, {
      params: { nombre: consulta }
    });

    setSugerencias((prev) => ({
      ...prev,
      [clave]: response.data.length ? response.data : []
    }));
  } catch (error) {
    console.warn("No se encontraron sugerencias para:", med.nombreComercial);
    setSugerencias((prev) => ({
      ...prev,
      [clave]: []
    }));
  }
};

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
    // if (!obraSocial || !receta || carrito.length === 0) {
    if (carrito.length === 0) {
      alert("Faltan datos para registrar la venta.");
      return;
    }

    const venta = {
      // receta_id: receta.id_receta,
      // paciente: receta.paciente,
      // obra_social: obraSocial,
      productos: carrito,
      total,
      tipo_pago: "obra_social",
      receta_id: receta.id_receta,
    };

    try {
      // await axios.post(`${import.meta.env.VITE_API_URL}/venta-obra-social`, venta);
      await axios.post(`${import.meta.env.VITE_API_URL}/venta`, venta);
      alert("Venta con obra social registrada.");
      setReceta(null);
      setCarrito([]);
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("Error al registrar la venta.");
    }
  };

  let recetaVencida = false;
  let fechaVencimiento = null;

if (receta) {
  const fechaEmision = new Date(receta.fechaEmision);
  fechaVencimiento = new Date(fechaEmision);
  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

  const hoy = new Date();
  recetaVencida = hoy > fechaVencimiento;
}



useEffect(() => {
  const nuevoTotal = carrito.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );
  setTotal(nuevoTotal);
}, [carrito]);

useEffect(() => {
  const totalBruto = carrito.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );

  const cobertura = COBERTURAS[obraSocial] || 0;

  const osCubre = (totalBruto * cobertura) / 100;
  const clientePaga = totalBruto - osCubre;

  setTotal(totalBruto);
  setCubreOS(osCubre);
  setPagaCliente(clientePaga);
}, [carrito, obraSocial]);

  return (
    <div className="productos-container">
      <div className="productos-box">
        <button className="agregar-button" onClick={() => navigate("/ventas")}>
          Ir a Ventas Particulares
        </button>

        <h2>Ventas con Obra Social</h2>

        <div className="search-container">
          <label style={{ marginTop: "10px" }}>Convenio:</label>
          <select value={obraSocial} onChange={(e) => setObraSocial(e.target.value)} className="selectOS">
            <option value="">Seleccionar</option>
            <option value="PAMI Ambulatorio">PAMI Ambulatorio</option>
            <option value="PAMI Insulinas">PAMI Insulinas</option>
            <option value="IOSCOR">IOSCOR</option>
            <option value="Unión Personal">Unión Personal</option>
            <option value="OSDE">OSDE</option>
            <option value="Swiss Medical">Swiss Medical</option>
            <option value="Otro">Otro</option>
          </select>

          <label style={{ marginTop: "10px" }}>Receta:</label>
          <input
            type="text"
            value={idReceta}
            onChange={(e) => setIdReceta(e.target.value)}
            placeholder="Ej: 3"
            className="search-input input-id-receta"
          />

          <button onClick={buscarReceta}>Buscar Prescripción</button>
        </div>

        {receta && (
          <div className="receta-info">
            <h3>Receta #{receta.id_receta}</h3>
           
        <div className="form-info">
        <label>
          Fecha de prescripción:
          <input
            type="text"
            value={new Date(receta.fechaEmision).toLocaleDateString()}
            readOnly
          />
        </label>
<br />
        <label>
          Fecha de vencimiento:
          <input
            type="text"
            value={fechaVencimiento.toLocaleDateString()}
            readOnly
          />
        </label>

{recetaVencida && (
  <p style={{ color: "red", fontWeight: "bold" }}>⚠ Receta vencida</p>
)}
        <br />
        <label>
            Afiliado:
            <input
            type="text"
            value={`${receta.paciente.numeroBeneficiario}`}
            readOnly
            />
            <input
            type="text"
            value={`${receta.paciente.nombreCompleto}`}
            readOnly
            />
        </label>

        

        <br />
        <label>
            Médico:
            <input
            type="text"
            value={`${receta.medico.matricula}`}
            readOnly
            />
            <input
            type="text"
            value={`${receta.medico.nombreCompleto}`}
            readOnly
            />
        </label>
    </div>


            <h4>Medicamentos:</h4>
            <table className="tabla-receta">
                <thead>
                    <tr>
                    <th>Prescripción</th>
                    <th>Producto</th>
                    <th>Producto sugerido</th>
                    <th>Cantidad Recetada</th>
                   
                    </tr>
                </thead>
                <tbody>

                   {receta.productosRecetados.map((med, i) => {
                    const clave = `${med.principioActivo}-${med.dosis}-${i}`;
                    const sugeridos = sugerencias[clave] || [];

                    return (
                      <tr key={i}>
                        <td>{med.principioActivo} {med.formaFarmaceutica} X {med.cantidadPorEnvase}</td>
                        <td>{med.nombreComercial} {med.dosis} {med.formaFarmaceutica} X {med.cantidadPorEnvase}</td>
                        <td>
                          {sugeridos.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: "15px" }}>
                              {sugeridos.map((prod) => (
                                <li key={prod._id} style={{ listStyle:"none" }}>
                                  {prod.nombre} ({prod.stock_actual} en stock)
                                  <button
                                    onClick={() => agregarAlCarrito(prod)}
                                    style={{ marginLeft: "10px" }}
                                  >
                                    Agregar
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span style={{ fontStyle: "italic", color: "#888" }}>
                              No hay sugerencias
                            </span>
                          )}
                        </td>
                        <td>{med.cantidadRecetada}</td>
                      </tr>
                    );
                  })}

                </tbody>
                </table>
          </div>
        )}

        <button className="back-button" onClick={() => navigate("/menu")}>
          Volver al Menú Principal
        </button>
      </div>

      <div className="carrito-box">
        <h3>Carrito de Venta</h3>
        {carrito.length === 0 ? (
          <p>No hay productos agregados.</p>
        ) : (
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
        )}

        <p><strong>Total productos:</strong> ${total.toFixed(2)}</p>
        <p><strong>Cubre {obraSocial || "obra social"}:</strong> ${cubreOS.toFixed(2)}</p>
        <p><strong>A pagar por el cliente:</strong> ${pagaCliente.toFixed(2)}</p>
        <button onClick={enviarVenta}>Confirmar Venta con Obra Social</button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default VentasObraSocial;


