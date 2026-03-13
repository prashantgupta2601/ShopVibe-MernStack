const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality.',
    price: 149.99,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    ],
    stock: 50,
    averageRating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Advanced smartwatch with health monitoring, GPS tracking, water resistance, and a stunning AMOLED display. Stay connected on the go.',
    price: 299.99,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    ],
    stock: 30,
    averageRating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Minimalist Backpack',
    description:
      'Sleek and functional backpack with laptop compartment, water-resistant fabric, and ergonomic design. Ideal for daily commute and travel.',
    price: 79.99,
    category: 'Clothing',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    ],
    stock: 75,
    averageRating: 4.7,
    numReviews: 20,
  },
  {
    name: 'Running Shoes Ultra',
    description:
      'Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole for all terrains.',
    price: 129.99,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    ],
    stock: 60,
    averageRating: 4.6,
    numReviews: 15,
  },
  {
    name: 'Organic Coffee Beans',
    description:
      'Premium single-origin organic coffee beans, medium roast with notes of chocolate and caramel. Freshly roasted for maximum flavor.',
    price: 24.99,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
    ],
    stock: 100,
    averageRating: 4.8,
    numReviews: 25,
  },
  {
    name: 'Leather Messenger Bag',
    description:
      'Handcrafted genuine leather messenger bag with adjustable strap, multiple compartments, and vintage brass hardware.',
    price: 189.99,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    ],
    stock: 25,
    averageRating: 4.4,
    numReviews: 10,
  },
  {
    name: 'Wireless Charging Pad',
    description:
      'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and anti-slip surface.',
    price: 34.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1586953208270-767fc7ff84c4?w=500&h=500&fit=crop',
    ],
    stock: 80,
    averageRating: 4.1,
    numReviews: 18,
  },
  {
    name: 'Yoga Mat Premium',
    description:
      'Extra thick non-slip yoga mat with alignment lines, eco-friendly TPE material, and carrying strap. Perfect for all yoga styles.',
    price: 49.99,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    ],
    stock: 45,
    averageRating: 4.3,
    numReviews: 14,
  },
  {
    name: 'Scented Candle Set',
    description:
      'Set of 3 luxury soy wax candles with natural essential oils. Includes lavender, vanilla, and eucalyptus scents.',
    price: 39.99,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500&h=500&fit=crop',
    ],
    stock: 55,
    averageRating: 4.6,
    numReviews: 22,
  },
  {
    name: 'Denim Jacket Classic',
    description:
      'Timeless classic denim jacket with button closure, chest pockets, and comfortable cotton blend. A wardrobe essential.',
    price: 89.99,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop',
    ],
    stock: 35,
    averageRating: 4.5,
    numReviews: 11,
  },
  {
    name: 'Bestselling Novel Collection',
    description:
      'Curated collection of 5 bestselling fiction novels from award-winning authors. Perfect gift for book lovers.',
    price: 59.99,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    ],
    stock: 40,
    averageRating: 4.9,
    numReviews: 30,
  },
  {
    name: 'Face Serum Vitamin C',
    description:
      'Advanced brightening serum with 20% Vitamin C, hyaluronic acid, and vitamin E. Reduces dark spots and boosts radiance.',
    price: 44.99,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
    ],
    stock: 65,
    averageRating: 4.7,
    numReviews: 28,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});

    await User.create({
      name: 'Admin',
      email: 'admin@shopvibe.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    console.log('Admin: admin@shopvibe.com / admin123');
    console.log('User:  john@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
