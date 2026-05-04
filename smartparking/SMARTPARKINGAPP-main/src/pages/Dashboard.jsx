import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingAPI } from '../api';

export default function Dashboard() {
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

  return (
    <div>
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>
      <div className="nav-tabs">
        <button onClick={() => navigate('/home')}>HOME</button>
        <button className="active">DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      <div className="glass-card">
        <h2>PARKING OVERVIEW</h2>
        {loading ? (
          <p style={{ color: '#ccc' }}>Loading…</p>
        ) : (
          parkingAreas.map((area) => {
            const occupied = area.totalSpots - area.vacantSpots;
            const pct = area.totalSpots > 0 ? (occupied / area.totalSpots) * 100 : 0;
            const isAvailable = area.vacantSpots > 0;

            return (
              <div key={area.id} className="area-card" style={{ marginBottom: '12px' }}>
                <div className="area-header">
                  <span style={{ fontWeight: 'bold' }}>{area.name}</span>
                  <span className={isAvailable ? 'green' : 'red'}>
                    {isAvailable ? 'Available' : 'Full'}
                  </span>
                </div>

                {/* Available & Occupied counts */}
                <div className="spot-row" style={{ marginTop: '6px' }}>
                  <span style={{ color: '#76ff03', fontWeight: 'bold' }}>
                    🟢 Available: {area.vacantSpots}/{area.totalSpots}
                  </span>
                  <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    🔴 Occupied: {occupied}/{area.totalSpots}
                  </span>
                </div>

                {/* Progress bar grows as spots are occupied */}
                <div className="progress-wrap" style={{ marginTop: '8px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${pct}%`,
                      background: pct > 80 ? '#ff4444' : pct > 50 ? '#ffaa00' : '#76ff03'
                    }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: '#ccc', marginTop: '4px' }}>
                  {pct.toFixed(0)}% occupied ({occupied}/{area.totalSpots})
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="action-row">
        <button onClick={() => navigate('/parking-map')}>
          <MapPin size={18} /> View Map
        </button>
      </div>

      <div className="glass-card announcement">
        <h2>Announcements</h2>
        <p>Backgate area currently unavailable</p>
      </div>
    </div>
  );
}
