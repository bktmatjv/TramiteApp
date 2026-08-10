import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      const { jwtDecode } = await import('jwt-decode');
      const decoded = jwtDecode(response.data.token);
      if (decoded.rol === 'ROLE_ADMIN') {
        navigate('/admin/solicitudes');
      } else {
        navigate('/alumno/mis-tramites');
      }
    } catch (err) {
      setError('Credenciales inválidas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <aside className="auth-panel-left">
        <div className="auth-panel-left-content">
          <div className="auth-left-brand">
            <div className="auth-left-brand-icon">E</div>
            <span className="auth-left-brand-name">EduGestor</span>
          </div>
          <h2 className="auth-left-headline">
            Gestión de trámites, simplificada.
          </h2>
          <p className="auth-left-desc">
            Solicita, rastrea y gestiona todos tus trámites educativos desde un solo lugar, de forma rápida y segura.
          </p>
          <ul className="auth-left-features">
            <li>Solicita trámites en segundos</li>
            <li>Seguimiento en tiempo real</li>
            <li>Reporta pagos fácilmente</li>
            <li>Historial completo de solicitudes</li>
          </ul>
        </div>
        <p className="auth-left-footer">© 2026 EduGestor. Todos los derechos reservados.</p>
      </aside>

      {/* Right form panel */}
      <div className="auth-panel-right">
        <div className="auth-form-wrapper">
          {/* Mobile brand */}
          <div className="auth-mobile-brand">
            <div className="auth-mobile-brand-icon">E</div>
            <span className="auth-mobile-brand-name">EduGestor</span>
          </div>

          <h1 className="auth-heading">Bienvenido</h1>
          <p className="auth-subheading">Inicia sesión para continuar</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form" id="login-form">
            <div className="form-group">
              <label htmlFor="login-email">Email o DNI</label>
              <input
                type="text"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edugestor.com"
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="auth-link-row">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-link">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
