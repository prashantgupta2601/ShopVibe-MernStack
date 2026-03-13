const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalProducts = await Product.countDocuments();

    // Additional stats
    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Recent growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const previousOrders = await Order.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const orderGrowth = previousOrders > 0 ? ((recentOrders - previousOrders) / previousOrders * 100).toFixed(1) : 0;

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      pendingOrders,
      processingOrders,
      lowStockProducts,
      outOfStockProducts,
      orderGrowth: parseFloat(orderGrowth)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          avgPrice: { $avg: '$items.price' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          brand: '$product.brand',
          totalSold: 1,
          revenue: 1,
          avgPrice: 1,
          stock: '$product.stock',
          rating: '$product.averageRating',
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(statusCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New analytics endpoints
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const categoryAnalytics = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $addToSet: '$_id' },
        },
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          avgOrderValue: { $divide: ['$revenue', '$orderCount'] },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          orders: 0,
        },
      },
    ]);

    res.json(categoryAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const paymentMethodRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      dailyRevenue,
      paymentMethodRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerAnalytics = async (req, res) => {
  try {
    const customerGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newCustomers: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1,
          avgOrderValue: 1,
          createdAt: '$user.createdAt',
        },
      },
    ]);

    const customerSegments = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 100, 500, 1000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalSpent' },
          },
        },
      },
    ]);

    res.json({
      customerGrowth,
      topCustomers,
      customerSegments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryAnalytics = async (req, res) => {
  try {
    const inventoryLevels = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$stock',
          boundaries: [0, 10, 50, 100, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          },
        },
      },
    ]);

    const lowStockProducts = await Product.find({
      stock: { $gt: 0, $lt: 10 }
    })
      .sort({ stock: 1 })
      .limit(20)
      .select('name category brand stock price averageRating');

    const outOfStockProducts = await Product.find({ stock: 0 })
      .select('name category brand price averageRating');

    res.json({
      inventoryLevels,
      lowStockProducts,
      outOfStockProducts: outOfStockProducts.length,
      outOfStockItems: outOfStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};