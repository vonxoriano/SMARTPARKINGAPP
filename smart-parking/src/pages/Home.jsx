import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import { MapPin, Calendar, Car, Bike } from 'lucide-react';

const areas = [
  { name: 'RTL Area', status: 'unavailable', moto: '0/50', car: '0/50' },
  { name: 'Open Area', status: 'available', moto: '10/50', car: '0/50' },
  { name: 'Backgate', status: 'available', moto: '0/50', car: '0/50' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">Welcome Back!</h1>
          <p className="card-subtitle">Here's what's happening with your parking today.</p>
        </div>

        <div className="spots-hero">
          <div className="spots-hero-inner">
            <div>
              <div className="spots-label">Available Spots</div>
              <div className="spots-number">20<span className="spots-total">/300</span></div>
            </div>
            <div className="spots-icon-box">
              <Car size={32} />
            </div>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: '6.67%' }}></div>
          </div>
        </div>

        <div className="action-grid-3">
          <button className="btn-action purple btn-action-col" onClick={() => navigate('/dashboard')}>
            <MapPin size={20} />
            <span>Reserve Spot</span>
          </button>
          <button className="btn-action gold btn-action-col" onClick={() => navigate('/parking-map')}>
            <MapPin size={20} />
            <span>View Map</span>
          </button>
          <button className="btn-action yellow btn-action-col" onClick={() => navigate('/reservations')}>
            <Calendar size={20} />
            <span>My Reservations</span>
          </button>
        </div>

        <div>
          <h2 style={{ color: '#1E1E2E', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Parking Areas</h2>
          <div className="area-list">
            {areas.map((area) => (
              <div key={area.name} className="area-card">
                <div className="area-header">
                  <span className="area-title">{area.name}</span>
                  <span className={`badge ${area.status === 'available' ? 'badge-green' : 'badge-red'}`}>
                    {area.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="spot-row">
                  <div className="spot-item">
                    <div className="spot-left"><Bike size={12} /><span>Motorcycle</span></div>
                    <span className="spot-count">{area.moto}</span>
                  </div>
                  <div className="spot-item">
                    <div className="spot-left"><Car size={12} /><span>Car</span></div>
                    <span className="spot-count">{area.car}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="announcement">
          <h2>Announcements</h2>
          <p>RTL area currently unavailable</p>
        </div>
      </div>
    </SidebarLayout>
  );
}
