import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, CheckCircle } from 'lucide-react';

const CatalogoTramites = () => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const res = await api.get('/tramites');
        setTramites(res.data);
      } catch (err) {
        setMessage({ text: 'Error al cargar trámites.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchTramites();
  }, []);

  const solicitarTramite = async (id) => {
    try {
      await api.post('/solicitudes', { tipoTramiteId: id });
      setMessage({ text: 'Trámite solicitado exitosamente. Revisa "Mis Trámites".', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Error al solicitar el trámite.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando catálogo...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Catálogo de Trámites</h1>
        <p className="page-description">
          Selecciona el trámite que deseas realizar y presiona <strong>Solicitar</strong>.
        </p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.type === 'success' && <CheckCircle size={16} />}
          {message.text}
        </div>
      )}

      {tramites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No hay trámites disponibles en este momento.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {tramites.map((t) => (
            <article
              key={t.id}
              className="card card-hover"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Card header stripe */}
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--clr-green-800) 0%, var(--clr-green-600) 100%)',
                  padding: '1.25rem 1.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: 'rgba(255,255,255,.2)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t.nombre}
                </h2>
              </div>

              {/* Card body */}
              <div
                className="card-body"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6, flex: 1 }}>
                  {t.descripcion}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid var(--clr-border)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--clr-text-muted)',
                        marginBottom: '2px',
                      }}
                    >
                      Costo
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--clr-green-800)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      S/ {t.costo.toFixed(2)}
                    </div>
                  </div>

                  <button
                    id={`solicitar-tramite-${t.id}`}
                    onClick={() => solicitarTramite(t.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogoTramites;
