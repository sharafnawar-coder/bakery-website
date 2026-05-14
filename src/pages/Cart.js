import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const inputStyle = {
  width: '100%', padding: '0.8rem 1rem',
  borderRadius: '12px', border: '1.5px solid #f5ddd5',
  fontSize: '0.95rem', background: '#fffaf7',
  color: '#4a3728', outline: 'none', marginBottom: '0.8rem',
  fontFamily: 'Nunito, sans-serif',
};

const sectionTitle = {
  fontFamily: 'Playfair Display, serif',
  color: '#4a3728', fontSize: '1.1rem',
  marginBottom: '1rem', marginTop: '1.5rem',
};

export default function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [step, setStep] = useState(1); // 1=cart, 2=schedule, 3=payment
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Scheduling
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [address, setAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Payment
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

  const remove = id => {
    const newCart = cart.filter(i => i.product_id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const placeOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cart,
        delivery_type: deliveryType,
        address: deliveryType === 'delivery' ? address : null,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
      });
      localStorage.removeItem('cart');
      setCart([]);
      setMsg('🎉 Order placed successfully! Thank you for your purchase.');
      setTimeout(() => navigate('/my-orders'), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const cardBox = {
    background: 'white', borderRadius: '20px',
    padding: '1.8rem', marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(192,99,90,0.08)',
    border: '1px solid #fde8e0',
  };

  const btn = {
    background: 'linear-gradient(135deg, #c0635a, #d4796f)',
    color: 'white', border: 'none', padding: '0.9rem 2rem',
    borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 6px 20px rgba(192,99,90,0.3)',
    width: '100%', fontFamily: 'Nunito, sans-serif',
  };

  const backBtn = {
    background: '#fde8e0', color: '#c0635a', border: 'none',
    padding: '0.9rem 2rem', borderRadius: '12px', fontSize: '1rem',
    fontWeight: '700', cursor: 'pointer', width: '100%',
    fontFamily: 'Nunito, sans-serif', marginBottom: '0.8rem',
  };

  // Progress bar
  const Progress = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '2.5rem' }}>
      {[{ n: 1, label: 'Cart' }, { n: 2, label: 'Schedule' }, { n: 3, label: 'Payment' }].map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: step >= s.n ? '#c0635a' : '#fde8e0',
              color: step >= s.n ? 'white' : '#c0635a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.9rem', margin: '0 auto 4px',
              border: step === s.n ? '2px solid #c0635a' : '2px solid #fde8e0',
            }}>{s.n}</div>
            <div style={{ fontSize: '0.75rem', color: step >= s.n ? '#c0635a' : '#c4a09a', fontWeight: '600' }}>{s.label}</div>
          </div>
          {i < 2 && <div style={{ width: '60px', height: '2px', background: step > s.n ? '#c0635a' : '#fde8e0', margin: '0 4px 20px' }} />}
        </div>
      ))}
    </div>
  );

  if (msg) return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '450px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎀</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', marginBottom: '1rem' }}>{msg}</h2>
        <p style={{ color: '#b08a80', fontWeight: 300 }}>Redirecting you to your orders...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.2rem', marginBottom: '2rem', textAlign: 'center' }}>
          {step === 1 ? '🛒 Your Cart' : step === 2 ? '📅 Schedule' : '💳 Payment'}
        </h1>

        <Progress />

        {/* STEP 1 — Cart */}
        {step === 1 && (
          <>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#c4a09a', marginTop: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                <p>Your cart is empty!</p>
                <button onClick={() => navigate('/shop')} style={{ ...btn, width: 'auto', marginTop: '1.5rem', padding: '0.8rem 2rem' }}>
                  Browse Sweets
                </button>
              </div>
            ) : (
              <>
                <div style={cardBox}>
                  {cart.map(i => (
                    <div key={i.product_id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', paddingBottom: '1rem',
                      marginBottom: '1rem', borderBottom: '1px solid #fde8e0',
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#4a3728' }}>{i.name}</div>
                        <div style={{ color: '#b08a80', fontSize: '0.88rem' }}>
                          {i.quantity} × ${parseFloat(i.price).toFixed(2)} =
                          <span style={{ color: '#c0635a', fontWeight: '700' }}> ${(i.quantity * i.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => remove(i.product_id)} style={{
                        background: '#fff0f0', border: '1px solid #fdc5c5',
                        color: '#e08080', padding: '0.35rem 0.8rem',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem',
                      }}>Remove</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728', fontSize: '1.1rem' }}>Total</span>
                    <span style={{ color: '#c0635a', fontWeight: '700', fontSize: '1.3rem' }}>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button style={btn} onClick={() => setStep(2)}>Continue to Schedule →</button>
              </>
            )}
          </>
        )}

        {/* STEP 2 — Schedule */}
        {step === 2 && (
          <>
            <div style={cardBox}>
              <div style={sectionTitle}>Pickup or Delivery?</div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {['pickup', 'delivery'].map(type => (
                  <button key={type} onClick={() => setDeliveryType(type)} style={{
                    flex: 1, padding: '1rem', borderRadius: '12px', cursor: 'pointer',
                    border: deliveryType === type ? '2px solid #c0635a' : '2px solid #fde8e0',
                    background: deliveryType === type ? '#fff0ed' : 'white',
                    color: deliveryType === type ? '#c0635a' : '#b08a80',
                    fontWeight: '700', fontSize: '0.95rem',
                    fontFamily: 'Nunito, sans-serif',
                  }}>
                    {type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                  </button>
                ))}
              </div>

              {deliveryType === 'delivery' && (
                <>
                  <div style={sectionTitle}>Delivery Address</div>
                  <input style={inputStyle} placeholder="Enter your full address"
                    value={address} onChange={e => setAddress(e.target.value)}
                    onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                    onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                </>
              )}

              <div style={sectionTitle}>Select Date & Time</div>
              <input style={inputStyle} type="date"
                min={new Date().toISOString().split('T')[0]}
                value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}>
                <option value="">Select a time slot</option>
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button style={btn} onClick={() => {
              if (!scheduledDate || !scheduledTime) return alert('Please select a date and time!');
              if (deliveryType === 'delivery' && !address) return alert('Please enter a delivery address!');
              setStep(3);
            }}>Continue to Payment →</button>
            <button style={{ ...backBtn, marginTop: '0.8rem' }} onClick={() => setStep(1)}>← Back to Cart</button>
          </>
        )}

        {/* STEP 3 — Payment */}
        {step === 3 && (
          <>
            <div style={cardBox}>
              <div style={sectionTitle}>Order Summary</div>
              <div style={{ background: '#fdf5f2', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#b08a80', fontSize: '0.9rem' }}>Type</span>
                  <span style={{ fontWeight: '700', color: '#4a3728', fontSize: '0.9rem' }}>
                    {deliveryType === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                  </span>
                </div>
                {deliveryType === 'delivery' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#b08a80', fontSize: '0.9rem' }}>Address</span>
                    <span style={{ fontWeight: '600', color: '#4a3728', fontSize: '0.9rem', maxWidth: '200px', textAlign: 'right' }}>{address}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#b08a80', fontSize: '0.9rem' }}>Date</span>
                  <span style={{ fontWeight: '600', color: '#4a3728', fontSize: '0.9rem' }}>{scheduledDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b08a80', fontSize: '0.9rem' }}>Time</span>
                  <span style={{ fontWeight: '600', color: '#4a3728', fontSize: '0.9rem' }}>{scheduledTime}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', color: '#4a3728' }}>Total</span>
                <span style={{ color: '#c0635a', fontWeight: '700', fontSize: '1.2rem' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={cardBox}>
              <div style={sectionTitle}>Card Details</div>

              {/* Card visual */}
              <div style={{
                background: 'linear-gradient(135deg, #c0635a, #d4796f)',
                borderRadius: '16px', padding: '1.5rem', color: 'white',
                marginBottom: '1.5rem', position: 'relative', minHeight: '130px',
              }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem', letterSpacing: '1px' }}>CARD NUMBER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem', fontFamily: 'monospace' }}>
                  {card.number || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>CARD HOLDER</div>
                    <div style={{ fontWeight: '700' }}>{card.name || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>EXPIRES</div>
                    <div style={{ fontWeight: '700' }}>{card.expiry || 'MM/YY'}</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>💳</div>
                </div>
              </div>

              <input style={inputStyle} placeholder="Cardholder name"
                value={card.name} onChange={e => setCard({ ...card, name: e.target.value })}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <input style={inputStyle} placeholder="Card number" maxLength={19}
                value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="MM/YY" maxLength={5}
                  value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="CVC" maxLength={3}
                  value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })}
                  onFocus={e => e.target.style.border = '1.5px solid #c0635a'}
                  onBlur={e => e.target.style.border = '1.5px solid #f5ddd5'} />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#c4a09a', textAlign: 'center', marginTop: '0.5rem' }}>
                🔒 Demo mode — no real payment is processed
              </div>
            </div>

            <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} onClick={() => {
              if (!card.name || !card.number || !card.expiry || !card.cvc)
                return alert('Please fill in all card details!');
              placeOrder();
            }} disabled={loading}>
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)} 🎀`}
            </button>
            <button style={{ ...backBtn, marginTop: '0.8rem' }} onClick={() => setStep(2)}>← Back to Schedule</button>
          </>
        )}
      </div>
    </div>
  );
}