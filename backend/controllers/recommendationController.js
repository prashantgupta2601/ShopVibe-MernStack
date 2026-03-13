const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Enhanced ML-based recommendation algorithm
exports.getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user ? req.user._id : null;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let recommendations = [];
    const recommendationScores = new Map();

    // 1. Same category recommendations (Weight: 0.4)
    const sameCategory = await Product.find({
      category: product.category,
      _id: { $ne: productId },
    })
      .limit(10)
      .sort({ averageRating: -1, numReviews: -1 });

    sameCategory.forEach(p => {
      recommendationScores.set(p._id.toString(), {
        product: p,
        score: 0.4,
        reason: 'Similar category'
      });
    });

    // 2. Collaborative filtering - users who bought this also bought (Weight: 0.3)
    const ordersWithThisProduct = await Order.find({
      'items.product': productId
    }).populate('items.product user');

    const alsoBoughtProducts = new Map();
    ordersWithThisProduct.forEach(order => {
      order.items.forEach(item => {
        if (item.product._id.toString() !== productId) {
          const productId = item.product._id.toString();
          alsoBoughtProducts.set(productId, (alsoBoughtProducts.get(productId) || 0) + 1);
        }
      });
    });

    // Get top also-bought products
    const alsoBoughtIds = Array.from(alsoBoughtProducts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    if (alsoBoughtIds.length > 0) {
      const alsoBoughtProductsFull = await Product.find({
        _id: { $in: alsoBoughtIds }
      });

      alsoBoughtProductsFull.forEach(p => {
        const frequency = alsoBoughtProducts.get(p._id.toString());
        const score = Math.min(0.3, (frequency / ordersWithThisProduct.length) * 0.3);
        recommendationScores.set(p._id.toString(), {
          product: p,
          score: (recommendationScores.get(p._id.toString())?.score || 0) + score,
          reason: 'Customers also bought'
        });
      });
    }

    // 3. User-based recommendations (Weight: 0.2)
    if (userId) {
      const userOrders = await Order.find({ user: userId }).populate('items.product');
      const userPreferences = {
        categories: new Set(),
        brands: new Set(),
        priceRange: { min: Infinity, max: 0 }
      };

      userOrders.forEach(order => {
        order.items.forEach(item => {
          userPreferences.categories.add(item.product.category);
          userPreferences.brands.add(item.product.brand);
          userPreferences.priceRange.min = Math.min(userPreferences.priceRange.min, item.product.price);
          userPreferences.priceRange.max = Math.max(userPreferences.priceRange.max, item.product.price);
        });
      });

      // Find products matching user preferences
      const preferenceBasedProducts = await Product.find({
        _id: { $ne: productId },
        $or: [
          { category: { $in: Array.from(userPreferences.categories) } },
          { brand: { $in: Array.from(userPreferences.brands) } },
          { 
            price: { 
              $gte: userPreferences.priceRange.min * 0.8, 
              $lte: userPreferences.priceRange.max * 1.2 
            } 
          }
        ]
      }).limit(8);

      preferenceBasedProducts.forEach(p => {
        let score = 0;
        if (userPreferences.categories.has(p.category)) score += 0.1;
        if (userPreferences.brands.has(p.brand)) score += 0.05;
        if (p.price >= userPreferences.priceRange.min * 0.8 && p.price <= userPreferences.priceRange.max * 1.2) score += 0.05;
        
        recommendationScores.set(p._id.toString(), {
          product: p,
          score: (recommendationScores.get(p._id.toString())?.score || 0) + score,
          reason: 'Based on your preferences'
        });
      });
    }

    // 4. Trending products (Weight: 0.1)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const trending = await Product.find({
      _id: { $ne: productId },
      createdAt: { $gte: thirtyDaysAgo },
      averageRating: { $gte: 4.0 },
      numReviews: { $gte: 5 }
    })
      .sort({ averageRating: -1, numReviews: -1, createdAt: -1 })
      .limit(5);

    trending.forEach(p => {
      recommendationScores.set(p._id.toString(), {
        product: p,
        score: (recommendationScores.get(p._id.toString())?.score || 0) + 0.1,
        reason: 'Trending now'
      });
    });

    // Convert to array and sort by score
    recommendations = Array.from(recommendationScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => ({
        ...item.product.toObject(),
        recommendationScore: item.score,
        recommendationReason: item.reason
      }));

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get personalized recommendations for user
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's order history
    const userOrders = await Order.find({ user: userId }).populate('items.product');
    
    if (userOrders.length === 0) {
      // For new users, return popular products
      const popularProducts = await Product.find()
        .sort({ averageRating: -1, numReviews: -1 })
        .limit(10);
      return res.json(popularProducts);
    }

    // Analyze user preferences
    const userProfiles = analyzeUserPreferences(userOrders);
    
    // Get recommendations based on multiple factors
    const recommendations = await getMultiFactorRecommendations(userProfiles, userId);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Personalized recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to analyze user preferences
function analyzeUserPreferences(orders) {
  const categories = new Map();
  const brands = new Map();
  const pricePoints = [];
  
  orders.forEach(order => {
    order.items.forEach(item => {
      // Category preferences
      categories.set(item.product.category, (categories.get(item.product.category) || 0) + 1);
      
      // Brand preferences
      brands.set(item.product.brand, (brands.get(item.product.brand) || 0) + 1);
      
      // Price preferences
      pricePoints.push(item.product.price);
    });
  });
  
  const avgPrice = pricePoints.reduce((sum, price) => sum + price, 0) / pricePoints.length;
  
  return {
    categories: Array.from(categories.entries()).sort((a, b) => b[1] - a[1]),
    brands: Array.from(brands.entries()).sort((a, b) => b[1] - a[1]),
    avgPrice,
    priceRange: {
      min: Math.min(...pricePoints),
      max: Math.max(...pricePoints)
    }
  };
}

// Helper function for multi-factor recommendations
async function getMultiFactorRecommendations(userProfiles, userId) {
  const topCategories = userProfiles.categories.slice(0, 3).map(c => c[0]);
  const topBrands = userProfiles.brands.slice(0, 3).map(b => b[0]);
  
  const recommendations = await Product.find({
    _id: { 
      $nin: await getAlreadyPurchasedProducts(userId)
    },
    $or: [
      { category: { $in: topCategories } },
      { brand: { $in: topBrands } },
      { 
        price: { 
          $gte: userProfiles.priceRange.min * 0.7, 
          $lte: userProfiles.priceRange.max * 1.3 
        } 
      }
    ]
  })
  .sort({ averageRating: -1, numReviews: -1 })
  .limit(10);
  
  return recommendations;
}

// Helper function to get already purchased products
async function getAlreadyPurchasedProducts(userId) {
  const orders = await Order.find({ user: userId });
  const purchasedProducts = new Set();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      purchasedProducts.add(item.product.toString());
    });
  });
  
  return Array.from(purchasedProducts);
}