const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
], authController.login);

// Get user profile
router.get('/profile', auth, authController.getProfile);

module.exports = router;