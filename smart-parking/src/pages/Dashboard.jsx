import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import { Car, Bike, MapPin } from 'lucide-react';

const parkingAreas = [
  {
    name: 'RTL AREA', status: 'unavailable',
    spots: [{ type: 'Motorcycle', icon: Bike, count: '2/50' }, { type: 'Car', icon: Car, count: '0/50' }]
  },
  {
    name: 'OPEN AREA', status: 'available',
    spots: [{ type: 'Motorcycle', icon: Bike, count: '10/50' }, { type: 'Car', icon: Car, count: '0/50' }]
  },
  {
    name: 'BACKGATE', status: 'available',
    spots: [{ type: 'Motorcycle', icon: Bike, count: '0/50' }, { type: 'Car', icon: Car, count: '0/50' }]
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">Dashboard</h1>
          <p className="card-subtitle">Check available parking spots across all areas.</p>
        </div>

        <div className="card">
          <div className="section-title">AVAILABLE SPOTS</div>
          <div className="area-list">
            {parkingAreas.map((area) => (
              <div key={area.name} className="inner-card">
                <div className="area-header">
                  <span style={{ color: '#E8E4F0', fontWeight: 500, fontSize: 12 }}>{area.name}</span>
                  <span className={`badge ${area.status === 'available' ? 'badge-green' : 'badge-red'}`}>
                    {area.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="dashboard-spot-row">
                  {area.spots.map((spot) => (
                    <div key={spot.type} className="dashboard-spot-item">
                      <spot.icon size={12} />
                      <span>{spot.type}</span>
                      <span className="dashboard-spot-count">{spot.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-grid-2">
          <button className="btn-action purple" onClick={() => navigate('/reservations')}>
            <MapPin size={20} /><span>Reserve Spot</span>
          </button>
          <button className="btn-action gold" onClick={() => navigate('/parking-map')}>
            <MapPin size={20} /><span>View Map</span>
          </button>
        </div>

        <div className="announcement">
          <h2>Announcements</h2>
          <p>Backgate area currently unavailable</p>
        </div>
      </div>
    </SidebarLayout>
  );
}
