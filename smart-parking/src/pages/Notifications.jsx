import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Car, Bike, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
const notifications = [
  { id: 1, title: 'RTL Area Unavailable', message: 'RTL area is currently closed for maintenance.', time: '2 hours ago', read: false },
  { id: 2, title: 'Reservation Confirmed', message: 'Your parking spot at OPEN AREA has been reserved.', time: '1 day ago', read: true },
  { id: 3, title: 'Reservation Expiring', message: 'Your reservation will expire in 15 minutes.', time: '2 days ago', read: true },
];

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* NAVIGATION */}
      <div className="nav-tabs">
        <button onClick={() => navigate('/')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button className="active">NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* NOTIFICATIONS CARD */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>All Notifications</h2>
          <button style={{
            background: '#8b4a4a',
            border: 'none',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Mark all as read
          </button>
        </div>

        {/* LIST */}
        <div style={{ marginTop: 10 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="area-card"
              style={{
                borderLeft: n.read ? '3px solid transparent' : '3px solid gold'
              }}
            >
              {/* TITLE ROW */}
              <div className="area-header">
                <span>{n.title}</span>
                {!n.read && <span className="red">NEW</span>}
              </div>

              {/* MESSAGE */}
              <div className="spot-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{n.message}</span>

                <div style={{ display: 'flex', gap: 6, marginTop: 5, fontSize: 12, opacity: 0.8 }}>
                  <Clock size={12} />
                  <span>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="glass-card">
        <h2>Stats</h2>

        <div className="area-card">
          <div className="area-header">
            <span><Car size={14} /> Car Reservations</span>
            <span className="green">5</span>
          </div>
        </div>

        <div className="area-card">
          <div className="area-header">
            <span><Bike size={14} /> Motorcycle</span>
            <span className="green">3</span>
          </div>
        </div>

        <div className="area-card">
          <div className="area-header">
            <span><MapPin size={14} /> Areas Visited</span>
            <span className="green">8</span>
          </div>
        </div>
      </div>
    </div>
  );
}