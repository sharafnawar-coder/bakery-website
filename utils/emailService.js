const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmation = async (toEmail, customerName, order, items) => {
  const itemsList = items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #fde8e0">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #fde8e0;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #fde8e0;text-align:right">$${(i.unit_price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fffaf7;border-radius:20px;overflow:hidden;border:1px solid #fde8e0">
      
      <div style="background:linear-gradient(135deg,#c0635a,#d4796f);padding:2.5rem 2rem;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:0.5rem">🎀</div>
        <h1 style="color:white;margin:0;font-size:1.6rem;font-weight:700">Sharaf's Sweets</h1>
        <p style="color:rgba(255,255,255,0.85);margin:0.5rem 0 0;font-size:0.95rem">Order Confirmation</p>
      </div>

      <div style="padding:2rem">
        <p style="color:#4a3728;font-size:1rem">Hi <strong>${customerName}</strong>! 🌸</p>
        <p style="color:#7a5c58;font-size:0.95rem;line-height:1.6">
          Thank you for your order! We've received it and we're getting started on your sweet treats right away.
        </p>

        <div style="background:white;border-radius:14px;padding:1.2rem;margin:1.5rem 0;border:1px solid #fde8e0">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
            <span style="color:#b08a80;font-size:0.88rem">Order Number</span>
            <strong style="color:#c0635a">#${order.id}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
            <span style="color:#b08a80;font-size:0.88rem">Type</span>
            <strong style="color:#4a3728">${order.delivery_type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}</strong>
          </div>
          ${order.address ? `
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
            <span style="color:#b08a80;font-size:0.88rem">Address</span>
            <strong style="color:#4a3728">${order.address}</strong>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
            <span style="color:#b08a80;font-size:0.88rem">Date</span>
            <strong style="color:#4a3728">${order.scheduled_date || 'TBD'}</strong>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:#b08a80;font-size:0.88rem">Time</span>
            <strong style="color:#4a3728">${order.scheduled_time || 'TBD'}</strong>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">
          <thead>
            <tr style="background:#fdf5f2">
              <th style="padding:8px 12px;text-align:left;color:#c0635a;font-size:0.85rem">Item</th>
              <th style="padding:8px 12px;text-align:center;color:#c0635a;font-size:0.85rem">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#c0635a;font-size:0.85rem">Price</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
        </table>

        <div style="text-align:right;padding:0.8rem 0;border-top:2px solid #fde8e0">
          <span style="color:#4a3728;font-size:1rem">Total: </span>
          <strong style="color:#c0635a;font-size:1.2rem">$${parseFloat(order.total_amount).toFixed(2)}</strong>
        </div>

        <p style="color:#b08a80;font-size:0.88rem;margin-top:1.5rem;line-height:1.6">
          If you have any questions, reply to this email or contact us at 
          <a href="mailto:sharafssweets@gmail.com" style="color:#c0635a">sharafssweets@gmail.com</a>
        </p>

        <p style="color:#c0635a;font-size:0.95rem;font-weight:700;margin-top:1rem">
          Made with love 🎀 — Sharaf's Sweets
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Sharaf's Sweets" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎀 Order Confirmed #${order.id} — Sharaf's Sweets`,
    html,
  });
};