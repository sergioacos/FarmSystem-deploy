import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, token } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!token||!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.rol.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;