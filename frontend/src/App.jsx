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
import Unauthorized from "./views/Unauthorized";
import ProtectedRoute from './components/ProtectedRoute';
import VentasObraSocial from './views/VentasOS';
import EditarUsuario from './views/EditarUsuario';


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/menu" element={<ProtectedRoute requiredRole="usuario"><Menu /></ProtectedRoute>} />
          <Route path="/menuadmin" element={<ProtectedRoute requiredRole="admin">  <MenuAdmin /></ProtectedRoute>} /> 
          <Route path="/productos" element={<ProtectedRoute requiredRole="usuario"><Productos /></ProtectedRoute>} />
          <Route path="/productosadmin" element={<ProtectedRoute requiredRole="admin"><ProductosAdmin /></ProtectedRoute>} />
          <Route path="/productos/nuevo" element={<ProtectedRoute requiredRole="admin"><NuevoProducto /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute requiredRole="admin"><Usuarios /></ProtectedRoute>} />
          <Route path="/usuarios/nuevo" element={<ProtectedRoute requiredRole="admin"><NuevoUsuario /></ProtectedRoute>} />
          <Route path="/usuarios/editar/:id" element={<ProtectedRoute requiredRole="admin"><EditarUsuario /></ProtectedRoute>} />
          <Route path="/historialVentas" element={<ProtectedRoute requiredRoles={['admin', 'usuario']}><HistorialVentas /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute requiredRole="usuario"><Ventas /></ProtectedRoute>} />
          <Route path="/ventasOS" element={<ProtectedRoute requiredRole="usuario"><VentasObraSocial /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
