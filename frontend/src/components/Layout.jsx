import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onNavigate={closeSidebar} />
      </aside>

      {/* Main */}
      <div className="main-wrapper">
        <header className="app-header">
          {/* Left: mobile menu + greeting */}
          <div className="header-greeting">
            <button
              className="btn-icon"
              style={{ display: 'flex' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menú"
              id="sidebar-toggle-btn"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span>
              Hola, <strong>{user?.nombre || user?.email?.split('@')[0] || 'Usuario'}</strong>
            </span>
          </div>

          {/* Right: actions */}
          <div className="header-actions">
            <button
              id="logout-btn"
              onClick={logout}
              className="btn btn-secondary btn-sm btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <LogOut size={15} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
