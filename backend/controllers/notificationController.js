const Order = require('../models/Order');
const Product = require('../models/Product');

// Real-time order status updates
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit real-time notification to user
    const io = req.app.get('io');
    io.to(order.user._id.toString()).emit('orderStatusUpdate', {
      orderId: order._id,
      orderStatus,
      message: `Your order #${order._id.toString().slice(-6)} is now ${orderStatus.replace('_', ' ')}`
    });

    // Send notification to admin users
    io.emit('adminOrderUpdate', {
      orderId: order._id,
      orderStatus,
      user: order.user.name
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Low stock alerts
exports.checkLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $gt: 0, $lt: 10 }
    }).select('name category brand stock');

    const outOfStockProducts = await Product.find({
      stock: 0
    }).select('name category brand');

    const io = req.app.get('io');
    
    // Send low stock alerts to admins
    if (lowStockProducts.length > 0) {
      io.emit('lowStockAlert', {
        type: 'warning',
        message: `${lowStockProducts.length} products are running low on stock`,
        products: lowStockProducts
      });
    }

    if (outOfStockProducts.length > 0) {
      io.emit('outOfStockAlert', {
        type: 'error',
        message: `${outOfStockProducts.length} products are out of stock`,
        products: outOfStockProducts
      });
    }

    res.json({
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New order notification
exports.notifyNewOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'name');
    const io = global.io || require('../server').io;

    if (io && order) {
      // Notify admins about new order
      io.emit('newOrder', {
        orderId: order._id,
        user: order.user.name,
        totalPrice: order.totalPrice,
        message: `New order received from ${order.user.name}`
      });

      // Notify user about order confirmation
      io.to(order.user._id.toString()).emit('orderConfirmation', {
        orderId: order._id,
        message: 'Your order has been confirmed and is being processed'
      });
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// Real-time inventory updates
exports.updateInventory = async (req, res) => {
  try {
    const { productId, quantity, operation } = req.body;
    
    let updateQuery = {};
    if (operation === 'add') {
      updateQuery = { $inc: { stock: quantity } };
    } else if (operation === 'subtract') {
      updateQuery = { $inc: { stock: -quantity } };
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateQuery,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Emit inventory update
    const io = req.app.get('io');
    io.emit('inventoryUpdate', {
      productId: product._id,
      productName: product.name,
      newStock: product.stock,
      operation
    });

    // Check if stock is low
    if (product.stock < 10 && product.stock > 0) {
      io.emit('lowStockAlert', {
        type: 'warning',
        message: `${product.name} is running low on stock (${product.stock} units left)`,
        product
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    // This would typically come from a notifications collection
    // For now, return recent order status updates
    const orders = await Order.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('orderStatus updatedAt totalPrice');

    const notifications = orders.map(order => ({
      id: order._id,
      type: 'order',
      title: 'Order Update',
      message: `Your order is now ${order.orderStatus.replace('_', ' ')}`,
      timestamp: order.updatedAt,
      read: false
    }));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
