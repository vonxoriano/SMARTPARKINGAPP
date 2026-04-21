import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div>
      {/* HEADER */}
      <div className="header-banner">
       <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>

      {/* AUTH CARD */}
      <div className="glass-card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center' }}>REGISTER</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="area-card">
            <div className="area-header">
              <span>Name</span>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={inputStyle}
            />
          </div>

          {/* STUDENT ID */}
          <div className="area-card">
            <div className="area-header">
              <span>Student ID</span>
            </div>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="12-3456-789"
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div className="area-card">
            <div className="area-header">
              <span>Email</span>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@cit-u.edu.ph"
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div className="area-card">
            <div className="area-header">
              <span>Password</span>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="area-card">
            <div className="area-header">
              <span>Confirm Password</span>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              style={inputStyle}
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: 15,
              background: '#8b4a4a',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            REGISTER
          </button>
        </form>

        {/* FOOTER */}
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            style={{ color: 'gold', cursor: 'pointer' }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {
  width: '100%',
  marginTop: 8,
  padding: 8,
  borderRadius: 8,
  border: 'none',
  outline: 'none',
};