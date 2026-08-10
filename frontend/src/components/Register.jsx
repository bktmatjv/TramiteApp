import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'ROLE_ALUMNO'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      setSuccess(response.data || 'Usuario registrado exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err.response?.data || 'Error al registrar el usuario');
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
            Crea tu cuenta y comienza hoy.
          </h2>
          <p className="auth-left-desc">
            Únete a EduGestor y accede a un sistema moderno para gestionar todos tus trámites educativos de forma eficiente.
          </p>
          <ul className="auth-left-features">
            <li>Registro rápido en segundos</li>
            <li>Acceso inmediato al catálogo</li>
            <li>Notificaciones de estado al instante</li>
            <li>Datos seguros y protegidos</li>
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

          <h1 className="auth-heading">Crear cuenta</h1>
          <p className="auth-subheading">Completa los datos para registrarte</p>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleRegister} className="auth-form" id="register-form">
            <div className="auth-form-row">
              <div className="form-group">
                <label htmlFor="nombres">Nombres</label>
                <input
                  type="text"
                  id="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="García"
                  required
                />
              </div>
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  id="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="12345678"
                  required
                  maxLength={8}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rol">Rol</label>
                <select id="rol" value={formData.rol} onChange={handleChange} required>
                  <option value="ROLE_ALUMNO">Alumno</option>
                  <option value="ROLE_ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-link-row">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
