import { useState, useEffect } from 'react';
import api from '../api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/products').then(r => {
      const imgs = [];
      r.data.forEach(p => {
        api.get(`/products/${p.id}/images`).then(imgRes => {
          imgRes.data.forEach(img => {
            imgs.push({ ...img, productName: p.name, category: getCategory(p.name) });
          });
          setImages([...imgs]);
        }).catch(() => {
          if (p.image_url) {
            imgs.push({ image_url: p.image_url, productName: p.name, category: getCategory(p.name) });
            setImages([...imgs]);
          }
        });
      });
    });
  }, []);

  const getCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes('cupcake')) return 'Cupcakes';
    if (n.includes('brownie')) return 'Brownies';
    if (n.includes('pie')) return 'Pies';
    if (n.includes('baklava')) return 'Baklava';
    if (n.includes('cake') && !n.includes('cupcake')) return 'Cakes';
    return 'Other';
  };

  const categories = ['All', 'Cupcakes', 'Cakes', 'Brownies', 'Pies', 'Baklava'];
  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter);

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎨</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Our Gallery
          </h1>
          <p style={{ color: '#b08a80', fontWeight: 300 }}>
            A peek into our sweet creations 🌸
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: '0.5rem 1.2rem', borderRadius: '25px',
              border: filter === cat ? '2px solid #c0635a' : '1.5px solid #fde8e0',
              background: filter === cat ? '#c0635a' : 'white',
              color: filter === cat ? 'white' : '#b08a80',
              fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
            }}>{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((img, i) => (
            <div key={i}
              onClick={() => setSelected(img)}
              style={{
                borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(192,99,90,0.1)',
                border: '1px solid #fde8e0', position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(192,99,90,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(192,99,90,0.1)';
              }}>
              <img src={img.image_url} alt={img.productName}
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                onError={e => e.target.parentElement.style.display = 'none'} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(74,55,40,0.8))',
                padding: '1.5rem 0.8rem 0.8rem',
              }}>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>{img.productName}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{img.category}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#c4a09a', marginTop: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍰</div>
            <p>No photos yet — add product images from the admin panel!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            padding: '2rem',
          }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', overflow: 'hidden',
            maxWidth: '600px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <img src={selected.image_url} alt={selected.productName}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontWeight: '700' }}>
                  {selected.productName}
                </div>
                <div style={{ color: '#b08a80', fontSize: '0.85rem' }}>{selected.category}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: '#fde8e0', color: '#c0635a', border: 'none',
                padding: '0.5rem 1rem', borderRadius: '25px', cursor: 'pointer',
                fontWeight: '700', fontFamily: 'Nunito, sans-serif',
              }}>Close ✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}