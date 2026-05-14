const express = require('express');
const router = express.Router();
const { getAllPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } = require('../controllers/purchaseOrderController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllPurchaseOrders);
router.post('/', auth, createPurchaseOrder);
router.patch('/:id/receive', auth, receivePurchaseOrder);

module.exports = router;