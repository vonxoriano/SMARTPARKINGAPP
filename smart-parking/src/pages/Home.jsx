import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Car, Bike } from 'lucide-react';
import logo from '../assets/logo.png';
const areas = [
  { name: 'RTL Area', status: 'unavailable', moto: '0/50', car: '0/50' },
  { name: 'Open Area', status: 'available', moto: '10/50', car: '0/50' },
  { name: 'Backgate', status: 'available', moto: '0/50', car: '0/50' },
];

export default function Home() {
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
        <button className="active">HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* AVAILABLE SPOTS */}
      <div className="glass-card">
        <h2>Available Spots</h2>

        <div className="spots-number">
          20<span>/300</span>
        </div>

        <div className="progress-wrap">
          <div className="progress-bar"></div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button onClick={() => navigate('/dashboard')}>
          <MapPin size={18} /> Reserve Spot
        </button>

        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>

        <button onClick={() => navigate('/reservations')}>
          <Calendar size={18} /> My Reservations
        </button>
      </div>

      {/* PARKING AREAS */}
      <div className="glass-card">
        <h2>Parking Areas</h2>

        {areas.map((area) => (
          <div key={area.name} className="area-card">
            <div className="area-header">
              <span>{area.name}</span>
              <span className={area.status === 'available' ? 'green' : 'red'}>
                {area.status === 'available' ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="spot-row">
              <div>
                <Bike size={14} /> Motorcycle — {area.moto}
              </div>

              <div>
                <Car size={14} /> Car — {area.car}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>RTL area currently unavailable</p>
      </div>
    </div>
  );
}