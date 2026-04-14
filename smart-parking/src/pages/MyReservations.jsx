import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import { MapPin } from 'lucide-react';

const reservations = [
  { id: 1, area: 'RTL', vehicle: 'CAR', time: '2:00PM', date: '3/14/2026', status: 'ACTIVE', minutesLeft: '10:37' }
];

export default function MyReservations() {
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">My Reservations</h1>
          <p className="card-subtitle">View and manage your parking reservations.</p>
        </div>

        <div className="action-grid-2">
          <button className="btn-action purple" onClick={() => navigate('/dashboard')}>
            <MapPin size={20} /><span>Reserve Spot</span>
          </button>
          <button className="btn-action gold" onClick={() => navigate('/parking-map')}>
            <MapPin size={20} /><span>View Map</span>
          </button>
        </div>

        <div className="card">
          <div className="section-title">RESERVATION:</div>
          {reservations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reservations.map((r) => (
                <div key={r.id} className="reservation-card">
                  <div className="reservation-top">
                    <div className="res-tag">
                      <div className="res-badge">{r.vehicle}</div>
                    </div>
                    <div className="res-tag">
                      <span className="res-label">AREA:</span>
                      <div className="res-badge">{r.area}</div>
                    </div>
                    <div className="res-tag">
                      <span className="res-label">TIME:</span>
                      <div className="res-badge-wide">{r.time}</div>
                    </div>
                  </div>
                  <div className="res-meta">
                    <span>DATE: {r.date}</span>
                    <span>STATUS: {r.status}</span>
                  </div>
                  <div>
                    <div className="res-timer-row">
                      <span className="res-timer-label">Minutes left:</span>
                      <span className="res-timer-value">{r.minutesLeft}</span>
                    </div>
                    <div className="progress-sm-wrap">
                      <div className="progress-sm-bar" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No reservations yet</p>
              <button className="btn-reserve-now" onClick={() => navigate('/dashboard')}>Reserve Now</button>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
