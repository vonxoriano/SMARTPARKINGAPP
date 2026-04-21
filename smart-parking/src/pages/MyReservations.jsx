import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingContext } from '../context/ParkingContext';

export default function MyReservations() {
  const navigate = useNavigate();
  const { reservations, cancelReservation } = useContext(ParkingContext);

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
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button onClick={() => navigate('/dashboard')}>
          <MapPin size={18} /> Reserve Spot
        </button>

        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>
      </div>

      {/* RESERVATIONS */}
      <div className="glass-card">
        <h2>My Reservations</h2>

        {reservations.length > 0 ? (
          reservations.map((r) => (
            <div key={r.id} className="area-card" style={{ position: 'relative' }}>
              
              <button 
                onClick={() => cancelReservation(r.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                DELETE
              </button>

              {/* TOP INFO */}
              <div className="area-header">
                <span>{r.vehicle}</span>
                <span className="green">{r.status}</span>
              </div>

              {/* DETAILS */}
              <div className="spot-row">
                <div>Area: {r.area}</div>
                <div>Time: {r.time}</div>
              </div>

              <div className="spot-row">
                <div>Date: {r.date}</div>
                <div>Minutes Left: {r.minutesLeft}</div>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress-wrap" style={{ marginTop: '10px' }}>
                <div className="progress-bar" style={{ width: '70%' }}></div>
              </div>

            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>No reservations yet</p>
            <button onClick={() => navigate('/dashboard')}>
              Reserve Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}