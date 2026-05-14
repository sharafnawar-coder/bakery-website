const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get all site content
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_content');
    const content = {};
    result.rows.forEach(r => { content[r.key] = r.value; });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update site content
router.put('/:key', auth, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO site_content (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
       RETURNING *`,
      [key, value]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Instagram posts
router.get('/instagram', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instagram_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Instagram post
router.post('/instagram', auth, async (req, res) => {
  const { image_url, caption, post_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO instagram_posts (image_url, caption, post_url) VALUES ($1, $2, $3) RETURNING *',
      [image_url, caption, post_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Instagram post
router.delete('/instagram/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM instagram_posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get catering packages
router.get('/catering', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catering_packages ORDER BY display_order');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add catering package
router.post('/catering', auth, async (req, res) => {
  const { name, emoji, price, base_price, description, includes, is_featured, display_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO catering_packages 
       (name, emoji, price, base_price, description, includes, is_featured, display_order) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, emoji || '🎂', price, base_price || 0, description, includes, is_featured || false, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update catering package
router.put('/catering/:id', auth, async (req, res) => {
  const { name, emoji, price, base_price, description, includes, is_featured, display_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE catering_packages 
       SET name=$1, emoji=$2, price=$3, base_price=$4, description=$5, 
           includes=$6, is_featured=$7, display_order=$8 
       WHERE id=$9 RETURNING *`,
      [name, emoji, price, base_price || 0, description, includes, is_featured, display_order, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete catering package
router.delete('/catering/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM catering_packages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;