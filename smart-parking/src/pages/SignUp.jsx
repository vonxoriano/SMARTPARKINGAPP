import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', studentId: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
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
          <h2 className="auth-card-title">REGISTER</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {[
              { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter your name' },
              { label: 'STUDENT ID NO', name: 'studentId', type: 'text', placeholder: '12-3456-789' },
              { label: 'INSTITUTIONAL EMAIL', name: 'email', type: 'email', placeholder: 'student@cit-u.edu.ph' },
              { label: 'PASSWORD', name: 'password', type: 'password', placeholder: 'Enter password' },
              { label: 'CONFIRM PASSWORD', name: 'confirmPassword', type: 'password', placeholder: 'Confirm password' },
            ].map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="form-input"
                />
              </div>
            ))}
            <button type="submit" className="btn-submit">REGISTER</button>
          </form>
          <div className="auth-footer">
            <span>Already have an account? </span>
            <button className="btn-link" onClick={() => navigate('/')}>Back to Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
