import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import logo from '../assets/logo.png';

// ─── STATIC fixed layout — never changes unless manually edited ────────────
// v = vacant, t = taken, r = reserved
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

// ─── Load from localStorage (so reservations persist on refresh) ──────────
const loadAreas = () => {
  try {
    const saved = localStorage.getItem('parkingAreas');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return STATIC_AREAS;
};

const saveAreas = (areas) => {
  localStorage.setItem('parkingAreas', JSON.stringify(areas));
};

export default function ParkingMap() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [parkingAreas, setParkingAreas] = useState(loadAreas);
  const [selectedSpot, setSelectedSpot] = useState(null); // { areaIndex, spotId }

  // Always reload from localStorage on mount (in case deletion happened on another page)
  useEffect(() => {
    setParkingAreas(loadAreas());
  }, []);

  // Listen for deletions that happened on MyReservations page
  useEffect(() => {
    const handleUpdate = () => setParkingAreas(loadAreas());
    window.addEventListener('parkingAreasUpdated', handleUpdate);
    return () => window.removeEventListener('parkingAreasUpdated', handleUpdate);
  }, []);

  // Click a vacant spot → highlight it (toggle off if same spot)
  const handleSpotClick = (areaIndex, spotId) => {
    const spot = parkingAreas[areaIndex].spots.find((s) => s.id === spotId);
    if (spot.status !== 'vacant') return;

    if (selectedSpot?.areaIndex === areaIndex && selectedSpot?.spotId === spotId) {
      setSelectedSpot(null);
    } else {
      setSelectedSpot({ areaIndex, spotId });
    }
  };

  // RESERVE button → turn selected spot red, save, navigate to form
  const handleReserve = (areaIndex) => {
    if (!selectedVehicle) {
      alert('Please choose a vehicle type first!');
      return;
    }
    if (!selectedSpot || selectedSpot.areaIndex !== areaIndex) {
      alert('Please click on an available (green) spot in this area first!');
      return;
    }

    const updated = parkingAreas.map((area, idx) => {
      if (idx !== selectedSpot.areaIndex) return area;
      return {
        ...area,
        spots: area.spots.map((s) =>
          s.id === selectedSpot.spotId ? { ...s, status: 'reserved' } : s
        ),
      };
    });

    setParkingAreas(updated);
    saveAreas(updated);        // ← persist so refresh keeps it red
    setSelectedSpot(null);

    sessionStorage.setItem('selectedVehicle', selectedVehicle);
    sessionStorage.setItem('selectedArea', parkingAreas[areaIndex].name);
    sessionStorage.setItem('selectedSpotId', String(selectedSpot.spotId)); // ← needed for delete
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
          <span className="green">● Vacant — click to select</span>
          <span className="red">● Taken / Reserved</span>
          <span style={{ color: '#ffe066' }}>● Selected</span>
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
      {parkingAreas.map((area, areaIndex) => {
        const vacantCount = area.spots.filter((s) => s.status === 'vacant').length;
        const hasSelectionHere = selectedSpot?.areaIndex === areaIndex;

        return (
          <div
            key={area.name}
            className="glass-card"
            style={{
              border: hasSelectionHere ? '2px solid #ffe066' : '2px solid transparent',
              transition: 'border 0.2s',
            }}
          >
            {/* Header + Reserve Button */}
            <div className="area-header">
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{area.name}</span>
              <button
                onClick={() => handleReserve(areaIndex)}
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

            {/* Selection hint */}
            {hasSelectionHere && (
              <p style={{ margin: '6px 0 0', color: '#ffe066', fontSize: '13px', fontWeight: 'bold' }}>
                ✅ Spot {selectedSpot.spotId} selected — click RESERVE to confirm.
              </p>
            )}

            {/* SPOT GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '6px',
                marginTop: '10px',
              }}
            >
              {area.spots.map((spot) => {
                const isHighlighted =
                  selectedSpot?.areaIndex === areaIndex &&
                  selectedSpot?.spotId === spot.id;

                // Color: vacant=green (bright lime if highlighted), taken/reserved=red
                let bgColor = 'red';
                if (spot.status === 'vacant') {
                  bgColor = isHighlighted ? '#76ff03' : 'green';
                }

                return (
                  <div
                    key={spot.id}
                    title={`Spot ${spot.id} — ${spot.status}`}
                    onClick={() => handleSpotClick(areaIndex, spot.id)}
                    style={{
                      width: '100%',
                      paddingTop: '100%',
                      borderRadius: '6px',
                      background: bgColor,
                      opacity: spot.status === 'vacant' && !isHighlighted ? 0.85 : 1,
                      cursor: spot.status === 'vacant' ? 'pointer' : 'default',
                      outline: isHighlighted ? '3px solid #fff' : 'none',
                      outlineOffset: '2px',
                      boxShadow: isHighlighted
                        ? '0 0 14px 6px rgba(180,255,40,0.85)'
                        : 'none',
                      transform: isHighlighted ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform 0.15s, box-shadow 0.15s, background 0.2s',
                      position: 'relative',
                      zIndex: isHighlighted ? 2 : 1,
                    }}
                  />
                );
              })}
            </div>

            {/* STATS */}
            <div className="spot-row" style={{ marginTop: 10 }}>
              <span className="green">
                Vacant: {area.spots.filter((s) => s.status === 'vacant').length}
              </span>
              <span className="red">
                Taken: {area.spots.filter((s) => s.status === 'taken').length}
              </span>
              <span style={{ color: '#ff6b6b' }}>
                Reserved: {area.spots.filter((s) => s.status === 'reserved').length}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
