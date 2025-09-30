import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Bought = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed and will be delivered soon.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Order Details</h2>
              <p className="text-gray-700">Order ID: #123456789</p>
              <p className="text-gray-700">Estimated Delivery: 2-3 business days</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              <Link
                to="/profile"
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors duration-200"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bought;