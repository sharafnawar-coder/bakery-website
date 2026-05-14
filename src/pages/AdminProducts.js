import { useState, useEffect } from 'react';
import api from '../api';

const inputStyle = {
  padding: '0.65rem 0.9rem', borderRadius: '10px',
  border: '1.5px solid #f5ddd5', fontSize: '0.9rem',
  background: '#fffaf7', color: '#4a3728', outline: 'none',
  flex: '1', minWidth: '130px', fontFamily: 'Nunito, sans-serif',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock_quantity: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMode, setImageMode] = useState('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [editImagePreview, setEditImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editImages, setEditImages] = useState({});

  const load = () => api.get('/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
// eslint-disable-next-line no-unused-vars
  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const submit = async () => {
    if (!form.name || !form.price) return alert('Name and price are required!');
    setUploading(true);
    try {
      let image_url = '';
      if (imageMode === 'upload' && imageFile) {
        image_url = await uploadImage(imageFile);
      } else if (imageMode === 'url' && imageUrlInput) {
        image_url = imageUrlInput;
      }
      await api.post('/products', { ...form, image_url });
      setForm({ name: '', description: '', price: '', stock_quantity: '' });
      setImageFile(null);
      setImagePreview('');
      setImageUrlInput('');
      load();
    } catch (err) {
      alert('Error adding product');
    }
    setUploading(false);
  };

  const del = async id => {
    if (window.confirm('Delete this product?')) { await api.delete(`/products/${id}`); load(); }
  };

  const loadImages = async (productId) => {
    const res = await api.get(`/products/${productId}/images`);
    setEditImages(prev => ({ ...prev, [productId]: res.data }));
  };

  const handleMultiImageUpload = async (e, productId) => {
    const files = Array.from(e.target.files);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('image', files[i]);
      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await uploadRes.json();
      await api.post('/products/images', {
        product_id: productId,
        image_url: data.url,
        is_primary: editImages[productId]?.length === 0 && i === 0,
      });
    }
    loadImages(productId);
  };

  const deleteImage = async (imageId, productId) => {
    await api.delete(`/products/images/${imageId}`);
    loadImages(productId);
  };

  const startEdit = p => {
    setEditId(p.id);
    setEditForm({ name: p.name, description: p.description, price: p.price, stock_quantity: p.stock_quantity, image_url: p.image_url });
    setEditImagePreview(p.image_url || '');
    setEditImageFile(null);
    loadImages(p.id);
  };

  const saveEdit = async id => {
    setUploading(true);
    try {
      let image_url = editForm.image_url;
      if (editImageFile) image_url = await uploadImage(editImageFile);
      await api.put(`/products/${id}`, { ...editForm, image_url });
      setEditId(null);
      setEditImageFile(null);
      setEditImagePreview('');
      load();
    } catch (err) {
      alert('Error saving product');
    }
    setUploading(false);
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '2rem' }}>
          Manage Products 🍬
        </h1>

        {/* Add product form */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.8rem',
          marginBottom: '2rem', boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
            Add New Product
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
            {[
              { name: 'name', placeholder: 'Product name' },
              { name: 'description', placeholder: 'Description' },
              { name: 'price', placeholder: 'Price ($)' },
              { name: 'stock_quantity', placeholder: 'Stock quantity' },
            ].map(f => (
              <input key={f.name} style={inputStyle} name={f.name}
                placeholder={f.placeholder} value={form[f.name]} onChange={handle}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
            ))}
          </div>

          {/* Image upload toggle */}
          <div style={{ width: '100%', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <button type="button" onClick={() => setImageMode('upload')} style={{
                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '0.85rem',
                background: imageMode === 'upload' ? '#c0635a' : '#fde8e0',
                color: imageMode === 'upload' ? 'white' : '#c0635a',
                border: imageMode === 'upload' ? '2px solid #c0635a' : '1.5px solid #e8b4a0',
              }}>📷 Upload from Computer</button>
              <button type="button" onClick={() => setImageMode('url')} style={{
                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '0.85rem',
                background: imageMode === 'url' ? '#c0635a' : '#fde8e0',
                color: imageMode === 'url' ? 'white' : '#c0635a',
                border: imageMode === 'url' ? '2px solid #c0635a' : '1.5px solid #e8b4a0',
              }}>🔗 Paste Image URL</button>
            </div>
            {imageMode === 'upload' && (
  <div>
    {/* Drag and drop zone */}
    <div
      onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = '#fde8e0'; e.currentTarget.style.borderColor = '#c0635a'; }}
      onDragLeave={e => { e.currentTarget.style.background = '#fffaf7'; e.currentTarget.style.borderColor = '#e8b4a0'; }}
      onDrop={e => {
        e.preventDefault();
        e.currentTarget.style.background = '#fffaf7';
        e.currentTarget.style.borderColor = '#e8b4a0';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
        } else {
          alert('Please drop an image file!');
        }
      }}
      style={{
        border: '2px dashed #e8b4a0', borderRadius: '12px',
        padding: '2rem', textAlign: 'center',
        background: '#fffaf7', cursor: 'pointer',
        marginBottom: '0.8rem', transition: 'all 0.2s',
      }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
      <p style={{ color: '#c0635a', fontWeight: '700', fontSize: '0.95rem', margin: '0 0 0.3rem' }}>
        Drag & Drop your photo here
      </p>
      <p style={{ color: '#b08a80', fontSize: '0.82rem', margin: '0 0 1rem' }}>
        or click the button below to browse
      </p>
      <label style={{
        background: '#c0635a', color: 'white',
        border: 'none', padding: '0.6rem 1.5rem',
        borderRadius: '25px', cursor: 'pointer',
        fontWeight: '700', fontSize: '0.88rem',
        fontFamily: 'Nunito, sans-serif',
        display: 'inline-block',
      }}>
        Browse Files
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
      </label>
    </div>

    {/* Preview */}
    {imagePreview && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={imagePreview} alt="preview" style={{
          width: '80px', height: '80px', objectFit: 'cover',
          borderRadius: '12px', border: '2px solid #fde8e0',
        }} />
        <div>
          <p style={{ color: '#3a7a5a', fontWeight: '700', fontSize: '0.88rem', margin: '0 0 0.3rem' }}>
            ✓ Photo ready to upload
          </p>
          <button onClick={() => { setImageFile(null); setImagePreview(''); }} style={{
            background: '#fff0f0', border: '1px solid #fdc5c5',
            color: '#e08080', padding: '0.3rem 0.8rem',
            borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '0.82rem',
          }}>Remove</button>
        </div>
      </div>
    )}
  </div>
)}
            
                    

            {imageMode === 'url' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <input
                  style={{ ...inputStyle, minWidth: '300px' }}
                  placeholder="Paste image URL here (e.g. https://...)"
                  value={imageUrlInput}
                  onChange={e => { setImageUrlInput(e.target.value); setImagePreview(e.target.value); }}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'}
                />
                {imageUrlInput && (
                  <img src={imageUrlInput} alt="preview"
                    onError={e => e.target.style.display = 'none'}
                    style={{
                      width: '70px', height: '70px', objectFit: 'cover',
                      borderRadius: '10px', border: '2px solid #fde8e0',
                    }} />
                )}
              </div>
            )}
          </div>

          <button onClick={submit} disabled={uploading} style={{
            background: 'linear-gradient(135deg, #c0635a, #d4796f)',
            color: 'white', border: 'none', padding: '0.65rem 1.5rem',
            borderRadius: '10px', cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '0.9rem', fontFamily: 'Nunito, sans-serif',
            opacity: uploading ? 0.7 : 1,
          }}>
            {uploading ? 'Saving...' : '+ Add Product'}
          </button>
        </div>

        {/* Products table */}
        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)', border: '1px solid #fde8e0',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #c0635a, #d4796f)' }}>
                {['Photos', 'Name', 'Description', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#fffaf7', verticalAlign: 'top' }}>

                  {editId === p.id ? (
                    <>
                      {/* PHOTO cell — multi upload */}
                      <td style={{ padding: '0.8rem', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                          {(editImages[p.id] || []).map(img => (
                            <div key={img.id} style={{ position: 'relative' }}>
                              <img src={img.image_url} alt="" style={{
                                width: '50px', height: '50px', objectFit: 'cover',
                                borderRadius: '8px',
                                border: img.is_primary ? '2px solid #c0635a' : '1px solid #fde8e0',
                              }} />
                              <button onClick={() => deleteImage(img.id, p.id)} style={{
                                position: 'absolute', top: '-6px', right: '-6px',
                                background: '#e05555', color: 'white', border: 'none',
                                borderRadius: '50%', width: '16px', height: '16px',
                                cursor: 'pointer', fontSize: '0.6rem', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>✕</button>
                            </div>
                          ))}
                          <label style={{
                            background: '#fde8e0', color: '#c0635a', border: '1px dashed #e8b4a0',
                            padding: '0.3rem 0.6rem', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.72rem', fontWeight: '700', whiteSpace: 'nowrap',
                          }}>
                            📷 Add
                            <input type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              multiple style={{ display: 'none' }}
                              onChange={e => handleMultiImageUpload(e, p.id)} />
                          </label>
                        </div>
                      </td>

                      {/* NAME */}
                      <td style={{ padding: '0.6rem' }}>
                        <input style={{ ...inputStyle, minWidth: '100px' }} value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      </td>

                      {/* DESCRIPTION */}
                      <td style={{ padding: '0.6rem' }}>
                        <input style={{ ...inputStyle, minWidth: '120px' }} value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                      </td>

                      {/* PRICE */}
                      <td style={{ padding: '0.6rem' }}>
                        <input style={{ ...inputStyle, minWidth: '70px' }} value={editForm.price}
                          onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                      </td>

                      {/* STOCK */}
                      <td style={{ padding: '0.6rem' }}>
                        <input style={{ ...inputStyle, minWidth: '60px' }} value={editForm.stock_quantity}
                          onChange={e => setEditForm({ ...editForm, stock_quantity: e.target.value })} />
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '0.6rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button onClick={() => saveEdit(p.id)} disabled={uploading} style={{
                            background: '#f0faf4', border: '1px solid #b0e0c0',
                            color: '#3a7a5a', padding: '0.35rem 0.8rem',
                            borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                          }}>{uploading ? '...' : 'Save'}</button>
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
                      {/* PHOTO cell — view mode */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} style={{
                            width: '55px', height: '55px', objectFit: 'cover',
                            borderRadius: '10px', border: '2px solid #fde8e0',
                          }} />
                        ) : (
                          <div style={{
                            width: '55px', height: '55px', background: '#fde8e0',
                            borderRadius: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '1.5rem',
                          }}>🍬</div>
                        )}
                      </td>

                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#4a3728', fontSize: '0.9rem' }}>{p.name}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#b08a80', fontSize: '0.85rem', maxWidth: '180px' }}>{p.description}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#c0635a', fontWeight: '700' }}>${parseFloat(p.price).toFixed(2)}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          background: p.stock_quantity > 0 ? '#f0faf4' : '#fff0f0',
                          color: p.stock_quantity > 0 ? '#3a7a5a' : '#e08080',
                          padding: '0.2rem 0.7rem', borderRadius: '15px',
                          fontSize: '0.82rem', fontWeight: '600',
                        }}>{p.stock_quantity}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
