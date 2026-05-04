import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthAPI } from '../api';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', studentId: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.studentId || !formData.email) { setError('Please fill in all fields.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match!'); return; }
    if (formData.password.length < 4) { setError('Password must be at least 4 characters.'); return; }

    setLoading(true);
    try {
      await AuthAPI.register(formData.name, formData.studentId, formData.email, formData.password);
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: 'none', outline: 'none' };

  return (
    <div>
      <div className="header-banner">
        <img src={logo} alt="logo" />
        <h1>CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY</h1>
      </div>
      <div className="glass-card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center' }}>REGISTER</h2>
        <form onSubmit={handleSubmit}>
          {[['Name','name','text'],['Student ID','studentId','text'],['Email','email','email'],
            ['Password','password','password'],['Confirm Password','confirmPassword','password']].map(([label, name, type]) => (
            <div key={name} className="area-card">
              <div className="area-header"><span>{label}</span></div>
              <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={label} style={inputStyle} />
            </div>
          ))}
          {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: '8px 0' }}>⚠ {error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 15, background: '#8b4a4a', border: 'none', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Registering…' : 'REGISTER'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={{ color: 'gold', cursor: 'pointer' }}>Login</span>
        </p>
      </div>
    </div>
  );
}
