const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const { notifyNewOrder } = require('./notificationController');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId || '',
        userId: req.user?._id.toString() || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Add shipping and billing details if provided
      shipping: req.body.shipping ? {
        name: req.body.shipping.fullName,
        address: {
          line1: req.body.shipping.address,
          city: req.body.shipping.city,
          state: req.body.shipping.state,
          postal_code: req.body.shipping.zipCode,
          country: req.body.shipping.country,
        },
      } : undefined,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      const order = await Order.findById(orderId).populate('user');
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentMethod = 'stripe';
        order.paymentDetails = {
          stripePaymentIntentId: paymentIntentId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paidAt: new Date(),
        };
        await order.save();

        // Update product stock
        for (const item of order.items) {
          const product = await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          // Check for low stock
          if (product.stock < 10) {
            const io = req.app.get('io');
            io.emit('lowStockAlert', {
              type: 'warning',
              message: `${product.name} is running low on stock (${product.stock} units left)`,
              product
            });
          }
        }

        // Send notifications
        await notifyNewOrder(orderId);

        // Emit real-time notifications
        const io = req.app.get('io');
        io.to(order.user._id.toString()).emit('paymentSuccess', {
          orderId: order._id,
          message: 'Payment successful! Your order is being processed.',
        });

        res.json({ 
          success: true, 
          orderId: order._id,
          message: 'Payment confirmed successfully'
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({ 
        message: 'Payment not successful', 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      
      // Update order if not already updated
      if (paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(
          paymentIntent.metadata.orderId,
          { 
            paymentStatus: 'paid',
            paymentMethod: 'stripe',
            'paymentDetails.stripePaymentIntentId': paymentIntent.id
          }
        );
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update order status to failed
      if (failedPayment.metadata.orderId) {
        await Order.findByIdAndUpdate(
          failedPayment.metadata.orderId,
          { paymentStatus: 'failed' }
        );
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid' });
    }

    if (!order.paymentDetails?.stripePaymentIntentId) {
      return res.status(400).json({ message: 'No Stripe payment found for this order' });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentDetails.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if no amount specified
      reason: 'requested_by_customer',
      metadata: {
        orderId: orderId,
        reason: reason || 'Customer requested refund',
      },
    });

    // Update order status
    order.paymentStatus = 'refunded';
    order.refundDetails = {
      stripeRefundId: refund.id,
      amount: refund.amount / 100,
      reason,
      processedAt: new Date(),
    };
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Notify user
    const io = req.app.get('io');
    io.to(order.user.toString()).emit('refundProcessed', {
      orderId: order._id,
      refundAmount: refund.amount / 100,
      message: 'Refund processed successfully',
    });

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
    });
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};