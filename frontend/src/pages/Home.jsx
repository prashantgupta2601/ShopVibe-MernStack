import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiSparkles,
  HiTruck,
  HiShieldCheck,
  HiCreditCard,
} from 'react-icons/hi';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton';
import AnimatedPage from '../components/AnimatedPage';

const categories = [
  { name: 'Electronics', icon: '🔌', color: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing', icon: '👕', color: 'from-pink-500 to-rose-500' },
  { name: 'Home', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-amber-500' },
  { name: 'Books', icon: '📚', color: 'from-purple-500 to-violet-500' },
  { name: 'Beauty', icon: '✨', color: 'from-red-500 to-pink-500' },
];

const features = [
  { icon: HiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: HiShieldCheck, title: 'Secure Payment', desc: '100% protected' },
  { icon: HiCreditCard, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: HiSparkles, title: 'Best Quality', desc: 'Premium products' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?limit=8&sort=newest')
      .then(({ data }) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6"
            >
              New Collection 2026
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold leading-tight"
            >
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {' '}
                Perfect Style
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-blue-100 max-w-lg"
            >
              Shop the latest trends with premium quality products. Free
              shipping on orders over $50.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Shop Now <HiArrowRight />
                </motion.button>
              </Link>
              <Link to="/products?category=Electronics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/50 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Explore Deals
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-4"
              >
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">
              Shop by Category
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/products?category=${cat.name}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-gradient-to-br ${cat.color} p-6 rounded-xl text-white text-center cursor-pointer shadow-lg`}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <p className="mt-2 font-semibold text-sm">{cat.name}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1"
            >
              View All <HiArrowRight />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-2xl p-8 md:p-16 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Spring Sale - Up to 50% Off
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Don't miss our biggest sale of the season. Limited time offer on
              premium products.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-700 font-bold py-3 px-8 rounded-lg"
              >
                Shop the Sale
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter and be the first to know about new
              arrivals and exclusive deals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-grow"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
