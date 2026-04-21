import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Clock, Car, Bike, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingContext } from '../context/ParkingContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAllAsRead, reservations } = useContext(ParkingContext);

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

      {/* NOTIFICATIONS */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>All Notifications</h2>
          <button
            onClick={markAllAsRead}
            style={{
              background: '#8b4a4a',
              border: 'none',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Mark all as read
          </button>
        </div>

        {/* LIST */}
        <div style={{ marginTop: 10 }}>
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="area-card"
                style={{
                  borderLeft: n.read ? '3px solid transparent' : '3px solid gold'
                }}
              >
                {/* TITLE */}
                <div className="area-header">
                  <span>{n.title}</span>
                  {!n.read && <span className="red">NEW</span>}
                </div>

                {/* MESSAGE */}
                <div
                  className="spot-row"
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <span>{n.message}</span>

                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      marginTop: 5,
                      fontSize: 12,
                      opacity: 0.8
                    }}
                  >
                    <Clock size={12} />
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="glass-card">
        <h2>Stats</h2>

        <div className="area-card">
          <div className="area-header">
            <span><Car size={14} /> Car Reservations</span>
            <span className="green">
              {reservations.filter(r => r.vehicle === 'CAR').length}
            </span>
          </div>
        </div>

        <div className="area-card">
          <div className="area-header">
            <span><Bike size={14} /> Motorcycle</span>
            <span className="green">
              {reservations.filter(r => r.vehicle === 'MOTORCYCLE').length}
            </span>
          </div>
        </div>

        <div className="area-card">
          <div className="area-header">
            <span><MapPin size={14} /> Areas Visited</span>
            <span className="green">
              {new Set(reservations.map(r => r.area)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}