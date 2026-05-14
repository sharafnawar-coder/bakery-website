import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.name || !form.email || !form.message) return alert('Please fill in all required fields!');
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    borderRadius: '12px', border: '1.5px solid #f5ddd5',
    fontSize: '0.95rem', background: '#fffaf7',
    color: '#4a3728', outline: 'none',
    fontFamily: 'Nunito, sans-serif',
    marginBottom: '1rem', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💌</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Contact Us
          </h1>
          <p style={{ color: '#b08a80', fontWeight: 300 }}>
            We'd love to hear from you! Reach out for custom orders, questions, or just to say hi 🌸
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

          {/* Contact info */}
          <div>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '2rem',
              boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
              border: '1px solid #fde8e0', marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Get in Touch
              </h2>
              {[
                { icon: '📧', label: 'Email', value: 'sharafssweets@gmail.com' },
                { icon: '📍', label: 'Location', value: 'Lawrenceville, Georgia, USA' },
                { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 9AM – 6PM' },
                { icon: '📦', label: 'Orders', value: 'Min. 24hrs advance notice' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  marginBottom: '1.2rem',
                }}>
                  <div style={{
                    fontSize: '1.4rem', background: '#fff5f2',
                    borderRadius: '10px', padding: '0.5rem',
                    width: '44px', height: '44px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#4a3728', fontSize: '0.9rem' }}>{item.label}</div>
                    <div style={{ color: '#b08a80', fontSize: '0.88rem', marginTop: '0.2rem' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{
              background: 'linear-gradient(135deg, #fde8e0, #fff0eb)',
              borderRadius: '20px', padding: '1.5rem',
              border: '1px solid #f5c5b5',
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Quick Contact
              </h3>
              <a href="mailto:sharafssweets@gmail.com" style={{
                display: 'block', background: '#c0635a', color: 'white',
                padding: '0.75rem 1.5rem', borderRadius: '25px',
                fontWeight: '700', fontSize: '0.9rem', textAlign: 'center',
                textDecoration: 'none', marginBottom: '0.8rem',
              }}>📧 Email Us Directly</a>
              <a href="https://wa.me/11234567890" target="_blank" rel="noreferrer" style={{
                display: 'block', background: '#25D366', color: 'white',
                padding: '0.75rem 1.5rem', borderRadius: '25px',
                fontWeight: '700', fontSize: '0.9rem', textAlign: 'center',
                textDecoration: 'none',
              }}>💬 WhatsApp Us</a>
            </div>
          </div>

          {/* Message form */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '2rem',
            boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
            border: '1px solid #fde8e0',
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎀</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', marginBottom: '0.8rem' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#b08a80', fontWeight: 300 }}>
                  Thank you {form.name}! We'll get back to you within 24 hours 🌸
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  style={{
                    marginTop: '1.5rem', background: '#c0635a', color: 'white',
                    border: 'none', padding: '0.7rem 1.5rem', borderRadius: '25px',
                    cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif',
                  }}>Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                  Send a Message
                </h2>
                <input style={inputStyle} name="name" placeholder="Your name *"
                  value={form.name} onChange={handle}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                <input style={inputStyle} name="email" placeholder="Your email *"
                  value={form.email} onChange={handle}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                <input style={inputStyle} name="subject" placeholder="Subject (e.g. Custom cake order)"
                  value={form.subject} onChange={handle}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' }}
                  name="message" placeholder="Your message *"
                  value={form.message} onChange={handle}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                <button onClick={submit} style={{
                  width: '100%', padding: '0.9rem',
                  background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  boxShadow: '0 6px 20px rgba(192,99,90,0.3)',
                }}>Send Message 🎀</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}