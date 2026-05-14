import { useState, useEffect } from 'react';
import api from '../api';

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  borderRadius: '10px', border: '1.5px solid #f5ddd5',
  fontSize: '0.9rem', background: '#fffaf7', color: '#4a3728',
  outline: 'none', fontFamily: 'Nunito, sans-serif',
  marginBottom: '0.8rem', boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle, height: '100px', resize: 'vertical',
};

const labelStyle = {
  display: 'block', color: '#7a5c58', fontWeight: '700',
  fontSize: '0.85rem', marginBottom: '0.3rem',
};

export default function AdminSiteManager() {
  const [content, setContent] = useState({});
  const [instaImages, setInstaImages] = useState([]);
  const [cateringPackages, setCateringPackages] = useState([]);
  const [newInsta, setNewInsta] = useState({ image_url: '', caption: '', post_url: '' });
  const [newPkg, setNewPkg] = useState({ name: '', emoji: '🎂', price: '', base_price: '', description: '', includes: '', is_featured: false, display_order: 0 });
  const [editPkg, setEditPkg] = useState(null);
  const [saved, setSaved] = useState('');
  const [tab, setTab] = useState('about');

  const loadAll = () => {
    api.get('/site').then(r => setContent(r.data)).catch(() => {});
    api.get('/site/instagram').then(r => setInstaImages(r.data)).catch(() => {});
    api.get('/site/catering').then(r => setCateringPackages(r.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const saveField = async (key, value) => {
    try {
      await api.put(`/site/${key}`, { value });
      setSaved(key);
      setTimeout(() => setSaved(''), 2000);
    } catch (err) {
      alert('Error saving — make sure backend is running');
    }
  };

  const addInsta = async () => {
    if (!newInsta.image_url) return alert('Please enter an image URL!');
    try {
      await api.post('/site/instagram', newInsta);
      setNewInsta({ image_url: '', caption: '', post_url: '' });
      api.get('/site/instagram').then(r => setInstaImages(r.data));
    } catch (err) {
      alert('Error adding post');
    }
  };

  const deleteInsta = async (id) => {
    if (window.confirm('Delete this Instagram post?')) {
      await api.delete(`/site/instagram/${id}`);
      api.get('/site/instagram').then(r => setInstaImages(r.data));
    }
  };

  const addPkg = async () => {
    if (!newPkg.name || !newPkg.price) return alert('Name and price are required!');
    try {
      await api.post('/site/catering', newPkg);
      setNewPkg({
        name: '', emoji: '🎂', price: '', base_price: '',
        description: '', includes: '', is_featured: false, display_order: 0,
      });
      api.get('/site/catering').then(r => setCateringPackages(r.data));
      alert('Package added successfully!');
    } catch (err) {
      alert('Error adding package');
    }
  };

  const savePkg = async () => {
    try {
      await api.put(`/site/catering/${editPkg.id}`, editPkg);
      setEditPkg(null);
      api.get('/site/catering').then(r => setCateringPackages(r.data));
    } catch (err) {
      alert('Error saving package');
    }
  };

  const deletePkg = async (id) => {
    if (window.confirm('Delete this catering package?')) {
      await api.delete(`/site/catering/${id}`);
      api.get('/site/catering').then(r => setCateringPackages(r.data));
    }
  };

  const tabs = [
    { id: 'about',     label: '📖 About Us' },
    { id: 'contact',   label: '📞 Contact Info' },
    { id: 'instagram', label: '📸 Instagram' },
    { id: 'catering',  label: '🎉 Catering Packages' },
  ];

  const SaveBtn = ({ fieldKey, value }) => (
    <button
      onClick={() => saveField(fieldKey, value)}
      style={{
        background: saved === fieldKey
          ? '#3a7a5a'
          : 'linear-gradient(135deg, #c0635a, #d4796f)',
        color: 'white', border: 'none',
        padding: '0.5rem 1.3rem', borderRadius: '8px',
        cursor: 'pointer', fontWeight: '700',
        fontSize: '0.85rem', fontFamily: 'Nunito, sans-serif',
        marginBottom: '1.2rem', transition: 'background 0.3s',
      }}>
      {saved === fieldKey ? '✓ Saved!' : 'Save'}
    </button>
  );

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Site Manager 🌐
        </h1>
        <p style={{ color: '#b08a80', fontWeight: 300, marginBottom: '2rem' }}>
          Edit your website content, contact info, Instagram posts, and catering packages.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.6rem 1.2rem', borderRadius: '25px', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '0.88rem',
              background: tab === t.id ? '#c0635a' : 'white',
              color: tab === t.id ? 'white' : '#b08a80',
              border: tab === t.id ? '2px solid #c0635a' : '1.5px solid #fde8e0',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{
          background: 'white', borderRadius: '20px', padding: '2rem',
          boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
          border: '1px solid #fde8e0',
        }}>

          {/* ── ABOUT TAB ── */}
          {tab === 'about' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                About Us Content
              </h2>

              <label style={labelStyle}>Page Title</label>
              <input style={inputStyle}
                value={content.about_title || ''}
                onChange={e => setContent({ ...content, about_title: e.target.value })}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <SaveBtn fieldKey="about_title" value={content.about_title} />

              <label style={labelStyle}>Our Story (main paragraph)</label>
              <textarea style={textareaStyle}
                value={content.about_story || ''}
                onChange={e => setContent({ ...content, about_story: e.target.value })}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <SaveBtn fieldKey="about_story" value={content.about_story} />

              <label style={labelStyle}>Our Mission (second paragraph)</label>
              <textarea style={textareaStyle}
                value={content.about_mission || ''}
                onChange={e => setContent({ ...content, about_mission: e.target.value })}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <SaveBtn fieldKey="about_mission" value={content.about_mission} />
            </div>
          )}

          {/* ── CONTACT TAB ── */}
          {tab === 'contact' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                Contact Information
              </h2>
              {[
                { label: 'Email Address', key: 'contact_email' },
                { label: 'Phone Number', key: 'contact_phone' },
                { label: 'Location / Address', key: 'contact_location' },
                { label: 'Business Hours', key: 'contact_hours' },
                { label: 'Instagram Handle (e.g. @sharafssweets)', key: 'instagram_handle' },
                { label: 'Instagram URL (full link)', key: 'instagram_url' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <input style={inputStyle}
                    value={content[field.key] || ''}
                    onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  <SaveBtn fieldKey={field.key} value={content[field.key]} />
                </div>
              ))}
            </div>
          )}

          {/* ── INSTAGRAM TAB ── */}
          {tab === 'instagram' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                Instagram Posts
              </h2>
              <p style={{ color: '#b08a80', fontSize: '0.88rem', marginBottom: '1.5rem', fontWeight: 300 }}>
                Add image URLs from your Instagram posts. They will appear on the About &amp; Gallery page.
              </p>

              {/* Add new post */}
              <div style={{
                background: '#fffaf7', borderRadius: '14px', padding: '1.5rem',
                border: '1px solid #fde8e0', marginBottom: '2rem',
              }}>
                <h3 style={{ color: '#c0635a', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem' }}>
                  + Add New Instagram Post
                </h3>
                <label style={labelStyle}>Image URL *</label>
                <input style={inputStyle}
                  placeholder="https://images.unsplash.com/... or any image URL"
                  value={newInsta.image_url}
                  onChange={e => setNewInsta({ ...newInsta, image_url: e.target.value })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                <label style={labelStyle}>Caption (optional)</label>
                <input style={inputStyle}
                  placeholder="e.g. Fresh cupcakes just out of the oven! 🧁"
                  value={newInsta.caption}
                  onChange={e => setNewInsta({ ...newInsta, caption: e.target.value })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                <label style={labelStyle}>Instagram Post Link (optional)</label>
                <input style={inputStyle}
                  placeholder="https://www.instagram.com/p/..."
                  value={newInsta.post_url}
                  onChange={e => setNewInsta({ ...newInsta, post_url: e.target.value })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                {newInsta.image_url && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Preview</label>
                    <img src={newInsta.image_url} alt="preview"
                      onError={e => e.target.style.display = 'none'}
                      style={{
                        width: '100px', height: '100px', objectFit: 'cover',
                        borderRadius: '12px', border: '2px solid #fde8e0',
                      }} />
                  </div>
                )}

                <button onClick={addInsta} style={{
                  background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                  color: 'white', border: 'none', padding: '0.7rem 1.8rem',
                  borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
                  fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
                }}>+ Add Post</button>
              </div>

              {/* Existing posts */}
              <h3 style={{ color: '#4a3728', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem' }}>
                Posted Images ({instaImages.length})
              </h3>
              {instaImages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#c4a09a', padding: '2rem',
                  background: '#fffaf7', borderRadius: '12px', border: '1px dashed #fde8e0' }}>
                  No Instagram posts yet. Add one above!
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {instaImages.map(img => (
                  <div key={img.id} style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid #fde8e0', position: 'relative',
                    boxShadow: '0 2px 8px rgba(192,99,90,0.07)',
                  }}>
                    <img src={img.image_url} alt={img.caption}
                      style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '0.6rem', background: 'white' }}>
                      <div style={{
                        fontSize: '0.75rem', color: '#b08a80',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {img.caption || 'No caption'}
                      </div>
                      {img.post_url && (
                        <a href={img.post_url} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.72rem', color: '#c0635a', textDecoration: 'none', fontWeight: '600' }}>
                          View post ↗
                        </a>
                      )}
                    </div>
                    <button onClick={() => deleteInsta(img.id)} style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: 'rgba(224,85,85,0.9)', color: 'white',
                      border: 'none', borderRadius: '50%',
                      width: '22px', height: '22px', cursor: 'pointer',
                      fontSize: '0.7rem', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CATERING TAB ── */}
          {tab === 'catering' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                Catering Packages
              </h2>
              <p style={{ color: '#b08a80', fontSize: '0.88rem', marginBottom: '1.5rem', fontWeight: 300 }}>
                Manage packages shown on the Catering page. Customers can add them to their cart directly.
              </p>

              {/* Add new package */}
              <div style={{
                background: '#fffaf7', borderRadius: '14px', padding: '1.5rem',
                border: '1px solid #fde8e0', marginBottom: '2rem',
              }}>
                <h3 style={{ color: '#c0635a', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem' }}>
                  + Add New Package
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div>
                    <label style={labelStyle}>Package Name *</label>
                    <input style={inputStyle} placeholder="e.g. Sweet Starter"
                      value={newPkg.name}
                      onChange={e => setNewPkg({ ...newPkg, name: e.target.value })}
                      onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                      onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Emoji</label>
                    <input style={inputStyle} placeholder="🎂"
                      value={newPkg.emoji}
                      onChange={e => setNewPkg({ ...newPkg, emoji: e.target.value })}
                      onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                      onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Display Price * (e.g. "From $150" or "Custom Quote")</label>
                    <input style={inputStyle} placeholder="From $150"
                      value={newPkg.price}
                      onChange={e => setNewPkg({ ...newPkg, price: e.target.value })}
                      onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                      onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Cart Price ($) — enter 0 for custom quote only</label>
                    <input style={inputStyle} type="number" placeholder="150"
                      value={newPkg.base_price}
                      onChange={e => setNewPkg({ ...newPkg, base_price: e.target.value })}
                      onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                      onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Display Order (1, 2, 3...)</label>
                    <input style={inputStyle} type="number" placeholder="1"
                      value={newPkg.display_order}
                      onChange={e => setNewPkg({ ...newPkg, display_order: e.target.value })}
                      onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                      onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                    <input type="checkbox" id="featured_new"
                      checked={newPkg.is_featured}
                      onChange={e => setNewPkg({ ...newPkg, is_featured: e.target.checked })} />
                    <label htmlFor="featured_new" style={{ color: '#7a5c58', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                      ⭐ Mark as Featured (Most Popular)
                    </label>
                  </div>
                </div>

                <label style={labelStyle}>Short Description</label>
                <input style={inputStyle} placeholder="Perfect for small gatherings and office parties"
                  value={newPkg.description}
                  onChange={e => setNewPkg({ ...newPkg, description: e.target.value })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                <label style={labelStyle}>
                  What's Included — separate each item with a comma
                </label>
                <p style={{ color: '#c4a09a', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                  Example: 50 assorted cupcakes,2 dozen brownies,Custom packaging,Free delivery
                </p>
                <textarea style={{ ...textareaStyle, height: '80px' }}
                  placeholder="50 assorted cupcakes,2 dozen brownies,Custom packaging"
                  value={newPkg.includes}
                  onChange={e => setNewPkg({ ...newPkg, includes: e.target.value })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                <button onClick={addPkg} style={{
                  background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                  color: 'white', border: 'none', padding: '0.7rem 1.8rem',
                  borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
                  fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
                }}>+ Add Package</button>
              </div>

              {/* Existing packages */}
              <h3 style={{ color: '#4a3728', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem' }}>
                Current Packages ({cateringPackages.length})
              </h3>

              {cateringPackages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#c4a09a', padding: '2rem',
                  background: '#fffaf7', borderRadius: '12px', border: '1px dashed #fde8e0' }}>
                  No catering packages yet. Add one above!
                </div>
              )}

              {cateringPackages.map(pkg => (
                <div key={pkg.id} style={{
                  background: '#fffaf7', borderRadius: '14px', padding: '1.5rem',
                  border: pkg.is_featured ? '2px solid #c0635a' : '1px solid #fde8e0',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 10px rgba(192,99,90,0.06)',
                }}>
                  {editPkg?.id === pkg.id ? (
                    /* Edit mode */
                    <div>
                      <h4 style={{ color: '#c0635a', fontWeight: '700', marginBottom: '1rem' }}>
                        Editing: {pkg.name}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div>
                          <label style={labelStyle}>Package Name *</label>
                          <input style={inputStyle} value={editPkg.name}
                            onChange={e => setEditPkg({ ...editPkg, name: e.target.value })}
                            onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                            onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Emoji</label>
                          <input style={inputStyle} value={editPkg.emoji}
                            onChange={e => setEditPkg({ ...editPkg, emoji: e.target.value })}
                            onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                            onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Display Price *</label>
                          <input style={inputStyle} value={editPkg.price}
                            onChange={e => setEditPkg({ ...editPkg, price: e.target.value })}
                            onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                            onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Cart Price ($)</label>
                          <input style={inputStyle} type="number" value={editPkg.base_price || 0}
                            onChange={e => setEditPkg({ ...editPkg, base_price: e.target.value })}
                            onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                            onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Display Order</label>
                          <input style={inputStyle} type="number" value={editPkg.display_order}
                            onChange={e => setEditPkg({ ...editPkg, display_order: e.target.value })}
                            onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                            onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                          <input type="checkbox" id={`feat_${pkg.id}`}
                            checked={editPkg.is_featured}
                            onChange={e => setEditPkg({ ...editPkg, is_featured: e.target.checked })} />
                          <label htmlFor={`feat_${pkg.id}`} style={{ color: '#7a5c58', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                            ⭐ Featured
                          </label>
                        </div>
                      </div>

                      <label style={labelStyle}>Short Description</label>
                      <input style={inputStyle} value={editPkg.description || ''}
                        onChange={e => setEditPkg({ ...editPkg, description: e.target.value })}
                        onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                        onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                      <label style={labelStyle}>What's Included (comma-separated)</label>
                      <textarea style={{ ...textareaStyle, height: '80px' }}
                        value={editPkg.includes || ''}
                        onChange={e => setEditPkg({ ...editPkg, includes: e.target.value })}
                        onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                        onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />

                      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                        <button onClick={savePkg} style={{
                          background: '#f0faf4', border: '1px solid #b0e0c0',
                          color: '#3a7a5a', padding: '0.6rem 1.5rem',
                          borderRadius: '10px', cursor: 'pointer',
                          fontWeight: '700', fontFamily: 'Nunito, sans-serif',
                        }}>✓ Save Changes</button>
                        <button onClick={() => setEditPkg(null)} style={{
                          background: '#fde8e0', border: '1px solid #f5c5b5',
                          color: '#c0635a', padding: '0.6rem 1.5rem',
                          borderRadius: '10px', cursor: 'pointer',
                          fontWeight: '700', fontFamily: 'Nunito, sans-serif',
                        }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.5rem' }}>{pkg.emoji}</span>
                          <span style={{ fontWeight: '700', color: '#4a3728', fontSize: '1rem' }}>{pkg.name}</span>
                          {pkg.is_featured && (
                            <span style={{
                              background: '#c0635a', color: 'white',
                              fontSize: '0.72rem', padding: '0.15rem 0.6rem',
                              borderRadius: '10px', fontWeight: '700',
                            }}>⭐ Featured</span>
                          )}
                        </div>
                        <div style={{ color: '#c0635a', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                          {pkg.price}
                          {pkg.base_price > 0 && (
                            <span style={{ color: '#b08a80', fontWeight: '400', fontSize: '0.82rem' }}>
                              {' '}(cart price: ${parseFloat(pkg.base_price).toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#b08a80', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{pkg.description}</div>
                        {pkg.includes && (
                          <div style={{ fontSize: '0.8rem', color: '#c4a09a' }}>
                            Includes: {pkg.includes.split(',').length} items
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button onClick={() => setEditPkg({ ...pkg })} style={{
                          background: '#fff8e8', border: '1px solid #f5d99a',
                          color: '#c09040', padding: '0.4rem 1rem',
                          borderRadius: '8px', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.85rem',
                        }}>Edit</button>
                        <button onClick={() => deletePkg(pkg.id)} style={{
                          background: '#fff0f0', border: '1px solid #fdc5c5',
                          color: '#e08080', padding: '0.4rem 1rem',
                          borderRadius: '8px', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.85rem',
                        }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}