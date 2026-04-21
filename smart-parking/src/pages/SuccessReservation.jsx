import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import wildcat from '../assets/wildcat.png';

export default function SuccessReservation() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="nav-tabs">
        <button onClick={() => navigate('/')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* SUB NAVIGATION */}
      <div className="sub-nav">
        <button className="active-sub">RESERVE SPOT</button>
      </div>

      {/* SUCCESS INFO CARD */}
      <div className="glass-card" style={{ padding: '30px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '32px', lineHeight: '1.4', fontWeight: 'bold' }}>
              Your Reservation has been<br />
              booked <span style={{ color: '#00ff66' }}>Successfully!</span>
            </h2>
          </div>

          <img 
            src={wildcat} 
            alt="wildcat" 
            style={{ 
              width: '160px', 
              height: '160px', 
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              opacity: 0.9 
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/reservations')}
            style={{
              background: '#8b4a4a',
              color: 'gold',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            VIEW RESERVATION
          </button>
        </div>
      </div>
    </div>
  );
}
