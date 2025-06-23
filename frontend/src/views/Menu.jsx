import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [alertaStock, setAlertaStock] = useState(false);
  const [alertaVentas, setAlertaVentas] = useState(false);  
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [productosExcesivos, setProductosExcesivos] = useState([]);
  const [mostrarListaStock, setMostrarListaStock] = useState(false); 
  const [mostrarListaVentas, setMostrarListaVentas] = useState(false); 

  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [loadingVentas, setLoadingVentas] = useState(true);

  // useEffect para verificar productos con stock bajo y ventas inusuales en paralelo
  useEffect(() => {
    const fetchStockAndVentas = async () => {
      try {
        // Cargar stock
        const stockResponse = axios.get(`${import.meta.env.VITE_API_URL}/producto`);
        // Cargar ventas inusuales
        const ventasResponse = axios.get(`${import.meta.env.VITE_API_URL}/venta/ultimas-24-horas`);

        const [stockData, ventasData] = await Promise.all([stockResponse, ventasResponse]);

        // Procesar datos de stock
        const productos = stockData.data;
        const bajos = productos.filter(p => p.stock_actual < p.stock_minimo);
        setProductosBajoStock(bajos);
        setAlertaStock(bajos.length > 0);

        // Procesar datos de ventas
        const { alerta, productos: productosVentas } = ventasData.data;
        setProductosExcesivos(productosVentas);
        setAlertaVentas(alerta);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false); // Finaliza la carga
        setLoadingVentas(false); // Finaliza la carga de ventas inusuales
      }
    };

    fetchStockAndVentas();
  }, []); 

  const toggleListaStock = () => {
    setMostrarListaStock(!mostrarListaStock); 
  };

  const toggleListaVentas = () => {
    setMostrarListaVentas(!mostrarListaVentas); 
  };

  const irProductos = () => {
    navigate('/productos');
  };

  return (
    <div className="menu-container" style={{ position: 'relative' }}>
      <div
        className={`alerta-ventas ${alertaVentas ? 'alerta' : 'ok'}`}
        title={alertaVentas ? 'Ventas inusuales de productos en las últimas 24 hs.' : 'Ventas dentro del rango esperado'}
        style={{
          cursor: alertaVentas ? 'pointer' : 'default',
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '12px 18px',
          backgroundColor: alertaVentas ? '#e53935' : '#006f2e',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.3s ease',
        }}
        onClick={toggleListaVentas}  
      >
        {loadingVentas
          ? 'Cargando ventas...'
          : alertaVentas
          ? 'Cantidades inusuales de productos vendidos en las últimas 24 hs. ▼'
          : 'Ventas dentro del rango esperado'}
      </div>

      {/* Alerta de stock bajo */}
      <div
        className={`alerta-stock ${alertaStock ? 'alerta' : 'ok'}`}
        title={alertaStock ? 'Productos con stock crítico' : 'Stock OK'}
        onClick={toggleListaStock}
        style={{ cursor: alertaStock ? 'pointer' : 'default' }}
      >
        {alertaStock
          ? 'Stock crítico de productos ▼'
          : 'No hay productos con stock crítico'}
      </div>

      {/* Lista de productos con ventas inusuales */}
      {mostrarListaVentas && alertaVentas && (
        <div className="lista-ventas-excesivas">
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {productosExcesivos.map((producto) => (
              <li key={producto.nombre} className="producto-alerta">
                <strong>{producto.nombre}</strong><br />
                <small>Cantidad Vendida: {producto.cantidadVendida} / Umbral: {producto.umbral}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lista de productos con stock bajo */}
      {mostrarListaStock && alertaStock && (
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
        <button onClick={logout}>Salir</button>
      </div>

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Menu;
