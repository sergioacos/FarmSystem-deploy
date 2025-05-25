import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
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
