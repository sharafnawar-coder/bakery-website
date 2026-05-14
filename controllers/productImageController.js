const pool = require('../config/db');

exports.getProductImages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, id ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProductImage = async (req, res) => {
  const { product_id, image_url, is_primary } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_primary) {
      await client.query(
        'UPDATE product_images SET is_primary = false WHERE product_id = $1',
        [product_id]
      );
      await client.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [image_url, product_id]
      );
    }
    const result = await client.query(
      'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
      [product_id, image_url, is_primary || false]
    );
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    await pool.query('DELETE FROM product_images WHERE id = $1', [req.params.imageId]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};