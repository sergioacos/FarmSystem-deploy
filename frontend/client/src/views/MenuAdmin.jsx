import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Menu.css';

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      <div className="menu-container">
        <div className="menu-box">
          <button onClick={() => navigate('/productosadmin')}>Gestión de Productos</button>
          <button onClick={() => navigate('/usuarios')}>Gestión de Usuarios</button>
          <button onClick={() => navigate('/historialVentas')}>Historial de Ventas</button>
          <button onClick={() => navigate('/lotes')}>Ver Lotes</button>
          <button onClick={logout}>Salir</button>
        </div>
      </div>
      <div className="footer">
        <p>© 2025 Invexa</p>
      </div>
    </>
  );
};

export default MenuAdmin;
