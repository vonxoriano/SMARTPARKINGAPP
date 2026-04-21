import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Car, Bike, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingContext } from '../context/ParkingContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { parkingAreas } = useContext(ParkingContext);

  const getCounts = (spots) => {
    const total = spots.length;
    const taken = spots.filter(s => s.status === 'taken').length;
    return `${taken}/${total}`;
  };

  const isAreaAvailable = (spots) => {
    return spots.some(s => s.status === 'vacant');
  };

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
        <button className="active">DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* AVAILABLE SPOTS */}
      <div className="glass-card">
        <h2>AVAILABLE SPOTS</h2>

        {parkingAreas.map((area) => {
          const available = isAreaAvailable(area.spots);

          return (
            <div key={area.name} className="area-card">
              <div className="area-header">
                <span>{area.name}</span>
                <span className={available ? 'green' : 'red'}>
                  {available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="spot-row">
                <div>
                  <Bike size={14} /> Motorcycle — {getCounts(area.spots)}
                </div>
                <div>
                  <Car size={14} /> Car — {getCounts(area.spots)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button onClick={() => navigate('/reservations')}>
          <MapPin size={18} /> Reserve Spot
        </button>

        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>Parking availability updates in real-time.</p>
      </div>
    </div>
  );
}