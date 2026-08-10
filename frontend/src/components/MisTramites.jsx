import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ModalPago from './ModalPago';
import { CreditCard } from 'lucide-react';

const STATUS_LABELS = {
  PENDIENTE_PAGO: 'Pendiente Pago',
  EN_REVISION:    'En Revisión',
  EN_PROCESO:     'En Proceso',
  OBSERVADO:      'Observado',
  EMITIDO:        'Emitido',
};

const getStatusClass = (estado) => {
  switch (estado) {
    case 'PENDIENTE_PAGO': return 'status-pendiente';
    case 'EN_REVISION':    return 'status-revision';
    case 'EN_PROCESO':     return 'status-asignada';
    case 'OBSERVADO':      return 'status-observado';
    case 'EMITIDO':        return 'status-finalizada';
    default:               return '';
  }
};

const MisTramites = () => {
  const [solicitudes, setSolicitudes]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedId, setSelectedId]     = useState(null);
  const [isModalOpen, setModalOpen]     = useState(false);

  const fetchSolicitudes = async () => {
    try {
      const res = await api.get('/solicitudes/mis-tramites');
      setSolicitudes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSolicitudes(); }, []);

  const openModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando trámites...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mis Trámites</h1>
        <p className="page-description">
          Sigue el estado de tus solicitudes y reporta los pagos correspondientes.
        </p>
      </div>

      {solicitudes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <p>No tienes trámites solicitados aún.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Trámite</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.8rem',
                        background: 'var(--clr-surface-2)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--clr-text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {s.codigoSeguimiento}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{s.tipoTramite?.nombre}</td>
                  <td
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: 'var(--clr-green-800)',
                    }}
                  >
                    S/ {Number(s.tipoTramite?.costo).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusClass(s.estado)}`}>
                      {STATUS_LABELS[s.estado] || s.estado}
                    </span>
                  </td>
                  <td style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8125rem' }}>
                    {new Date(s.fechaActualizacion).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    {s.estado === 'PENDIENTE_PAGO' || s.estado === 'OBSERVADO' ? (
                      <button
                        id={`pagar-btn-${s.id}`}
                        onClick={() => openModal(s.id)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.25rem' }}
                      >
                        <CreditCard size={13} />
                        Pagar
                      </button>
                    ) : (
                      <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalPago
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        solicitudId={selectedId}
        onPagoExitoso={fetchSolicitudes}
      />
    </div>
  );
};

export default MisTramites;
