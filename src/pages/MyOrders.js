import { useState, useEffect } from 'react';
import api from '../api';

const statusSteps = ['placed', 'preparing', 'ready', 'delivered'];

const statusInfo = {
  placed:    { emoji: '📝', label: 'Order Placed',    color: '#c09040', bg: '#fff8e8', desc: 'We received your order!' },
  preparing: { emoji: '👩‍🍳', label: 'Preparing',       color: '#a0409a', bg: '#fff0f8', desc: 'Your sweets are being made!' },
  ready:     { emoji: '✅', label: 'Ready',           color: '#3a5aaa', bg: '#f0f5ff', desc: 'Your order is ready for pickup/delivery!' },
  delivered: { emoji: '🎉', label: 'Delivered',       color: '#3a7a5a', bg: '#f0faf4', desc: 'Enjoy your sweets!' },
};

function StatusTracker({ status }) {
  const currentIndex = statusSteps.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', flexWrap: 'wrap', gap: '0' }}>
      {statusSteps.map((step, i) => {
        const info = statusInfo[step];
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: done ? '#c0635a' : '#fde8e0',
                color: done ? 'white' : '#c4a09a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: active ? '1.1rem' : '0.9rem',
                margin: '0 auto 4px',
                boxShadow: active ? '0 0 0 3px rgba(192,99,90,0.25)' : 'none',
                transition: 'all 0.3s',
              }}>{done ? info.emoji : '○'}</div>
              <div style={{
                fontSize: '0.7rem', color: done ? '#c0635a' : '#c4a09a',
                fontWeight: active ? '700' : '400', maxWidth: '60px', textAlign: 'center',
              }}>{info.label}</div>
            </div>
            {i < statusSteps.length - 1 && (
              <div style={{
                width: '40px', height: '3px',
                background: i < currentIndex ? '#c0635a' : '#fde8e0',
                margin: '0 2px 20px', transition: 'all 0.3s',
                borderRadius: '2px',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data));
    // Auto-refresh every 30 seconds to catch status updates
    const interval = setInterval(() => {
      api.get('/orders/my').then(r => setOrders(r.data));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          My Orders 📦
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Track your orders in real time — page refreshes automatically every 30 seconds.
        </p>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', color: '#c4a09a', marginTop: '4rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <p>No orders yet — go treat yourself! 🍰</p>
          </div>
        )}

        {orders.map(o => {
          const info = statusInfo[o.status] || statusInfo.placed;
          const isExpanded = expanded === o.id;
          return (
            <div key={o.id} style={{
              background: 'white', borderRadius: '20px',
              marginBottom: '1rem', overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(192,99,90,0.07)',
              border: '1px solid #fde8e0',
            }}>
              {/* Order header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : o.id)}
                style={{
                  padding: '1.3rem 1.5rem', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: '600', color: '#4a3728' }}>
                      Order #{o.id}
                    </span>
                    <span style={{
                      background: info.bg, color: info.color,
                      padding: '0.2rem 0.8rem', borderRadius: '20px',
                      fontSize: '0.8rem', fontWeight: '700',
                    }}>{info.emoji} {info.label}</span>
                  </div>
                  <div style={{ color: '#b08a80', fontSize: '0.85rem' }}>
                    {o.delivery_type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                    {o.scheduled_date && ` · ${o.scheduled_date} at ${o.scheduled_time || ''}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c0635a', fontWeight: '700', fontSize: '1.1rem' }}>
                    ${parseFloat(o.total_amount).toFixed(2)}
                  </div>
                  <div style={{ color: '#c4a09a', fontSize: '0.78rem' }}>
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #fde8e0' }}>
                  <div style={{ paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#b08a80', marginBottom: '0.3rem', fontWeight: '600' }}>
                      Order Progress
                    </div>
                    <StatusTracker status={o.status} />
                    <div style={{
                      background: info.bg, border: `1px solid`,
                      borderColor: info.color + '44',
                      borderRadius: '10px', padding: '0.7rem 1rem',
                      color: info.color, fontWeight: '600', fontSize: '0.88rem',
                      marginTop: '0.5rem',
                    }}>
                      {info.emoji} {info.desc}
                    </div>
                  </div>

                  {o.address && (
                    <div style={{ marginTop: '1rem', color: '#7a5c58', fontSize: '0.88rem' }}>
                      <strong>Delivery address:</strong> {o.address}
                    </div>
                  )}

                  <div style={{ marginTop: '0.8rem', color: '#c4a09a', fontSize: '0.8rem' }}>
                    Placed on {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}