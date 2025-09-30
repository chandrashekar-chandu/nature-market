const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);