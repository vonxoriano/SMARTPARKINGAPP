import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import logo from '../assets/logo.png';
import { ParkingContext } from '../context/ParkingContext';

export default function ParkingMap() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const { parkingAreas } = useContext(ParkingContext);

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
            className={selectedVehicle === 'car' ? 'active-btn' : ''}
          >
            <Car size={16} /> Car
          </button>

          <button
            onClick={() => setSelectedVehicle('motorcycle')}
            className={selectedVehicle === 'motorcycle' ? 'active-btn' : ''}
          >
            <Bike size={16} /> Motorcycle
          </button>
        </div>
      </div>

      {/* PARKING AREAS */}
      {parkingAreas.map((area) => (
        <div key={area.name} className="glass-card">
          <div className="area-header">
            <span>{area.name}</span>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#8b4a4a',
                border: 'none',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              RESERVE
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
                onClick={() => {
                  if (spot.status === 'vacant') {
                    navigate(`/reserve-spot?area=${encodeURIComponent(area.name)}&vehicle=${encodeURIComponent(selectedVehicle.toUpperCase())}&spotId=${spot.id}`);
                  }
                }}
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
                  opacity: spot.status === 'vacant' ? 0.7 : 1,
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
      ))}
    </div>
  );
}