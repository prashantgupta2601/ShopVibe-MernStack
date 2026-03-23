const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation. Features two processors controlling 8 microphones for unprecedented noise cancellation.',
    price: 34990,
    category: 'Electronics',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'],
    stock: 45,
    averageRating: 4.8,
    numReviews: 342,
  },
  {
    name: 'Apple iPad Pro 12.9-inch (M2)',
    description: 'Stunning 12.9-inch Liquid Retina XDR display with ProMotion, True Tone, and P3 wide color. M2 chip with 8-core CPU and 10-core GPU.',
    price: 112900,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
    stock: 12,
    averageRating: 4.9,
    numReviews: 145,
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Fitness tracking, sleep coaching, and wellness insights. Beautiful display with personalized watch faces.',
    price: 29999,
    category: 'Electronics',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'],
    stock: 55,
    averageRating: 4.6,
    numReviews: 231,
  },
  {
    name: 'Dell XPS 13 Laptop',
    description: '13.4-inch FHD+ display, Intel Core i7 processor, 16GB RAM, 512GB SSD. Premium build quality and extreme portability.',
    price: 144990,
    category: 'Electronics',
    brand: 'Dell',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'],
    stock: 8,
    averageRating: 4.7,
    numReviews: 89,
  },
  {
    name: 'Sony PlayStation 5 Console',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback and 3D Audio.',
    price: 54990,
    category: 'Electronics',
    brand: 'Sony',
    images: ['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6523/6523169_sd.jpg'],
    stock: 20,
    averageRating: 4.9,
    numReviews: 876,
  },
  {
    name: 'Nike Air Zoom Pegasus 40',
    description: 'A springy ride for every run, the Pegasus familiar, just-for-you feel returns to help you accomplish your goals.',
    price: 11995,
    category: 'Sports',
    brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    stock: 85,
    averageRating: 4.6,
    numReviews: 89,
  },
  {
    name: 'Adidas Ultraboost Light',
    description: 'The lightest Ultraboost ever made, featuring 30% lighter Boost material for ultimate energy return and cushioning.',
    price: 18999,
    category: 'Sports',
    brand: 'Adidas',
    images: ['https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80'],
    stock: 42,
    averageRating: 4.8,
    numReviews: 120,
  },
  {
    name: 'The North Face Borealis Backpack',
    description: 'The classic 28-liter backpack updated with easier-to-access pockets and an overhauled suspension system.',
    price: 8999,
    category: 'Clothing',
    brand: 'The North Face',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
    stock: 65,
    averageRating: 4.7,
    numReviews: 128,
  },
  {
    name: 'Levi\'s Men\'s Original Trucker Jacket',
    description: 'The original jean jacket since 1967. A blank canvas for self-expression.',
    price: 4599,
    category: 'Clothing',
    brand: 'Levi\'s',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80'],
    stock: 55,
    averageRating: 4.6,
    numReviews: 312,
  },
  {
    name: 'Fossil Greenville Leather Messenger Bag',
    description: 'Crafted in premium rich leather, this messenger bag features a padded laptop pocket and adjustable strap.',
    price: 14995,
    category: 'Clothing',
    brand: 'Fossil',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
    stock: 15,
    averageRating: 4.5,
    numReviews: 42,
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day.',
    price: 599,
    category: 'Books',
    brand: 'Penguin Random House',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'],
    stock: 210,
    averageRating: 4.9,
    numReviews: 8945,
  },
  {
    name: 'Starbucks Pike Place Roast Coffee',
    description: 'Well-rounded with subtle notes of cocoa and toasted nuts balancing the smooth mouthfeel.',
    price: 1250,
    category: 'Home',
    brand: 'Starbucks',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80'],
    stock: 120,
    averageRating: 4.8,
    numReviews: 245,
  },
  {
    name: 'Anker PowerWave Wireless Charging Pad',
    description: 'High-speed wireless charging for Samsung Galaxy and Apple iPhone.',
    price: 1499,
    category: 'Electronics',
    brand: 'Anker',
    images: ['https://img.freepik.com/free-vector/realistic-wireless-charger-template_23-2148729910.jpg?w=800'],
    stock: 150,
    averageRating: 4.3,
    numReviews: 876,
  },
  {
    name: 'Liforme Original Yoga Mat',
    description: 'The ultimate grip for your practice. Features unique AlignForMe system of intelligent markers.',
    price: 12900,
    category: 'Sports',
    brand: 'Liforme',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
    stock: 35,
    averageRating: 4.9,
    numReviews: 215,
  },
  {
    name: 'CeraVe Vitamin C Serum',
    description: 'Skin brightening serum with 10% pure Vitamin C (L-ascorbic acid).',
    price: 1850,
    category: 'Beauty',
    brand: 'CeraVe',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],
    stock: 125,
    averageRating: 4.5,
    numReviews: 1243,
  },
  {
    name: 'Bath & Body Works Mahogany Teakwood Candle',
    description: 'Smells like borrowing their flannel for a hike in the woods. 3-Wick candle.',
    price: 2499,
    category: 'Home',
    brand: 'Bath & Body Works',
    images: ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80'],
    stock: 80,
    averageRating: 4.7,
    numReviews: 541,
  },
  {
    name: 'Puma One 20.3 Soccer Cleats',
    description: 'Engineered for speed and accurate kicking on firm ground and artificial grass.',
    price: 4999,
    category: 'Sports',
    brand: 'Puma',
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80'],
    stock: 25,
    averageRating: 4.4,
    numReviews: 112,
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses',
    description: 'Iconic aviator sunglasses originally designed for U.S. aviators in 1937.',
    price: 11490,
    category: 'Clothing',
    brand: 'Ray-Ban',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'],
    stock: 60,
    averageRating: 4.8,
    numReviews: 450,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Advanced wireless mouse with ultra-fast scrolling and quiet clicks.',
    price: 9495,
    category: 'Electronics',
    brand: 'Logitech',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
    stock: 90,
    averageRating: 4.7,
    numReviews: 672,
  },
  {
    name: 'Dyson V15 Detect Vacuum Cleaner',
    description: 'Powerful intelligent cordless vacuum with laser illumination to reveal microscopic dust.',
    price: 64900,
    category: 'Home',
    brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80'],
    stock: 18,
    averageRating: 4.9,
    numReviews: 320,
  }
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
