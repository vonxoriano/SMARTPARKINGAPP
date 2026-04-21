import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import logo from '../assets/logo.png';

const generateSpots = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status:
      Math.random() > 0.7
        ? 'taken'
        : Math.random() > 0.9
        ? 'reserved'
        : 'vacant',
  }));

const initialAreas = [
  { name: 'RTL AREA', spots: generateSpots(20) },
  { name: 'OPEN AREA', spots: generateSpots(20) },
  { name: 'BACKGATE', spots: generateSpots(20) },
];

export default function ParkingMap() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [parkingAreas] = useState(initialAreas);

  const handleReserve = (areaName) => {
    if (!selectedVehicle) {
      alert('Please choose a vehicle type first!');
      return;
    }
    setSelectedArea(areaName);
    // Save to sessionStorage so ReserveSpot page can read it
    sessionStorage.setItem('selectedVehicle', selectedVehicle);
    sessionStorage.setItem('selectedArea', areaName);
    navigate('/reserve-spot');
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
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button className="active">PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* LEGEND */}
      <div className="glass-card">
        <h2>Legend</h2>
        <div className="spot-row">
          <span className="green">● Vacant</span>
          <span className="red">● Taken</span>
          <span style={{ color: 'gold' }}>● Reserved</span>
        </div>
      </div>

      {/* VEHICLE SELECT */}
      <div className="glass-card">
        <h2>Choose Vehicle</h2>
        <div className="action-row">
          <button
            onClick={() => setSelectedVehicle('car')}
            style={{
              background: selectedVehicle === 'car' ? 'gold' : '#8b4a4a',
              color: selectedVehicle === 'car' ? 'black' : 'white',
              border: selectedVehicle === 'car' ? '2px solid white' : 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s',
            }}
          >
            <Car size={18} /> Car
          </button>

          <button
            onClick={() => setSelectedVehicle('motorcycle')}
            style={{
              background: selectedVehicle === 'motorcycle' ? 'gold' : '#8b4a4a',
              color: selectedVehicle === 'motorcycle' ? 'black' : 'white',
              border: selectedVehicle === 'motorcycle' ? '2px solid white' : 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s',
            }}
          >
            <Bike size={18} /> Motorcycle
          </button>
        </div>

        {selectedVehicle && (
          <p style={{ marginTop: '10px', color: 'lightgreen', fontWeight: 'bold' }}>
            ✅ Selected: {selectedVehicle === 'car' ? '🚗 Car' : '🏍️ Motorcycle'}
          </p>
        )}
      </div>

      {/* PARKING AREAS */}
      {parkingAreas.map((area) => {
        const vacantCount = area.spots.filter((s) => s.status === 'vacant').length;
        const isSelected = selectedArea === area.name;
        return (
          <div
            key={area.name}
            className="glass-card"
            style={{
              border: isSelected ? '2px solid gold' : '2px solid transparent',
              transition: 'border 0.2s',
            }}
          >
            <div className="area-header">
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{area.name}</span>
              <button
                onClick={() => handleReserve(area.name)}
                style={{
                  background: vacantCount > 0 ? '#4a8b4a' : '#666',
                  border: 'none',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: vacantCount > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                }}
              >
                {vacantCount > 0 ? 'RESERVE' : 'FULL'}
              </button>
            </div>

            {/* GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '6px',
                marginTop: '10px',
              }}
            >
              {area.spots.map((spot) => (
                <div
                  key={spot.id}
                  title={`Spot ${spot.id} - ${spot.status}`}
                  style={{
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '6px',
                    background:
                      spot.status === 'vacant'
                        ? 'green'
                        : spot.status === 'taken'
                        ? 'red'
                        : 'gold',
                    opacity: spot.status === 'vacant' ? 0.8 : 1,
                    cursor: spot.status === 'vacant' ? 'pointer' : 'default',
                  }}
                />
              ))}
            </div>

            {/* STATS */}
            <div className="spot-row" style={{ marginTop: 10 }}>
              <span className="green">
                Vacant: {area.spots.filter((s) => s.status === 'vacant').length}
              </span>
              <span className="red">
                Taken: {area.spots.filter((s) => s.status === 'taken').length}
              </span>
              <span style={{ color: 'gold' }}>
                Reserved: {area.spots.filter((s) => s.status === 'reserved').length}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
