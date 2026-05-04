import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Car, Bike, MapPin, CheckCheck, Trash2, X } from 'lucide-react';
import logo from '../assets/logo.png';
import {
  getNotifications, addNotification, markAllRead, markOneRead,
  deleteNotif, clearAll, seedInitialNotifications,
} from '../notificationUtils';

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const TYPE_META = {
  reservation_confirmed: { color: '#4caf50', label: 'Confirmed' },
  reservation_cancelled: { color: '#f44336', label: 'Cancelled' },
  reservation_expiring:  { color: '#ff9800', label: 'Expiring' },
  reservation_expired:   { color: '#9e9e9e', label: 'Expired' },
  profile_updated:       { color: '#2196f3', label: 'Profile' },
  system:                { color: '#9c27b0', label: 'System' },
};

const checkExpiring = () => {
  const reservations = JSON.parse(sessionStorage.getItem('reservations') || '[]');
  const existing = getNotifications();
  const now = Date.now();
  reservations.filter(r => r.status === 'ACTIVE').forEach(r => {
    if (!r.date || !r.time) return;
    const end = new Date(`${r.date}T${r.time}`).getTime() + parseInt(r.duration || '1') * 3600000;
    const minsLeft = (end - now) / 60000;
    const already = existing.some(n => n.reservationId === r.id &&
      (n.type === 'reservation_expiring' || n.type === 'reservation_expired'));
    if (already) return;
    if (minsLeft > 0 && minsLeft <= 30) {
      addNotification({
        type: 'reservation_expiring',
        title: 'Reservation Expiring Soon',
        message: `Your ${r.vehicle} spot at ${r.area} expires in ${Math.round(minsLeft)} minute(s).`,
        reservationId: r.id,
      });
    } else if (minsLeft <= 0 && minsLeft > -120) {
      addNotification({
        type: 'reservation_expired',
        title: 'Reservation Expired',
        message: `Your ${r.vehicle} reservation at ${r.area} on ${r.date} has expired.`,
        reservationId: r.id,
      });
    }
  });
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState('all');

  const reload = () => {
    seedInitialNotifications();
    checkExpiring();
    setNotifs(getNotifications());
  };

  useEffect(() => {
    reload();
    window.addEventListener('notificationsUpdated', reload);
    return () => window.removeEventListener('notificationsUpdated', reload);
  }, []);

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'reservations') return n.type?.startsWith('reservation');
    if (filter === 'system') return n.type === 'system' || n.type === 'profile_updated';
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  const reservations = JSON.parse(sessionStorage.getItem('reservations') || '[]');
  const carCount  = reservations.filter(r => r.vehicle === 'CAR').length;
  const motoCount = reservations.filter(r => r.vehicle === 'MOTORCYCLE').length;
  const areaCount = [...new Set(reservations.map(r => r.area).filter(Boolean))].length;

  const handleMarkAll  = () => { markAllRead(); reload(); };
  const handleMarkOne  = (id) => { markOneRead(id); reload(); };
  const handleDelete   = (id, e) => { e.stopPropagation(); deleteNotif(id); reload(); };
  const handleClearAll = () => { if (window.confirm('Clear all notifications?')) { clearAll(); reload(); } };

  const tabBtn = (val, label) => (
    <button
      key={val}
      onClick={() => setFilter(val)}
      style={{
        background: filter === val ? '#8b4a4a' : 'rgba(255,255,255,0.12)',
        border: 'none', color: 'white', padding: '5px 14px',
        borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
        fontWeight: filter === val ? 'bold' : 'normal', transition: 'all 0.2s',
      }}
    >{label}</button>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* NAV */}
      <div className="nav-tabs">
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button className="active">NOTIFICATIONS</button>
        <button onClick={() => navigate('/settings')}>SETTINGS</button>
      </div>

      {/* NOTIFICATIONS CARD */}
      <div className="glass-card">
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <h2 style={{ margin:0 }}>
              <Bell size={18} style={{ marginRight:6, verticalAlign:'middle' }} />
              All Notifications
            </h2>
            {unreadCount > 0 && (
              <span style={{ background:'#e53935', color:'white', borderRadius:'12px', padding:'2px 9px', fontSize:'12px', fontWeight:'bold' }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            <button onClick={handleMarkAll} style={{ background:'#4a8b4a', border:'none', color:'white', padding:'6px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px' }}>
              <CheckCheck size={13} /> Mark all read
            </button>
            <button onClick={handleClearAll} style={{ background:'#8b2222', border:'none', color:'white', padding:'6px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px' }}>
              <Trash2 size={13} /> Clear all
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'8px', marginTop:'14px', flexWrap:'wrap' }}>
          {tabBtn('all','All')}
          {tabBtn('unread','Unread')}
          {tabBtn('reservations','Reservations')}
          {tabBtn('system','System & Profile')}
        </div>

        {/* List */}
        <div style={{ marginTop:'12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'30px 0', color:'#aaa' }}>
              <Bell size={40} style={{ opacity:0.25, display:'block', margin:'0 auto 10px' }} />
              <p>No notifications here.</p>
            </div>
          ) : filtered.map(n => {
            const meta = TYPE_META[n.type] || TYPE_META.system;
            return (
              <div
                key={n.id}
                onClick={() => handleMarkOne(n.id)}
                className="area-card"
                style={{
                  marginBottom:'8px',
                  borderLeft: n.read ? '3px solid transparent' : `3px solid ${meta.color}`,
                  background: n.read ? undefined : 'rgba(255,255,255,0.06)',
                  cursor:'pointer', transition:'background 0.2s',
                }}
              >
                <div className="area-header">
                  <span style={{ display:'flex', alignItems:'center', gap:'8px', fontWeight: n.read ? 'normal' : 'bold' }}>
                    {n.title}
                  </span>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {!n.read && (
                      <span style={{ background: meta.color, color:'white', borderRadius:'10px', padding:'2px 8px', fontSize:'11px', fontWeight:'bold' }}>NEW</span>
                    )}
                    <button
                      onClick={e => handleDelete(n.id, e)}
                      title="Delete"
                      style={{ background:'transparent', border:'none', color:'#aaa', cursor:'pointer', display:'flex', padding:'2px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ margin:'6px 0 4px', fontSize:'13px', opacity:0.88 }}>{n.message}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', opacity:0.6 }}>
                  <Clock size={11} />
                  <span>{timeAgo(n.time)}</span>
                  <span style={{ marginLeft:6, background: meta.color + '33', color: meta.color, borderRadius:'8px', padding:'1px 7px', fontSize:'10px' }}>
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATS */}
      <div className="glass-card">
        <h2>Your Stats</h2>
        {[
          { icon: <Car size={14} />,   label: 'Car Reservations',       val: carCount },
          { icon: <Bike size={14} />,  label: 'Motorcycle Reservations', val: motoCount },
          { icon: <MapPin size={14} />,label: 'Unique Areas Visited',     val: areaCount },
          { icon: <Bell size={14} />,  label: 'Total Notifications',      val: notifs.length },
          { icon: <span style={{ color:'#ff6b6b' }}>🔴</span>, label: 'Unread Notifications', val: unreadCount, red: true },
        ].map(({ icon, label, val, red }) => (
          <div key={label} className="area-card" style={{ marginBottom:'6px' }}>
            <div className="area-header">
              <span style={{ display:'flex', alignItems:'center', gap:'6px', color: red ? '#ff6b6b' : undefined }}>{icon} {label}</span>
              <span style={{ color: red ? '#ff6b6b' : 'lightgreen', fontWeight:'bold' }}>{val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}