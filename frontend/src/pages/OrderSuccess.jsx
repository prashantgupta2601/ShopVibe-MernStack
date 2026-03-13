import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <AnimatedPage className="max-w-2xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <HiCheckCircle className="w-24 h-24 text-green-500 mx-auto" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mt-6"
      >
        Order Placed Successfully!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 mt-3"
      >
        Thank you for your purchase. Your order has been confirmed.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-6 mt-8 inline-block"
      >
        <p className="text-sm text-gray-500">Order ID</p>
        <p className="font-mono text-lg font-bold mt-1">{id}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-center gap-4"
      >
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn-primary"
          >
            View Orders
          </motion.button>
        </Link>
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn-secondary"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </AnimatedPage>
  );
}
