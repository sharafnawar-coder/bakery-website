import { useState, useEffect } from 'react';
import api from '../api';

const statusColors = {
  placed:    { bg: '#fff8e8', color: '#c09040', border: '#f5d99a' },
  preparing: { bg: '#fff0f8', color: '#a0409a', border: '#f5a0e0' },
  ready:     { bg: '#f0f5ff', color: '#3a5aaa', border: '#b0c5f0' },
  delivered: { bg: '#f0faf4', color: '#3a7a5a', border: '#b0e0c0' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);

  const load = () => api.get('/orders/all').then(r => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      alert('Error updating status');
    }
    setUpdating(null);
  };

  const nextStatus = {
    placed: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
    delivered: null,
  };

  const nextLabel = {
    placed: '👩‍🍳 Start Preparing',
    preparing: '✅ Mark Ready',
    ready: '🚗 Mark Delivered',
    delivered: null,
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          All Orders 📦
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Update order status to keep customers informed in real time.
        </p>

        {/* Status legend */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(statusColors).map(([s, c]) => (
            <div key={s} style={{
              background: c.bg, color: c.color, border: `1px solid ${c.border}`,
              padding: '0.3rem 0.9rem', borderRadius: '20px',
              fontSize: '0.82rem', fontWeight: '700',
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</div>
          ))}
          <span style={{ color: '#b08a80', fontSize: '0.82rem', alignSelf: 'center' }}>
            ← Click the action button to move orders through these stages
          </span>
        </div>

        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #c0635a, #d4796f)' }}>
                {['Order', 'Customer', 'Type', 'Schedule', 'Total', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.88rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#c4a09a' }}>
                  No orders yet.
                </td></tr>
              )}
              {orders.map((o, i) => {
                const sc = statusColors[o.status] || statusColors.placed;
                const next = nextStatus[o.status];
                const label = nextLabel[o.status];
                return (
                  <tr key={o.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7' }}>
                    <td style={{ padding: '0.9rem 1rem', color: '#c4a09a', fontSize: '0.85rem' }}>#{o.id}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#4a3728', fontSize: '0.88rem' }}>{o.customer_name}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.85rem' }}>
                      {o.delivery_type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.82rem' }}>
                      {o.scheduled_date ? `${o.scheduled_date} ${o.scheduled_time || ''}` : '—'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#c0635a', fontWeight: '700' }}>
                      ${parseFloat(o.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        padding: '0.2rem 0.8rem', borderRadius: '15px',
                        fontSize: '0.8rem', fontWeight: '700',
                      }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {next ? (
                        <button
                          onClick={() => updateStatus(o.id, next)}
                          disabled={updating === o.id}
                          style={{
                            background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                            color: 'white', border: 'none',
                            padding: '0.35rem 0.8rem', borderRadius: '8px',
                            cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem',
                            fontFamily: 'Nunito, sans-serif',
                            opacity: updating === o.id ? 0.6 : 1,
                            whiteSpace: 'nowrap',
                          }}>
                          {updating === o.id ? '...' : label}
                        </button>
                      ) : (
                        <span style={{ color: '#3a7a5a', fontWeight: '600', fontSize: '0.82rem' }}>✓ Complete</span>
                      )}
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