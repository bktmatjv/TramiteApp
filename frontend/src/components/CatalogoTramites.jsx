import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, FileText, Zap } from 'lucide-react';

/* ─── Feature list per trámite ─── */
const FEATURES = {
  default: [
    { ok: true,  text: 'Emisión rápida y automatizada' },
    { ok: true,  text: 'Válido para trámites institucionales' },
    { ok: true,  text: 'Documento firmado digitalmente' },
    { ok: false, text: 'No válido para uso en el extranjero sin apostilla' },
  ],
};
const getFeatures = (nombre) => {
  const key = Object.keys(FEATURES).find(k => nombre?.toLowerCase().includes(k));
  return FEATURES[key] || FEATURES.default;
};

/* ─── Stepper ─── */
const Stepper = ({ current }) => {
  const steps = ['Vista previa', 'Pago', 'Confirmación'];
  return (
    <div className="ct-stepper">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done   = idx < current;
        return (
          <React.Fragment key={label}>
            <div className={`ct-step ${active ? 'ct-step--active' : ''} ${done ? 'ct-step--done' : ''}`}>
              <div className="ct-step-circle">
                {done ? <CheckCircle size={14} /> : String(idx).padStart(2, '0')}
              </div>
              <span className="ct-step-label">{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`ct-step-line ${done ? 'ct-step-line--done' : ''}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Payment confirmation screen (inline) ─── */
const PagoConfirmado = ({ tramite, onClose }) => (
  <div className="ct-pago-confirmado">
    <div className="ct-pago-icon-wrap">
      <CheckCircle size={48} strokeWidth={1.5} />
    </div>
    <h2 className="ct-pago-title">¡Notificación enviada!</h2>
    <p className="ct-pago-desc">
      Se ha enviado la notificación de pago a tu entidad bancaria por el trámite{' '}
      <strong>{tramite.nombre}</strong> (S/ {Number(tramite.costo).toFixed(2)}).
      Revisa &quot;Mis Trámites&quot; para hacer seguimiento.
    </p>

    <div className="ct-metodos-grid">
      <span className="ct-metodo">🏦 BCP</span>
      <span className="ct-metodo">🏦 BBVA</span>
      <span className="ct-metodo">🏦 Interbank</span>
      <span className="ct-metodo">🏦 Scotiabank</span>
      <span className="ct-metodo">💜 Yape</span>
      <span className="ct-metodo">🔵 Plin</span>
      <span className="ct-metodo">💳 Visa / MC</span>
      <span className="ct-metodo">🧾 Agente bancario</span>
    </div>

    <p className="ct-pago-note">
      Tienes <strong>48 horas</strong> para completar el pago. Una vez confirmado, tu documento será emitido automáticamente.
    </p>

    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <button className="btn btn-secondary btn-lg" onClick={onClose} id="pago-confirmado-cerrar-btn">
        Volver al catálogo
      </button>
      <a href="/alumno/mis-tramites" className="btn btn-primary btn-lg" id="pago-confirmado-tramites-btn">
        Ver mis trámites →
      </a>
    </div>
  </div>
);

/* ─── Detail Panel ─── */
const DetalleTramite = ({ tramite, onBack, onSolicitar }) => {
  const [step, setStep]           = useState(1); // 1=preview, 2=pago, 3=confirmado
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const features                  = getFeatures(tramite.nombre);

  const handleSolicitar = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/solicitudes', { tipoTramiteId: tramite.id });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el trámite. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return <PagoConfirmado tramite={tramite} onClose={onBack} />;

  return (
    <div className="ct-detail">
      {/* Back */}
      <button className="ct-back-btn" onClick={onBack} id="detalle-volver-btn">
        <ArrowLeft size={14} /> Volver a trámites
      </button>

      {/* Title */}
      <h1 className="ct-detail-title">{tramite.nombre}</h1>
      <p className="ct-detail-desc">{tramite.descripcion}</p>

      {/* Stepper */}
      <Stepper current={step} />

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <XCircle size={15} /> {error}
        </div>
      )}

      {/* Body */}
      <div className="ct-detail-body">
        {/* Left: document preview mockup */}
        <div className="ct-preview-panel">
          <div className="ct-preview-badge">
            <Clock size={13} /> Vista previa — datos ocultos hasta emisión oficial
          </div>
          <div className="ct-doc-mockup ct-doc-empty">
            <div className="ct-doc-empty-icon">📄</div>
            <p className="ct-doc-empty-title">Documento no adjuntado</p>
            <p className="ct-doc-empty-sub">
              El documento estará disponible una vez que el trámite sea procesado y aprobado.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="ct-summary-panel">
          <div className="ct-summary-card">
            <div className="ct-summary-badge">
              <Zap size={11} /> EMISIÓN INMEDIATA
            </div>
            <div className="ct-summary-price-row">
              <span className="ct-summary-price-label">Total a pagar</span>
              <span className="ct-summary-price">S/ {Number(tramite.costo).toFixed(2)}</span>
            </div>
            <hr className="ct-divider" />
            <p className="ct-summary-features-title">Características del trámite</p>
            <ul className="ct-features-list">
              {features.map((f, i) => (
                <li key={i} className={f.ok ? 'ct-feat--ok' : 'ct-feat--no'}>
                  {f.ok
                    ? <CheckCircle size={15} />
                    : <XCircle size={15} />}
                  {f.text}
                </li>
              ))}
            </ul>

            <button
              id="detalle-solicitar-btn"
              className="btn btn-primary btn-block"
              style={{ marginTop: '1.5rem' }}
              onClick={handleSolicitar}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Solicitar y Pagar →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Catalog Card ─── */
const TramiteCard = ({ tramite, onClick }) => (
  <article
    className="ct-card"
    onClick={onClick}
    id={`tramite-card-${tramite.id}`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    aria-label={`Ver detalles de ${tramite.nombre}`}
  >
    <div className="ct-card-badges">
      <span className="ct-badge ct-badge--new">¡NUEVO!</span>
      <span className="ct-badge ct-badge--emit">EMISIÓN INMEDIATA</span>
    </div>

    <h2 className="ct-card-title">{tramite.nombre}</h2>
    <p className="ct-card-price">S/ {Number(tramite.costo).toFixed(2)}</p>
    <p className="ct-card-desc">{tramite.descripcion}</p>

    <div className="ct-card-footer">
      <span className="ct-card-arrow">
        <ArrowRight size={18} />
      </span>
    </div>
  </article>
);

/* ─── Main Component ─── */
const CatalogoTramites = () => {
  const [tramites, setTramites]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [error, setError]             = useState('');

  useEffect(() => {
    api.get('/tramites')
      .then(res => setTramites(res.data))
      .catch(() => setError('Error al cargar el catálogo de trámites.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando catálogo...</span>
      </div>
    );
  }

  if (selected) {
    return (
      <DetalleTramite
        tramite={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Catálogo de Trámites</h1>
        <p className="page-description">
          {tramites.length} trámites disponibles — Haz click en uno para ver los detalles y solicitar.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="ct-catalog-header">
        <span className="ct-results-count">{tramites.length} Resultados</span>
        <div className="ct-sort-row">
          <span>Ordenado por:</span>
          <select className="ct-sort-select">
            <option>Elige un orden</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Nombre A-Z</option>
          </select>
        </div>
      </div>

      {tramites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No hay trámites disponibles en este momento.</p>
        </div>
      ) : (
        <div className="ct-grid">
          {tramites.map(t => (
            <TramiteCard key={t.id} tramite={t} onClick={() => setSelected(t)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogoTramites;
