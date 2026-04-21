import { useNavigate } from 'react-router-dom';
import { Car, Bike, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
const parkingAreas = [
  {
    name: 'RTL AREA',
    status: 'unavailable',
    spots: [
      { type: 'Motorcycle', icon: Bike, count: '2/50' },
      { type: 'Car', icon: Car, count: '0/50' }
    ]
  },
  {
    name: 'OPEN AREA',
    status: 'available',
    spots: [
      { type: 'Motorcycle', icon: Bike, count: '10/50' },
      { type: 'Car', icon: Car, count: '0/50' }
    ]
  },
  {
    name: 'BACKGATE',
    status: 'available',
    spots: [
      { type: 'Motorcycle', icon: Bike, count: '0/50' },
      { type: 'Car', icon: Car, count: '0/50' }
    ]
  },
];

export default function Dashboard() {
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
        <button onClick={() => navigate('/home')}>HOME</button>
        <button className="active">DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* AVAILABLE SPOTS */}
      <div className="glass-card">
        <h2>AVAILABLE SPOTS</h2>

        {parkingAreas.map((area) => (
          <div key={area.name} className="area-card">
            <div className="area-header">
              <span>{area.name}</span>
              <span className={area.status === 'available' ? 'green' : 'red'}>
                {area.status === 'available' ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="spot-row">
              {area.spots.map((spot) => (
                <div key={spot.type}>
                  <spot.icon size={14} /> {spot.type} — {spot.count}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button onClick={() => navigate('/reservations')}>
          <MapPin size={18} /> View Reservations History
        </button>

        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>Backgate area currently unavailable</p>
      </div>
    </div>
  );
}