import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Ventas.css";

const VentasObraSocial = () => {
  const [idReceta, setIdReceta] = useState("");
  const [obraSocial, setObraSocial] = useState("");
  const [receta, setReceta] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const buscarReceta = async () => {
    if (!idReceta) return alert("Ingresá el número de receta");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/recetaElectronica/${idReceta}`);
      setReceta(response.data);
      setCarrito([]); // Reiniciar carrito con nueva receta
    } catch (error) {
      console.error("Error al buscar receta:", error);
      alert("No se encontró una receta con ese número.");
    }
  };

  const agregarAlCarrito = (medicamento) => {
    const yaAgregado = carrito.find(item => item.nombre === medicamento.nombreComercial);
    if (yaAgregado) return;

    const item = {
      nombre: medicamento.nombreComercial,
      cantidad: medicamento.cantidadRecetada,
      precio_unitario: 0, // puede depender del convenio
      producto_id: null
    };

    setCarrito([...carrito, item]);
  };

  const enviarVenta = async () => {
    if (!obraSocial || !receta || carrito.length === 0) {
      alert("Faltan datos para registrar la venta.");
      return;
    }

    const venta = {
      receta_id: receta.id_receta,
      paciente: receta.paciente,
      obra_social: obraSocial,
      productos: carrito,
      total,
      tipo_pago: "obra_social"
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/venta-obra-social`, venta);
      alert("Venta con obra social registrada.");
      setReceta(null);
      setCarrito([]);
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("Error al registrar la venta.");
    }
  };

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
            <h3>Receta #{receta.id_receta} <strong>Estado:</strong> {receta.estado} </h3>
           
        <div className="form-info">
        <label>
            Fecha de prescripción:
            <input
            type="text"
            value={new Date(receta.fechaEmision).toLocaleDateString()}
            readOnly
            />
        </label>

        <label>
            Fecha de vencimiento:
            <input
            type="text"
            value={new Date(receta.fechaEmision).toLocaleDateString()} // O podés calcular vencimiento real
            readOnly
            />
        </label>
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
                    <th>Cantidad Recetada</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {receta.productosRecetados.map((med, i) => (
                    <tr key={i}>
                        <td>{med.principioActivo} {med.formaFarmaceutica} X {med.cantidadPorEnvase}</td>
                        <td>{med.nombreComercial} {med.dosis} {med.formaFarmaceutica} X {med.cantidadPorEnvase}</td>
                        <td>{med.cantidadRecetada}</td>
                        <td>
                        <button onClick={() => agregarAlCarrito(med)}>Agregar</button>
                        </td>
                    </tr>
                    ))}
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
              <li key={index}>
                {item.nombre} - Cantidad: {item.cantidad}
                <button onClick={() => setCarrito(carrito.filter((_, i) => i !== index))} style={{ marginLeft: "10px" }}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}

        <p><strong>Total estimado:</strong> ${total.toFixed(2)}</p>
        <button onClick={enviarVenta}>Confirmar Venta con Obra Social</button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default VentasObraSocial;


