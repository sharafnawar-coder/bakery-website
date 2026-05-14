import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function About() {
  const [content, setContent] = useState({});
  const [instaImages, setInstaImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get('/site').then(r => setContent(r.data)).catch(() => {});
    api.get('/site/instagram').then(r => setInstaImages(r.data)).catch(() => {});
    api.get('/products').then(r => {
      setProducts(r.data);
      const imgs = [];
      r.data.forEach(p => {
        api.get(`/products/${p.id}/images`).then(imgRes => {
          imgRes.data.forEach(img => {
            imgs.push({ ...img, productName: p.name, category: getCategory(p.name) });
          });
          setProductImages([...imgs]);
        }).catch(() => {
          if (p.image_url) {
            imgs.push({ image_url: p.image_url, productName: p.name, category: getCategory(p.name) });
            setProductImages([...imgs]);
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
  const filteredGallery = galleryFilter === 'All'
    ? productImages
    : productImages.filter(i => i.category === galleryFilter);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => {
    if (!form.name || !form.email || !form.message) return alert('Please fill in all required fields!');
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    borderRadius: '12px', border: '1.5px solid #f5ddd5',
    fontSize: '0.95rem', background: '#fffaf7', color: '#4a3728',
    outline: 'none', fontFamily: 'Nunito, sans-serif',
    marginBottom: '1rem', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#FFFAF7' }}>

      {/* ── ABOUT US ── */}
      <div style={{
        background: 'linear-gradient(160deg, #fff0eb, #fde8e0)',
        padding: '5rem 2rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎀</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '3rem', marginBottom: '1rem' }}>
          {content.about_title || 'Our Story'}
        </h1>
        <p style={{ color: '#a07060', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 1.5rem', lineHeight: 1.8, fontWeight: 300 }}>
          {content.about_story || 'Sharaf\'s Sweets was born from a deep love of baking...'}
        </p>
        <p style={{ color: '#b08a80', fontSize: '1rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
          {content.about_mission || 'Our mission is simple — to make every occasion sweeter.'}
        </p>
      </div>

      {/* Why choose us */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          Why Choose Sharaf's Sweets?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { emoji: '🌿', title: 'Fresh Daily', desc: 'Every item baked fresh on the day of your order' },
            { emoji: '🎨', title: 'Fully Custom', desc: 'Tailored flavors, colors, and designs for every occasion' },
            { emoji: '💝', title: 'Made with Love', desc: 'Every bite crafted with care and attention to detail' },
            { emoji: '🚗', title: 'We Deliver', desc: 'Convenient pickup and delivery options available' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px', padding: '2rem',
              textAlign: 'center', border: '1px solid #fde8e0',
              boxShadow: '0 4px 15px rgba(192,99,90,0.07)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{item.emoji}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: '#b08a80', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div style={{ background: 'white', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Our Gallery
            </h2>
            <p style={{ color: '#b08a80', fontWeight: 300 }}>A peek into our sweet creations 🌸</p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setGalleryFilter(cat)} style={{
                padding: '0.4rem 1rem', borderRadius: '25px',
                border: galleryFilter === cat ? '2px solid #c0635a' : '1.5px solid #fde8e0',
                background: galleryFilter === cat ? '#c0635a' : '#fffaf7',
                color: galleryFilter === cat ? 'white' : '#b08a80',
                fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
              }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {filteredGallery.map((img, i) => (
              <div key={i} onClick={() => setSelected(img)} style={{
                borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                position: 'relative', border: '1px solid #fde8e0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(192,99,90,0.08)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(192,99,90,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(192,99,90,0.08)'; }}>
                <img src={img.image_url} alt={img.productName}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                  onError={e => e.target.parentElement.style.display = 'none'} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(74,55,40,0.75))',
                  padding: '1.5rem 0.8rem 0.7rem',
                }}>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '0.82rem' }}>{img.productName}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div style={{ textAlign: 'center', color: '#c4a09a', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍰</div>
              <p>No photos yet — add product images from the admin panel!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── INSTAGRAM ── */}
      {(instaImages.length > 0 || content.instagram_handle) && (
        <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2rem', marginBottom: '0.3rem' }}>
              Follow Us on Instagram
            </h2>
            <a href={content.instagram_url || '#'} target="_blank" rel="noreferrer"
              style={{ color: '#b08a80', fontWeight: 300, textDecoration: 'none', fontSize: '0.95rem' }}>
              {content.instagram_handle || '@sharafssweets'} 🌸
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {instaImages.map((img, i) => (
              <a key={i} href={img.post_url || content.instagram_url || '#'} target="_blank" rel="noreferrer"
                style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                <img src={img.image_url} alt={img.caption || 'Instagram'} style={{
                  width: '100%', height: '160px', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={content.instagram_url || '#'} target="_blank" rel="noreferrer" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              color: 'white', padding: '0.75rem 2rem', borderRadius: '25px',
              fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none',
            }}>📸 Follow on Instagram</a>
          </div>
        </div>
      )}

      {/* ── CONTACT ── */}
      <div style={{ background: 'white', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>💌</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Contact Us
            </h2>
            <p style={{ color: '#b08a80', fontWeight: 300 }}>
              We'd love to hear from you! Reach out for custom orders, questions, or just to say hi 🌸
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{
                background: '#fffaf7', borderRadius: '20px', padding: '2rem',
                border: '1px solid #fde8e0', marginBottom: '1.5rem',
              }}>
                {[
                  { icon: '📧', label: 'Email', value: content.contact_email || 'sharafssweets@gmail.com' },
                  { icon: '📞', label: 'Phone', value: content.contact_phone || '+1 (555) 123-4567' },
                  { icon: '📍', label: 'Location', value: content.contact_location || 'Lawrenceville, Georgia, USA' },
                  { icon: '⏰', label: 'Hours', value: content.contact_hours || 'Mon–Sat: 9AM – 6PM' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                    <div style={{
                      fontSize: '1.3rem', background: '#fde8e0', borderRadius: '10px',
                      padding: '0.5rem', width: '42px', height: '42px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#4a3728', fontSize: '0.88rem' }}>{item.label}</div>
                      <div style={{ color: '#b08a80', fontSize: '0.85rem', marginTop: '0.2rem' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <a href={`mailto:${content.contact_email || 'sharafssweets@gmail.com'}`} style={{
                  display: 'block', background: '#c0635a', color: 'white',
                  padding: '0.75rem 1.5rem', borderRadius: '25px', fontWeight: '700',
                  fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none',
                }}>📧 Email Us</a>
                <Link to="/catering" style={{
                  display: 'block', background: '#fde8e0', color: '#c0635a',
                  padding: '0.75rem 1.5rem', borderRadius: '25px', fontWeight: '700',
                  fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none',
                }}>🎉 Request Catering Quote</Link>
              </div>
            </div>

            <div style={{
              background: '#fffaf7', borderRadius: '20px', padding: '2rem',
              border: '1px solid #fde8e0',
            }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎀</div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', marginBottom: '0.8rem' }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: '#b08a80', fontWeight: 300 }}>
                    Thank you {form.name}! We'll get back to you within 24 hours 🌸
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{
                    marginTop: '1.5rem', background: '#c0635a', color: 'white',
                    border: 'none', padding: '0.7rem 1.5rem', borderRadius: '25px',
                    cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif',
                  }}>Send Another Message</button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                    Send a Message
                  </h3>
                  <input style={inputStyle} name="name" placeholder="Your name *" value={form.name} onChange={handle}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  <input style={inputStyle} name="email" placeholder="Your email *" value={form.email} onChange={handle}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  <input style={inputStyle} name="subject" placeholder="Subject" value={form.subject} onChange={handle}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  <textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
                    name="message" placeholder="Your message *" value={form.message} onChange={handle}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                  <button onClick={submit} style={{
                    width: '100%', padding: '0.9rem',
                    background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                  }}>Send Message 🎀</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', overflow: 'hidden',
            maxWidth: '550px', width: '100%',
          }}>
            <img src={selected.image_url} alt={selected.productName}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover' }} />
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontWeight: '700' }}>{selected.productName}</div>
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