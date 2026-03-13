const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  handleWebhook, 
  processRefund, 
  getPaymentMethods 
} = require('../controllers/paymentController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/refund', protect, isAdmin, processRefund);
router.get('/methods', protect, getPaymentMethods);

module.exports = router;