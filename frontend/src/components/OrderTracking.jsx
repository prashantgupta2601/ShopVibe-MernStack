import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaBox, FaHome } from 'react-icons/fa';

const orderStages = [
  { key: 'placed', label: 'Order Placed', icon: FaCheckCircle, color: 'blue' },
  { key: 'processing', label: 'Processing', icon: FaBox, color: 'yellow' },
  { key: 'shipped', label: 'Shipped', icon: FaTruck, color: 'purple' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck, color: 'orange' },
  { key: 'delivered', label: 'Delivered', icon: FaHome, color: 'green' }
];

const OrderTracking = ({ currentStatus, orderDate }) => {
  const currentStageIndex = orderStages.findIndex(stage => stage.key === currentStatus);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-6 dark:text-white">Order Tracking</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStageIndex / (orderStages.length - 1)) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-blue-600"
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {orderStages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive 
                      ? `bg-${stage.color}-500 text-white` 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                  }`}
                >
                  <Icon size={20} />
                </motion.div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    isActive ? 'text-gray-800 dark:text-white' : 'text-gray-500'
                  }`}>
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-blue-600 mt-1"
                    >
                      Current
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {currentStatus !== 'delivered' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Estimated Delivery:</strong> 3-7 business days from order date
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Order placed on {new Date(orderDate).toLocaleDateString()}
          </p>
        </motion.div>
      )}

      {/* Delivered Message */}
      {currentStatus === 'delivered' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"
        >
          <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            Order Successfully Delivered!
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Thank you for shopping with us
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;
