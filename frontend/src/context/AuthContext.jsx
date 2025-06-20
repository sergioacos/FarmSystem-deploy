import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // obtenemos usuario actualizado del backend
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token, logout]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
