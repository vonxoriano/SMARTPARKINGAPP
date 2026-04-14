import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Map,
  Bell,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

import logo from '../assets/logo.png'; 

const navItems = [
  { to: '/home', icon: Home, label: 'HOME' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
  { to: '/parking-map', icon: Map, label: 'PARKING MAP' },
  { to: '/notifications', icon: Bell, label: 'NOTIFICATIONS' },
  { to: '/settings', icon: Settings, label: 'SETTINGS' },
];

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <aside className="sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">
  <div className="sidebar-logo-inner">
    <img src={logo} alt="Logo" className="sidebar-logo-img" />
  </div>

  <div>
    <div className="sidebar-logo-title">Smart Parking</div>
    <div className="sidebar-logo-subtitle">CIT-U System</div>
  </div>
</div>

        {/* NAV */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* USER */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              <User size={16} />
            </div>

            <div>
              <div className="user-name">John Doe</div>
              <div className="user-id">12-3456-789</div>
            </div>
          </div>

          <button className="btn-logout" onClick={() => navigate('/')}>
            <LogOut size={16} />
            <span>LOG OUT</span>
          </button>
        </div>

      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}