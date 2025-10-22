import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, Edit, Trash2, Plus, X, Eye, Search, Filter, LogOut, Menu, Car ,AlertCircle} from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false); 

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  });

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchData();
    }
  }, [isLoggedIn, activeTab, token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'products' || activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/products`, { headers: getHeaders() });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
      
      if (activeTab === 'orders' || activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() });
        if (res.status === 401) {
          setError('Session expired. Please login again.');
          handleLogout();
          return;
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
      
      if (activeTab === 'brands' || activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/brands`, { headers: getHeaders() });
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      }
      
      if (activeTab === 'categories' || activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/categories`, { headers: getHeaders() });
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }

      if (activeTab === 'models' || activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/models`, { headers: getHeaders() });
        const data = await res.json();
        setModels(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setProducts([]);
      setOrders([]);
      setBrands([]);
      setCategories([]);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('admin_token', data.access_token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setOrders([]);
    setProducts([]);
    setModels([]);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    let url = '';
    let method = selectedItem ? 'PUT' : 'POST';

    switch (modalType) {
      case 'product':
        url = selectedItem 
          ? `${API_URL}/products/${selectedItem.id}` 
          : `${API_URL}/products`;
        break;
        
      case 'brand':
        url = selectedItem 
          ? `${API_URL}/brands/${selectedItem.id}` 
          : `${API_URL}/brands`;
        
        // For brands, send FormData with logo image
        const brandHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

        const brandRes = await fetch(url, {
          method,
          headers: brandHeaders,
          body: formData
        });

        if (!brandRes.ok) {
          const errorData = await brandRes.json();
          throw new Error(errorData.detail || 'Failed to save');
        }

        closeModal();
        fetchData();
        return;
        
      case 'category':
        url = selectedItem 
          ? `${API_URL}/categories/${selectedItem.id}` 
          : `${API_URL}/categories`;
        
        const categoryData = {};
        for (let [key, value] of formData.entries()) {
          categoryData[key] = value;
        }
        
        const categoryRes = await fetch(url, {
          method,
          headers: getHeaders(),
          body: JSON.stringify(categoryData)
        });

        if (!categoryRes.ok) throw new Error('Failed to save');
        closeModal();
        fetchData();
        return;
        
      case 'model':
        url = selectedItem 
          ? `${API_URL}/models/${selectedItem.id}` 
          : `${API_URL}/models`;
          console.log('=== Sending Model Request ===');
  console.log('URL:', url);
  console.log('Method:', method);
  console.log('Token:', token ? 'exists' : 'missing');
          console.log('FormData Entries:'); 
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
        // For models, send FormData with image
        const modelHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

        const modelRes = await fetch(url, {
          method,
          headers: modelHeaders,
          body: formData  // أرسل FormData مباشرة
        });
         console.log('Response status:', modelRes.status);
        if (!modelRes.ok) {
          const errorData = await modelRes.json();
          throw new Error(errorData.detail || 'Failed to save');
        }

          const modelData = await modelRes.json();
  console.log('Success:', modelData);
  

        closeModal();
        fetchData();
        return;
    }

    // For products, send FormData with images
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const res = await fetch(url, {
      method,
      headers: headers,
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to save');
    }

    closeModal();
    fetchData();
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Failed to save: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      let url = '';
      switch (type) {
        case 'product':
          url = `${API_URL}/products/${id}`;
          break;
        case 'brand':
          url = `${API_URL}/brands/${id}`;
          break;
        case 'category':
          url = `${API_URL}/categories/${id}`;
          break;
        case 'model':
          url = `${API_URL}/models/${id}`;
          break;
      }

      await fetch(url, { 
        method: 'DELETE', 
        headers: getHeaders() 
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/status?status=${status}`, {
        method: 'PUT',
        headers: getHeaders()
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

const viewOrderDetails = async (orderId) => {
  try {
    setLoading(true);
    const res = await fetch(`${API_URL}/orders/${orderId}/details`, { 
      headers: getHeaders() 
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch order details");
    }
    
    const data = await res.json();
    setSelectedOrder(data);
    setShowOrderDetails(true);
  } catch (error) {
    console.error('Error fetching order details:', error);
    alert("Failed to load order details: " + error.message);
  } finally {
    setLoading(false);
  }
};

const closeOrderDetails = () => {
  setShowOrderDetails(false);
  setSelectedOrder(null);
};

// const viewOrderDetails = async (orderId) => {
//   try {
//     const res = await fetch(`${API_URL}/orders/${orderId}`, { headers: getHeaders() });
//     if (!res.ok) throw new Error("Failed to fetch order details");
//     const data = await res.json();
//     setSelectedOrder(data);
//     setShowOrderDetails(true);
//   } catch (error) {
//     console.error(error);
//     alert("Failed to load order details");
//   }
// };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your store</p>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: products?.length || 0, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Orders', value: orders?.length || 0, icon: ShoppingCart, color: 'from-green-500 to-green-600' },
    { label: 'Pending Orders', value: orders?.filter(o => o.status === 'pending').length || 0, icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Total Brands', value: brands?.length || 0, icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Models', value: models?.length || 0, icon: Car, color: 'from-orange-500 to-orange-600' }
  ];

  const filteredOrders = (orders || []).filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = (products || []).filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModels = (models || []).filter(model =>
    model.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">Admin Panel</div>
                  <div className="text-xs text-gray-400">Auto Parts</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'brands', label: 'Brands', icon: Users },
              { id: 'models', label: 'Models', icon: Car },
              { id: 'categories', label: 'Categories', icon: Filter }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-600 mt-1">Manage your store {activeTab}</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading...</div>
            </div>
          )}

          {activeTab === 'dashboard' && !loading && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-600">${order.total_amount}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Low Stock Products</h3>
                  <div className="space-y-3">
                    {products.filter(p => p.stock_quantity < 10).slice(0, 5).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">${product.price}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          {product.stock_quantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Models</h3>
                  <div className="space-y-3">
                    {models.slice(0, 5).map(model => (
                      <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">{model.name}</div>
                          <div className="text-sm text-gray-600">
                            {brands.find(b => b.id === model.brand_id)?.name || 'Unknown Brand'}
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Model
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => openModal('product')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Order ID</th>
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Customer</th>
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Address</th>
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Actions</th>
  </tr>
</thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-600">
                                {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {brands.find(b => b.id === product.brand_id)?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600">${product.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal('product', product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete('product', product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
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

          {activeTab === 'orders' && !loading && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                    </tr>
                  </thead>
            <tbody className="divide-y divide-gray-100">
  {filteredOrders.map(order => (
    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <span className="font-mono font-semibold text-gray-900">#{order.id}</span>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{order.customer_name}</div>
        <div className="text-sm text-gray-600">{order.customer_phone}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs truncate" title={order.customer_address}>
          {order.customer_address || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-blue-600">EGP {order.total_amount}</div>
      </td>
      <td className="px-6 py-4">
        <select
          value={order.status}
          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => viewOrderDetails(order.id)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'brands' && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Car Brands</h2>
                <button
                  onClick={() => openModal('brand')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Brand
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map(brand => (
                  <div key={brand.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={brand.logo_url} 
                        alt={brand.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{brand.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('brand', brand)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('brand', brand.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'models' && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Car Models</h2>
                <button
                  onClick={() => openModal('model')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Model
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map(model => (
                  <div key={model.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600">
                          {brands.find(b => b.id === model.brand_id)?.name || 'Unknown Brand'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('model', model)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('model', model.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
                <button
                  onClick={() => openModal('category')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Category
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(category => (
                  <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('category', category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete('category', category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <ModalContent
          modalType={modalType}
          selectedItem={selectedItem}
          onClose={closeModal}
          onSubmit={handleSubmit}
          brands={brands}
          categories={categories}
          models={models}
        />
      )}

      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          products={products}
          onClose={closeOrderDetails}
        />
      )}
    </div>
  );
};

// Modal Component
// Modal Component
const ModalContent = ({ modalType, selectedItem, onClose, onSubmit, brands, categories, models }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState(
    selectedItem && modalType === 'product' 
      ? [selectedItem.image_url, ...(selectedItem.images || [])].filter(Boolean)
      : []
  );
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(selectedItem?.brand_id || '');
  const [filteredModels, setFilteredModels] = useState(models || []);

  useEffect(() => {
    const urls = selectedImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [selectedImages]);

  // Filter models when brand changes
  useEffect(() => {
    if (selectedBrandId && selectedBrandId !== '') {
      const filtered = models.filter(model => model.brand_id === parseInt(selectedBrandId));
      setFilteredModels(filtered);
    } else {
      setFilteredModels(models || []);
    }
  }, [selectedBrandId, models]);

  const handleBrandChange = (e) => {
    setSelectedBrandId(e.target.value);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  // Debug: شوف إيه اللي في FormData
  console.log('=== FormData Contents ===');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log('=== End FormData ===');
  
  if (modalType === 'product') {
    selectedImages.forEach(image => {
      formData.append('images', image);
    });
    
    if (existingImages.length > 0) {
      formData.append('existing_images', JSON.stringify(existingImages));
    }
  }

  await onSubmit(formData);
};
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {selectedItem ? 'Edit' : 'Add'} {modalType}
            </h2>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {modalType === 'product' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedItem?.name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={selectedItem?.price}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={selectedItem?.stock_quantity}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <select
                    name="brand_id"
                    value={selectedBrandId}
                    onChange={handleBrandChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model (Optional)
                    {selectedBrandId && filteredModels.length === 0 && (
                      <span className="text-xs text-gray-500 ml-2">(No models for this brand)</span>
                    )}
                  </label>
                  <select
                    name="model_id"
                    defaultValue={selectedItem?.model_id || ''}
                    disabled={!selectedBrandId || filteredModels.length === 0}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">All Models</option>
                    {filteredModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category_id"
                  defaultValue={selectedItem?.category_id}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedItem?.description}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images
                  <span className="text-xs text-gray-500 ml-2">(First image will be the main image)</span>
                </label>
                
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">New Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {previewUrls.map((url, index) => (
                        <div key={`preview-${index}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-green-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      {selectedImages.length > 0 || existingImages.length > 0
                        ? 'Add More Images'
                        : 'Upload Product Images'}
                    </span>
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Upload multiple images. The first image will be the main product image.
                </p>
              </div>
            </>
          )}

          {modalType === 'brand' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedItem?.name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={selectedItem?.description}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color (Tailwind classes)</label>
                <input
                  type="text"
                  name="color"
                  defaultValue={selectedItem?.color}
                  placeholder="from-blue-500 to-blue-600"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Logo</label>
                
                {selectedItem?.logo_url && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Current Logo:</p>
                    <img 
                      src={selectedItem.logo_url} 
                      alt="Current logo"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <input type="hidden" name="existing_logo" value={selectedItem.logo_url} />
                  </div>
                )}

                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  required={!selectedItem}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <p className="text-xs text-gray-500 mt-2">
                  {selectedItem ? '💡 Leave empty to keep current logo' : '💡 Upload brand logo image'}
                </p>
              </div>
            </>
          )}
{modalType === 'model' && (
  <>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Model Name</label>
      <input
        type="text"
        name="name"
        defaultValue={selectedItem?.name}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
      <select
        name="brand_id"
        defaultValue={selectedItem?.brand_id}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select Brand</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
      <textarea
        name="description"
        defaultValue={selectedItem?.description}
        rows="3"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    {/* Image Upload Section */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Model Image</label>
      
      {selectedItem?.image_url && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">Current Image:</p>
          <img 
            src={selectedItem.image_url} 
            alt="Current model"
            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
          />
          <input type="hidden" name="existing_image" value={selectedItem.image_url} />
        </div>
      )}

      <input
        type="file"
        name="image"
        accept="image/*"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <p className="text-xs text-gray-500 mt-2">
        {selectedItem ? '💡 Leave empty to keep current image' : '💡 Upload model image (optional)'}
      </p>
    </div>
  </>
)} 
          {modalType === 'category' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedItem?.name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedItem?.description}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              {selectedItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  
  );
};
const OrderDetailsModal = ({ order, products, onClose }) => {
  if (!order) {
    return null;
  }

  // Format date
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Order Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
              <p className="text-blue-100 text-sm mt-1">{orderDate}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-bold text-gray-900">{order.customer_name || "—"}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="font-bold text-gray-900">{order.customer_phone || "—"}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="font-bold text-gray-900 break-all">{order.customer_email || "—"}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="font-bold text-gray-900">{order.customer_address || "—"}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
         
<div>
  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
      <Package className="w-5 h-5 text-white" />
    </div>
    Order Items ({order.items?.length || 0})
  </h3>
  {order.items && order.items.length > 0 ? (
    <div className="space-y-4">
      {order.items.map((item, index) => (
        <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-colors">
          <div className="flex gap-4 p-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              {item.product_image ? (
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-300 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-lg mb-2">{item.product_name || 'Unknown Product'}</h4>
              
              {/* Brand, Model, Category Info */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.brand_name && (
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    {item.brand_logo && (
                      <img src={item.brand_logo} alt={item.brand_name} className="w-4 h-4 rounded object-cover" />
                    )}
                    <span className="text-xs font-semibold text-gray-700">
                      <span className="text-gray-500">Brand:</span> {item.brand_name}
                    </span>
                  </div>
                )}
                
                {item.model_name && (
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <Car className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      <span className="text-gray-500">Model:</span> {item.model_name}
                    </span>
                  </div>
                )}
                
                {item.category_name && (
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <Filter className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      <span className="text-gray-500">Category:</span> {item.category_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Info */}
              <div className="flex items-center gap-4">
                <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="text-xs text-gray-600">Qty: </span>
                  <span className="text-sm font-bold text-blue-600">{item.quantity}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="text-xs text-gray-600">Unit Price: </span>
                  <span className="text-sm font-bold text-green-600">EGP {item.price}</span>
                </div>
              </div>
            </div>

            {/* Item Total */}
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-500 mb-1">Item Total</p>
              <p className="font-black text-blue-600 text-2xl">EGP {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500 font-semibold">No items in this order</p>
    </div>
  )}
</div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                <span className="text-gray-700 font-semibold">Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                  order.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                  order.status === 'confirmed' ? 'bg-green-400 text-green-900' :
                  order.status === 'processing' ? 'bg-blue-400 text-blue-900' :
                  order.status === 'delivered' ? 'bg-purple-400 text-purple-900' :
                  'bg-red-400 text-red-900'
                }`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                <span className="text-gray-700 font-semibold">Payment Method</span>
                <span className="font-bold text-gray-900">{order.payment_method || "Vodafone Cash"}</span>
              </div>

              {/* Deposit */}
              {order.deposit_amount && (
                <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                  <span className="text-gray-700 font-semibold">Deposit Required (50%)</span>
                  <span className="font-bold text-orange-600">EGP {order.deposit_amount.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div className="border-t-2 border-blue-300 pt-3 mt-3"></div>
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
                <span className="text-xl font-black text-white">Total Amount</span>
                <span className="text-3xl font-black text-white">EGP {order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Order Notes
              </h3>
              <p className="text-gray-700 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
          >
            Close Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;