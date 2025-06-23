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
  const [alertaVencimientos, setAlertaVencimientos] = useState(false); 
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [productosExcesivos, setProductosExcesivos] = useState([]);
  const [productosVencimiento, setProductosVencimiento] = useState([]); 
  const [mostrarListaStock, setMostrarListaStock] = useState(false); 
  const [mostrarListaVentas, setMostrarListaVentas] = useState(false); 
  const [mostrarListaVencimientos, setMostrarListaVencimientos] = useState(false); 

  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [loadingVencimientos, setLoadingVencimientos] = useState(true); 

  useEffect(() => {
    const fetchStockAndVentasAndVencimientos = async () => {
      try {
        const stockResponse = axios.get(`${import.meta.env.VITE_API_URL}/producto`);
        const ventasResponse = axios.get(`${import.meta.env.VITE_API_URL}/venta/ultimas-24-horas`);
        const vencimientosResponse = axios.get(`${import.meta.env.VITE_API_URL}/alerta-vencimientos`);

        const [stockData, ventasData, vencimientosData] = await Promise.all([stockResponse, ventasResponse, vencimientosResponse]);

        // Procesar datos de stock
        const productos = stockData.data;
        const bajos = productos.filter(p => p.stock_actual < p.stock_minimo);
        setProductosBajoStock(bajos);
        setAlertaStock(bajos.length > 0);

        // Procesar datos de ventas
        const { alerta, productos: productosVentas } = ventasData.data;
        setProductosExcesivos(productosVentas);
        setAlertaVentas(alerta);

        // Procesar datos de vencimientos
        const productosVencimientoProximo = vencimientosData.data;
        setProductosVencimiento(productosVencimientoProximo);
        setAlertaVencimientos(productosVencimientoProximo.length > 0);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
        setLoadingVentas(false);
        setLoadingVencimientos(false);
      }
    };

    fetchStockAndVentasAndVencimientos();
  }, []); 

  const toggleListaStock = () => {
    setMostrarListaStock(!mostrarListaStock); 
  };

  const toggleListaVentas = () => {
    setMostrarListaVentas(!mostrarListaVentas); 
  };

  const toggleListaVencimientos = () => {
    setMostrarListaVencimientos(!mostrarListaVencimientos); 
  };

  const irProductos = () => {
    navigate('/productos');
  };

  const irVencimientos = () => {
    navigate('/vencimientos');
  };

  return (
    <div className="menu-container" style={{ position: 'relative' }}>
      {/* Alerta de ventas inusuales */}
      {alertaVentas && (
        <div
          className={`alerta-ventas ${alertaVentas ? 'alerta' : 'ok'}`}
          title={alertaVentas ? 'Ventas inusuales de productos en las últimas 24 hs.' : 'Ventas dentro del rango esperado'}
          onClick={toggleListaVentas}  
        >
          {loadingVentas
            ? 'Cargando ventas...'
            : alertaVentas
            ? 'Cantidades inusuales de productos vendidos en las últimas 24 hs. ▼'
            : 'Ventas dentro del rango esperado'}
        </div>
      )}

      {/* Alerta de stock bajo */}
      {alertaStock && (
        <div
          className={`alerta-stock ${alertaStock ? 'alerta' : 'ok'}`}
          title={alertaStock ? 'Productos con stock crítico' : 'Stock OK'}
          onClick={toggleListaStock}
        >
          {alertaStock
            ? 'Stock crítico de productos ▼'
            : 'No hay productos con stock crítico'}
        </div>
      )}

      {/* Alerta de vencimientos próximos */}
      <div
        className={`alerta-vencimientos ${alertaVencimientos ? 'alerta' : 'ok'}`}
        title={alertaVencimientos ? 'Productos próximos a vencer en 7 días' : 'Vencimientos OK'}
        onClick={toggleListaVencimientos} 
      >
        {loadingVencimientos
          ? 'Cargando vencimientos...'
          : alertaVencimientos
          ? 'Productos próximos a vencer en los próximos 7 días ▼'
          : 'No hay vencimientos próximos'}
      </div>

      {/* Contenedor de botones */}
      <div className="menu-box">
        <button onClick={() => navigate('/productos')}>Gestión de Productos</button>
        <button onClick={() => navigate('/ventas')}>Gestión de Ventas</button>
        <button onClick={irVencimientos}>Vencimientos Próximos</button>
        <button onClick={logout}>Salir</button>
      </div>

      {/* Lista de productos con vencimientos próximos */}
      {mostrarListaVencimientos && alertaVencimientos && (
        <div className="lista-vencimientos">
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {productosVencimiento.map((lote) => (
              <li key={lote._id} className="producto-alerta">
                <strong>{lote.numero_lote}</strong><br />
                <small>Fecha de Vencimiento: {new Date(lote.fecha_caducidad).toLocaleDateString()}</small><br />
                {lote.productos.map((producto, index) => (
                  <div key={index}>
                    <small>{producto.producto_id?.nombre} — Cantidad: {producto.cantidad_asociada}</small>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

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

      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </div>
  );
};

export default Menu;
