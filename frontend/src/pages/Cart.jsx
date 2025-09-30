import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../utils/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      const data = await api.getCart(token);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    try {
      await api.updateCartItem(productId, newQuantity, token);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.removeFromCart(productId, token);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      await api.createOrder({}, token);
      // Clear cart
      setCartItems([]);
      // Navigate to bought page is handled by Link
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 text-center mb-8">Your Cart</h1>

        {loading ? (
           <div className="text-center py-12">
             <div className="spinner"></div>
           </div>
         ) : !user ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Please login to view cart</h3>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <Link
              to="/explore"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product._id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600">₹{item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{item.product.price * item.quantity}</p>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{totalPrice + 50}</span>
                </div>
              </div>
              <Link
                to="/bought"
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center block transition-colors duration-200"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;