import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = [
  { path: '/home',          label: 'HOME' },
  { path: '/dashboard',     label: 'DASHBOARD' },
  { path: '/parking-map',   label: 'PARKING MAP' },
  { path: '/notifications', label: 'NOTIFICATIONS' },
  { path: '/settings',      label: 'SETTINGS' },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* NAV TABS */}
      <div className="nav-tabs">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}