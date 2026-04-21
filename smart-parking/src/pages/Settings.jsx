import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';
export default function Settings() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@cit-u.edu.ph',
    studentId: '12-3456-789',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Student ID', name: 'studentId', type: 'text' },
  ];

  const pwFields = [
    { label: 'Current Password', placeholder: 'Enter current password' },
    { label: 'New Password', placeholder: 'Enter new password' },
    { label: 'Confirm New Password', placeholder: 'Confirm new password' },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* NAVIGATION */}
      <div className="nav-tabs">
        <button onClick={() => navigate('/')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button className="active">SETTINGS</button>
      </div>

      {/* SETTINGS CARD */}
      <div className="glass-card">
        <h2>Profile Info</h2>

        {/* AVATAR */}
        <div className="area-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>
            <User />
          </div>
          <button
            style={{
              marginTop: 10,
              background: '#8b4a4a',
              border: 'none',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Change Photo
          </button>
        </div>

        {/* FIELDS */}
        {fields.map((f) => (
          <div key={f.name} className="area-card">
            <div className="area-header">
              <span>{f.label}</span>
            </div>

            <input
              type={f.type}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              style={{
                width: '100%',
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                outline: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* PASSWORD */}
      <div className="glass-card">
        <h2>Change Password</h2>

        {pwFields.map((f) => (
          <div key={f.label} className="area-card">
            <div className="area-header">
              <span>{f.label}</span>
            </div>

            <input
              type="password"
              placeholder={f.placeholder}
              style={{
                width: '100%',
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                outline: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* ACCOUNT */}
      <div className="glass-card">
        <h2>Account</h2>

        <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
          Sign out of your account on this device.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'red',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}