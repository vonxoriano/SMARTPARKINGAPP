import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import { ParkingAPI, ReservationAPI } from '../api';
import Navbar from '../components/Navbar';

export default function ParkingMap() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [parkingAreas, setParkingAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const loadAreas = async () => {
    try {
      const areas = await ParkingAPI.getAllAreas();
      setParkingAreas(areas);
    } catch (err) {
      console.error('Failed to load parking areas:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAndExpireReservations = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      if (!currentUser.id) return;
      const reservations = await ReservationAPI.getByUser(currentUser.id, 'RESERVED');
      const now = Date.now();
      for (const r of reservations) {
        if (!r.reservedAt) continue;
        const duration = Number(sessionStorage.getItem('reservationDuration') || 3600000);
        const expiry = new Date(r.reservedAt).getTime() + duration;
        if (now > expiry) {
          await ReservationAPI.expire(r.id);
        }
      }
    } catch (err) {
      console.error('Expire check failed:', err);
    }
  };

  useEffect(() => {
    loadAreas();
    const interval = setInterval(async () => {
      await checkAndExpireReservations();
      await loadAreas();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSpotClick = (areaId, spot) => {
    if (spot.status !== 'vacant') return;
    if (selectedSpot?.areaId === areaId && selectedSpot?.spotId === spot.id) {
      setSelectedSpot(null);
    } else {
      setSelectedSpot({ areaId, spotId: spot.id });
    }
  };

  const handleReserve = (area) => {
    if (!selectedVehicle) { alert('Please choose a vehicle type first!'); return; }
    if (!selectedSpot || selectedSpot.areaId !== area.id) { alert('Please click on an available (green) spot in this area first!'); return; }
    sessionStorage.setItem('selectedVehicle', selectedVehicle);
    sessionStorage.setItem('selectedArea', area.name);
    sessionStorage.setItem('selectedSpotId', String(selectedSpot.spotId));
    navigate('/reserve-spot');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="glass-card"><p style={{ color: '#ccc' }}>Loading parking map…</p></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* LEGEND */}
      <div className="glass-card">
        <h2>Legend</h2>
        <div className="spot-row">
          <span style={{ color: 'lightgreen' }}>● Vacant</span>
          <span style={{ color: '#f0c040' }}>● Reserved</span>
          <span style={{ color: '#ff6b6b' }}>● Occupied</span>
          <span style={{ color: '#76ff03' }}>● Selected</span>
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
        const vacantCount = area.vacantSpots;
        const totalCount  = area.totalSpots;
        const pct = totalCount > 0 ? (vacantCount / totalCount) * 100 : 0;
        const hasSelectionHere = selectedSpot?.areaId === area.id;

        return (
          <div key={area.id} className="glass-card"
            style={{ border: hasSelectionHere ? '2px solid #ffe066' : '2px solid transparent', transition: 'border 0.2s' }}
          >
            <div className="area-header">
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{area.name}</span>
              <button
                onClick={() => handleReserve(area)}
                style={{
                  background: vacantCount > 0 ? '#4a8b4a' : '#666',
                  border: 'none', color: 'white',
                  padding: '6px 14px', borderRadius: '8px',
                  cursor: vacantCount > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                }}
              >
                {vacantCount > 0 ? 'RESERVE' : 'FULL'}
              </button>
            </div>

            {hasSelectionHere && (
              <p style={{ margin: '6px 0 0', color: '#ffe066', fontSize: '13px', fontWeight: 'bold' }}>
                ✅ Spot selected — click RESERVE to confirm.
              </p>
            )}

            {/* SPOT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', marginTop: '10px' }}>
              {area.spots.map((spot) => {
                const isHighlighted = selectedSpot?.areaId === area.id && selectedSpot?.spotId === spot.id;
                let bgColor;
                if (isHighlighted)             bgColor = '#76ff03';
                else if (spot.status === 'vacant')   bgColor = '#2d8b2d';
                else if (spot.status === 'reserved') bgColor = '#f0c040';
                else                                 bgColor = '#cc3333';

                return (
                  <div
                    key={spot.id}
                    title={`Slot ${spot.slotNumber} — ${spot.status}`}
                    onClick={() => handleSpotClick(area.id, spot)}
                    style={{
                      width: '100%', paddingTop: '100%', borderRadius: '6px',
                      background: bgColor,
                      opacity: spot.status === 'vacant' && !isHighlighted ? 0.85 : 1,
                      cursor: spot.status === 'vacant' ? 'pointer' : 'default',
                      outline: isHighlighted ? '3px solid #fff' : 'none',
                      outlineOffset: '2px',
                      boxShadow: isHighlighted ? '0 0 14px 6px rgba(180,255,40,0.85)' : 'none',
                      transform: isHighlighted ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform 0.15s, box-shadow 0.15s, background 0.2s',
                      position: 'relative', zIndex: isHighlighted ? 2 : 1,
                    }}
                  />
                );
              })}
            </div>

            {/* STATS + PROGRESS BAR */}
            <div className="spot-row" style={{ marginTop: 10 }}>
              <span style={{ color: 'lightgreen' }}>Vacant: {area.spots.filter(s => s.status === 'vacant').length}</span>
              <span style={{ color: '#f0c040' }}>Reserved: {area.spots.filter(s => s.status === 'reserved').length}</span>
              <span style={{ color: '#cc3333' }}>Occupied: {area.spots.filter(s => s.status === 'taken').length}</span>
            </div>

            <div className="progress-wrap" style={{ marginTop: '8px' }}>
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <p style={{ fontSize: '11px', color: '#ccc', marginTop: '4px' }}>
              {pct.toFixed(0)}% available ({vacantCount}/{totalCount})
            </p>
          </div>
        );
      })}
    </div>
  );
}