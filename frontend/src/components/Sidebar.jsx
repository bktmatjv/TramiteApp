import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, ClipboardList, Shield, User } from 'lucide-react';

function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ROLE_ADMIN';

  // Initials for avatar
  const initials = user?.nombre
    ? user.nombre.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  const navItems = isAdmin
    ? [
        { to: '/admin/solicitudes', icon: <ClipboardList size={17} />, label: 'Gestión Solicitudes' },
      ]
    : [
        { to: '/alumno/tramites',     icon: <FileText size={17} />,     label: 'Catálogo Trámites' },
        { to: '/alumno/mis-tramites', icon: <ClipboardList size={17} />, label: 'Mis Trámites' },
        { to: '/alumno/perfil',       icon: <User size={17} />,          label: 'Mi Perfil' },
      ];

  return (
    <>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          {isAdmin ? <Shield size={20} /> : <FileText size={20} />}
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">EduGestor</span>
          <span className="sidebar-brand-sub">{isAdmin ? 'Admin Panel' : 'Portal Alumno'}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-section-label">Menú</div>
      <nav className="sidebar-nav" aria-label="Menú principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-chip">
          <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
          <div>
            <div className="sidebar-user-name">
              {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}
            </div>
            <div className="sidebar-user-role">
              {isAdmin ? 'Administrador' : 'Alumno'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
