const express = require('express');
const { auth } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

const router = express.Router();

// Get user's cart
router.get('/', auth, cartController.getCart);

// Add to cart
router.post('/', auth, cartController.addToCart);

// Update cart item quantity
router.put('/:productId', auth, cartController.updateCartItem);

// Remove from cart
router.delete('/:productId', auth, cartController.removeFromCart);

// Clear cart
router.delete('/', auth, cartController.clearCart);

module.exports = router;