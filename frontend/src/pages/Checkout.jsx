import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import AnimatedPage from '../components/AnimatedPage';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sync cart to server before placing order
      for (const item of cartItems) {
        await api.post('/cart', {
          productId: item._id,
          quantity: item.quantity,
        });
      }
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'COD',
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing order');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', full: true },
    { name: 'address', label: 'Address', full: true },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'zipCode', label: 'ZIP Code' },
    { name: 'country', label: 'Country' },
    { name: 'phone', label: 'Phone', full: true },
  ];

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div
                      key={field.name}
                      className={field.full ? 'sm:col-span-2' : ''}
                    >
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <label className="flex items-center gap-3 p-4 border border-primary-600 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="accent-primary-600"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-200 dark:border-gray-700 mb-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Shipping</span>
                <span>{cartTotal >= 50 ? 'Free' : '$9.99'}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700 my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ${(cartTotal + (cartTotal >= 50 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
}
