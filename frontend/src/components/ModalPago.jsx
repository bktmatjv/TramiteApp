import React, { useState } from 'react';
import api from '../services/api';
import { X, CreditCard, AlertCircle } from 'lucide-react';

const ModalPago = ({ isOpen, onClose, solicitudId, onPagoExitoso }) => {
  const [codigo, setCodigo]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/solicitudes/${solicitudId}/pago`, { codigoOperacionBanco: codigo });
      onPagoExitoso();
      setCodigo('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCodigo('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-pago-title">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--clr-green-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--clr-green-700)',
                flexShrink: 0,
              }}
            >
              <CreditCard size={20} />
            </div>
            <div>
              <h2
                id="modal-pago-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--clr-text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Reportar Pago
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)', marginTop: 2 }}>
                Ingresa el código de operación bancaria
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Cerrar"
            id="modal-close-btn"
            style={{ marginLeft: '0.5rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="modal-pago-form">
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="modal-codigo-operacion">Código de Operación</label>
            <input
              id="modal-codigo-operacion"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. 12345678"
              required
              className="form-input"
              autoFocus
            />
            <span
              style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}
            >
              Encuéntralo en el comprobante de pago de tu entidad bancaria.
            </span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              id="modal-cancel-btn"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="modal-submit-btn"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Reportar pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPago;
