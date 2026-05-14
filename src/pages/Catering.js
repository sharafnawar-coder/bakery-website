import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Catering() {
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [added, setAdded] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/site/catering').then(r => setPackages(r.data)).catch(() => {});
  }, []);

  const addToCart = (pkg) => {
    if (!user) return navigate('/login');
    if (!pkg.base_price || parseFloat(pkg.base_price) === 0) {
      alert('This package requires a custom quote. Please contact us at sharafssweets@gmail.com');
      return;
    }
    const existing = cart.find(i => i.product_id === `catering-${pkg.id}`);
    const newCart = existing
      ? cart.map(i => i.product_id === `catering-${pkg.id}`
          ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, {
          product_id: `catering-${pkg.id}`,
          name: pkg.name,
          price: parseFloat(pkg.base_price),
          quantity: 1,
          is_catering: true,
        }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setAdded({ ...added, [pkg.id]: true });
    setTimeout(() => setAdded(a => ({ ...a, [pkg.id]: false })), 2000);
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #fff0eb 0%, #fde8e0 50%, #fce4da 100%)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px',
          background: 'rgba(224,150,130,0.12)', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '250px', height: '250px',
          background: 'rgba(224,150,130,0.08)', borderRadius: '50%',
        }} />
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          color: '#c0635a', marginBottom: '1rem', lineHeight: 1.2,
        }}>
          Catering & Events
        </h1>
        <p style={{
          color: '#a07060', fontSize: '1.1rem',
          maxWidth: '520px', margin: '0 auto',
          lineHeight: 1.8, fontWeight: 300,
        }}>
          Make your special occasion even sweeter. We craft custom dessert
          experiences for weddings, birthdays, corporate events, and more 🌸
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Packages heading */}
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          color: '#c0635a', fontSize: '2rem',
          textAlign: 'center', marginBottom: '0.5rem',
        }}>
          Our Packages
        </h2>
        <p style={{
          textAlign: 'center', color: '#b08a80',
          fontWeight: 300, marginBottom: '3rem',
        }}>
          All packages are fully customizable to your needs 💕
        </p>

        {/* Packages grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}>
          {packages.map(pkg => {
            const includesList = pkg.includes ? pkg.includes.split(',') : [];
            const isAdded = added[pkg.id];
            const isCustom = !pkg.base_price || parseFloat(pkg.base_price) === 0;

            return (
              <div key={pkg.id} style={{
                background: pkg.is_featured ? '#fff0ed' : 'white',
                borderRadius: '20px',
                padding: '2rem',
                border: `2px solid ${pkg.is_featured ? '#c0635a' : '#fde8e0'}`,
                boxShadow: pkg.is_featured
                  ? '0 8px 30px rgba(192,99,90,0.2)'
                  : '0 4px 20px rgba(192,99,90,0.08)',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(192,99,90,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = pkg.is_featured
                  ? '0 8px 30px rgba(192,99,90,0.2)'
                  : '0 4px 20px rgba(192,99,90,0.08)';
              }}>

                {/* Featured badge */}
                {pkg.is_featured && (
                  <div style={{
                    position: 'absolute', top: '-14px',
                    left: '50%', transform: 'translateX(-50%)',
                    background: '#c0635a', color: 'white',
                    padding: '0.3rem 1.4rem', borderRadius: '20px',
                    fontSize: '0.78rem', fontWeight: '700',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(192,99,90,0.35)',
                  }}>⭐ Most Popular</div>
                )}

                {/* Emoji */}
                
<div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
  {pkg.emoji && pkg.emoji !== '?' && !pkg.emoji.includes('?')
    ? pkg.emoji
    : pkg.name.toLowerCase().includes('starter') ? '🧁'
    : pkg.name.toLowerCase().includes('celebration') ? '🎂'
    : pkg.name.toLowerCase().includes('wedding') ? '💍'
    : '🎉'}
</div>
                {/* Name */}
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#c0635a', fontSize: '1.4rem', marginBottom: '0.3rem',
                }}>{pkg.name}</h3>

                {/* Price */}
                <div style={{
                  color: '#c0635a', fontWeight: '700',
                  fontSize: '1.2rem', marginBottom: '0.6rem',
                }}>{pkg.price}</div>

                {/* Description */}
                <p style={{
                  color: '#b08a80', fontSize: '0.88rem',
                  marginBottom: '1.2rem', fontWeight: 300, lineHeight: 1.6,
                }}>{pkg.description}</p>

                {/* Includes list */}
                {includesList.length > 0 && (
                  <div style={{
                    borderTop: '1px solid #fde8e0',
                    paddingTop: '1rem',
                    marginBottom: '1.5rem',
                  }}>
                    {includesList.map((item, j) => (
                      <div key={j} style={{
                        display: 'flex', gap: '0.6rem',
                        marginBottom: '0.5rem', alignItems: 'flex-start',
                      }}>
                        <span style={{
                          color: '#c0635a', fontWeight: '700',
                          fontSize: '0.9rem', flexShrink: 0, marginTop: '1px',
                        }}>✓</span>
                        <span style={{ color: '#7a5c58', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {item.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add to cart button */}
                <button onClick={() => addToCart(pkg)} style={{
                  width: '100%', padding: '0.85rem',
                  background: isAdded
                    ? '#5a9e7a'
                    : isCustom
                    ? 'linear-gradient(135deg, #b08a80, #c4a09a)'
                    : 'linear-gradient(135deg, #c0635a, #d4796f)',
                  color: 'white', border: 'none',
                  borderRadius: '12px', cursor: 'pointer',
                  fontWeight: '700', fontSize: '0.95rem',
                  fontFamily: 'Nunito, sans-serif',
                  transition: 'all 0.3s',
                  boxShadow: isAdded
                    ? '0 4px 15px rgba(90,158,122,0.3)'
                    : '0 4px 15px rgba(192,99,90,0.3)',
                  letterSpacing: '0.2px',
                }}>
                  {isAdded
                    ? '✓ Added to Cart!'
                    : isCustom
                    ? '📧 Contact for Quote'
                    : '🛒 Add to Cart'}
                </button>

                {isCustom && (
                  <p style={{
                    textAlign: 'center', marginTop: '0.6rem',
                    fontSize: '0.78rem', color: '#c4a09a', fontWeight: 300,
                  }}>
                    Email us at sharafssweets@gmail.com
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Why choose us */}
        <div style={{
          background: 'white', borderRadius: '24px',
          padding: '3rem 2rem', border: '1px solid #fde8e0',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#c0635a', fontSize: '1.8rem',
            textAlign: 'center', marginBottom: '2rem',
          }}>
            Why Choose Sharaf's Sweets?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { emoji: '🌿', title: 'Fresh Daily', desc: 'Every item made fresh on the day of your event' },
              { emoji: '🎨', title: 'Fully Custom', desc: 'Colors, flavors, and designs tailored to your vision' },
              { emoji: '🚗', title: 'We Deliver', desc: 'On-time delivery and setup included in every package' },
              { emoji: '💝', title: 'Made with Love', desc: 'Every bite crafted with care and attention to detail' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{
                  fontSize: '2.5rem', marginBottom: '0.8rem',
                  background: '#fff5f2', borderRadius: '50%',
                  width: '64px', height: '64px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 0.8rem',
                }}>
                  {item.emoji}
                </div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700', color: '#4a3728',
                  marginBottom: '0.4rem', fontSize: '1rem',
                }}>{item.title}</div>
                <div style={{
                  color: '#b08a80', fontSize: '0.85rem',
                  fontWeight: 300, lineHeight: 1.6,
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}