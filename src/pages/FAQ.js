import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: '🚗 Delivery & Pickup',
    questions: [
      { q: 'Do you offer delivery?', a: 'Yes! We offer both pickup and delivery. You can choose your preference at checkout. Delivery is available within our local area.' },
      { q: 'How far in advance should I order?', a: 'We recommend ordering at least 24–48 hours in advance, especially for cakes and large orders. For same-day orders, please contact us directly.' },
      { q: 'What are your pickup hours?', a: 'Pickup is available Monday–Saturday, 9:00 AM to 6:00 PM. Sunday pickups are available by appointment only.' },
      { q: 'Is there a delivery fee?', a: 'Delivery fees depend on your location. You will see the delivery details at checkout.' },
    ]
  },
  {
    category: '🌾 Allergens & Ingredients',
    questions: [
      { q: 'Do your products contain nuts?', a: 'Yes, some of our products contain nuts including walnuts and pistachios, especially our baklava. Please inform us of any allergies when ordering.' },
      { q: 'Are there gluten-free options?', a: 'Currently our products are made in a kitchen that handles gluten. We are working on gluten-free options — stay tuned!' },
      { q: 'Do you use fresh ingredients?', a: 'Absolutely! All our products are made fresh daily using high-quality ingredients. We never use artificial preservatives.' },
      { q: 'Are your products halal?', a: 'Yes, all our sweets are made with halal-certified ingredients.' },
    ]
  },
  {
    category: '🎂 Custom Orders',
    questions: [
      { q: 'Can I order a custom cake?', a: 'Yes! We love creating custom cakes for special occasions. Please contact us at sharafssweets@gmail.com with your requirements at least 3–5 days in advance.' },
      { q: 'Can I customize frosting flavors?', a: 'Yes, we offer vanilla, cream cheese, milk chocolate, and dark chocolate frostings. Let us know your preference when placing a custom order.' },
      { q: 'Do you make wedding cakes?', a: 'Yes we do! Wedding cakes require at least 2 weeks notice. Please reach out to us directly to discuss your vision and pricing.' },
      { q: 'Can I order in bulk for events?', a: 'Absolutely! We offer bulk pricing for events, corporate orders, and parties. Contact us for a custom quote.' },
    ]
  },
  {
    category: '💳 Payments & Orders',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept Visa and Mastercard payments online through our secure checkout.' },
      { q: 'Can I cancel or modify my order?', a: 'You can cancel or modify your order up to 24 hours before your scheduled pickup or delivery time. Please contact us as soon as possible.' },
      { q: 'Do you offer refunds?', a: 'If there is an issue with your order, please contact us within 24 hours of receiving it and we will make it right.' },
    ]
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (key) => setOpenIndex(openIndex === key ? null : key);

  return (
    <div style={{ background: '#FFFAF7', minHeight: '90vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>❓</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#b08a80', fontWeight: 300, fontSize: '1rem' }}>
            Everything you need to know about Sharaf's Sweets 🎀
          </p>
        </div>

        {/* FAQ sections */}
        {faqs.map((section, si) => (
          <div key={si} style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              color: '#4a3728', fontSize: '1.3rem',
              marginBottom: '1rem', paddingBottom: '0.5rem',
              borderBottom: '2px solid #fde8e0',
            }}>{section.category}</h2>

            {section.questions.map((item, qi) => {
              const key = `${si}-${qi}`;
              const isOpen = openIndex === key;
              return (
                <div key={qi} style={{
                  background: 'white', borderRadius: '14px',
                  marginBottom: '0.8rem', overflow: 'hidden',
                  border: isOpen ? '1.5px solid #e8b4a0' : '1px solid #fde8e0',
                  boxShadow: isOpen ? '0 4px 15px rgba(192,99,90,0.1)' : '0 2px 8px rgba(192,99,90,0.05)',
                  transition: 'all 0.2s',
                }}>
                  <button onClick={() => toggle(key)} style={{
                    width: '100%', padding: '1.1rem 1.5rem',
                    background: 'transparent', border: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Nunito, sans-serif',
                  }}>
                    <span style={{ fontWeight: '700', color: '#4a3728', fontSize: '0.95rem', flex: 1, paddingRight: '1rem' }}>
                      {item.q}
                    </span>
                    <span style={{
                      color: '#c0635a', fontSize: '1.2rem', fontWeight: '700',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.2s', flexShrink: 0,
                    }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.2rem',
                      color: '#7a5c58', fontSize: '0.92rem',
                      lineHeight: 1.7, fontWeight: 300,
                      borderTop: '1px solid #fde8e0',
                      paddingTop: '1rem',
                    }}>{item.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Contact banner */}
        <div style={{
          background: 'linear-gradient(135deg, #fde8e0, #fff0eb)',
          borderRadius: '20px', padding: '2rem',
          textAlign: 'center', marginTop: '2rem',
          border: '1px solid #f5c5b5',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>💌</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c0635a', marginBottom: '0.5rem' }}>
            Still have questions?
          </h3>
          <p style={{ color: '#b08a80', fontWeight: 300, fontSize: '0.92rem', marginBottom: '1rem' }}>
            We'd love to hear from you!
          </p>
          <a href="mailto:sharafssweets@gmail.com" style={{
            background: 'linear-gradient(135deg, #c0635a, #d4796f)',
            color: 'white', padding: '0.75rem 2rem',
            borderRadius: '25px', fontWeight: '700',
            fontSize: '0.9rem', display: 'inline-block',
            textDecoration: 'none',
          }}>Email Us 🎀</a>
        </div>
      </div>
    </div>
  );
}