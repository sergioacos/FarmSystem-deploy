import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email y contraseña son obligatorios');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });   
      const { token, user } = response.data;

    // Guarda token y datos en localStorage 
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));

      // Redirige según el rol
      if (user.rol === 'admin') {
          navigate('/menuadmin'); 
      } else {
          navigate('/menu');
      }
    } catch (error) {
      if (error.response) {
        // Error del servidor 
        setErrorMessage(error.response.data.error || 'Error de autenticación');
      } else {
        // Error de red 
        setErrorMessage('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
