const Order = require('../models/Order');
const User = require('../models/User');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0) + 50; // + shipping

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress: req.body.shippingAddress || '',
    });

    await order.save();
    await order.populate('items.product');

    // Clear cart
    user.cart = [];
    await user.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateOrderStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllOrders = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};