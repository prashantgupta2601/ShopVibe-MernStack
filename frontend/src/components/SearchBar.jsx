import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { smartSearch, clearSearchResults } from '../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, loading } = useSelector(state => state.products);

  useEffect(() => {
    if (query.length > 2) {
      dispatch(smartSearch(query));
      setShowDropdown(true);
    } else {
      dispatch(clearSearchResults());
      setShowDropdown(false);
    }
  }, [query, dispatch]);

  const handleSearch = (searchQuery) => {
    navigate(`/products?search=${searchQuery}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={() => handleSearch(query)}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          <FaSearch />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (searchResults.products.length > 0 || searchResults.suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-2 z-50 max-h-96 overflow-y-auto"
          >
            {/* Products */}
            {searchResults.products.slice(0, 5).map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700"
              >
                <div className="flex items-center">
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {searchResults.suggestions.length > 0 && (
              <div className="border-t dark:border-gray-700">
                <p className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Suggestions:
                </p>
                {searchResults.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <p className="text-sm dark:text-white">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;