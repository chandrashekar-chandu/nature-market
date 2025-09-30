const express = require('express');
const { auth } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Get user's orders
router.get('/', auth, orderController.getOrders);

// Get single order
router.get('/:id', auth, orderController.getOrder);

// Create order
router.post('/', auth, orderController.createOrder);

// Update order status (admin only)
router.put('/:id/status', auth, orderController.updateOrderStatus);

// Get all orders (admin only)
router.get('/admin/all', auth, orderController.getAllOrders);

module.exports = router;