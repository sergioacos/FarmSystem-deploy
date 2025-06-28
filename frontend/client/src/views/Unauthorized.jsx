import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>Usuario No Autorizado</h1>
        <p>Debes iniciar sesión con un usuario autorizado para acceder a esta página.</p>
        <button onClick={() => navigate("/")}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Unauthorized;
