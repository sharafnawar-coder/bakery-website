const pool = require('../config/db');
const { sendOrderConfirmation } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  const { items, delivery_type, address, scheduled_date, scheduled_time } = req.body;
  const user_id = req.user.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let total = 0;
    for (const item of items) {
      const p = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.product_id]);
      const product = p.rows[0];
      if (!product || product.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Not enough stock for ${product?.name || 'product'}` });
      }
      total += product.price * item.quantity;
    }

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount, status, delivery_type, address, scheduled_date, scheduled_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, total, 'placed', delivery_type || 'pickup', address || null, scheduled_date || null, scheduled_time || null]
    );
    const order = orderResult.rows[0];

    const savedItems = [];
    for (const item of items) {
      const p = await client.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
      const product = p.rows[0];
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, product.price]
      );
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
      savedItems.push({ name: product.name, quantity: item.quantity, unit_price: product.price });
    }

    await client.query('COMMIT');

    // Send confirmation email
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
      const user = userResult.rows[0];
      await sendOrderConfirmation(user.email, user.name, order, savedItems);
    } catch (emailErr) {
      console.error('Email failed:', emailErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};