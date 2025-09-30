const User = require('../models/User');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};