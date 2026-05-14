import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const getEmoji = (name) => {
  const n = name.toLowerCase();
  if (n.includes('cupcake')) return '🧁';
  if (n.includes('brownie')) return '🍫';
  if (n.includes('pie')) return '🥧';
  if (n.includes('baklava')) return '🍯';
  if (n.includes('cake') && !n.includes('cupcake')) return '🎂';
  return '🍬';
};

const getCategory = (name) => {
  const n = name.toLowerCase();
  if (n.includes('cupcake')) return 'Cupcakes';
  if (n.includes('brownie')) return 'Brownies';
  if (n.includes('pie')) return 'Pies';
  if (n.includes('baklava')) return 'Baklava';
  if (n.includes('cake') && !n.includes('cupcake')) return 'Cakes';
  return 'Other';
};

function ImageSlideshow({ images, productName }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div style={{
        width: '100%', height: '180px', background: '#fff5f2',
        borderRadius: '16px', marginBottom: '1rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '3.5rem',
      }}>
        {getEmoji(productName)}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', marginBottom: '1rem' }}>
      <img
        src={images[current]?.image_url}
        alt={productName}
        style={{
          width: '100%', height: '180px', objectFit: 'cover',
          borderRadius: '16px', border: '1px solid #fde8e0',
          display: 'block',
        }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); }}
            style={{
              position: 'absolute', left: '8px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              borderRadius: '50%', width: '28px', height: '28px',
              cursor: 'pointer', color: '#c0635a', fontWeight: 'bold',
              fontSize: '1rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>‹</button>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); }}
            style={{
              position: 'absolute', right: '8px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              borderRadius: '50%', width: '28px', height: '28px',
              cursor: 'pointer', color: '#c0635a', fontWeight: 'bold',
              fontSize: '1rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>›</button>
          <div style={{
            position: 'absolute', bottom: '8px', left: '50%',
            transform: 'translateX(-50%)', display: 'flex', gap: '4px',
          }}>
            {images.map((_, i) => (
              <div key={i}
                onClick={e => { e.stopPropagation(); setCurrent(i); }}
                style={{
                  width: i === current ? '16px' : '6px',
                  height: '6px', borderRadius: '3px',
                  background: i === current ? '#c0635a' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [qty, setQty] = useState({});
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [added, setAdded] = useState({});
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Cupcakes', 'Cakes', 'Brownies', 'Pies', 'Baklava'];

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data);
      r.data.forEach(p => {
        api.get(`/products/${p.id}/images`).then(imgRes => {
          setProductImages(prev => ({ ...prev, [p.id]: imgRes.data }));
        }).catch(() => {
          if (p.image_url) {
            setProductImages(prev => ({
              ...prev,
              [p.id]: [{ image_url: p.image_url, is_primary: true }]
            }));
          }
        });
      });
    });
  }, []);

  const addToCart = (product) => {
    if (!user) return navigate('/login');
    const quantity = qty[product.id] || 1;
    const existing = cart.find(i => i.product_id === product.id);
    const newCart = existing
      ? cart.map(i => i.product_id === product.id
          ? { ...i, quantity: i.quantity + quantity } : i)
      : [...cart, {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setAdded({ ...added, [product.id]: true });
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1500);
  };

  const filtered = products.filter(p => {
    const raw = search.trim().toLowerCase();
    const term = raw.length > 2 && raw.endsWith('s') ? raw.slice(0, -1) : raw;
    if (term !== '') {
      return (
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        getCategory(p.name).toLowerCase().includes(term)
      );
    }
    return filter === 'All' || getCategory(p.name) === filter;
  });

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem', color: '#c0635a', marginBottom: '0.5rem',
          }}>Our Sweet Shop 🍰</h1>
          <p style={{ color: '#b08a80', fontWeight: 300 }}>
            Everything made fresh, baked with love 💕
          </p>
        </div>

        {/* Search + Category filter */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <span style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', fontSize: '1rem',
                color: '#c4a09a', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search sweets... (e.g. cake, chocolate, vanilla)"
                value={search}
                onChange={e => { setSearch(e.target.value); setFilter('All'); }}
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.8rem',
                  borderRadius: '25px', border: '1.5px solid #fde8e0',
                  fontSize: '0.92rem', background: 'white', color: '#4a3728',
                  outline: 'none', fontFamily: 'Nunito, sans-serif',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 10px rgba(192,99,90,0.07)',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #fde8e0'}
              />
              {search && (
                <button onClick={() => { setSearch(''); setFilter('All'); }} style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#c4a09a',
                  fontSize: '1rem', fontWeight: 'bold', lineHeight: 1,
                }}>✕</button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setFilter(cat); setSearch(''); }} style={{
                padding: '0.5rem 1.2rem', borderRadius: '25px',
                border: filter === cat ? '2px solid #c0635a' : '1.5px solid #fde8e0',
                background: filter === cat ? '#c0635a' : 'white',
                color: filter === cat ? 'white' : '#b08a80',
                fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {products.length === 0 && (
          <div style={{ textAlign: 'center', color: '#c4a09a', fontSize: '1.1rem', marginTop: '3rem' }}>
            Loading sweets... 🌸
          </div>
        )}

        {/* No results */}
        {products.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#c4a09a', marginTop: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No sweets found {search ? `for "${search}"` : `in ${filter}`}
            </p>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem', fontWeight: 300 }}>
              Try: cake, cupcake, brownie, baklava, chocolate, vanilla, strawberry
            </p>
            <button onClick={() => { setSearch(''); setFilter('All'); }} style={{
              background: '#c0635a', color: 'white', border: 'none',
              padding: '0.6rem 1.5rem', borderRadius: '25px', cursor: 'pointer',
              fontWeight: '700', fontFamily: 'Nunito, sans-serif',
            }}>Show All Sweets</button>
          </div>
        )}

        {/* Products grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map(p => (
            <div key={p.id} style={{
              background: 'white', borderRadius: '20px', padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(192,99,90,0.07)',
              border: '1px solid #fde8e0', textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(192,99,90,0.14)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,99,90,0.07)';
            }}>
              <ImageSlideshow
                images={productImages[p.id] || []}
                productName={p.name}
              />
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                color: '#4a3728', fontSize: '1.05rem', marginBottom: '0.4rem',
              }}>{p.name}</h3>
              <p style={{
                color: '#b08a80', fontSize: '0.82rem',
                marginBottom: '0.8rem', lineHeight: 1.5, fontWeight: 300,
              }}>{p.description}</p>
              <div style={{
                color: '#c0635a', fontSize: '1.3rem',
                fontWeight: '700', marginBottom: '0.5rem',
              }}>${parseFloat(p.price).toFixed(2)}</div>
              <div style={{
                fontSize: '0.78rem', marginBottom: '1rem',
                background: p.stock_quantity > 0 ? '#f0faf4' : '#fff5f5',
                color: p.stock_quantity > 0 ? '#5a9e7a' : '#e08080',
                padding: '0.2rem 0.7rem', borderRadius: '20px',
                display: 'inline-block', fontWeight: '600',
              }}>
                {p.stock_quantity > 0 ? `✓ ${p.stock_quantity} in stock` : '✗ Out of stock'}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem', marginBottom: '0.8rem',
              }}>
                <button
                  onClick={() => setQty(q => ({ ...q, [p.id]: Math.max(1, (q[p.id] || 1) - 1) }))}
                  style={{
                    background: '#fde8e0', border: 'none', borderRadius: '8px',
                    width: '30px', height: '30px', cursor: 'pointer',
                    color: '#c0635a', fontSize: '1.1rem', fontWeight: 'bold',
                  }}>−</button>
                <span style={{ minWidth: '24px', fontWeight: '700', color: '#4a3728' }}>
                  {qty[p.id] || 1}
                </span>
                <button
                  onClick={() => setQty(q => ({ ...q, [p.id]: (q[p.id] || 1) + 1 }))}
                  style={{
                    background: '#fde8e0', border: 'none', borderRadius: '8px',
                    width: '30px', height: '30px', cursor: 'pointer',
                    color: '#c0635a', fontSize: '1.1rem', fontWeight: 'bold',
                  }}>+</button>
              </div>
              <button
                onClick={() => addToCart(p)}
                disabled={p.stock_quantity === 0}
                style={{
                  width: '100%', padding: '0.7rem',
                  background: added[p.id] ? '#5a9e7a' : 'linear-gradient(135deg, #c0635a, #d4796f)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  cursor: p.stock_quantity === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '700', fontSize: '0.9rem',
                  transition: 'background 0.3s',
                  opacity: p.stock_quantity === 0 ? 0.5 : 1,
                  fontFamily: 'Nunito, sans-serif',
                }}>
                {added[p.id] ? '✓ Added!' : 'Add to Cart 🛒'}
              </button>
            </div>
          ))}
        </div>

        {/* Savory Coming Soon */}
        <div style={{
          marginTop: '4rem', background: 'white', borderRadius: '24px',
          padding: '3rem 2rem', textAlign: 'center',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥐</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#c0635a', fontSize: '1.8rem', marginBottom: '0.4rem',
          }}>Our Savory Collection</h2>
          <p style={{
            color: '#c4a09a', fontSize: '1rem', fontWeight: '300',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>Coming Soon</p>
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap',
          }}>
            {['🥪', '🥗', '🫓', '🧆'].map((e, i) => (
              <div key={i} style={{
                background: '#fdf5f2', borderRadius: '16px',
                padding: '1.2rem 1.5rem', fontSize: '2rem',
                border: '1px dashed #f5c5b5',
              }}>{e}</div>
            ))}
          </div>
          <p style={{
            color: '#c4a09a', fontSize: '0.85rem',
            marginTop: '1.5rem', fontWeight: '300',
          }}>
            We're working on something delicious — stay tuned! 🌸
          </p>
        </div>
      </div>
    </div>
  );
}