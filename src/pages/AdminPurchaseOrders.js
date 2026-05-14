import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPurchaseOrders() {
  const [pos, setPos] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product_id: '', quantity: 1, unit_cost: '' }]);
  const [note, setNote] = useState('');

  const load = () => api.get('/purchase-orders').then(r => setPos(r.data));

  useEffect(() => {
    load();
    api.get('/products').then(r => setProducts(r.data));
  }, []);

  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = val;
    setItems(updated);
  };

  const submit = async () => {
    if (items[0].product_id === '') return alert('Please select at least one product!');
    for (const item of items) {
      if (!item.product_id) return alert('Please select a product for each item!');
      if (!item.quantity || item.quantity < 1) return alert('Please enter a valid quantity!');
    }
    try {
      await api.post('/purchase-orders', {
        supplier_id: 1,
        items: items.map(i => ({
          ...i,
          unit_cost: i.unit_cost || 0,
        })),
        note,
      });
      setItems([{ product_id: '', quantity: 1, unit_cost: '' }]);
      setNote('');
      alert('✅ Stock restock order created successfully!');
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating order');
    }
  };

  const receive = async id => {
    if (window.confirm('Mark this order as received? This will update stock levels.')) {
      await api.patch(`/purchase-orders/${id}/receive`);
      load();
    }
  };

  const selectStyle = {
    padding: '0.65rem 0.9rem', borderRadius: '10px',
    border: '1.5px solid #f5ddd5', fontSize: '0.9rem',
    background: '#fffaf7', color: '#4a3728', outline: 'none',
    flex: 1, fontFamily: 'Nunito, sans-serif',
  };

  const inputStyle = {
    ...selectStyle, minWidth: '80px',
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Purchase Orders 📋
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Use this section to restock your product inventory.
        </p>

        {/* Create PO form */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.8rem',
          marginBottom: '2rem', boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
            Restock Products
          </h2>

          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select style={{ ...selectStyle, flex: 2 }}
                value={item.product_id}
                onChange={e => updateItem(i, 'product_id', e.target.value)}>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (stock: {p.stock_quantity})</option>
                ))}
              </select>
              <input style={{ ...inputStyle, maxWidth: '100px' }}
                type="number" min="1" placeholder="Quantity"
                value={item.quantity}
                onChange={e => updateItem(i, 'quantity', e.target.value)} />
              <input style={{ ...inputStyle, maxWidth: '120px' }}
                type="number" min="0" placeholder="Unit cost ($)"
                value={item.unit_cost}
                onChange={e => updateItem(i, 'unit_cost', e.target.value)} />
              {items.length > 1 && (
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} style={{
                  background: '#fff0f0', border: '1px solid #fdc5c5',
                  color: '#e08080', padding: '0.4rem 0.8rem',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '700',
                }}>✕</button>
              )}
            </div>
          ))}

          <input
            style={{ ...inputStyle, width: '100%', marginBottom: '1rem', flex: 'none' }}
            placeholder="Note (optional, e.g. Weekly restock)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button onClick={() => setItems([...items, { product_id: '', quantity: 1, unit_cost: '' }])} style={{
              background: '#fde8e0', color: '#c0635a', border: 'none',
              padding: '0.6rem 1.2rem', borderRadius: '10px',
              cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif',
            }}>+ Add Another Product</button>
            <button onClick={submit} style={{
              background: 'linear-gradient(135deg, #c0635a, #d4796f)',
              color: 'white', border: 'none', padding: '0.6rem 1.5rem',
              borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
              fontFamily: 'Nunito, sans-serif',
            }}>Create Restock Order</button>
          </div>
        </div>

        {/* PO History */}
        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <div style={{ padding: '1.2rem 1.8rem', borderBottom: '1px solid #fde8e0' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', margin: 0 }}>
              Restock History
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #c0635a, #d4796f)' }}>
                {['PO ID', 'Status', 'Created', 'Received', 'Action'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pos.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#c4a09a' }}>
                  No restock orders yet.
                </td></tr>
              )}
              {pos.map((po, i) => (
                <tr key={po.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7' }}>
                  <td style={{ padding: '0.9rem 1rem', color: '#c4a09a', fontSize: '0.85rem' }}>#{po.id}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      background: po.status === 'received' ? '#f0faf4' : '#fff8e8',
                      color: po.status === 'received' ? '#3a7a5a' : '#c09040',
                      border: `1px solid ${po.status === 'received' ? '#b0e0c0' : '#f5d99a'}`,
                      padding: '0.2rem 0.8rem', borderRadius: '15px',
                      fontSize: '0.82rem', fontWeight: '700',
                    }}>{po.status}</span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.85rem' }}>
                    {new Date(po.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.85rem' }}>
                    {po.received_at ? new Date(po.received_at).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    {po.status === 'pending' ? (
                      <button onClick={() => receive(po.id)} style={{
                        background: '#f0faf4', border: '1px solid #b0e0c0',
                        color: '#3a7a5a', padding: '0.35rem 0.9rem',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                      }}>✓ Mark Received</button>
                    ) : (
                      <span style={{ color: '#3a7a5a', fontWeight: '600', fontSize: '0.85rem' }}>✓ Done</span>
                    )}
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