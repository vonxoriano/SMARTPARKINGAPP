import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import { User } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@cit-u.edu.ph',
    studentId: '12-3456-789',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <SidebarLayout>
      <div className="page-space">
        <div className="card">
          <h1 className="card-title">Settings</h1>
          <p className="card-subtitle">Manage your account settings and preferences.</p>
        </div>

        <div className="card">
          <div className="section-title">Profile Info</div>
          <div className="settings-form">
            <div className="settings-avatar-row">
              <div className="user-avatar-lg"><User size={32} /></div>
              <button className="btn-change-photo">Change Photo</button>
            </div>
            {fields.map((f) => (
              <div key={f.name}>
                <label className="settings-label">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="settings-input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Change Password</div>
          <div className="settings-form">
            {pwFields.map((f) => (
              <div key={f.label}>
                <label className="settings-label">{f.label}</label>
                <input
                  type="password"
                  placeholder={f.placeholder}
                  className="settings-input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Account</div>
          <p style={{ color: '#A0A0B0', fontSize: 12, marginBottom: 12 }}>Sign out of your account on this device.</p>
          <button className="btn-danger" onClick={() => navigate('/')}>LOG OUT</button>
        </div>
      </div>
    </SidebarLayout>
  );
}
