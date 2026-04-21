import { useContext, useEffect, useState } from 'react';
import { ParkingContext } from '../context/ParkingContext';
import { useNavigate } from 'react-router-dom';

export default function MyReservations() {
  const { reservations, cancelReservation } = useContext(ParkingContext);
  const navigate = useNavigate();

  // 🔄 force re-render every second for countdown updates
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⏱ countdown logic
  const getTimeLeft = (expiresAt) => {
    if (!expiresAt) return 'N/A';

    const diff = expiresAt - Date.now();

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 🎨 UI helper for expired
  const isExpired = (expiresAt) => {
    return expiresAt && expiresAt <= Date.now();
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h2>My Reservations</h2>

      {reservations.length === 0 ? (
        <p>No active reservations.</p>
      ) : (
        reservations.map((res) => (
          <div
            key={res.id}
            className="area-card"
            style={{
              marginTop: 10,
              opacity: isExpired(res.expiresAt) ? 0.5 : 1,
              borderLeft: isExpired(res.expiresAt)
                ? '3px solid red'
                : '3px solid green',
            }}
          >
            {/* HEADER */}
            <div className="area-header">
              <span>
                {res.vehicle} - {res.area}
              </span>

              <span>
                {isExpired(res.expiresAt)
                  ? 'EXPIRED'
                  : getTimeLeft(res.expiresAt)}
              </span>
            </div>

            {/* DETAILS */}
            <div className="spot-row" style={{ flexDirection: 'column' }}>
              <span>Date: {res.date}</span>
              <span>Time: {res.time}</span>
              <span>Spot ID: {res.spotId || 'N/A'}</span>
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: 10 }}>
              {!isExpired(res.expiresAt) && (
                <button
                  onClick={() => cancelReservation(res.id)}
                  style={{
                    background: '#8b4a4a',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    marginRight: 10,
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => navigate('/parking-map')}
                style={{
                  background: '#444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                View Map
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}