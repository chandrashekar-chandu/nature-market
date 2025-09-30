import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../utils/api.js";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Explore = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { id: "all", name: "All Products", count: products.length },
        { id: "vegetables", name: "Vegetables", count: products.filter(p => p.category === "vegetables").length },
        { id: "dairy", name: "Dairy", count: products.filter(p => p.category === "dairy").length },
        { id: "icecream", name: "Ice Cream", count: products.filter(p => p.category === "icecream").length },
        { id: "general", name: "General", count: products.filter(p => p.category === "general").length },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = async (product) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }
        try {
            await api.addToCart(product._id, 1, token);
            alert(`Added ${product.name} to cart!\nPrice: ₹${product.price}`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-800 mb-4">Explore Our Products</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our wide range of fresh, organic products delivered straight to your doorstep
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                                        selectedCategory === category.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {filteredProducts.map(product => (
                                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No products found */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </>
                )}

                {/* Call to Action */}
                {!user && (
                    <div className="text-center bg-green-600 text-white rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
                        <p className="text-xl mb-6">Get fresh products delivered to your doorstep</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Sign In to Order
                            </Link>
                            <Link
                                to="/signup"
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Explore;