import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/NuevoProducto.css";

const NuevoProducto = () => {
  const [codigo, setCodigo] = useState(""); //Borrar cuando implementemos que se cree automáticamente
  const [nombre, setNombre] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [altaRotacion, setAltaRotacion] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categoria`);
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigo || !nombre || !laboratorio || !precio || !stockMinimo || !stockActual || !categoria) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const nuevoProducto = {
        codigo, // Incluyo el código aquí
        nombre,
        laboratorio,
        precio,
        stock_minimo: stockMinimo,
        stock_actual: stockActual,
        categoria,
        alta_rotacion: altaRotacion,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/producto`, nuevoProducto);
      alert("Producto creado exitosamente")
      navigate("/productosadmin");
    } catch (err) {
      console.error("Error al crear producto", err);
      setError("Hubo un error al guardar el producto.");
    }
  };

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Nuevo Producto</h2>

        <form onSubmit={handleSubmit} className="formulario-producto">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código"
          />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del producto"
          />
          <input
            type="text"
            value={laboratorio}
            onChange={(e) => setLaboratorio(e.target.value)}
            placeholder="Laboratorio"
          />
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
          />
          <input
            type="number"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            placeholder="Stock mínimo"
          />
          <input
            type="number"
            value={stockActual}
            onChange={(e) => setStockActual(e.target.value)}
            placeholder="Stock actual"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
          </select>

          <div className="checkbox-alta-rotacion">
            <input
              type="checkbox"
              id="altaRotacion"
              checked={altaRotacion}
              onChange={(e) => setAltaRotacion(e.target.checked)}
            />
            <label htmlFor="altaRotacion">Producto de alta rotación</label>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="botones-formulario">
            <button type="submit" className="back-button">Guardar</button>
            <button
              type="button"
              className="back-button cancelar"
              onClick={() => navigate("/productosAdmin")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default NuevoProducto;
