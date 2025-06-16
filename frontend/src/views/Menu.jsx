import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [alertaStock, setAlertaStock] = useState(null);

  useEffect(() => {
    const chequearStock = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto`);
        const productos = response.data;
        const hayBajoStock = productos.some(
          (p) => p.stock_actual < p.stock_minimo
        );
        setAlertaStock(hayBajoStock);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setAlertaStock(false);
      }
    };
    chequearStock();
  }, []);

  const handleClick = () => {
    if (alertaStock) {
      navigate('/productos');
    }
  };

  return (
    <div className="menu-container" style={{ position: 'relative' }}>
      {alertaStock !== null && (
        <div
          className={`alerta-stock ${alertaStock ? 'alerta' : 'ok'}`}
          title={alertaStock ? 'Productos con stock crítico' : 'Stock OK'}
          onClick={handleClick}
        >
          {alertaStock
            ? 'Stock crítico de productos'
            : 'No hay productos con stock crítico'}
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
