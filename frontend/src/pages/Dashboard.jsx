import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import AnimatedPage from '../components/AnimatedPage';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orders, loading } = useSelector(state => state.orders);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const statusColor = (status) => {
    const colors = {
      processing:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      shipped:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      delivered:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'orders', label: 'Order History', icon: HiOutlineShoppingBag },
            { id: 'profile', label: 'Profile', icon: HiOutlineUser },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

        {tab === 'orders' && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <HiOutlineShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </span>
                        <span className="font-bold">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {order.items.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6 max-w-md"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
}
