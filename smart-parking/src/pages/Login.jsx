import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-wrap">
          <div className="auth-logo-box">
            <div className="auth-logo-inner">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="auth-app-title">Smart Parking</h1>
          <p className="auth-app-sub">CIT-U Parking System</p>
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">LOG IN</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>ID NUMBER</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="12-3456-789"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>
            <div className="auth-actions">
              <button type="button" className="btn-forgot">Forgot Password?</button>
            </div>
            <button type="submit" className="btn-submit">LOG IN</button>
          </form>
          <div className="auth-footer">
            <span>Don't have an account? </span>
            <button className="btn-link" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
