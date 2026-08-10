import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Perfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/usuarios/me');
        setFormData(res.data);
      } catch (err) {
        setMessage({ text: 'Error al cargar el perfil.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.put('/usuarios/me', {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
      });
      setMessage({
        text: 'Perfil actualizado correctamente.',
        type: 'success',
      });
      setFormData(res.data);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error al actualizar el perfil.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Initials for avatar
  const initials = formData.nombres
    ? `${formData.nombres.charAt(0)}${formData.apellidos?.charAt(0) || ''}`.toUpperCase()
    : '?';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-description">Actualiza tus datos personales.</p>
      </div>

      {/* Avatar card */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--clr-green-800) 0%, var(--clr-green-600) 100%)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.25)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'white',
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,.35)',
          }}
        >
          {initials}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {formData.nombres} {formData.apellidos}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,.7)', marginTop: '3px' }}>
            {formData.email}
          </div>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.type === 'success'
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />
          }
          {message.text}
        </div>
      )}

      {/* Form card */}
      <div className="card">
        {/* Section: editable */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--clr-border)',
            }}
          >
            <User size={16} color="var(--clr-green-700)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--clr-text-primary)',
              }}
            >
              Datos Personales
            </span>
          </div>
        </div>

        <form id="perfil-form" onSubmit={handleSubmit}>
          <div style={{ padding: '0 1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.125rem',
                marginBottom: '1.125rem',
              }}
            >
              <div className="form-group">
                <label htmlFor="perfil-nombres">Nombres</label>
                <input
                  id="perfil-nombres"
                  name="nombres"
                  type="text"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="perfil-apellidos">Apellidos</label>
                <input
                  id="perfil-apellidos"
                  name="apellidos"
                  type="text"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: read-only */}
          <div style={{ padding: '0 1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '1rem 0 1.25rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--clr-border)',
              }}
            >
              <Lock size={15} color="var(--clr-text-muted)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--clr-text-muted)',
                }}
              >
                Datos no editables
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.125rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="form-group">
                <label htmlFor="perfil-dni">DNI</label>
                <input
                  id="perfil-dni"
                  type="text"
                  value={formData.dni}
                  disabled
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="perfil-email">Email</label>
                <input
                  id="perfil-email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--clr-border)',
              background: 'var(--clr-bg)',
            }}
          >
            <button
              id="perfil-save-btn"
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
