import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineTrash,
  HiMinus,
  HiPlus,
  HiOutlineShoppingCart,
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import AnimatedPage from '../components/AnimatedPage';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <AnimatedPage className="max-w-7xl mx-auto px-4 py-20 text-center">
        <HiOutlineShoppingCart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" />
        <h2 className="text-2xl font-bold mt-6">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary mt-6"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="card p-4 flex gap-4"
                >
                  <img
                    src={
                      item.images?.[0] ||
                      'https://via.placeholder.com/120x120'
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/products/${item._id}`}
                      className="font-semibold hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal (
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={cartTotal >= 50 ? 'text-green-600' : ''}>
                  {cartTotal >= 50 ? 'Free' : '$9.99'}
                </span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ${(cartTotal + (cartTotal >= 50 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
            </div>
            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-6"
              >
                Proceed to Checkout
              </motion.button>
            </Link>
            <Link
              to="/products"
              className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline mt-3"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
