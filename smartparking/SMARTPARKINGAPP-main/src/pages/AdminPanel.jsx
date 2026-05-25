import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Car, Users, CalendarCheck, LogOut,
  CheckCircle, Clock, Trash2, RefreshCw, MapPin,
  ChevronDown, ChevronUp, Shield, Megaphone
} from 'lucide-react';
import logo from '../assets/logo.png';

const API = 'http://localhost:8080/api';

const api = {
  get:   (path)       => fetch(`${API}${path}`).then(r => r.json()),
  patch: (path, body) => fetch(`${API}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  del:   (path)       => fetch(`${API}${path}`, { method: 'DELETE' }).then(r => r.json()),
};

const actionBtn = { border: 'none', color: 'white', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 };
const refreshBtn = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 };

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 120, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 'bold', color, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Badge({ status }) {
  const colors = {
    RESERVED: '#f0c040', OCCUPIED: 'lightgreen', EXPIRED: '#9e9e9e',
    COMPLETED: '#4fc3f7', CANCELLED: '#ff6b6b',
    vacant: 'lightgreen', reserved: '#f0c040', taken: '#ff6b6b',
  };
  return (
    <span style={{ background: (colors[status] || '#ccc') + '22', color: colors[status] || '#ccc', border: `1px solid ${colors[status] || '#ccc'}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 'bold' }}>
      {status}
    </span>
  );
}

function Overview({ areas, reservations, users }) {
  const totalSpots    = areas.reduce((s, a) => s + a.totalSpots, 0);
  const vacantSpots   = areas.reduce((s, a) => s + a.vacantSpots, 0);
  const occupiedSpots = totalSpots - vacantSpots;
  const activeRes     = reservations.filter(r => r.status === 'RESERVED' || r.status === 'OCCUPIED').length;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Overview</h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total Spots"        value={totalSpots}    color="#4fc3f7"    icon={MapPin} />
        <StatCard label="Vacant"             value={vacantSpots}   color="lightgreen" icon={CheckCircle} />
        <StatCard label="Occupied"           value={occupiedSpots} color="#ff6b6b"    icon={Car} />
        <StatCard label="Active Reservations" value={activeRes}    color="#f0c040"    icon={CalendarCheck} />
        <StatCard label="Total Users"        value={users.length}  color="#ce93d8"    icon={Users} />
      </div>
      <h3 style={{ marginBottom: 10, color: '#ccc' }}>Parking Areas</h3>
      {areas.map(area => {
        const pct = area.totalSpots > 0 ? ((area.totalSpots - area.vacantSpots) / area.totalSpots) * 100 : 0;
        return (
          <div key={area.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 'bold' }}>{area.name}</span>
              <span style={{ fontSize: 12, color: '#aaa' }}>{area.totalSpots - area.vacantSpots}/{area.totalSpots} occupied</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 8 }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 6, background: pct > 80 ? '#ff4444' : pct > 50 ? '#ffaa00' : '#76ff03', transition: 'width 0.4s' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Reservations({ reservations, onRefresh }) {
  const [filter, setFilter]   = useState('ALL');
  const [expanded, setExpanded] = useState(null);
  const statuses = ['ALL', 'RESERVED', 'OCCUPIED', 'EXPIRED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter);

  const handleAction = async (action, id) => {
    if (!window.confirm(`${action} this reservation?`)) return;
    try {
      if (action === 'DELETE') await api.del(`/reservations/${id}`);
      else await api.patch(`/reservations/${id}/${action.toLowerCase()}`);
      onRefresh();
    } catch { alert('Action failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2>All Reservations <span style={{ fontSize: 13, color: '#aaa', fontWeight: 'normal' }}>({filtered.length})</span></h2>
        <button onClick={onRefresh} style={refreshBtn}><RefreshCw size={14} /> Refresh</button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? '#8b4a4a' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: filter === s ? 'bold' : 'normal' }}>{s}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: 30 }}>No reservations found.</p>
      ) : filtered.map(r => (
        <div key={r.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Car size={15} color="#aaa" />
              <span style={{ fontWeight: 'bold' }}>{r.userName}</span>
              <span style={{ color: '#aaa', fontSize: 12 }}>#{r.slotNumber} · {r.areaName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge status={r.status} />
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                {expanded === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
          {expanded === r.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: '#ccc', marginBottom: 12 }}>
                <span>🚗 {r.vehicle}</span>
                <span>📅 {r.date} {r.time}</span>
                <span>⏱ {r.durationHours}hr</span>
                <span>🆔 #{r.id}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {r.status === 'RESERVED' && (
                  <>
                    <button onClick={() => handleAction('ARRIVE', r.id)} style={{ ...actionBtn, background: '#2d8b2d' }}>✅ Arrive</button>
                    <button onClick={() => handleAction('CANCEL', r.id)} style={{ ...actionBtn, background: '#8b2222' }}>✖ Cancel</button>
                    <button onClick={() => handleAction('EXPIRE', r.id)} style={{ ...actionBtn, background: '#555' }}>⏰ Expire</button>
                  </>
                )}
                {r.status === 'OCCUPIED' && (
                  <button onClick={() => handleAction('EXIT', r.id)} style={{ ...actionBtn, background: '#1a6bb5' }}>🚗 Exit</button>
                )}
                {!['RESERVED', 'OCCUPIED'].includes(r.status) && (
                  <button onClick={() => handleAction('DELETE', r.id)} style={{ ...actionBtn, background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ParkingSpots({ areas, onRefresh }) {
  const handleOverride = async (spotId, newStatus) => {
    try {
      await api.patch(`/parking/spots/${spotId}/status`, { status: newStatus });
      onRefresh();
    } catch { alert('Failed to update spot'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2>Parking Spots</h2>
        <button onClick={onRefresh} style={refreshBtn}><RefreshCw size={14} /> Refresh</button>
      </div>
      {areas.map(area => (
        <div key={area.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
          <h3 style={{ marginBottom: 12 }}>{area.name}
            <span style={{ fontSize: 12, color: '#aaa', fontWeight: 'normal', marginLeft: 10 }}>{area.vacantSpots} vacant / {area.totalSpots} total</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {area.spots?.map(spot => {
              const colors = { vacant: '#2d8b2d', reserved: '#b8860b', taken: '#8b2222' };
              const bg = colors[spot.status] || '#555';
              return (
                <div key={spot.id} style={{ background: bg + '33', border: `1px solid ${bg}`, borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Slot #{spot.slotNumber}</div>
                  <Badge status={spot.status} />
                  {spot.status !== 'vacant' && (
                    <button onClick={() => handleOverride(spot.id, 'VACANT')} style={{ marginTop: 6, width: '100%', background: '#2d8b2d', border: 'none', color: 'white', padding: '3px 0', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
                      Force Vacant
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersSection({ users, onRefresh }) {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/users/${id}`);
      onRefresh();
    } catch { alert('Failed to delete user'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2>Users <span style={{ fontSize: 13, color: '#aaa', fontWeight: 'normal' }}>({users.length})</span></h2>
        <button onClick={onRefresh} style={refreshBtn}><RefreshCw size={14} /> Refresh</button>
      </div>
      {users.map(u => (
        <div key={u.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
              {u.name}
              {u.role === 'ADMIN' && (
                <span style={{ background: '#ce93d822', color: '#ce93d8', border: '1px solid #ce93d8', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 'bold' }}>ADMIN</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>ID: {u.studentId} · {u.email}</div>
          </div>
          {u.role !== 'ADMIN' && (
            <button onClick={() => handleDelete(u.id, u.name)} style={{ background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AnnouncementsAdmin({ announcements, onRefresh }) {
  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 13 };

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) { setError('Both title and message are required.'); return; }
    setLoading(true); setError('');
    try {
      await fetch('http://localhost:8080/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });
      setTitle(''); setMessage('');
      onRefresh();
    } catch { setError('Failed to create announcement.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await fetch(`http://localhost:8080/api/announcements/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2>Announcements</h2>
        <button onClick={onRefresh} style={refreshBtn}><RefreshCw size={14} /> Refresh</button>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, color: '#f0c040' }}>📢 New Announcement</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
          <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          {error && <p style={{ color: '#ff6b6b', fontSize: 12 }}>⚠ {error}</p>}
          <button onClick={handleCreate} disabled={loading} style={{ background: loading ? '#555' : '#8b4a4a', border: 'none', color: 'white', padding: '8px 20px', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: 13, alignSelf: 'flex-start' }}>
            {loading ? 'Posting…' : '📢 Post Announcement'}
          </button>
        </div>
      </div>
      {announcements.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>No announcements yet.</p>
      ) : announcements.map(a => (
        <div key={a.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', marginBottom: 8, borderLeft: '3px solid #f0c040' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: '#ccc' }}>{a.message}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
            <button onClick={() => handleDelete(a.id)} style={{ background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab]           = useState('overview');
  const [areas, setAreas]                   = useState([]);
  const [reservations, setReservations]     = useState([]);
  const [users, setUsers]                   = useState([]);
  const [announcements, setAnnouncements]   = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    if (user.role !== 'ADMIN') window.location.href = '/';
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [a, r, u, an] = await Promise.all([
        api.get('/parking/areas'),
        api.get('/reservations'),
        api.get('/users'),
        api.get('/announcements'),
      ]);
      setAreas(Array.isArray(a) ? a : []);
      setReservations(Array.isArray(r) ? r : []);
      setUsers(Array.isArray(u) ? u : []);
      setAnnouncements(Array.isArray(an) ? an : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const tabs = [
    { id: 'overview',      label: 'Overview',       icon: LayoutDashboard },
    { id: 'reservations',  label: 'Reservations',   icon: CalendarCheck },
    { id: 'spots',         label: 'Parking Spots',  icon: MapPin },
    { id: 'users',         label: 'Users',          icon: Users },
    { id: 'announcements', label: 'Announcements',  icon: Megaphone },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#1a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      <div className="header-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="logo" style={{ height: 40 }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 16 }}>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <Shield size={12} color="#ce93d8" />
              <span style={{ fontSize: 11, color: '#ce93d8', fontWeight: 'bold', letterSpacing: 1 }}>ADMIN PANEL</span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: '#8b2222', border: 'none', color: 'white', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold', fontSize: 13 }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="nav-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px', maxWidth: 900, margin: '0 auto' }}>
        {loading ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>Loading admin data…</p>
        ) : (
          <>
            {activeTab === 'overview'      && <Overview areas={areas} reservations={reservations} users={users} />}
            {activeTab === 'reservations'  && <Reservations reservations={reservations} onRefresh={loadAll} />}
            {activeTab === 'spots'         && <ParkingSpots areas={areas} onRefresh={loadAll} />}
            {activeTab === 'users'         && <UsersSection users={users} onRefresh={loadAll} />}
            {activeTab === 'announcements' && <AnnouncementsAdmin announcements={announcements} onRefresh={loadAll} />}
          </>
        )}
      </div>
    </div>
  );
}