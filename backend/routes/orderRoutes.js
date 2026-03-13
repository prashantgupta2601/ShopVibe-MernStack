const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/all', protect, isAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;
