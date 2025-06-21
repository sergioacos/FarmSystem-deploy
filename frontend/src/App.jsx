import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import Login from './views/Login';
import Menu from './views/Menu';
import MenuAdmin from './views/MenuAdmin'; 
import Productos from './views/Productos';
import ProductosAdmin from './views/ProductosAdmin';
import NuevoProducto from './views/NuevoProducto';
import Usuarios from './views/Usuarios';
import NuevoUsuario from './views/NuevoUsuario';
import HistorialVentas from './views/HistorialVentas';
import Ventas from './views/Ventas';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<ProtectedRoute requiredRole="usuario"><Menu /></ProtectedRoute>} />
          <Route path="/menuadmin" element={<ProtectedRoute requiredRole="admin">  <MenuAdmin /></ProtectedRoute>} /> 
          <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="/productosadmin" element={<ProtectedRoute requiredRole="admin"><ProductosAdmin /></ProtectedRoute>} />
          <Route path="/productos/nuevo" element={<ProtectedRoute><NuevoProducto /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="/usuarios/nuevo" element={<ProtectedRoute><NuevoUsuario /></ProtectedRoute>} />
          <Route path="/historialVentas" element={<ProtectedRoute><HistorialVentas /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
