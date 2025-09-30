const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'dairy', 'icecream', 'general'],
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 100,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);