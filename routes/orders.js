const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const pool = require('../config/db');

router.post('/', auth, createOrder);
router.get('/my', auth, getUserOrders);
router.get('/all', auth, getAllOrders);

router.get('/analytics', auth, async (req, res) => {
  try {
    const totalRevenue = await pool.query('SELECT COALESCE(SUM(total_amount),0) as total FROM orders');
    const totalOrders = await pool.query('SELECT COUNT(*) as count FROM orders');
    const totalCustomers = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const topProducts = await pool.query(`
      SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      GROUP BY p.name ORDER BY total_sold DESC LIMIT 5
    `);
    const ordersPerDay = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as revenue
      FROM orders WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at) ORDER BY date ASC
    `);
    const recentOrders = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.delivery_type, o.created_at, u.name as customer_name
      FROM orders o JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 5
    `);
    res.json({
      totalRevenue: parseFloat(totalRevenue.rows[0].total),
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalCustomers: parseInt(totalCustomers.rows[0].count),
      topProducts: topProducts.rows,
      ordersPerDay: ordersPerDay.rows,
      recentOrders: recentOrders.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin update order status
router.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['placed', 'preparing', 'ready', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;