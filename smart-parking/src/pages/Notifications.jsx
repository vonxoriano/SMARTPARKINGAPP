import SidebarLayout from '../components/SidebarLayout';
import { Bell, Clock, Car, Bike, MapPin } from 'lucide-react';

const notifications = [
  { id: 1, title: 'RTL Area Unavailable', message: 'RTL area is currently closed for maintenance.', time: '2 hours ago', read: false },
  { id: 2, title: 'Reservation Confirmed', message: 'Your parking spot at OPEN AREA has been reserved.', time: '1 day ago', read: true },
  { id: 3, title: 'Reservation Expiring', message: 'Your reservation will expire in 15 minutes.', time: '2 days ago', read: true },
];

export default function Notifications() {
  return (
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">Notifications</h1>
          <p className="card-subtitle">Stay updated with your parking activities.</p>
        </div>

        <div className="card">
          <div className="notif-header">
            <span className="section-title" style={{ marginBottom: 0 }}>All Notifications</span>
            <button className="btn-mark-all">Mark all as read</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((n) => (
              <div key={n.id} className={`notif-card ${n.read ? 'read' : 'unread'}`}>
                <div className="notif-inner">
                  <Bell size={16} color="#A0A0B0" style={{ marginTop: 2 }} />
                  <div className="notif-body">
                    <div className="notif-title-row">
                      <span className="notif-title">{n.title}</span>
                      {!n.read && <span className="notif-dot"></span>}
                    </div>
                    <p className="notif-msg">{n.message}</p>
                    <div className="notif-time">
                      <Clock size={12} />
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-grid-3">
          {[
            { icon: Car, label: 'Car Reservations', value: 5 },
            { icon: Bike, label: 'Motorcycle', value: 3 },
            { icon: MapPin, label: 'Areas Visited', value: 8 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-icon-box"><Icon size={20} /></div>
                <div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
