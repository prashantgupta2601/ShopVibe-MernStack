import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await api.post('/payment/confirm', {
          paymentIntentId: paymentIntent.id,
          orderId,
        });
        toast.success('Payment successful!');
        navigate(`/order-success/${orderId}`);
      } catch (err) {
        toast.error('Payment confirmation failed, please contact support.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button disabled={!stripe || loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default function Payment() {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderAndIntent = async () => {
      try {
        const { data: order } = await api.get(`/orders/${id}`);
        setOrderDetails(order);

        // Fetch client secret from backend
        const { data } = await api.post('/payment/create-intent', {
          amount: order.totalPrice,
          orderId: order._id,
        });
        setClientSecret(data.clientSecret);
      } catch (err) {
        toast.error('Failed to initialize payment');
      }
    };
    fetchOrderAndIntent();
  }, [id]);

  if (!clientSecret || !orderDetails) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 font-medium">Loading payment details...</span>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>
        <div className="card p-8">
          <p className="text-gray-600 mb-6 text-center">
            You are paying for Order #{id.substring(0, 8)} - Total: ₹{orderDetails.totalPrice.toFixed(2)}
          </p>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderId={id} amount={orderDetails.totalPrice} />
          </Elements>
        </div>
      </div>
    </AnimatedPage>
  );
}
