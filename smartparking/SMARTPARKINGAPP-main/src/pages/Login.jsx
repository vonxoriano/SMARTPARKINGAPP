import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthAPI } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await AuthAPI.login(idNumber, password);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Invalid ID Number or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-logo-strip">
          <img src={logo} alt="CIT-U Logo" />
          <div className="login-logo-text">
            <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
            <p>Smart Parking Management System</p>
          </div>
        </div>
        <div className="login-card">
          <h2 className="login-card-title">SIGN IN</h2>
          <p className="login-card-sub">Enter your credentials to continue</p>
          <form onSubmit={handleLogin} autoComplete="off">
            <div className="login-field">
              <label>ID Number</label>
              <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="e.g. 12-3456-789" autoComplete="off" />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" />
            </div>
            {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: '8px 0' }}>⚠ {error}</p>}
            <div className="login-forgot"><button type="button">Forgot Password?</button></div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Logging in…' : 'LOG IN'}
            </button>
          </form>
          <div className="login-divider"><span /><p>or</p><span /></div>
          <div className="login-footer">
            Don't have an account?
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}