import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Update cart count whenever localStorage changes
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };
    updateCount();
    // Listen for storage changes
    window.addEventListener('storage', updateCount);
    // Also poll every second to catch same-tab updates
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const linkStyle = {
    color: '#7a5c58', fontSize: '0.95rem', fontWeight: '600',
    textDecoration: 'none', transition: 'color 0.2s',
  };

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #f5ddd5',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.6rem', fontWeight: '700',
        color: '#c0635a', textDecoration: 'none', letterSpacing: '-0.5px',
      }}>
        🎀 Sharaf's Sweets
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {[
          { to: '/shop', label: 'Shop' },
          { to: '/about', label: 'About & Gallery' },
          { to: '/catering', label: 'Catering' },
          { to: '/faq', label: 'FAQ' },
        ].map(l => (
          <Link key={l.to} to={l.to} style={linkStyle}
            onMouseEnter={e => e.target.style.color = '#c0635a'}
            onMouseLeave={e => e.target.style.color = '#7a5c58'}>
            {l.label}
          </Link>
        ))}

        {user?.role === 'admin' && (
          <Link to="/admin" style={linkStyle}
            onMouseEnter={e => e.target.style.color = '#c0635a'}
            onMouseLeave={e => e.target.style.color = '#7a5c58'}>
            ⚙️ Admin
          </Link>
        )}

        {user && (
          <>
            {/* Cart with badge */}
            <Link to="/cart" style={{ ...linkStyle, position: 'relative', display: 'inline-flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.querySelector('span')?.style && (e.currentTarget.style.color = '#c0635a')}
              onMouseLeave={e => e.currentTarget.style.color = '#7a5c58'}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-10px', right: '-14px',
                  background: '#c0635a', color: 'white',
                  borderRadius: '50%', width: '20px', height: '20px',
                  fontSize: '0.7rem', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(192,99,90,0.4)',
                  animation: 'pulse 0.3s ease',
                }}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            <Link to="/my-orders" style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#c0635a'}
              onMouseLeave={e => e.target.style.color = '#7a5c58'}>
              My Orders
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" style={{ color: '#c0635a', fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{
              background: '#c0635a', color: 'white',
              padding: '0.5rem 1.3rem', borderRadius: '25px',
              fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
            }}>Join Us</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ color: '#c0635a', fontWeight: '600', fontSize: '0.9rem' }}>
              Hi, {user.name?.split(' ')[0]}! 🌸
            </span>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1.5px solid #e8b4a0',
              color: '#c0635a', padding: '0.4rem 1rem', borderRadius: '25px',
              cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            }}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}