const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProductImages, addProductImage, deleteProductImage
} = require('../controllers/productImageController');

router.get('/:id/images', getProductImages);
router.post('/images', auth, addProductImage);
router.delete('/images/:imageId', auth, deleteProductImage);

module.exports = router;