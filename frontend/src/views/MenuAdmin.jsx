import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

const MenuAdmin = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="menu-container">
        <div className="menu-box">
          <button onClick={() => navigate('/productosAdmin')}>Gestión de Productos</button>
          <button onClick={() => navigate('/usuarios')}>Gestión de Usuarios</button>
          <button onClick={() => navigate('/')}>Salir</button>
        </div>
      </div>
      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </>
  );
};

export default MenuAdmin;
