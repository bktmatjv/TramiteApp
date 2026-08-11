import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';

/* ─── Modal Create / Edit ─── */
const emptyForm = { nombre: '', descripcion: '', costo: '', activo: true };

const TramiteModal = ({ tramite, onClose, onSaved }) => {
  const [form, setForm]     = useState(tramite ? {
    nombre:      tramite.nombre,
    descripcion: tramite.descripcion || '',
    costo:       String(tramite.costo),
    activo:      tramite.activo,
  } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const isEdit = Boolean(tramite);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, costo: parseFloat(form.costo) };
      if (isEdit) {
        await api.put(`/admin/tramites/${tramite.id}`, payload);
      } else {
        await api.post('/admin/tramites', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Error al guardar el trámite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar Trámite' : 'Nuevo Trámite'}</h2>
          <button className="modal-close" onClick={onClose} id="tramite-modal-close-btn" aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} id="tramite-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del trámite *</label>
            <input
              id="nombre" name="nombre" type="text"
              className="form-control"
              value={form.nombre} onChange={handleChange}
              placeholder="Ej. Constancia de Matrícula"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion" name="descripcion"
              className="form-control"
              value={form.descripcion} onChange={handleChange}
              placeholder="Describe brevemente el trámite..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="costo">Costo (S/) *</label>
            <input
              id="costo" name="costo" type="number" step="0.01" min="0.01"
              className="form-control"
              value={form.costo} onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox" id="activo" name="activo"
              checked={form.activo} onChange={handleChange}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="activo" style={{ margin: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              Trámite activo (visible en el catálogo)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} id="tramite-modal-cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="tramite-modal-save-btn">
              <Save size={14} /> {loading ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear trámite')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Confirm Delete Modal ─── */
const ConfirmDelete = ({ tramite, onClose, onConfirm, loading }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title" style={{ color: '#c62828' }}>Eliminar trámite</h2>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <p style={{ fontSize: '0.9375rem', color: 'var(--clr-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        ¿Estás seguro de eliminar <strong>"{tramite.nombre}"</strong>?
        Esta acción es <strong>irreversible</strong> y eliminará el trámite del sistema.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onClose} id="delete-cancel-btn">Cancelar</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading} id="delete-confirm-btn">
          <Trash2 size={14} /> {loading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const GestionCatalogo = () => {
  const [tramites, setTramites]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalEdit, setModalEdit]     = useState(null);  // tramite obj | 'new' | null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError]             = useState('');

  const fetchTramites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tramites');
      setTramites(res.data);
    } catch (err) {
      setError('Error al cargar el catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTramites(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/admin/tramites/${id}/toggle`);
      setTramites(prev => prev.map(t => t.id === id ? res.data : t));
    } catch {
      setError('Error al cambiar el estado del trámite.');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/tramites/${deleteTarget.id}`);
      setTramites(prev => prev.filter(t => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el trámite.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catálogo de Trámites</h1>
          <p className="page-description">
            Gestiona los tipos de trámite disponibles en el sistema.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModalEdit('new')}
          id="nuevo-tramite-btn"
          style={{ gap: '0.5rem', flexShrink: 0 }}
        >
          <Plus size={15} /> Nuevo Trámite
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="loading-screen"><div className="spinner" /><span>Cargando catálogo...</span></div>
      ) : tramites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No hay trámites en el sistema. Crea uno con el botón superior.</p>
        </div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map(t => (
                <tr key={t.id} style={{ opacity: t.activo ? 1 : 0.55 }}>
                  <td>
                    <span className="font-mono" style={{ fontSize: '0.8rem', background: 'var(--clr-surface-2)', padding: '2px 7px', borderRadius: 'var(--radius-xs)', fontWeight: 600 }}>
                      #{t.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>{t.nombre}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)', maxWidth: 280 }}>
                    {t.descripcion || <em style={{ color: 'var(--clr-text-muted)' }}>Sin descripción</em>}
                  </td>
                  <td style={{ fontWeight: 700, color: '#c62828', fontFamily: 'var(--font-sans)' }}>
                    S/ {Number(t.costo).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${t.activo ? 'status-finalizada' : 'status-observado'}`}>
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
                      {/* Edit */}
                      <button
                        id={`edit-tramite-${t.id}`}
                        className="btn btn-secondary btn-sm"
                        title="Editar"
                        onClick={() => setModalEdit(t)}
                        style={{ padding: '4px 10px' }}
                      >
                        <Pencil size={13} />
                      </button>
                      {/* Toggle activo */}
                      <button
                        id={`toggle-tramite-${t.id}`}
                        className="btn btn-secondary btn-sm"
                        title={t.activo ? 'Desactivar' : 'Activar'}
                        onClick={() => handleToggle(t.id)}
                        style={{ padding: '4px 10px' }}
                      >
                        {t.activo ? <ToggleRight size={15} style={{ color: '#16a34a' }} /> : <ToggleLeft size={15} />}
                      </button>
                      {/* Delete */}
                      <button
                        id={`delete-tramite-${t.id}`}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                        onClick={() => setDeleteTarget(t)}
                        style={{ padding: '4px 10px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalEdit && (
        <TramiteModal
          tramite={modalEdit === 'new' ? null : modalEdit}
          onClose={() => setModalEdit(null)}
          onSaved={fetchTramites}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmDelete
          tramite={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default GestionCatalogo;
