import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineCollection,
  HiOutlineChartPie,
  HiOutlineUsers,
  HiOutlineArchive,
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const emptyProduct = {
  name: '', description: '', price: '', category: '', images: [''], stock: '',
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard');
  
  // States
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [inventory, setInventory] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const [statsRes, salesRes, statusRes] = await Promise.all([
          api.get('/analytics/stats'),
          api.get('/analytics/monthly-sales'),
          api.get('/analytics/orders-status')
        ]);
        setDashboardStats(statsRes.data);
        
        const formattedSales = salesRes.data.map(item => ({
          name: `${item._id.month}/${item._id.year}`,
          revenue: item.revenue,
          orders: item.orders
        }));
        setMonthlySales(formattedSales);
        
        const formattedStatus = statusRes.data.map(item => ({
          name: item._id,
          value: item.count
        }));
        setOrderStatusData(formattedStatus);
        
      } else if (tab === 'products') {
        const { data } = await api.get('/products?limit=100');
        setProducts(data.products);
      } else if (tab === 'orders') {
        const { data } = await api.get('/orders/all');
        setOrders(data);
      } else if (tab === 'users') {
        const { data } = await api.get('/users');
        setUsers(data);
      } else if (tab === 'inventory') {
        const { data } = await api.get('/inventory');
        setInventory(data);
      }
    } catch (err) {
      // Inventory might be at analytics/inventory depending on route mounting
      if (tab === 'inventory') {
         try {
           const { data } = await api.get('/analytics/inventory');
           setInventory(data);
         } catch {
           toast.error('Error loading inventory data');
         }
      } else {
        toast.error('Error loading admin data');
      }
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm(emptyProduct);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadData();
    } catch {
      toast.error('Error deleting product');
    }
  };

  const handleProductEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images.length ? product.images : [''],
      stock: product.stock,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { orderStatus });
      toast.success('Order updated');
      loadData();
    } catch {
      toast.error('Error updating order');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      toast.success('User role updated');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting user');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HiOutlineChartPie },
    { id: 'products', label: 'Products', icon: HiOutlineCollection },
    { id: 'orders', label: 'Orders', icon: HiOutlineShoppingBag },
    { id: 'users', label: 'Users', icon: HiOutlineUsers },
    { id: 'inventory', label: 'Inventory', icon: HiOutlineArchive },
  ];

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setShowForm(false);
              }}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-5 h-5" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && dashboardStats && !loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6 border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">${dashboardStats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="card p-6 border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{dashboardStats.totalOrders}</p>
              </div>
              <div className="card p-6 border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{dashboardStats.totalUsers}</p>
              </div>
              <div className="card p-6 border-l-4 border-purple-500">
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold">{dashboardStats.totalProducts}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Monthly Revenue</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0088FE" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Orders by Status</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingProduct(null);
                  setForm(emptyProduct);
                }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <HiOutlinePlus /> Add Product
              </motion.button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleProductSubmit}
                  className="card p-6 mb-8 overflow-hidden"
                >
                  <h3 className="font-bold mb-4">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="input-field" rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock</label>
                      <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input type="text" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} className="input-field" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button whileHover={{ scale: 1.02 }} type="submit" className="btn-primary">
                      {editingProduct ? 'Update' : 'Create'}
                    </motion.button>
                    <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {!loading && (
              <div className="space-y-3">
                {products.map((product) => (
                  <motion.div key={product._id} layout className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={product.images?.[0] || 'https://via.placeholder.com/60'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)} &middot; Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleProductEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <HiOutlinePencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleProductDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <HiOutlineTrash className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && !loading && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Manage Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div key={order._id} layout className="card p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{order.user?.name} &middot; {order.user?.email}</p>
                      <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="input-field text-sm py-1 mt-1 w-auto"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.map((item, j) => (
                      <span key={j}>{item.name} x{item.quantity}{j < order.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && !loading && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Manage Users</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <select 
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="input-field text-sm py-1 w-auto"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button onClick={() => deleteUser(user._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'inventory' && !loading && inventory && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Inventory Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
               <div className="card p-6 border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold">{inventory.lowStockProducts.length}</p>
              </div>
              <div className="card p-6 border-l-4 border-red-500">
                <p className="text-gray-500 text-sm">Out of Stock Items</p>
                <p className="text-2xl font-bold">{inventory.outOfStockProducts}</p>
              </div>
            </div>
            
            <h3 className="font-bold mb-4">Low Stock Alerts</h3>
            <div className="space-y-3">
              {inventory.lowStockProducts.map(product => (
                <div key={product._id} className="card p-4 flex justify-between items-center border border-yellow-200">
                   <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category} &middot; {product.brand}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-orange-600 font-bold text-lg">{product.stock} left</p>
                      <p className="text-sm cursor-pointer text-blue-600 hover:underline" onClick={() => {setTab('products'); handleProductEdit(product);}}>Update Stock</p>
                   </div>
                </div>
              ))}
              {inventory.lowStockProducts.length === 0 && <p className="text-gray-500">No low stock items!</p>}
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}
