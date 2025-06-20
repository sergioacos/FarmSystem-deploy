import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [alertaStock, setAlertaStock] = useState(false);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    const chequearStock = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto`);
        const productos = response.data;
        const bajos = productos.filter(p => p.stock_actual < p.stock_minimo);
        setProductosBajoStock(bajos);
        setAlertaStock(bajos.length > 0);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setAlertaStock(false);
      }
    };
    chequearStock();
  }, []);

  const toggleLista = () => {
    if (alertaStock) {
      setMostrarLista(!mostrarLista);
    }
  };

  const irProductos = () => {
    navigate('/productos');
  };

  return (
    <div className="menu-container" style={{ position: 'relative' }}>
      <div
        className={`alerta-stock ${alertaStock ? 'alerta' : 'ok'}`}
        title={alertaStock ? 'Productos con stock crítico' : 'Stock OK'}
        onClick={toggleLista}
        style={{ cursor: alertaStock ? 'pointer' : 'default' }}
      >
        {alertaStock
          ? 'Stock crítico de productos ▼'
          : 'No hay productos con stock crítico'}
      </div>

      {mostrarLista && alertaStock && (
        <div className="lista-stock-bajo">
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {productosBajoStock.map((producto) => (
              <li key={producto._id} className="producto-alerta">
                <strong>{producto.nombre}</strong> ({producto.laboratorio})<br />
                <small>Stock: {producto.stock_actual} / Mínimo: {producto.stock_minimo}</small>
              </li>
            ))}
          </ul>
          <button className="ver-todo-btn" onClick={irProductos}>
            Ver todos los productos
          </button>
        </div>
      )}

      <div className="menu-box">
        <button onClick={() => navigate('/productos')}>Gestión de Productos</button>
        <button onClick={() => navigate('/ventas')}>Gestión de Ventas</button>
        <button onClick={() => navigate('/')}>Salir</button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Menu;
