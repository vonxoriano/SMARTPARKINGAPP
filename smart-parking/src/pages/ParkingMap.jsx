import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import { Car, Bike } from 'lucide-react';

const generateSpots = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: Math.random() > 0.7 ? 'taken' : Math.random() > 0.9 ? 'reserved' : 'vacant',
  }));

const initialAreas = [
  { name: 'RTL AREA', spots: generateSpots(20) },
  { name: 'OPEN AREA', spots: generateSpots(20) },
  { name: 'BACKGATE', spots: generateSpots(20) },
];

export default function ParkingMap() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [parkingAreas] = useState(initialAreas);

  return (
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">Parking Map</h1>
          <p className="card-subtitle">View parking areas and spot availability.</p>
        </div>

        <div className="card">
          <div className="section-title">LEGEND</div>
          <div className="legend-row">
            <div className="legend-item"><div className="legend-dot dot-vacant"></div>Vacant</div>
            <div className="legend-item"><div className="legend-dot dot-taken"></div>Taken</div>
            <div className="legend-item"><div className="legend-dot dot-reserved"></div>Reserved</div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">CHOOSE VEHICLE</div>
          <div className="vehicle-toggle">
            <button
              className={`btn-vehicle ${selectedVehicle === 'car' ? 'active' : 'inactive'}`}
              onClick={() => setSelectedVehicle('car')}
            >
              <Car size={16} /><span>CAR</span>
            </button>
            <button
              className={`btn-vehicle ${selectedVehicle === 'motorcycle' ? 'active' : 'inactive'}`}
              onClick={() => setSelectedVehicle('motorcycle')}
            >
              <Bike size={16} /><span>MOTORCYCLE</span>
            </button>
          </div>
        </div>

        <div className="page-space">
          <h2 style={{ color: '#1E1E2E', fontSize: 14, fontWeight: 600 }}>PARKING AREAS</h2>
          {parkingAreas.map((area) => (
            <div key={area.name} className="card">
              <div className="map-area-header">
                <span style={{ color: '#E8E4F0', fontWeight: 500, fontSize: 14 }}>{area.name}</span>
                <button className="btn-reserve" onClick={() => navigate('/dashboard')}>RESERVE</button>
              </div>
              <div className="spot-grid">
                {area.spots.map((spot) => (
                  <button
                    key={spot.id}
                    disabled={spot.status !== 'vacant'}
                    className={`spot-cell ${spot.status}`}
                    title={`Spot ${spot.id} - ${spot.status}`}
                  />
                ))}
              </div>
              <div className="spot-stats">
                <span className="stat-green">Vacant: {area.spots.filter(s => s.status === 'vacant').length}</span>
                <span className="stat-purple">Taken: {area.spots.filter(s => s.status === 'taken').length}</span>
                <span className="stat-yellow">Reserved: {area.spots.filter(s => s.status === 'reserved').length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
