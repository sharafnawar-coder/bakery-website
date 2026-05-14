import { Link } from 'react-router-dom';

const categories = [
  {
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    name: 'Cupcakes',
    desc: 'Chocolate, Vanilla, Red Velvet & more',
  },
  {
    image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400',
    name: 'Pies',
    desc: 'Blueberry, Strawberry, Tiramisu & more',
  },
  {
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400',
    name: 'Baklava',
    desc: 'Small, Medium & Large sizes',
  },
  {
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    name: 'Cakes',
    desc: '2-Tier Chocolate, Strawberry & more',
  },
  {
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    name: 'Brownies',
    desc: 'Fudgy, Nutella, Walnut & more',
  },
];

export default function Home() {
  return (
    <div style={{ background: '#FFFAF7' }}>

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
          background: 'rgba(224,150,130,0.12)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '250px', height: '250px',
          background: 'rgba(224,150,130,0.08)',
          borderRadius: '50%',
        }} />

        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎀</div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: '#c0635a',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          Sharaf's Sweets
        </h1>
        <p style={{
          color: '#a07060',
          fontSize: '1.15rem',
          maxWidth: '480px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          Handcrafted with love — every bite tells a sweet story 🌸
        </p>
        <Link to="/shop" style={{
          background: '#c0635a',
          color: 'white',
          padding: '0.9rem 2.5rem',
          borderRadius: '35px',
          fontSize: '1rem',
          fontWeight: '700',
          display: 'inline-block',
          boxShadow: '0 8px 25px rgba(192,99,90,0.35)',
          letterSpacing: '0.3px',
        }}>
          Shop Now ✨
        </Link>
      </div>

      {/* Categories */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          color: '#c0635a',
          marginBottom: '0.5rem',
        }}>Our Sweet Collection</h2>
        <p style={{ textAlign: 'center', color: '#b08a80', marginBottom: '3rem', fontWeight: 300 }}>
          Made fresh, baked with love 💕
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          {categories.map((p, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
              border: '1px solid #fde8e0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(192,99,90,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,99,90,0.08)';
            }}>
              <img src={p.image} alt={p.name} style={{
                width: '100%', height: '150px', objectFit: 'cover',
              }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#c0635a', fontSize: '1.1rem', marginBottom: '0.3rem',
                }}>{p.name}</h3>
                <p style={{ color: '#b08a80', fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 300 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f9e4dc, #fce8e0)',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        margin: '1rem 0',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          color: '#c0635a',
          fontSize: '1.8rem',
          marginBottom: '0.8rem',
        }}>Every Sweet Made to Order 🍰</h2>
        <p style={{ color: '#a07060', fontWeight: 300, fontSize: '1rem', marginBottom: '1.5rem' }}>
          Fresh ingredients · Handcrafted daily · Made with love
        </p>
        <Link to="/shop" style={{
          background: 'white',
          color: '#c0635a',
          padding: '0.75rem 2rem',
          borderRadius: '30px',
          fontWeight: '700',
          boxShadow: '0 4px 15px rgba(192,99,90,0.15)',
          display: 'inline-block',
        }}>Browse All Sweets</Link>
      </div>

      {/* Savory Coming Soon */}
      <div style={{
        padding: '3.5rem 2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥐</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#c0635a', fontSize: '1.8rem',
            marginBottom: '0.4rem',
          }}>Our Savory Collection</h2>
          <p style={{
            color: '#c4a09a', fontSize: '1rem',
            fontWeight: '300', letterSpacing: '3px',
            textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>Coming Soon</p>
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '1.2rem', flexWrap: 'wrap', marginBottom: '1.5rem',
          }}>
            {[
              { emoji: '🥪', label: 'Sandwiches' },
              { emoji: '🥗', label: 'Salads' },
              { emoji: '🫓', label: 'Flatbreads' },
              { emoji: '🧆', label: 'Bites' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fdf5f2', borderRadius: '14px',
                padding: '1rem 1.2rem', textAlign: 'center',
                border: '1px dashed #f5c5b5', minWidth: '90px',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{item.emoji}</div>
                <div style={{ color: '#c4a09a', fontSize: '0.78rem', fontWeight: '300' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#c4a09a', fontSize: '0.85rem', fontWeight: '300' }}>
            Something savory is on the way — we can't wait to share it with you 🌸
          </p>
        </div>
      </div>

      {/* Instagram Feed */}
<div style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2rem', marginBottom: '0.5rem' }}>
      Follow Us on Instagram
    </h2>
    <a href="https://instagram.com/sharafssweets" target="_blank" rel="noreferrer"
      style={{ color: '#b08a80', fontWeight: 300, textDecoration: 'none' }}>
      @sharafssweets 🌸
    </a>
  </div>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '0.8rem',
    marginBottom: '1.5rem',
  }}>
    {[
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
      'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=300',
      'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=300',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300',
    ].map((url, i) => (
      <a key={i} href="https://instagram.com/sharafssweets" target="_blank" rel="noreferrer"
        style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <img src={url} alt="Instagram" style={{
          width: '100%', height: '160px', objectFit: 'cover', display: 'block',
          transition: 'transform 0.3s',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(192,99,90,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,99,90,0.3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(192,99,90,0)'}>
          <span style={{ color: 'white', fontSize: '1.5rem', opacity: 0 }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0}>📸</span>
        </div>
      </a>
    ))}
  </div>
  <div style={{ textAlign: 'center' }}>
    <a href="https://instagram.com/sharafssweets" target="_blank" rel="noreferrer" style={{
      display: 'inline-block', background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      color: 'white', padding: '0.75rem 2rem', borderRadius: '25px',
      fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none',
    }}>📸 Follow on Instagram</a>
  </div>
</div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#c4a09a',
        fontSize: '0.85rem',
        fontWeight: 300,
      }}>
        🎀 Sharaf's Sweets · Made with love
      </div>

    </div>
  );
}