const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation. Features two processors controlling 8 microphones for unprecedented noise cancellation. Up to 30-hour battery life with quick charging. Ultra-comfortable lightweight design with soft fit leather.',
    price: 398.00,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    ],
    stock: 45,
    averageRating: 4.8,
    numReviews: 342,
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced health features, temperature sensing, and blood oxygen monitoring. Brighter Always-On Retina display. Carbon neutral case and band combinations. Water resistant and swimproof.',
    price: 399.00,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    stock: 28,
    averageRating: 4.9,
    numReviews: 512,
  },
  {
    name: 'The North Face Borealis Backpack',
    description: 'The classic 28-liter backpack updated with easier-to-access pockets and an overhauled suspension system. Flexible custom injection-molded shoulder straps and padded mesh back panel.',
    price: 99.00,
    category: 'Clothing',
    brand: 'The North Face',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    stock: 65,
    averageRating: 4.7,
    numReviews: 128,
  },
  {
    name: 'Nike Air Zoom Pegasus 40',
    description: 'A springy ride for every run, the Pegasus\' familiar, just-for-you feel returns to help you accomplish your goals. Features improved comfort in sensitive areas like the arch and toes.',
    price: 130.00,
    category: 'Sports',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    stock: 85,
    averageRating: 4.6,
    numReviews: 89,
  },
  {
    name: 'Starbucks Pike Place Roast Coffee',
    description: 'Well-rounded with subtle notes of cocoa and toasted nuts balancing the smooth mouthfeel. A smooth, well-rounded blend of Latin American coffees with subtly rich flavors of cocoa and toasted nuts.',
    price: 14.99,
    category: 'Home',
    brand: 'Starbucks',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    ],
    stock: 120,
    averageRating: 4.8,
    numReviews: 245,
  },
  {
    name: 'Fossil Greenville Leather Messenger Bag',
    description: 'Crafted in premium rich leather, this messenger bag features a padded laptop pocket, an adjustable strap, and plenty of compartments to keep your essentials organized on the go.',
    price: 198.00,
    category: 'Clothing',
    brand: 'Fossil',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    stock: 15,
    averageRating: 4.5,
    numReviews: 42,
  },
  {
    name: 'Anker PowerWave Wireless Charging Pad',
    description: 'High-speed wireless charging for Samsung Galaxy and Apple iPhone. Features a slimline, anti-slip design to keep your phone in place, and an LED indicator to let you know the charging status.',
    price: 19.99,
    category: 'Electronics',
    brand: 'Anker',
    images: [
      'https://down-ph.img.susercontent.com/file/vn-11134207-7ras8-m44el671y4zz3b',
    ],
    stock: 150,
    averageRating: 4.3,
    numReviews: 876,
  },
  {
    name: 'Liforme Original Yoga Mat',
    description: 'The ultimate grip for your practice. Features Liforme\'s unique AlignForMe system of intelligent markers to guide your positioning. Eco-friendly, PVC-free, and biodegradable.',
    price: 149.95,
    category: 'Sports',
    brand: 'Liforme',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    ],
    stock: 35,
    averageRating: 4.9,
    numReviews: 215,
  },
  {
    name: 'Bath & Body Works Mahogany Teakwood 3-Wick Candle',
    description: 'Smells like borrowing their flannel for a hike in the woods. Fragrance notes: rich mahogany, black teakwood, dark oak and frosted lavender. Burns up to 45 hours.',
    price: 26.95,
    category: 'Home',
    brand: 'Bath & Body Works',
    images: [
      'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80',
    ],
    stock: 80,
    averageRating: 4.7,
    numReviews: 541,
  },
  {
    name: 'Levi\'s Men\'s Original Trucker Jacket',
    description: 'The original jean jacket since 1967. A blank canvas for self-expression. Gets better over time from natural wear with fading, stains, and holes.',
    price: 89.50,
    category: 'Clothing',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    ],
    stock: 55,
    averageRating: 4.6,
    numReviews: 312,
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies that will teach you exactly how to form good habits and break bad ones.',
    price: 11.98,
    category: 'Books',
    brand: 'Penguin Random House',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    ],
    stock: 210,
    averageRating: 4.9,
    numReviews: 8945,
  },
  {
    name: 'CeraVe Vitamin C Serum with Hyaluronic Acid',
    description: 'Skin brightening serum with 10% pure Vitamin C (L-ascorbic acid). Antioxidant benefits to help brighten tone and promote a more even complexion. Visibly improves skin texture.',
    price: 19.97,
    category: 'Beauty',
    brand: 'CeraVe',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    ],
    stock: 125,
    averageRating: 4.5,
    numReviews: 1243,
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
