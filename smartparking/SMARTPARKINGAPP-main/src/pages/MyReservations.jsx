import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Bike, Search, Filter, Clock } from 'lucide-react';
import { addNotification } from '../notificationUtils';
import { ReservationAPI } from '../api';
import Navbar from '../components/Navbar';

// Countdown timer — counts down to reservedAt + 1 hour
function useCountdown(reservedAt) {
  const getSecondsLeft = useCallback(() => {
    if (!reservedAt) return 0;
    const duration = Number(sessionStorage.getItem('reservationDuration') || 3600000);
    const expiry = new Date(reservedAt).getTime() + duration;
    return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
  }, [reservedAt]);

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft(getSecondsLeft()), 1000);
    return () => clearInterval(id);
  }, [getSecondsLeft]);

  return secondsLeft;
}

// Individual card with countdown + action buttons
function ReservationCard({ r, onArrive, onExit, onCancel, onDelete }) {
  const secondsLeft = useCountdown(r.status === 'RESERVED' ? r.reservedAt : null);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const timerExpired = secondsLeft === 0 && r.status === 'RESERVED';

  const statusColor = {
    RESERVED:  '#f0c040',
    OCCUPIED:  'lightgreen',
    EXPIRED:   '#ff6b6b',
    COMPLETED: '#aaa',
    CANCELLED: '#ff6b6b',
  }[r.status] || '#ccc';

  const isActive = r.status === 'RESERVED' || r.status === 'OCCUPIED';

  return (
    <div className="area-card" style={{ marginBottom: '10px' }}>
      <div className="area-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
          {r.vehicle === 'CAR' ? <Car size={16} /> : <Bike size={16} />} {r.vehicle}
        </span>
        <span style={{ color: statusColor, fontWeight: 'bold', fontSize: '13px' }}>● {r.status}</span>
      </div>

      <div className="spot-row" style={{ marginTop: '6px' }}>
        <div>📍 {r.areaName} — Slot #{r.slotNumber}</div>
        <div>📅 {r.date}</div>
      </div>
      <div className="spot-row" style={{ marginTop: '4px' }}>
        <div>⏰ {r.time}</div>
        <div>⏱ 1 hr</div>
      </div>

      {/* Countdown — only while RESERVED */}
      {r.status === 'RESERVED' && (
        <div style={{
          marginTop: '10px', padding: '8px 12px', borderRadius: '8px',
          background: timerExpired ? 'rgba(255,80,80,0.15)' : 'rgba(240,192,64,0.15)',
          border: `1px solid ${timerExpired ? '#ff6b6b' : '#f0c040'}`,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Clock size={15} color={timerExpired ? '#ff6b6b' : '#f0c040'} />
          {timerExpired
            ? <span style={{ color: '#ff6b6b', fontSize: '13px', fontWeight: 'bold' }}>⚠ Time's up — marking as EXPIRED.</span>
            : <span style={{ color: '#f0c040', fontSize: '13px' }}>Arrive within: <strong>{mm}:{ss}</strong></span>
          }
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
        {r.status === 'RESERVED' && !timerExpired && (
          <button onClick={() => onArrive(r)}
            style={{ background: '#2d8b2d', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            ✅ I Arrived
          </button>
        )}
        {r.status === 'OCCUPIED' && (
          <button onClick={() => onExit(r)}
            style={{ background: '#1a6bb5', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            🚗 Exit
          </button>
        )}
        {r.status === 'RESERVED' && (
          <button onClick={() => onCancel(r)}
            style={{ background: '#8b2222', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            🗑 Cancel
          </button>
        )}
        {/* Delete button — only for finished/non-active reservations */}
        {!isActive && (
          <button onClick={() => onDelete(r)}
            style={{ background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}

// All 3 parking areas — hardcoded as fallback so they always appear in the filter
const ALL_AREAS = ['RTL AREA', 'OPEN AREA', 'BACKGATE'];

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArea, setFilterArea] = useState('ALL');

  const loadReservations = useCallback(async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      if (!user.id) { setLoading(false); return; }
      const data = await ReservationAPI.getByUser(user.id);
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReservations(); }, [loadReservations]);

  const handleArrive = async (r) => {
    try {
      const updated = await ReservationAPI.arrive(r.id);
      setReservations(prev => prev.map(x => x.id === updated.id ? updated : x));
      addNotification({ type: 'reservation_arrived', title: 'Arrived — Slot Confirmed', message: `Slot #${r.slotNumber} at ${r.areaName} is now locked to your vehicle.` });
    } catch (err) { alert(err.message || 'Failed to confirm arrival'); }
  };

  const handleExit = async (r) => {
    if (!window.confirm('Confirm you are leaving? The slot will be freed.')) return;
    try {
      const updated = await ReservationAPI.exit(r.id);
      setReservations(prev => prev.map(x => x.id === updated.id ? updated : x));
      addNotification({ type: 'reservation_completed', title: 'Parking Completed', message: `You have exited slot #${r.slotNumber} at ${r.areaName}. Thanks!` });
    } catch (err) { alert(err.message || 'Failed to process exit'); }
  };

  const handleCancel = async (r) => {
    if (!window.confirm('Cancel this reservation? The spot will be freed.')) return;
    try {
      const updated = await ReservationAPI.cancel(r.id);
      setReservations(prev => prev.map(x => x.id === updated.id ? updated : x));
      addNotification({ type: 'reservation_cancelled', title: 'Reservation Cancelled', message: `Your reservation at ${r.areaName} on ${r.date} has been cancelled.` });
    } catch (err) { alert(err.message || 'Failed to cancel reservation'); }
  };

  const handleDelete = async (r) => {
    if (!window.confirm('Permanently delete this reservation record?')) return;
    try {
      await ReservationAPI.delete(r.id);
      setReservations(prev => prev.filter(x => x.id !== r.id));
    } catch (err) { alert(err.message || 'Failed to delete reservation'); }
  };

  // Auto-expire when frontend timer hits zero
  useEffect(() => {
    const id = setInterval(() => {
      reservations.forEach(r => {
        if (r.status !== 'RESERVED' || !r.reservedAt) return;
        const duration = Number(sessionStorage.getItem('reservationDuration') || 3600000);
        const expiry = new Date(r.reservedAt).getTime() + duration;
        if (Date.now() > expiry) {
          ReservationAPI.expire(r.id).then(updated => {
            setReservations(prev => prev.map(x => x.id === updated.id ? updated : x));
            addNotification({ type: 'reservation_expired', title: 'Reservation Expired', message: `Your reservation at ${r.areaName} expired — you did not arrive within 1 hour.` });
          }).catch(console.error);
        }
      });
    }, 10000);
    return () => clearInterval(id);
  }, [reservations]);

  const filtered = reservations.filter((r) => {
    const area = r.areaName || '';
    const matchSearch = search === ''
      || area.toLowerCase().includes(search.toLowerCase())
      || r.vehicle.toLowerCase().includes(search.toLowerCase())
      || r.date.includes(search)
      || r.status.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = filterVehicle === 'ALL' || r.vehicle === filterVehicle;
    const matchStatus  = filterStatus  === 'ALL' || r.status  === filterStatus;
    const matchArea    = filterArea    === 'ALL' || area       === filterArea;
    return matchSearch && matchVehicle && matchStatus && matchArea;
  });

  // Dropdown style — dark bg so options are always readable
  const selectStyle = {
    padding: '7px 10px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: '#2a1a1a',   // ← solid dark background so options are visible
    color: 'white', fontSize: '13px', cursor: 'pointer',
  };
  const filterGroup = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const filterLabel = { fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '4px' };

  return (
    <div>
      <Navbar />

      <div className="action-row">
        <button onClick={() => navigate('/parking-map')}><MapPin size={18} /> Reserve Spot</button>
        <button onClick={() => navigate('/parking-map')}><MapPin size={18} /> View Map</button>
      </div>

      {/* Search & Filter */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '12px' }}>🔍 Search & Filter</h2>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
          <input type="text" placeholder="Search" value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Vehicle</label>
            <select value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option>
              <option value="CAR">Car</option>
              <option value="MOTORCYCLE">Motorcycle</option>
            </select>
          </div>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option>
              <option value="RESERVED">Reserved</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="EXPIRED">Expired</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Area</label>
            <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option>
              {ALL_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button onClick={() => { setSearch(''); setFilterVehicle('ALL'); setFilterStatus('ALL'); setFilterArea('ALL'); }}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', alignSelf: 'flex-end' }}>
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '10px' }}>
          My Reservations
          <span style={{ fontSize: '12px', color: '#ccc', marginLeft: '10px' }}>({filtered.length} result{filtered.length !== 1 ? 's' : ''})</span>
        </h2>
        {loading ? (
          <p style={{ color: '#ccc', textAlign: 'center' }}>Loading reservations…</p>
        ) : filtered.length > 0 ? (
          filtered.map((r) => (
            <ReservationCard key={r.id} r={r}
              onArrive={handleArrive}
              onExit={handleExit}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#ccc' }}>No reservations found.</p>
            <button onClick={() => navigate('/parking-map')}
              style={{ marginTop: '10px', background: 'gold', color: 'black', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Reserve Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}