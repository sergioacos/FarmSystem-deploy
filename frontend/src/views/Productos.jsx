import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Productos.css';

const Productos = () => {
  const navigate = useNavigate();

  return (
    <div className="productos-container">
      <div className="productos-box">
        <h2>Gestión de Productos</h2>
        <p>Productos disponibles en la farmacia.</p>
        <button onClick={() => navigate('/menu')}>Volver al Menú Principal</button>
      </div>
    </div>
  );
};

export default Productos;
