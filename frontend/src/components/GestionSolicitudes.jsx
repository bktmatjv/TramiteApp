import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_LABELS = {
  PENDIENTE_PAGO: 'Pendiente Pago',
  EN_REVISION:    'En Revisión',
  EN_PROCESO:     'En Proceso',
  OBSERVADO:      'Observado',
  EMITIDO:        'Emitido',
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS);

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

const GestionSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [filterDni, setFilterDni]     = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/solicitudes', {
        params: { page, size: 10, dni: filterDni, estado: filterEstado },
      });
      setSolicitudes(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSolicitudes(); }, [page, filterDni, filterEstado]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await api.put(`/admin/solicitudes/${id}/estado`, { nuevoEstado });
      fetchSolicitudes();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el estado');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Solicitudes</h1>
        <p className="page-description">
          Administra y actualiza el estado de todas las solicitudes de trámites del sistema.
        </p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '1', minWidth: 200, maxWidth: 320 }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--clr-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="filter-dni-input"
            type="text"
            placeholder="Buscar por DNI del alumno..."
            className="filter-input"
            style={{ paddingLeft: '2.25rem' }}
            value={filterDni}
            onChange={(e) => { setFilterDni(e.target.value); setPage(0); }}
          />
        </div>
        <select
          id="filter-estado-select"
          className="filter-select"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(0); }}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          <span>Cargando solicitudes...</span>
        </div>
      ) : (
        <>
          {solicitudes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <p>No hay solicitudes que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Código / Fecha</th>
                    <th>Alumno</th>
                    <th>Trámite</th>
                    <th>Op. Banco</th>
                    <th>Estado</th>
                    <th>Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span
                          className="font-mono fw-600"
                          style={{
                            fontSize: '0.8rem',
                            background: 'var(--clr-surface-2)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          {s.codigoSeguimiento}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '4px' }}>
                          {new Date(s.fechaSolicitud).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.alumnoNombre}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>
                          DNI: {s.alumnoDni}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{s.tipoTramite?.nombre}</td>
                      <td>
                        {s.codigoOperacionBanco ? (
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '0.8rem',
                              background: 'var(--clr-green-50)',
                              color: 'var(--clr-green-800)',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-xs)',
                              fontWeight: 600,
                              border: '1px solid var(--clr-green-100)',
                            }}
                          >
                            {s.codigoOperacionBanco}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            No reportado
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(s.estado)}`}>
                          {STATUS_LABELS[s.estado] || s.estado}
                        </span>
                      </td>
                      <td>
                        <select
                          id={`estado-select-${s.id}`}
                          className="modern-select"
                          value={s.estado}
                          onChange={(e) => handleEstadoChange(s.id, e.target.value)}
                          disabled={s.estado === 'EMITIDO'}
                          style={{ width: '100%', maxWidth: 160 }}
                        >
                          {STATUS_OPTIONS.map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                id="pagination-prev"
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <ChevronLeft size={15} /> Anterior
              </button>
              <span className="pagination-info">
                Página {page + 1} de {totalPages}
              </span>
              <button
                id="pagination-next"
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Siguiente <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GestionSolicitudes;
