import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, MapPin, Clock, Calendar } from 'lucide-react';
import { addNotification } from '../notificationUtils';
import { ReservationAPI } from '../api';
import Navbar from '../components/Navbar';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function nowTimeStr() {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  return d.toTimeString().slice(0, 5);
}

export default function ReserveSpot() {
  const navigate = useNavigate();
  const savedVehicle = sessionStorage.getItem('selectedVehicle') || '';
  const savedArea    = sessionStorage.getItem('selectedArea')   || '';
  const savedSpotId  = parseInt(sessionStorage.getItem('selectedSpotId') || '0', 10);

  const [date, setDate]         = useState(todayStr());
  const [time, setTime]         = useState(nowTimeStr());
  const [duration, setDuration] = useState(3600000);
  const [loading, setLoading]   = useState(false);   // ← was missing
  const [error, setError]       = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (e.target.value === todayStr()) {
      if (time < nowTimeStr()) setTime(nowTimeStr());
    }
  };

  const handleConfirm = async () => {
    if (!date || !time) { alert('Please select both a date and time!'); return; }

    const chosen = new Date(`${date}T${time}`);
    if (chosen < new Date()) {
      setError('Please choose a current or future date and time.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      if (!currentUser.id) throw new Error('Not logged in. Please log in first.');

      const reservation = await ReservationAPI.create({
        userId:        currentUser.id,
        spotId:        savedSpotId,
        vehicle:       savedVehicle.toUpperCase(),
        date,
        time,
        durationHours: 1,
        durationMs:    duration,
      });

      sessionStorage.setItem('lastReservation', JSON.stringify(reservation));
      sessionStorage.setItem('reservationDuration', duration);

      addNotification({
        type: 'reservation_confirmed',
        title: 'Reservation Confirmed',
        message: `Your ${reservation.vehicle} spot at ${reservation.areaName} is reserved for ${reservation.date} at ${reservation.time}.`,
        reservationId: reservation.id,
      });

      navigate('/reservation-success');
    } catch (err) {
      setError(err.message || 'Reservation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', marginTop: '5px', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: '#2a1a1a',
    color: 'white', fontSize: '14px',
    colorScheme: 'dark',
  };
  const selectionBox = {
    background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '14px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', minWidth: '100px',
  };

  return (
    <div>
      <Navbar />

      <div className="glass-card">
        <h2 style={{ fontSize: '20px', marginBottom: '5px' }}>📋 Reserve a Spot</h2>
        <p style={{ fontSize: '13px', color: '#ccc' }}>Confirm your vehicle and area, then pick a time.</p>
      </div>

      <div className="glass-card">
        <h2>Your Selection</h2>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
          <div style={selectionBox}>
            {savedVehicle === 'car' ? <Car size={28} /> : <Bike size={28} />}
            <span style={{ fontWeight: 'bold', marginTop: '5px' }}>{savedVehicle === 'car' ? 'Car' : 'Motorcycle'}</span>
            <span style={{ fontSize: '11px', color: '#ccc' }}>Vehicle</span>
          </div>
          <div style={selectionBox}>
            <MapPin size={28} />
            <span style={{ fontWeight: 'bold', marginTop: '5px' }}>{savedArea || 'N/A'}</span>
            <span style={{ fontSize: '11px', color: '#ccc' }}>Area</span>
          </div>
        </div>
        <button onClick={() => navigate('/parking-map')}
          style={{ marginTop: '12px', background: 'transparent', border: '1px solid #ccc', color: '#ccc', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
          ← Change Selection
        </button>
      </div>

      <div className="glass-card">
        <h2>Pick Date & Time</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <div>
            <label style={{ fontSize: '13px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> Date
            </label>
            <input type="date" value={date} min={todayStr()} onChange={handleDateChange} style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> Time
            </label>
            <input type="time" value={time} min={date === todayStr() ? nowTimeStr() : undefined}
              onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          </div>

          {/* Single dropdown — no duplicate */}
          <div>
            <label style={{ fontSize: '13px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> Time Duration
            </label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={inputStyle}>
              <option value={10000}>10 seconds (testing)</option>
              <option value={3600000}>1 hour</option>
            </select>
          </div>

        </div>
      </div>

      {error && <div className="glass-card" style={{ color: '#ff6b6b' }}>⚠ {error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button onClick={handleConfirm} disabled={loading}
          style={{ background: 'gold', color: 'black', border: 'none', padding: '12px 40px', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Reserving…' : '✅ Confirm Reservation'}
        </button>
      </div>
    </div>
  );
}