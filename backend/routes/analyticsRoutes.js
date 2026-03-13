const express = require('express');
const router = express.Router();
const {
  getStats,
  getMonthlySales,
  getTopProducts,
  getOrdersByStatus,
  getCategoryAnalytics,
  getRevenueAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
} = require('../controllers/analyticsController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/stats', protect, isAdmin, getStats);
router.get('/monthly-sales', protect, isAdmin, getMonthlySales);
router.get('/top-products', protect, isAdmin, getTopProducts);
router.get('/orders-status', protect, isAdmin, getOrdersByStatus);
router.get('/categories', protect, isAdmin, getCategoryAnalytics);
router.get('/revenue', protect, isAdmin, getRevenueAnalytics);
router.get('/customers', protect, isAdmin, getCustomerAnalytics);
router.get('/inventory', protect, isAdmin, getInventoryAnalytics);

module.exports = router;