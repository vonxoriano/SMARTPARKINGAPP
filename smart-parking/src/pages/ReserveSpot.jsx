import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import logo from '../assets/logo.png';
import wildcat from '../assets/wildcat.png';
import { ParkingContext } from '../context/ParkingContext';

export default function ReserveSpot() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reserveSpot } = useContext(ParkingContext);
  const queryParams = new URLSearchParams(location.search);
  
  const vehicle = queryParams.get('vehicle') || 'CAR';
  const area = queryParams.get('area') || 'RTL';
  const spotId = queryParams.get('spotId') || '1';
  
  // Format current time
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `${hours}:${minutes}${ampm}`;

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

      {/* RESERVATION INFO CARD */}
      <div className="glass-card" style={{ padding: '30px' }}>
        <div className="reserve-content-wrapper">
          <div className="reserve-info">
            <div className="reserve-info-row">
              <span className="reserve-info-label">VEHICLE:</span>
              <span className="reserve-info-value">{vehicle}</span>
            </div>
            
            <div className="reserve-info-row">
              <span className="reserve-info-label">AREA:</span>
              <span className="reserve-info-value">{area.replace(' AREA', '')}</span>
            </div>
            
            <div className="reserve-info-row">
              <span className="reserve-info-label">TIME:</span>
              <span className="reserve-info-value">{timeString}</span>
            </div>

            <div className="reserve-reminder">
              REMINDER: Your reservation only last for 15 mins
            </div>
          </div>

          <img src={wildcat} alt="wildcat" className="reserve-logo" />
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="reserve-actions">
        <button onClick={() => navigate(-1)}>BACK</button>
        <button onClick={() => {
          reserveSpot(area, spotId, vehicle, timeString);
          navigate('/success-reservation');
        }}>RESERVE</button>
      </div>
    </div>
  );
}
