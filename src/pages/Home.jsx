import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Car, Bike } from 'lucide-react';
import logo from '../assets/logo.png';

const STATIC_AREAS = [
  {
    name: 'RTL AREA',
    spots: [
      't','t','t','t','t','t','t','v','v','v',
      't','t','t','v','t','t','t','v','v','v',
    ].map((s, i) => ({ id: i + 1, status: s === 'v' ? 'vacant' : s === 't' ? 'taken' : 'reserved' })),
  },
  {
    name: 'OPEN AREA',
    spots: [
      'v','t','v','v','v','t','v','v','v','t',
      't','t','v','t','t','v','v','t','t','t',
    ].map((s, i) => ({ id: i + 1, status: s === 'v' ? 'vacant' : s === 't' ? 'taken' : 'reserved' })),
  },
  {
    name: 'BACKGATE',
    spots: [
      'v','t','t','v','v','v','t','v','t','v',
      'v','t','v','t','v','v','t','t','v','v',
    ].map((s, i) => ({ id: i + 1, status: s === 'v' ? 'vacant' : s === 't' ? 'taken' : 'reserved' })),
  },
];

const loadAreas = () => {
  try {
    const saved = localStorage.getItem('parkingAreas');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return STATIC_AREAS;
};

export default function Home() {
  const navigate = useNavigate();
  const [parkingAreas, setParkingAreas] = useState(loadAreas);

  useEffect(() => {
    setParkingAreas(loadAreas());
    const handleUpdate = () => setParkingAreas(loadAreas());
    window.addEventListener('parkingAreasUpdated', handleUpdate);
    return () => window.removeEventListener('parkingAreasUpdated', handleUpdate);
  }, []);

  const totalVacant = parkingAreas.reduce((sum, area) => {
    return sum + area.spots.filter((s) => s.status === 'vacant').length;
  }, 0);
  const totalSpots = parkingAreas.reduce((sum, area) => sum + area.spots.length, 0);

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
          {totalVacant}<span>/{totalSpots}</span>
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

        {parkingAreas.map((area) => {
          const vacantCount = area.spots.filter((s) => s.status === 'vacant').length;
          const isAvailable = vacantCount > 0;
          return (
            <div key={area.name} className="area-card">
              <div className="area-header">
                <span>{area.name}</span>
                <span className={isAvailable ? 'green' : 'red'}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="spot-row">
                <div style={{ fontWeight: 'bold', color: isAvailable ? '#76ff03' : 'red' }}>
                  Vacant: {vacantCount}/{area.spots.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>RTL area currently unavailable</p>
      </div>
    </div>
  );
}