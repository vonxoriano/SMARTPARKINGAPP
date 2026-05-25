import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { ParkingAPI } from '../api';
import AnnouncementsCard from '../components/AnnouncementsCard';
import Navbar from '../components/Navbar';

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

  const totalSpots    = parkingAreas.reduce((sum, area) => sum + area.totalSpots, 0);
  const totalVacant   = parkingAreas.reduce((sum, area) => sum + area.vacantSpots, 0);
  const totalOccupied = totalSpots - totalVacant;
  const progressPct   = totalSpots > 0 ? (totalOccupied / totalSpots) * 100 : 0;

  return (
    <div>
      <Navbar />

      {/* AVAILABLE SPOTS */}
      <div className="glass-card">
        <h2>Occupied Spots</h2>
        {loading ? (
          <p style={{ color: '#ccc' }}>Loading…</p>
        ) : (
          <>
            <div className="spots-number">
              {totalOccupied}<span>/{totalSpots}</span>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar" style={{ width: `${progressPct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#ccc' }}>
              <span>🟢 Available: {totalVacant}</span>
              <span>🔴 Occupied: {totalOccupied}</span>
            </div>
          </>
        )}
      </div>

      <div className="glass-card">
        <h2>Von Soriano</h2>
        <p>Developer</p>
        <p>Cebu Institute of Technology University</p>
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

      <AnnouncementsCard />
    </div>
  );
}