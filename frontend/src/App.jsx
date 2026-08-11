import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import CatalogoTramites from './components/CatalogoTramites';
import MisTramites from './components/MisTramites';
import GestionSolicitudes from './components/GestionSolicitudes';
import GestionCatalogo from './components/GestionCatalogo';
import Perfil from './components/Perfil';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas de Alumno */}
          <Route path="/alumno" element={
            <ProtectedRoute allowedRoles={['ROLE_ALUMNO']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="tramites" element={<CatalogoTramites />} />
            <Route path="mis-tramites" element={<MisTramites />} />
            <Route path="perfil" element={<Perfil />} />
            <Route index element={<Navigate to="mis-tramites" replace />} />
          </Route>

          {/* Rutas de Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="solicitudes" element={<GestionSolicitudes />} />
            <Route path="catalogo"    element={<GestionCatalogo />} />
            <Route index element={<Navigate to="solicitudes" replace />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
