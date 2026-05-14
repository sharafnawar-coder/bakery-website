import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/analytics')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#c4a09a' }}>Loading analytics... 🌸</p>
    </div>
  );

  const statCards = [
    { label: 'Total Revenue', value: `$${data?.totalRevenue?.toFixed(2) || '0.00'}`, emoji: '💰', bg: '#fff5f2', color: '#c0635a' },
    { label: 'Total Orders', value: data?.totalOrders || 0, emoji: '📦', bg: '#f0faf4', color: '#3a7a5a' },
    { label: 'Customers', value: data?.totalCustomers || 0, emoji: '👥', bg: '#fff8e8', color: '#c09040' },
    { label: 'Avg Order Value', value: `$${data?.totalOrders ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}`, emoji: '🧾', bg: '#f5f0ff', color: '#7a5aaa' },
  ];

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Sales Analytics 📊
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Overview of your sweet shop performance.
        </p>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map(c => (
            <div key={c.label} style={{
              background: c.bg, borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #fde8e0', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{c.emoji}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', color: c.color }}>{c.value}</div>
              <div style={{ color: '#b08a80', fontSize: '0.82rem', marginTop: '0.3rem' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Top Products */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.8rem',
            boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
          }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
              🏆 Top Products
            </h2>
            {data?.topProducts?.length === 0 && (
              <p style={{ color: '#c4a09a', fontSize: '0.9rem' }}>No sales data yet.</p>
            )}
            {data?.topProducts?.map((p, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.7rem 0', borderBottom: '1px solid #fde8e0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{
                    background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#fde8e0',
                    color: i < 3 ? 'white' : '#c0635a',
                    width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '700', flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ color: '#4a3728', fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c0635a', fontWeight: '700', fontSize: '0.9rem' }}>${parseFloat(p.revenue).toFixed(2)}</div>
                  <div style={{ color: '#b08a80', fontSize: '0.75rem' }}>{p.total_sold} sold</div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders per day */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.8rem',
            boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
          }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
              📅 Last 7 Days
            </h2>
            {data?.ordersPerDay?.length === 0 && (
              <p style={{ color: '#c4a09a', fontSize: '0.9rem' }}>No orders in the last 7 days.</p>
            )}
            {data?.ordersPerDay?.map((d, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.7rem 0', borderBottom: '1px solid #fde8e0',
              }}>
                <span style={{ color: '#7a5c58', fontSize: '0.88rem' }}>
                  {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c0635a', fontWeight: '700', fontSize: '0.9rem' }}>${parseFloat(d.revenue).toFixed(2)}</div>
                  <div style={{ color: '#b08a80', fontSize: '0.75rem' }}>{d.count} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid #fde8e0' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', margin: 0 }}>
              🕐 Recent Orders
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fdf5f2' }}>
                {['Order', 'Customer', 'Type', 'Total', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', color: '#c0635a', fontWeight: '600', fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7' }}>
                  <td style={{ padding: '0.9rem 1rem', color: '#c4a09a', fontSize: '0.85rem' }}>#{o.id}</td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#4a3728', fontSize: '0.9rem' }}>{o.customer_name}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.88rem' }}>{o.delivery_type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#c0635a', fontWeight: '700' }}>${parseFloat(o.total_amount).toFixed(2)}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      background: '#fff8e8', color: '#c09040',
                      border: '1px solid #f5d99a', padding: '0.2rem 0.8rem',
                      borderRadius: '15px', fontSize: '0.8rem', fontWeight: '700',
                    }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}