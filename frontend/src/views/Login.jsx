import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });   
      const { token, user } = response.data;

    // Guardar token y datos en localStorage si querés mantener la sesión
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));

      navigate('/menu');
    } catch (error) {
      if (error.response) {
        // Error del servidor (ej: credenciales inválidas)
        alert(error.response.data.error || 'Error de autenticación');
      } else {
        // Error de red u otro
        alert('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
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
