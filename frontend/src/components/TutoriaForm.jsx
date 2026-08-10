import React, { useState, useEffect } from 'react';

const TutoriaForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombreAlumno: '',
        curso: '',
        fechaSolicitud: '',
        estado: 'PENDIENTE'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <h2>{initialData ? 'Editar Tutoría' : 'Nueva Tutoría'}</h2>
                <form onSubmit={handleSubmit} className="modern-form">
                    
                    <div className="form-group">
                        <label htmlFor="nombreAlumno">Nombre del Alumno</label>
                        <input
                            type="text"
                            id="nombreAlumno"
                            name="nombreAlumno"
                            value={formData.nombreAlumno}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="curso">Curso</label>
                        <input
                            type="text"
                            id="curso"
                            name="curso"
                            value={formData.curso}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Algoritmos y Estructuras de Datos"
                        />
                    </div>

                    <div className="form-group row-group">
                        <div className="form-group flex-1">
                            <label htmlFor="fechaSolicitud">Fecha de Solicitud</label>
                            <input
                                type="date"
                                id="fechaSolicitud"
                                name="fechaSolicitud"
                                value={formData.fechaSolicitud}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label htmlFor="estado">Estado</label>
                            <select
                                id="estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                            >
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="CONFIRMADA">CONFIRMADA</option>
                                <option value="FINALIZADA">FINALIZADA</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {initialData ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TutoriaForm;
