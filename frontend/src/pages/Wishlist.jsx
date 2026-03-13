import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton';
import AnimatedPage from '../components/AnimatedPage';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const { data } = await api.get('/auth/wishlist');
      setWishlist(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleWishlist = async (productId) => {
    try {
      await api.post('/auth/wishlist', { productId });
      loadWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGridSkeleton count={4} />
      </div>
    );

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineHeart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" />
            <h2 className="text-2xl font-bold mt-6">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mt-2">
              Save items you love for later.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-primary mt-6"
              >
                Browse Products
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
