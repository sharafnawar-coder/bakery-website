const pool = require('../config/db');

exports.getAllIngredients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createIngredient = async (req, res) => {
  const { name, unit, quantity, low_stock_threshold } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ingredients (name, unit, quantity, low_stock_threshold) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, unit, quantity || 0, low_stock_threshold || 10]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { name, unit, quantity, low_stock_threshold } = req.body;
  try {
    const result = await pool.query(
      'UPDATE ingredients SET name=$1, unit=$2, quantity=$3, low_stock_threshold=$4 WHERE id=$5 RETURNING *',
      [name, unit, quantity, low_stock_threshold, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteIngredient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ingredients WHERE id = $1', [id]);
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};