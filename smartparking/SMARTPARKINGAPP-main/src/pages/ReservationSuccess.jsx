import { useNavigate } from 'react-router-dom';
import { CheckCircle, Car, Bike, MapPin, Clock, Calendar } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ReservationSuccess() {
  const navigate = useNavigate();
  const reservation = JSON.parse(sessionStorage.getItem('lastReservation') || '{}');

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* NAVIGATION */}
      <div className="nav-tabs">
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* SUCCESS CARD */}
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <div style={{ color: 'lightgreen', marginBottom: '10px' }}>
          <CheckCircle size={60} />
        </div>
        <h2 style={{ fontSize: '22px', color: 'lightgreen' }}>Reservation Confirmed!</h2>
        <p style={{ color: '#ccc', marginTop: '5px', fontSize: '14px' }}>
          Your parking spot has been successfully reserved.
        </p>
      </div>

      {/* RESERVATION DETAILS */}
      <div className="glass-card">
        <h2>Reservation Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>

          <div style={detailRow}>
            <span style={detailLabel}>
              {reservation.vehicle === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
              Vehicle
            </span>
            <span style={detailValue}>{reservation.vehicle}</span>
          </div>

          <div style={detailRow}>
            <span style={detailLabel}><MapPin size={16} /> Area</span>
            <span style={detailValue}>{reservation.area}</span>
          </div>

          <div style={detailRow}>
            <span style={detailLabel}><Calendar size={16} /> Date</span>
            <span style={detailValue}>{reservation.date}</span>
          </div>

          <div style={detailRow}>
            <span style={detailLabel}><Clock size={16} /> Time</span>
            <span style={detailValue}>{reservation.time}</span>
          </div>

          <div style={detailRow}>
            <span style={detailLabel}><Clock size={16} /> Duration</span>
            <span style={detailValue}>{reservation.duration} hour(s)</span>
          </div>

          <div style={detailRow}>
            <span style={detailLabel}>Status</span>
            <span style={{ ...detailValue, color: 'lightgreen', fontWeight: 'bold' }}>
              ● {reservation.status}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row" style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/reservations')}
          style={{ background: 'gold', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          📋 View My Reservations
        </button>

        <button
          onClick={() => navigate('/parking-map')}
          style={{ background: '#8b4a4a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🗺️ Back to Map
        </button>
      </div>
    </div>
  );
}

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '8px',
};

const detailLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#ccc',
  fontSize: '14px',
};

const detailValue = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
};
