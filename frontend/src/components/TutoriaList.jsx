import React, { useState, useEffect } from 'react';
import { getTutores, asignarTutor, completarTutoria } from '../services/api';

function TutoriaList({ tutorias, onEdit, onDelete, refreshData }) {
  const [tutores, setTutores] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedTutorId, setSelectedTutorId] = useState('');

  useEffect(() => {
    loadTutores();
  }, []);

  const loadTutores = async () => {
    try {
      const data = await getTutores();
      setTutores(data);
    } catch (err) {
      console.error('Error al cargar tutores', err);
    }
  };

  const getStatusClass = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'status-pendiente';
      case 'ASIGNADA': return 'status-asignada';
      case 'FINALIZADA': return 'status-finalizada';
      default: return '';
    }
  };

  const handleAssign = async (tutoriaId) => {
    if (!selectedTutorId) return;
    try {
      await asignarTutor(tutoriaId, selectedTutorId);
      setAssigningId(null);
      setSelectedTutorId('');
      if(refreshData) refreshData();
    } catch(err) {
      alert('Error al asignar el tutor');
    }
  };

  const handleComplete = async (tutoriaId) => {
    try {
      await completarTutoria(tutoriaId);
      if(refreshData) refreshData();
    } catch(err) {
      alert('Error al marcar como finalizada');
    }
  };

  if (!tutorias || tutorias.length === 0) {
    return <div className="empty-state">No hay tutorías registradas. Crea la primera.</div>;
  }

  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Fecha de Solicitud</th>
            <th>Estado</th>
            <th>Tutor Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tutorias.map(tutoria => (
            <tr key={tutoria.id}>
              <td className="fw-600">{tutoria.nombreAlumno}</td>
              <td className="mono">{tutoria.curso}</td>
              <td>
                {tutoria.fechaSolicitud}
              </td>
              <td>
                <span className={`badge ${getStatusClass(tutoria.estado)}`}>
                  {tutoria.estado}
                </span>
              </td>
              <td>
                {tutoria.tutor ? (
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                     <span className="mono" style={{color: '#4b5563'}}>#{tutoria.tutor.id}</span>
                     <span>{tutoria.tutor.nombre}</span>
                  </div>
                ) : (
                  <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Sin asignar</span>
                )}
              </td>
              <td className="actions-cell">
                {tutoria.estado === 'PENDIENTE' && (
                  assigningId === tutoria.id ? (
                    <div className="assign-container">
                      <select 
                        className="modern-select" 
                        value={selectedTutorId} 
                        onChange={(e) => setSelectedTutorId(e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {tutores.map(t => (
                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                      <button className="btn btn-primary btn-small" onClick={() => handleAssign(tutoria.id)}>✔</button>
                      <button className="btn btn-secondary btn-small" onClick={() => setAssigningId(null)}>✖</button>
                    </div>
                  ) : (
                    <button className="btn btn-secondary btn-small" onClick={() => setAssigningId(tutoria.id)}>Asignar</button>
                  )
                )}

                {tutoria.estado === 'ASIGNADA' && (
                  <button className="btn btn-primary btn-small" onClick={() => handleComplete(tutoria.id)}>Completar</button>
                )}

                <button 
                  className="btn-icon" 
                  onClick={() => onEdit(tutoria)} 
                  title="Editar"
                >
                  ✎
                </button>
                <button 
                  className="btn-icon delete" 
                  onClick={() => onDelete(tutoria.id)} 
                  title="Eliminar"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TutoriaList;
