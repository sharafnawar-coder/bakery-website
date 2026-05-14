const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const pool = require('../config/db');

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, contact_email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO suppliers (name, contact_email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, contact_email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;