import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      res.data.user.role === 'admin' ? navigate('/admin') : navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    borderRadius: '12px', border: '1.5px solid #f5ddd5',
    fontSize: '0.95rem', background: '#fffaf7',
    color: '#4a3728', outline: 'none',
    transition: 'border 0.2s', marginBottom: '1rem',
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #fff0eb, #fce4da)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: '3rem 2.5rem',
        boxShadow: '0 20px 60px rgba(192,99,90,0.12)',
        width: '100%', maxWidth: '420px',
        border: '1px solid #fde8e0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎀</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#c0635a', fontSize: '1.8rem',
          }}>Welcome Back</h1>
          <p style={{ color: '#b08a80', fontWeight: 300, marginTop: '0.3rem' }}>
            Login to your sweet account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #fdc5c5',
            borderRadius: '10px', padding: '0.7rem 1rem',
            color: '#e05555', marginBottom: '1rem', fontSize: '0.9rem',
          }}>{error}</div>
        )}

        <input style={inputStyle} name="email" placeholder="Email address" onChange={handle}
          onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
          onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
        <input style={inputStyle} name="password" type="password" placeholder="Password" onChange={handle}
          onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
          onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

        <button onClick={submit} style={{
          width: '100%', padding: '0.9rem',
          background: 'linear-gradient(135deg, #c0635a, #d4796f)',
          color: 'white', border: 'none',
          borderRadius: '12px', fontSize: '1rem',
          fontWeight: '700', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(192,99,90,0.3)',
          letterSpacing: '0.3px',
        }}>Login 🌸</button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#b08a80', fontSize: '0.9rem' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#c0635a', fontWeight: '700' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}