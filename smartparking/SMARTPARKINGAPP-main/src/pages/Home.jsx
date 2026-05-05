import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingAPI } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [parkingAreas, setParkingAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const areas = await ParkingAPI.getAllAreas();
        setParkingAreas(areas);
      } catch (err) {
        console.error('Failed to load parking areas:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalSpots  = parkingAreas.reduce((sum, area) => sum + area.totalSpots, 0);
  const totalVacant = parkingAreas.reduce((sum, area) => sum + area.vacantSpots, 0);
  const totalOccupied = totalSpots - totalVacant;
  // progress bar grows as spots get taken
  const progressPct = totalSpots > 0 ? (totalOccupied / totalSpots) * 100 : 0;

  return (
    <div>
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      <div className="nav-tabs">
        <button className="active">HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* AVAILABLE SPOTS */}
      <div className="glass-card">
        <h2>Occupied Spots</h2>
        {loading ? (
          <p style={{ color: '#ccc' }}>Loading…</p>
        ) : (
          <>
            {/* shows occupied / total e.g. 1/60 */}
            <div className="spots-number">
              {totalOccupied}<span>/{totalSpots}</span>
            </div>

            {/* bar grows as more spots are taken */}
            <div className="progress-wrap">
              <div
                className="progress-bar"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#ccc' }}>
              <span>🟢 Available: {totalVacant}</span>
              <span>🔴 Occupied: {totalOccupied}</span>
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> Reserve Spot
        </button>
        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>
        <button onClick={() => navigate('/reservations')}>
          <Calendar size={18} /> My Reservations
        </button>
      </div>

      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>RTL area currently unavailable</p>
      </div>
    </div>
  );
}
