const express = require('express');
const router = express.Router();
const {
  updateOrderStatus,
  checkLowStock,
  updateInventory,
  getUserNotifications
} = require('../controllers/notificationController');
const { protect, isAdmin } = require('../middleware/auth');

router.put('/orders/:id/status', protect, isAdmin, updateOrderStatus);
router.get('/low-stock', protect, isAdmin, checkLowStock);
router.put('/inventory', protect, isAdmin, updateInventory);
router.get('/user', protect, getUserNotifications);

module.exports = router;
