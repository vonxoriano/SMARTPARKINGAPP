import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { ParkingAPI } from '../api';
import AnnouncementsCard from '../components/AnnouncementsCard';
import Navbar from '../components/Navbar';

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
      <Navbar />

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

                <div className="spot-row" style={{ marginTop: '6px' }}>
                  <span style={{ color: '#76ff03', fontWeight: 'bold' }}>
                    🟢 Available: {area.vacantSpots}/{area.totalSpots}
                  </span>
                  <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    🔴 Occupied: {occupied}/{area.totalSpots}
                  </span>
                </div>

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

      <AnnouncementsCard />
    </div>
  );
}