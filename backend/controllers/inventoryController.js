const Product = require('../models/Product');
const Order = require('../models/Order');

// Get inventory overview
exports.getInventoryOverview = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStockValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    const lowStockProducts = await Product.countDocuments({
      stock: { $gt: 0, $lt: 10 }
    });

    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    const categoryBreakdown = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json({
      totalProducts,
      totalStockValue: totalStockValue[0]?.totalValue || 0,
      totalStock: totalStockValue[0]?.totalStock || 0,
      lowStockProducts,
      outOfStockProducts,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products with alerts
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10, page = 1, limit = 20 } = req.query;

    const lowStockProducts = await Product.find({
      stock: { $gt: 0, $lt: threshold }
    })
      .sort({ stock: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('name category brand stock price averageRating images');

    const total = await Product.countDocuments({
      stock: { $gt: 0, $lt: threshold }
    });

    // Calculate restock suggestions
    const productsWithSuggestions = lowStockProducts.map(product => {
      const avgMonthlySales = 10; // This would be calculated from actual sales data
      const suggestedStock = Math.ceil(avgMonthlySales * 3); // 3 months supply
      
      return {
        ...product.toObject(),
        suggestedStock,
        urgency: product.stock < 5 ? 'critical' : product.stock < 8 ? 'high' : 'medium'
      };
    });

    res.json({
      products: productsWithSuggestions,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get out of stock products
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const outOfStockProducts = await Product.find({ stock: 0 })
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('name category brand price averageRating images updatedAt');

    const total = await Product.countDocuments({ stock: 0 });

    res.json({
      products: outOfStockProducts,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { productId, quantity, operation, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let updateQuery = {};
    let newStock = product.stock;

    switch (operation) {
      case 'add':
        newStock += quantity;
        updateQuery = { $inc: { stock: quantity } };
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - quantity);
        updateQuery = { $set: { stock: newStock } };
        break;
      case 'set':
        newStock = quantity;
        updateQuery = { $set: { stock: quantity } };
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...updateQuery, lastInventoryUpdate: new Date() },
      { new: true }
    );

    // Create inventory log entry
    const inventoryLog = {
      productId,
      productName: product.name,
      operation,
      quantity,
      previousStock: product.stock,
      newStock,
      reason: reason || 'Manual update',
      updatedBy: req.user._id,
      timestamp: new Date()
    };

    // Emit real-time notification
    const io = req.app.get('io');
    
    if (newStock < 10 && newStock > 0) {
      io.emit('lowStockAlert', {
        type: 'warning',
        message: `${product.name} is running low on stock (${newStock} units left)`,
        product: updatedProduct
      });
    }

    if (newStock === 0) {
      io.emit('outOfStockAlert', {
        type: 'error',
        message: `${product.name} is now out of stock`,
        product: updatedProduct
      });
    }

    io.emit('inventoryUpdate', inventoryLog);

    res.json({
      product: updatedProduct,
      log: inventoryLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk inventory update
exports.bulkUpdateInventory = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, quantity, operation, reason }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const product = await Product.findById(update.productId);
        if (!product) {
          errors.push({ productId: update.productId, error: 'Product not found' });
          continue;
        }

        let newStock = product.stock;
        switch (update.operation) {
          case 'add':
            newStock += update.quantity;
            break;
          case 'subtract':
            newStock = Math.max(0, product.stock - update.quantity);
            break;
          case 'set':
            newStock = update.quantity;
            break;
        }

        await Product.findByIdAndUpdate(
          update.productId,
          { 
            $set: { stock: newStock, lastInventoryUpdate: new Date() }
          }
        );

        results.push({
          productId: update.productId,
          productName: product.name,
          previousStock: product.stock,
          newStock
        });
      } catch (error) {
        errors.push({ productId: update.productId, error: error.message });
      }
    }

    // Emit bulk update notification
    const io = req.app.get('io');
    io.emit('bulkInventoryUpdate', {
      updated: results.length,
      errors: errors.length,
      timestamp: new Date()
    });

    res.json({
      message: `Updated ${results.length} products`,
      results,
      errors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory movements/history
exports.getInventoryHistory = async (req, res) => {
  try {
    const { productId, page = 1, limit = 50 } = req.query;

    // This would typically come from an inventory logs collection
    // For now, we'll simulate with order data
    const matchQuery = {};
    if (productId) {
      matchQuery['items.product'] = productId;
    }

    const movements = await Order.aggregate([
      { $unwind: '$items' },
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $limit: Number(limit) },
      { $skip: (Number(page) - 1) * Number(limit) },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$items.product',
          productName: '$product.name',
          quantity: '$items.quantity',
          type: 'sale',
          timestamp: '$createdAt',
          orderId: '$_id'
        }
      }
    ]);

    res.json({
      movements,
      page: Number(page),
      totalPages: Math.ceil(movements.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory forecasting
exports.getInventoryForecast = async (req, res) => {
  try {
    const { productId, days = 30 } = req.query;

    // Calculate average daily sales from recent orders
    const salesData = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.product': productId } },
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const avgDailySales = salesData.reduce((sum, day) => sum + day.totalSold, 0) / salesData.length || 0;
    const daysUntilOutOfStock = avgDailySales > 0 ? Math.floor(product.stock / avgDailySales) : 999;

    const forecast = {
      currentStock: product.stock,
      avgDailySales,
      daysUntilOutOfStock,
      projectedStock: Math.max(0, product.stock - (avgDailySales * days)),
      reorderRecommended: daysUntilOutOfStock < 14,
      suggestedReorderQuantity: Math.ceil(avgDailySales * 30) // 30 days supply
    };

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
