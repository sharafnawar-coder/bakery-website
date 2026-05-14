import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => { api.get('/products').then(r => setProducts(r.data)); }, []);

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: 'Out of stock', bg: '#fff0f0', color: '#e05555', border: '#fdc5c5' };
    if (qty < 10) return { label: 'Low stock', bg: '#fff8e8', color: '#c09040', border: '#f5d99a' };
    return { label: 'In stock', bg: '#f0faf4', color: '#3a7a5a', border: '#b0e0c0' };
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Inventory 📦
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Products with fewer than 10 units are flagged as low stock.
        </p>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Products', value: products.length, bg: '#f5f0ff', color: '#7a5aaa' },
            { label: 'Low Stock', value: products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length, bg: '#fff8e8', color: '#c09040' },
            { label: 'Out of Stock', value: products.filter(p => p.stock_quantity === 0).length, bg: '#fff0f0', color: '#e05555' },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, borderRadius: '16px', padding: '1.5rem',
              textAlign: 'center', border: '1px solid #fde8e0',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: c.color }}>{c.value}</div>
              <div style={{ color: '#b08a80', fontSize: '0.85rem', marginTop: '0.3rem' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #c0635a, #d4796f)' }}>
                {['Product', 'Category', 'Price', 'Stock Qty', 'Status'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const status = getStockStatus(p.stock_quantity);
                const category = p.name.toLowerCase().includes('cake') ? '🎂 Cake'
                  : p.name.toLowerCase().includes('cupcake') ? '🧁 Cupcake'
                  : p.name.toLowerCase().includes('pie') ? '🥧 Pie'
                  : p.name.toLowerCase().includes('baklava') ? '🍯 Baklava' : '🍬 Other';
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#4a3728' }}>{p.name}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.88rem' }}>{category}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#c0635a', fontWeight: '700' }}>${parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: p.stock_quantity < 10 ? '#c09040' : '#4a3728', fontSize: '1.05rem' }}>
                      {p.stock_quantity}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        background: status.bg, color: status.color,
                        border: `1px solid ${status.border}`,
                        padding: '0.25rem 0.9rem', borderRadius: '20px',
                        fontSize: '0.82rem', fontWeight: '700',
                      }}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}