import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="menu-box">
        <h2>Menú Principal</h2>
        <button onClick={() => navigate('/productos')}>Gestión de Productos</button>
        <button onClick={() => navigate('/')}>Salir</button>
      </div>
    </div>
  );
};

export default Menu;
