const express = require('express');
const router = express.Router();
const {
  getInventoryOverview,
  getLowStockProducts,
  getOutOfStockProducts,
  updateInventory,
  bulkUpdateInventory,
  getInventoryHistory,
  getInventoryForecast
} = require('../controllers/inventoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/overview', protect, isAdmin, getInventoryOverview);
router.get('/low-stock', protect, isAdmin, getLowStockProducts);
router.get('/out-of-stock', protect, isAdmin, getOutOfStockProducts);
router.put('/update', protect, isAdmin, updateInventory);
router.put('/bulk-update', protect, isAdmin, bulkUpdateInventory);
router.get('/history', protect, isAdmin, getInventoryHistory);
router.get('/forecast/:productId', protect, isAdmin, getInventoryForecast);

module.exports = router;
