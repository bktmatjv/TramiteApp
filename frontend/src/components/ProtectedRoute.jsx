import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    // Si no tiene el rol, redirige a su dashboard principal
    if (user?.rol === 'ROLE_ADMIN') {
      return <Navigate to="/admin/solicitudes" replace />;
    } else {
      return <Navigate to="/alumno/mis-tramites" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
