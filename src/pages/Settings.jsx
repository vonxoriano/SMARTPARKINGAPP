import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';
import { addNotification } from '../notificationUtils';

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Load persisted photo from localStorage
  const [photo, setPhoto] = useState(
    () => localStorage.getItem('profilePhoto') || null
  );

  // Load profile data saved at sign-up (fallback to defaults)
  const loadProfile = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) return JSON.parse(saved);
    } catch (_) { }
    return { name: 'Superuser Test', email: 'superuser@cit-u.edu.ph', studentId: '23-3724-353' };
  };

  const [formData] = useState(loadProfile);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = () => {
    const savedPassword = localStorage.getItem('testUserPassword') || 'test1234';
    if (passwords.currentPassword !== savedPassword) {
      alert('Current password is incorrect!');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 4) {
      alert('Password too short!');
      return;
    }
    localStorage.setItem('testUserPassword', passwords.newPassword);
    alert('Password changed successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // When user picks a file, read it as base64 and save to localStorage
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhoto(dataUrl);
      localStorage.setItem('profilePhoto', dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  // Remove photo and clear localStorage
  const handleRemovePhoto = () => {
    if (!window.confirm('Remove your profile photo?')) return;
    setPhoto(null);
    localStorage.removeItem('profilePhoto');
  };

  const fields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Student ID', name: 'studentId', type: 'text' },
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
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button className="active">SETTINGS</button>
      </div>

      {/* SETTINGS CARD */}
      <div className="glass-card">
        <h2>Profile Info</h2>

        {/* AVATAR */}
        <div className="area-card" style={{ textAlign: 'center', padding: '20px 16px' }}>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Circular avatar */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 12px',
              background: 'rgba(255,255,255,0.15)',
              border: '3px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <User size={48} color="rgba(255,255,255,0.7)" />
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                background: '#8b4a4a',
                border: 'none',
                color: 'white',
                padding: '7px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#a85858')}
              onMouseLeave={(e) => (e.target.style.background = '#8b4a4a')}
            >
              📷 Change Photo
            </button>

            {photo && (
              <button
                onClick={handleRemovePhoto}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,100,100,0.6)',
                  color: '#ff8080',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,80,80,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                🗑 Remove Photo
              </button>
            )}
          </div>

          {photo && (
            <p style={{ marginTop: '8px', fontSize: '11px', color: '#aaa' }}>
              Photo saved — will persist after refresh.
            </p>
          )}
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
              readOnly
              style={{
                width: '100%',
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                outline: 'none',
                opacity: 0.7,
                cursor: 'not-allowed'
              }}
            />
          </div>
        ))}


      </div>

      {/* PASSWORD */}
      <div className="glass-card">
        <h2>Change Password</h2>
        <div className="area-card">
          <div className="area-header"><span>Current Password</span></div>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none' }}
          />
        </div>
        <div className="area-card">
          <div className="area-header"><span>New Password</span></div>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none' }}
          />
        </div>
        <div className="area-card">
          <div className="area-header"><span>Confirm New Password</span></div>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none' }}
          />
        </div>
        <div style={{ marginTop: '14px', textAlign: 'right' }}>
          <button
            onClick={handleSavePassword}
            style={{
              background: '#4a8b4a',
              border: 'none',
              color: 'white',
              padding: '9px 22px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            💾 Change Password
          </button>
        </div>
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