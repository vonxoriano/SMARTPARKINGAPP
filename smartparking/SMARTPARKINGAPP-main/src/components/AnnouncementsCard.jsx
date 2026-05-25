import { useState, useEffect } from 'react';
import { Megaphone, Clock } from 'lucide-react';

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

export default function AnnouncementsCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/announcements')
      .then(r => r.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card announcement">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Megaphone size={18} /> Announcements
      </h2>
      {loading ? (
        <p style={{ color: '#ccc', fontSize: 13 }}>Loading…</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>No announcements yet.</p>
      ) : (
        announcements.map(a => (
          <div key={a.id} style={{
            background: 'rgba(255,255,255,0.07)', borderRadius: 8,
            padding: '10px 14px', marginTop: 10,
            borderLeft: '3px solid #f0c040',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: 14 }}>{a.title}</div>
            <div style={{ fontSize: 13, color: '#ccc', marginTop: 4 }}>{a.message}</div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {timeAgo(a.createdAt)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}