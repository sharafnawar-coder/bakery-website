const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', getAllProducts);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;