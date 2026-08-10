import React from 'react';

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-nav">
        <div style={{fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem', marginTop: '1rem'}}>ON THIS PAGE</div>
        <a href="#" className="sidebar-item active">Tutorías</a>
        <a href="#" className="sidebar-item">Tutores</a>
        <a href="#" className="sidebar-item">Estadísticas</a>
        <a href="#" className="sidebar-item">Configuración</a>
      </div>
    </aside>
  );
}

export default Sidebar;
