const express = require('express');
const router = express.Router();
const { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } = require('../controllers/ingredientController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllIngredients);
router.post('/', auth, createIngredient);
router.put('/:id', auth, updateIngredient);
router.delete('/:id', auth, deleteIngredient);

module.exports = router;