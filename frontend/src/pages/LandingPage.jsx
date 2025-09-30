import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import pic1 from "../assets/pic1.jpg";
import pic2 from "../assets/pic2.jpg";
import pic3 from "../assets/pic3.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            Welcome to NaturesMart
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your one-stop destination for all your nature and gardening needs.
            Discover premium quality products for your garden and home.
          </p>
        </div>

        {/* Images Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={pic1}
              alt="Nature product 1"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={pic2}
              alt="Nature product 2"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={pic3}
              alt="Nature product 3"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
            Explore Our Products
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
