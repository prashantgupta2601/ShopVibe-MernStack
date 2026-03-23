import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiStar, HiOutlineHeart, HiHeart, HiMinus, HiPlus } from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../services/api';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/authSlice';
import { DetailSkeleton } from '../components/ui/LoadingSkeleton';
import AnimatedPage from '../components/AnimatedPage';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { product, loading } = useSelector(state => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const token = user?.token;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      await api.post(`/products/${id}/reviews`, reviewData, config);
      toast.success('Review added!');
      dispatch(fetchProductDetails(id));
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding review');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      toast.success('Added to cart successfully!');
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use the wishlist');
      return;
    }
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
      if (user?.wishlist?.includes(product._id)) {
        toast.info('Removed from wishlist');
      } else {
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      toast.error(err || 'Failed to update wishlist');
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!product)
    return (
      <div className="text-center py-20 text-xl">Product not found</div>
    );

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={
                  product.images?.[selectedImage] ||
                  'https://via.placeholder.com/600x600?text=No+Image'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i
                        ? 'border-primary-600'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center mt-3 gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.numReviews} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
              {product.description}
            </p>
            <p
              className={`mt-4 font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : 'Out of Stock'}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                >
                  <HiMinus />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                >
                  <HiPlus />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-grow disabled:opacity-50"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${user?.wishlist?.includes(product._id) ? 'text-red-500' : ''}`}
              >
                {user?.wishlist?.includes(product._id) ? <HiHeart className="w-6 h-6" /> : <HiOutlineHeart className="w-6 h-6" />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {user && (
            <form onSubmit={handleAddReview} className="card p-6 mb-8">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewData({ ...reviewData, rating: star })
                    }
                  >
                    <HiStar
                      className={`w-8 h-8 ${
                        star <= reviewData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      } cursor-pointer hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                placeholder="Share your thoughts..."
                className="input-field mb-4"
                rows={3}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary"
              >
                Submit Review
              </motion.button>
            </form>
          )}

          <div className="space-y-4">
            {product.reviews?.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              product.reviews?.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <HiStar
                          key={j}
                          className={`w-4 h-4 ${
                            j < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
