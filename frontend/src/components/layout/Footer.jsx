import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ShopVibe
            </span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your destination for premium products at great prices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link
                to="/products"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Cart
              </Link>
              <Link
                to="/dashboard"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                My Account
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2 text-sm">
              <Link
                to="/products?category=Electronics"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Electronics
              </Link>
              <Link
                to="/products?category=Clothing"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Clothing
              </Link>
              <Link
                to="/products?category=Home"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Home
              </Link>
              <Link
                to="/products?category=Sports"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                Sports
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Subscribe for the latest deals and updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="input-field text-sm rounded-r-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary rounded-l-none text-sm px-4"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ShopVibe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
