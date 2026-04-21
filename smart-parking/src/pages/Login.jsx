import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LOGO STRIP */}
        <div className="login-logo-strip">
          <img src={logo} alt="CIT-U Logo" />
          <div className="login-logo-text">
            <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
            <p>Smart Parking Management System</p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="login-card">
          <h2 className="login-card-title">SIGN IN</h2>
          <p className="login-card-sub">Enter your credentials to continue</p>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label>ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. 12-3456-789"
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="login-forgot">
              <button type="button">Forgot Password?</button>
            </div>

            <button type="submit" className="login-submit">LOG IN</button>
          </form>

          <div className="login-divider">
            <span /><p>or</p><span />
          </div>

          <div className="login-footer">
            Don't have an account?
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>

      </div>
    </div>
  );
}
