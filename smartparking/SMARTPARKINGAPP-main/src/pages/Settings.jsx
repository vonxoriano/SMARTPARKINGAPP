import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';
import { addNotification } from '../notificationUtils';
import { AuthAPI } from '../api';

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Load logged-in user from sessionStorage (set at login)
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

  // Load persisted photo from localStorage
  const [photo, setPhoto] = useState(
    () => localStorage.getItem('profilePhoto') || null
  );

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [pwStatus, setPwStatus] = useState({ msg: '', ok: false });
  const [pwLoading, setPwLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async () => {
    setPwStatus({ msg: '', ok: false });

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPwStatus({ msg: 'Please fill in all password fields.', ok: false });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwStatus({ msg: 'New passwords do not match!', ok: false });
      return;
    }
    if (passwords.newPassword.length < 4) {
      setPwStatus({ msg: 'Password must be at least 4 characters.', ok: false });
      return;
    }
    if (!currentUser.studentId) {
      setPwStatus({ msg: 'Not logged in. Please log in again.', ok: false });
      return;
    }

    setPwLoading(true);
    try {
      await AuthAPI.changePassword(
        currentUser.studentId,
        passwords.currentPassword,
        passwords.newPassword
      );
      setPwStatus({ msg: 'Password changed successfully!', ok: true });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addNotification({
        type: 'profile_updated',
        title: 'Password Changed',
        message: 'Your account password has been updated successfully.',
      });
    } catch (err) {
      setPwStatus({ msg: err.message || 'Failed to change password.', ok: false });
    } finally {
      setPwLoading(false);
    }
  };

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
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    if (!window.confirm('Remove your profile photo?')) return;
    setPhoto(null);
    localStorage.removeItem('profilePhoto');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/');
  };

  const fields = [
    { label: 'Name',       key: 'name' },
    { label: 'Email',      key: 'email' },
    { label: 'Student ID', key: 'studentId' },
  ];

  return (
    <div>
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      <div className="nav-tabs">
        <button onClick={() => navigate('/home')}>HOME</button>
        <button onClick={() => navigate('/dashboard')}>DASHBOARD</button>
        <button onClick={() => navigate('/parking-map')}>PARKING MAP</button>
        <button onClick={() => navigate('/notifications')}>NOTIFICATIONS</button>
        <button className="active">SETTINGS</button>
      </div>

      {/* PROFILE CARD */}
      <div className="glass-card">
        <h2>Profile Info</h2>

        <div className="area-card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          <div style={{
            width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
            margin: '0 auto 12px', background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            {photo
              ? <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <User size={48} color="rgba(255,255,255,0.7)" />
            }
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => fileInputRef.current.click()}
              style={{ background: '#8b4a4a', border: 'none', color: 'white', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              📷 Change Photo
            </button>
            {photo && (
              <button onClick={handleRemovePhoto}
                style={{ background: 'transparent', border: '1px solid rgba(255,100,100,0.6)', color: '#ff8080', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                🗑 Remove Photo
              </button>
            )}
          </div>
          {photo && <p style={{ marginTop: '8px', fontSize: '11px', color: '#aaa' }}>Photo saved — will persist after refresh.</p>}
        </div>

        {/* Profile fields — pulled from real session */}
        {fields.map((f) => (
          <div key={f.key} className="area-card">
            <div className="area-header"><span>{f.label}</span></div>
            <input
              type="text"
              value={currentUser[f.key] || '—'}
              readOnly
              style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none', opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
        ))}
      </div>

      {/* CHANGE PASSWORD — calls real backend */}
      <div className="glass-card">
        <h2>Change Password</h2>
        {[
          { label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password' },
          { label: 'New Password',     name: 'newPassword',     placeholder: 'Enter new password' },
          { label: 'Confirm Password', name: 'confirmPassword', placeholder: 'Confirm new password' },
        ].map((f) => (
          <div key={f.name} className="area-card">
            <div className="area-header"><span>{f.label}</span></div>
            <input
              type="password"
              name={f.name}
              value={passwords[f.name]}
              onChange={handlePasswordChange}
              placeholder={f.placeholder}
              style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none' }}
            />
          </div>
        ))}

        {pwStatus.msg && (
          <p style={{ color: pwStatus.ok ? 'lightgreen' : '#ff6b6b', fontSize: '13px', margin: '10px 0 0' }}>
            {pwStatus.ok ? '✅' : '⚠'} {pwStatus.msg}
          </p>
        )}

        <div style={{ marginTop: '14px', textAlign: 'right' }}>
          <button
            onClick={handleSavePassword}
            disabled={pwLoading}
            style={{ background: pwLoading ? '#555' : '#4a8b4a', border: 'none', color: 'white', padding: '9px 22px', borderRadius: '8px', cursor: pwLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            {pwLoading ? '⏳ Saving…' : '💾 Change Password'}
          </button>
        </div>
      </div>

      {/* ACCOUNT */}
      <div className="glass-card">
        <h2>Account</h2>
        <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>Sign out of your account on this device.</p>
        <button onClick={handleLogout}
          style={{ background: 'red', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
          LOG OUT
        </button>
      </div>
    </div>
  );
}