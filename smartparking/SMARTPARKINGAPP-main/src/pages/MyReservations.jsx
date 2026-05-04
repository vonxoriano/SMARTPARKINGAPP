import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Bike, Search, Filter } from 'lucide-react';
import logo from '../assets/logo.png';
import { addNotification } from '../notificationUtils';
import { ReservationAPI } from '../api';

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArea, setFilterArea] = useState('ALL');

  useEffect(() => {
    const load = async () => {
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
    };
    load();
  }, []);

  const handleDelete = async (reservation) => {
    if (!window.confirm('Cancel this reservation? The spot will be freed.')) return;
    try {
      const updated = await ReservationAPI.cancel(reservation.id);
      setReservations(prev => prev.map(r => r.id === updated.id ? updated : r));
      addNotification({
        type: 'reservation_cancelled',
        title: 'Reservation Cancelled',
        message: `Your ${reservation.vehicle} reservation at ${reservation.areaName} on ${reservation.date} has been cancelled.`,
        reservationId: reservation.id,
      });
    } catch (err) {
      alert(err.message || 'Failed to cancel reservation');
    }
  };

  const filtered = reservations.filter((r) => {
    const area = r.areaName || '';
    const matchSearch = search === '' || area.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search) || r.status.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = filterVehicle === 'ALL' || r.vehicle === filterVehicle;
    const matchStatus  = filterStatus === 'ALL'  || r.status === filterStatus;
    const matchArea    = filterArea === 'ALL'    || area === filterArea;
    return matchSearch && matchVehicle && matchStatus && matchArea;
  });

  const filterGroup  = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const filterLabel  = { fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '4px' };
  const selectStyle  = { padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', cursor: 'pointer' };

  return (
    <div>
      <div className="header-banner"><img src={logo} alt="logo" /><h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1></div>
      <div className="nav-tabs">
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>
      <div className="action-row">
        <button onClick={() => navigate('/parking-map')}><MapPin size={18} /> Reserve Spot</button>
        <button onClick={() => navigate('/parking-map')}><MapPin size={18} /> View Map</button>
      </div>
      <div className="glass-card">
        <h2 style={{ marginBottom: '12px' }}>🔍 Search & Filter</h2>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
          <input type="text" placeholder="Search by area, vehicle, date, status..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Vehicle</label>
            <select value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option><option value="CAR">Car</option><option value="MOTORCYCLE">Motorcycle</option>
            </select>
          </div>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div style={filterGroup}>
            <label style={filterLabel}><Filter size={13} /> Area</label>
            <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} style={selectStyle}>
              <option value="ALL">All</option><option value="RTL AREA">RTL Area</option><option value="OPEN AREA">Open Area</option><option value="BACKGATE">Backgate</option>
            </select>
          </div>
          <button onClick={() => { setSearch(''); setFilterVehicle('ALL'); setFilterStatus('ALL'); setFilterArea('ALL'); }}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', alignSelf: 'flex-end' }}>
            Clear
          </button>
        </div>
      </div>
      <div className="glass-card">
        <h2 style={{ marginBottom: '10px' }}>
          My Reservations
          <span style={{ fontSize: '12px', color: '#ccc', marginLeft: '10px' }}>({filtered.length} result{filtered.length !== 1 ? 's' : ''})</span>
        </h2>
        {loading ? (
          <p style={{ color: '#ccc', textAlign: 'center' }}>Loading reservations…</p>
        ) : filtered.length > 0 ? (
          filtered.map((r) => (
            <div key={r.id} className="area-card" style={{ marginBottom: '10px' }}>
              <div className="area-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                  {r.vehicle === 'CAR' ? <Car size={16} /> : <Bike size={16} />}{r.vehicle}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: r.status === 'ACTIVE' ? 'lightgreen' : r.status === 'COMPLETED' ? '#aaa' : '#ff6b6b', fontWeight: 'bold', fontSize: '13px' }}>
                    ● {r.status}
                  </span>
                  {r.status === 'ACTIVE' && (
                    <button onClick={() => handleDelete(r)}
                      style={{ background: '#8b2222', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                      🗑 Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="spot-row" style={{ marginTop: '6px' }}>
                <div>📍 Area: {r.areaName}</div><div>⏰ Time: {r.time}</div>
              </div>
              <div className="spot-row" style={{ marginTop: '4px' }}>
                <div>📅 Date: {r.date}</div><div>⏱ Duration: {r.durationHours} hr(s)</div>
              </div>
              {r.status === 'ACTIVE' && (
                <div className="progress-wrap" style={{ marginTop: '10px' }}>
                  <div className="progress-bar" style={{ width: '70%' }}></div>
                </div>
              )}
            </div>
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
