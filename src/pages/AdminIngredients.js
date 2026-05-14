import { useState, useEffect } from 'react';
import api from '../api';

const inputStyle = {
  padding: '0.65rem 0.9rem', borderRadius: '10px',
  border: '1.5px solid #f5ddd5', fontSize: '0.9rem',
  background: '#fffaf7', color: '#4a3728', outline: 'none',
  flex: '1', minWidth: '120px', fontFamily: 'Nunito, sans-serif',
};

const units = ['kg', 'g', 'lbs', 'oz', 'L', 'ml', 'cups', 'tbsp', 'tsp', 'pieces', 'bags', 'boxes'];

export default function AdminIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({ name: '', unit: 'kg', quantity: '', low_stock_threshold: '10' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = () => api.get('/ingredients').then(r => setIngredients(r.data));
  useEffect(() => { load(); }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.unit) return alert('Name and unit are required!');
    await api.post('/ingredients', form);
    setForm({ name: '', unit: 'kg', quantity: '', low_stock_threshold: '10' });
    load();
  };

  const del = async id => {
    if (window.confirm('Delete this ingredient?')) { await api.delete(`/ingredients/${id}`); load(); }
  };

  const startEdit = p => { setEditId(p.id); setEditForm({ ...p }); };
  const saveEdit = async id => { await api.put(`/ingredients/${id}`, editForm); setEditId(null); load(); };

  const getStatus = (qty, threshold) => {
    if (qty <= 0) return { label: 'Out of stock', bg: '#fff0f0', color: '#e05555', border: '#fdc5c5' };
    if (qty <= threshold) return { label: 'Low stock', bg: '#fff8e8', color: '#c09040', border: '#f5d99a' };
    return { label: 'In stock', bg: '#f0faf4', color: '#3a7a5a', border: '#b0e0c0' };
  };

  const outOfStock = ingredients.filter(i => i.quantity <= 0).length;
  const lowStock = ingredients.filter(i => i.quantity > 0 && i.quantity <= i.low_stock_threshold).length;

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Ingredients Inventory 🧂
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Track your baking ingredients and get low stock alerts.
        </p>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Ingredients', value: ingredients.length, bg: '#fff5f2', color: '#c0635a' },
            { label: 'Low Stock', value: lowStock, bg: '#fff8e8', color: '#c09040' },
            { label: 'Out of Stock', value: outOfStock, bg: '#fff0f0', color: '#e05555' },
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

        {/* Add ingredient form */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.8rem',
          marginBottom: '2rem', boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
            Add Ingredient
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            <input style={inputStyle} name="name" placeholder="Ingredient name (e.g. Flour)"
              value={form.name} onChange={handle}
              onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
              onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

            <select style={{ ...inputStyle, cursor: 'pointer', maxWidth: '110px' }}
              name="unit" value={form.unit} onChange={handle}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>

            <input style={{ ...inputStyle, maxWidth: '120px' }} name="quantity" type="number"
              placeholder="Quantity" value={form.quantity} onChange={handle}
              onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
              onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

            <input style={{ ...inputStyle, maxWidth: '150px' }} name="low_stock_threshold" type="number"
              placeholder="Low stock alert at" value={form.low_stock_threshold} onChange={handle}
              onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
              onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

            <button onClick={submit} style={{
              background: 'linear-gradient(135deg, #c0635a, #d4796f)',
              color: 'white', border: 'none', padding: '0.65rem 1.5rem',
              borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
              fontSize: '0.9rem', whiteSpace: 'nowrap', fontFamily: 'Nunito, sans-serif',
            }}>+ Add</button>
          </div>
        </div>

        {/* Ingredients table */}
        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #c0635a, #d4796f)' }}>
                {['Ingredient', 'Quantity', 'Unit', 'Low Stock Alert', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ingredients.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#c4a09a' }}>
                  No ingredients yet — add your first one above!
                </td></tr>
              )}
              {ingredients.map((p, i) => {
                const status = getStatus(p.quantity, p.low_stock_threshold);
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7' }}>
                    {editId === p.id ? (
                      <>
                        <td style={{ padding: '0.6rem' }}>
                          <input style={{ ...inputStyle, minWidth: '100px' }} value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        </td>
                        <td style={{ padding: '0.6rem' }}>
                          <input style={{ ...inputStyle, minWidth: '80px' }} type="number" value={editForm.quantity}
                            onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} />
                        </td>
                        <td style={{ padding: '0.6rem' }}>
                          <select style={{ ...inputStyle, minWidth: '80px' }} value={editForm.unit}
                            onChange={e => setEditForm({ ...editForm, unit: e.target.value })}>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.6rem' }}>
                          <input style={{ ...inputStyle, minWidth: '80px' }} type="number" value={editForm.low_stock_threshold}
                            onChange={e => setEditForm({ ...editForm, low_stock_threshold: e.target.value })} />
                        </td>
                        <td style={{ padding: '0.6rem' }} />
                        <td style={{ padding: '0.6rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => saveEdit(p.id)} style={{
                              background: '#f0faf4', border: '1px solid #b0e0c0',
                              color: '#3a7a5a', padding: '0.35rem 0.8rem',
                              borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                            }}>Save</button>
                            <button onClick={() => setEditId(null)} style={{
                              background: '#fde8e0', border: '1px solid #f5c5b5',
                              color: '#c0635a', padding: '0.35rem 0.8rem',
                              borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                            }}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#4a3728' }}>{p.name}</td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: p.quantity <= p.low_stock_threshold ? '#c09040' : '#4a3728' }}>
                          {p.quantity}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: '#b08a80' }}>{p.unit}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.88rem' }}>
                          Below {p.low_stock_threshold} {p.unit}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{
                            background: status.bg, color: status.color,
                            border: `1px solid ${status.border}`,
                            padding: '0.25rem 0.9rem', borderRadius: '20px',
                            fontSize: '0.82rem', fontWeight: '700',
                          }}>{status.label}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => startEdit(p)} style={{
                              background: '#fff8e8', border: '1px solid #f5d99a',
                              color: '#c09040', padding: '0.35rem 0.8rem',
                              borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem',
                            }}>Edit</button>
                            <button onClick={() => del(p.id)} style={{
                              background: '#fff0f0', border: '1px solid #fdc5c5',
                              color: '#e08080', padding: '0.35rem 0.8rem',
                              borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem',
                            }}>Delete</button>
                          </div>
                        </td>
                      </>
                    )}
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