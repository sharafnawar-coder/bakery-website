const pool = require('../config/db');

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT po.*, s.name as supplier_name FROM purchase_orders po JOIN suppliers s ON po.supplier_id = s.id ORDER BY po.id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  const { supplier_id, items } = req.body;

  if (!supplier_id) {
    return res.status(400).json({ message: 'Please select a supplier' });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Please add at least one item' });
  }
  for (const item of items) {
    if (!item.product_id) return res.status(400).json({ message: 'Please select a product for each item' });
    if (!item.quantity || item.quantity < 1) return res.status(400).json({ message: 'Please enter a valid quantity' });
    if (!item.unit_cost || item.unit_cost < 0) return res.status(400).json({ message: 'Please enter a valid unit cost' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const poResult = await client.query(
      'INSERT INTO purchase_orders (supplier_id, status) VALUES ($1, $2) RETURNING *',
      [supplier_id, 'pending']
    );
    const po = poResult.rows[0];
    for (const item of items) {
      await client.query(
        'INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_cost) VALUES ($1, $2, $3, $4)',
        [po.id, item.product_id, item.quantity, item.unit_cost]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(po);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.receivePurchaseOrder = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const items = await client.query(
      'SELECT * FROM purchase_order_items WHERE purchase_order_id = $1', [id]
    );
    for (const item of items.rows) {
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    await client.query(
      'UPDATE purchase_orders SET status = $1, received_at = NOW() WHERE id = $2',
      ['received', id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};