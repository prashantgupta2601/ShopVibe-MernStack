import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import socketService from '../services/socketService';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      // Connect to socket
      socketService.connect(user._id, user.role === 'admin');

      // Set up event listeners
      socketService.on('orderStatusUpdate', handleOrderStatusUpdate);
      socketService.on('paymentSuccess', handlePaymentSuccess);
      socketService.on('lowStockAlert', handleLowStockAlert);
      socketService.on('newOrder', handleNewOrder);
      socketService.on('inventoryUpdate', handleInventoryUpdate);

      return () => {
        socketService.off('orderStatusUpdate', handleOrderStatusUpdate);
        socketService.off('paymentSuccess', handlePaymentSuccess);
        socketService.off('lowStockAlert', handleLowStockAlert);
        socketService.off('newOrder', handleNewOrder);
        socketService.off('inventoryUpdate', handleInventoryUpdate);
        socketService.disconnect();
      };
    }
  }, [user]);

  const handleOrderStatusUpdate = (data) => {
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Order Status Update',
      message: data.message,
      icon: FaInfoCircle,
      timestamp: new Date()
    });
  };

  const handlePaymentSuccess = (data) => {
    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Payment Successful',
      message: data.message,
      icon: FaCheckCircle,
      timestamp: new Date()
    });
  };

  const handleLowStockAlert = (data) => {
    addNotification({
      id: Date.now(),
      type: 'warning',
      title: 'Low Stock Alert',
      message: data.message,
      icon: FaExclamationTriangle,
      timestamp: new Date()
    });
  };

  const handleNewOrder = (data) => {
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'New Order',
      message: data.message,
      icon: FaInfoCircle,
      timestamp: new Date()
    });
  };

  const handleInventoryUpdate = (data) => {
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Inventory Update',
      message: `${data.productName} stock updated to ${data.newStock}`,
      icon: FaInfoCircle,
      timestamp: new Date()
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep max 10 notifications
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <FaBell size={16} />
        {notifications.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {notifications.length}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <FaBell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 ${getNotificationBg(notification.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`mt-1 ${getNotificationColor(notification.type)}`} size={16} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
