import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../utils/api.js';

const AdminPanel = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Mock orders data
  const [orders] = useState([
    {
      id: 'ORD001',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250,
      items: 3
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      date: '2024-01-20',
      status: 'processing',
      total: 890,
      items: 2
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      date: '2024-01-22',
      status: 'shipped',
      total: 650,
      items: 4
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    stock: '',
    description: '',
    image: '',
    status: 'active'
  });

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'icecream', label: 'Ice Cream' },
    { value: 'general', label: 'General' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      };
      await api.createProduct(productData, token);
      setNewProduct({
        name: '',
        category: 'Vegetables',
        price: '',
        stock: '',
        description: '',
        image: '',
        status: 'active'
      });
      setShowAddProduct(false);
      alert('Product added successfully!');
      fetchProducts(); // Refresh products
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddProduct(true);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      };
      await api.updateProduct(editingProduct._id, productData, token);
      setNewProduct({
        name: '',
        category: 'vegetables',
        price: '',
        stock: '',
        description: '',
        image: '',
        status: 'active'
      });
      setShowAddProduct(false);
      setEditingProduct(null);
      alert('Product updated successfully!');
      fetchProducts(); // Refresh products
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id, token);
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh products
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const toggleProductStatus = (id) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTotalStats = () => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    return { totalProducts, activeProducts, totalOrders, totalRevenue };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-gray-600">Manage your NaturesMart products and orders</p>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'products', label: 'Products', icon: '📦' },
                  { id: 'orders', label: 'Orders', icon: '🛒' },
                  { id: 'analytics', label: 'Analytics', icon: '📊' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      + Add New Product
                    </button>
                  </div>

                  {/* Add/Edit Product Modal */}
                  {showAddProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowAddProduct(false);
                              setEditingProduct(null);
                              setNewProduct({
                                name: '',
                                category: 'vegetables',
                                price: '',
                                stock: '',
                                description: '',
                                image: '',
                                status: 'active'
                              });
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={newProduct.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Enter product name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                              name="category"
                              value={newProduct.category}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                            <input
                              type="number"
                              name="price"
                              value={newProduct.price}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Enter price"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                            <input
                              type="number"
                              name="stock"
                              value={newProduct.stock}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Enter stock quantity"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              name="description"
                              value={newProduct.description}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Enter product description"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {newProduct.image && (
                              <div className="mt-2">
                                <img src={newProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                              name="status"
                              value={newProduct.status}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                          <button
                            onClick={() => {
                              setShowAddProduct(false);
                              setEditingProduct(null);
                              setNewProduct({
                                name: '',
                                category: 'vegetables',
                                price: '',
                                stock: '',
                                description: '',
                                image: '',
                                status: 'active'
                              });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {loading && <div className="text-center py-12"><div className="spinner"></div></div>}
                  {error && <p className="text-red-600">{error}</p>}
                  {/* Products Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Image</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Name</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Category</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Price</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Stock</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                                ) : (
                                  <span className="text-gray-500">📦</span>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 font-medium">{product.name}</td>
                            <td className="border border-gray-200 px-4 py-3">{product.category}</td>
                            <td className="border border-gray-200 px-4 py-3">₹{product.price}</td>
                            <td className="border border-gray-200 px-4 py-3">{product.stock}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                                active
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Order ID</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Email</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Date</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Items</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Total</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3 font-medium">{order.id}</td>
                            <td className="border border-gray-200 px-4 py-3">{order.customer}</td>
                            <td className="border border-gray-200 px-4 py-3">{order.email}</td>
                            <td className="border border-gray-200 px-4 py-3">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="border border-gray-200 px-4 py-3">{order.items}</td>
                            <td className="border border-gray-200 px-4 py-3 font-medium">₹{order.total}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg">
                      <div className="text-3xl font-bold">{stats.totalProducts}</div>
                      <div className="text-green-100">Total Products</div>
                      <div className="text-sm text-green-200 mt-2">{stats.activeProducts} Active</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg">
                      <div className="text-3xl font-bold">{stats.totalOrders}</div>
                      <div className="text-blue-100">Total Orders</div>
                      <div className="text-sm text-blue-200 mt-2">This month</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-lg">
                      <div className="text-3xl font-bold">₹{stats.totalRevenue}</div>
                      <div className="text-purple-100">Total Revenue</div>
                      <div className="text-sm text-purple-200 mt-2">All time</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-lg">
                      <div className="text-3xl font-bold">{Math.round(stats.totalRevenue / stats.totalOrders)}</div>
                      <div className="text-yellow-100">Avg Order Value</div>
                      <div className="text-sm text-yellow-200 mt-2">₹ per order</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Low Stock Products</span>
                        <span className="font-medium text-red-600">
                          {products.filter(p => p.stock < 10).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending Orders</span>
                        <span className="font-medium text-yellow-600">
                          {orders.filter(o => o.status === 'processing').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completed Orders</span>
                        <span className="font-medium text-green-600">
                          {orders.filter(o => o.status === 'delivered').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;