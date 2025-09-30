const express = require('express');
const { auth, admin } = require('../middleware/auth');
const productController = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get single product
router.get('/:id', productController.getProduct);

// Add product (admin only)
router.post('/', auth, admin, productController.createProduct);

// Update product (admin only)
router.put('/:id', auth, admin, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;