import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  { to: '/admin/products', emoji: '🍬', label: 'Manage Products', desc: 'Add, edit or remove sweets' },
  { to: '/admin/inventory', emoji: '📦', label: 'Product Inventory', desc: 'Stock levels & low stock alerts' },
  { to: '/admin/ingredients', emoji: '🧂', label: 'Ingredients', desc: 'Track baking ingredients' },
  { to: '/admin/orders', emoji: '🛍️', label: 'View Orders', desc: 'See all customer orders' },
  { to: '/admin/purchase-orders', emoji: '📋', label: 'Purchase Orders', desc: 'Restock inventory' },
  { to: '/admin/analytics', emoji: '📊', label: 'Sales Analytics', desc: 'Revenue, top products, daily orders' },
  { to: '/admin/site', emoji: '🌐', label: 'Site Manager', desc: 'Edit about, contact, Instagram & catering' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem' }}>
            Admin Dashboard ⚙️
          </h1>
          <p style={{ color: '#b08a80', fontWeight: 300, marginTop: '0.3rem' }}>
            Welcome back, {user?.name}! Manage your sweet shop below.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {cards.map(c => (
            <Link key={c.to} to={c.to} style={{
              background: 'white', borderRadius: '20px',
              padding: '2rem 1.5rem', textAlign: 'center',
              boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
              border: '1px solid #fde8e0', textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s', display: 'block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(192,99,90,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,99,90,0.08)';
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{c.emoji}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '1.05rem', marginBottom: '0.4rem' }}>{c.label}</div>
              <div style={{ color: '#b08a80', fontSize: '0.82rem', fontWeight: 300 }}>{c.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}