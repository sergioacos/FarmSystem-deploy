import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './views/Login';
import Menu from './views/Menu';
import MenuAdmin from './views/MenuAdmin'; 
import Productos from './views/Productos';
import ProductosAdmin from './views/ProductosAdmin';
import NuevoProducto from './views/NuevoProducto';
import Usuarios from './views/Usuarios';
import HistorialVentas from './views/HistorialVentas';
import Ventas from './views/Ventas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menuadmin" element={<MenuAdmin />} /> 
        <Route path="/productos" element={<Productos />} />
        <Route path="/productosadmin" element={<ProductosAdmin />} />
        <Route path="/productos/nuevo" element={<NuevoProducto />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/historialVentas" element={<HistorialVentas />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
