import React, { useState, useEffect } from 'react';
import TutoriaList from './components/TutoriaList';
import TutoriaForm from './components/TutoriaForm';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { getTutorias, createTutoria, updateTutoria, deleteTutoria, logout } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [tutorias, setTutorias] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutoria, setEditingTutoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTutorias();
    }
  }, [isAuthenticated]);

  const fetchTutorias = async () => {
    try {
      setLoading(true);
      const data = await getTutorias();
      setTutorias(data);
      setError(null);
    } catch (err) {
      if (err.message.includes('autenticación') || err.message.includes('Forbidden')) {
          handleLogout();
      } else {
          setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setTutorias([]);
  };

  const handleCreate = () => {
    setEditingTutoria(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tutoria) => {
    setEditingTutoria(tutoria);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tutoría?')) {
      try {
        await deleteTutoria(id);
        fetchTutorias();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTutoria) {
        await updateTutoria(editingTutoria.id, formData);
      } else {
        await createTutoria(formData);
      }
      setIsFormOpen(false);
      fetchTutorias();
    } catch (err) {
      alert('Error al guardar los datos');
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="app-header">
          <div className="header-content">
            <div className="brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>MentoringApp</span>
            </div>
            <div className="header-actions">
              <a href="#" style={{color: '#111827', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem'}}>DISCOVER</a>
              <a href="#" style={{color: '#4b5563', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem'}}>DOCS</a>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                Cerrar Sesión
              </button>
              <button className="btn btn-primary btn-small" onClick={handleCreate}>
                + Nueva Tutoría
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
          <h1 className="page-title">Gestión de Tutorías</h1>
          <p className="page-description">
            Administra las tutorías programadas, asigna tutores y marca las sesiones como finalizadas.
            Esta vista permite gestionar el flujo completo de acompañamiento académico.
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          
          {loading ? (
            <div className="empty-state">Cargando...</div>
          ) : (
            <TutoriaList 
              tutorias={tutorias} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              refreshData={fetchTutorias}
            />
          )}
        </main>
      </div>

      {isFormOpen && (
        <TutoriaForm 
          initialData={editingTutoria} 
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
