const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const fashionProducts = [
  {
    name: 'Classic White T-Shirt',
    description: 'Premium quality cotton t-shirt with a comfortable fit. Perfect for casual wear and everyday styling. Made from 100% organic cotton with a soft finish.',
    price: 799,
    category: 'Fashion',
    brand: 'H&M',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'
    ],
    stock: 50,
    rating: 4.2,
    reviews: []
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern fit. Features button closure, multiple pockets, and durable denim fabric. Perfect for layering in any season.',
    price: 2499,
    category: 'Fashion',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80'
    ],
    stock: 30,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Black Hoodie',
    description: 'Comfortable black hoodie with kangaroo pocket and adjustable drawstring hood. Made from soft cotton blend material for maximum comfort.',
    price: 1499,
    category: 'Fashion',
    brand: 'Zara',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80'
    ],
    stock: 45,
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Running Sneakers',
    description: 'High-performance running sneakers with advanced cushioning technology. Breathable mesh upper and durable rubber outsole for optimal performance.',
    price: 2999,
    category: 'Footwear',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
    ],
    stock: 25,
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Casual Sneakers',
    description: 'Stylish casual sneakers perfect for everyday wear. Features classic three-stripes design and comfortable cushioning for all-day comfort.',
    price: 2199,
    category: 'Footwear',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80'
    ],
    stock: 35,
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Leather Handbag',
    description: 'Elegant leather handbag with multiple compartments and adjustable strap. Premium genuine leather with gold-tone hardware for a luxurious look.',
    price: 1899,
    category: 'Accessories',
    brand: 'Guess',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80'
    ],
    stock: 20,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Stylish Sunglasses',
    description: 'Classic aviator sunglasses with UV protection and polarized lenses. Lightweight metal frame with comfortable nose pads for all-day wear.',
    price: 999,
    category: 'Accessories',
    brand: 'RayBan',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'
    ],
    stock: 60,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Smart Watch',
    description: 'Modern smartwatch with fitness tracking, heart rate monitor, and smartphone integration. Water-resistant design with customizable watch faces.',
    price: 3499,
    category: 'Accessories',
    brand: 'Fossil',
    images: [
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80',
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&q=80'
    ],
    stock: 15,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Leather Belt',
    description: 'Classic leather belt with reversible design and metal buckle. Genuine leather construction with adjustable length for perfect fit.',
    price: 699,
    category: 'Accessories',
    brand: 'Tommy Hilfiger',
    images: [
      'https://images.unsplash.com/photo-1593032457863-9f91a6a6e5e4?w=800&q=80',
      'https://images.unsplash.com/photo-1593032457863-9f91a6a6e5e4?w=400&q=80'
    ],
    stock: 40,
    rating: 4.1,
    reviews: []
  },
  {
    name: 'Women\'s Summer Dress',
    description: 'Flattering summer dress with floral print and lightweight fabric. Features adjustable straps and flowy silhouette perfect for warm weather.',
    price: 1799,
    category: 'Fashion',
    brand: 'Zara',
    images: [
      'https://images.unsplash.com/photo-1520975922203-bde49c7eaeae?w=800&q=80',
      'https://images.unsplash.com/photo-1520975922203-bde49c7eaeae?w=400&q=80'
    ],
    stock: 28,
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Cargo Pants',
    description: 'Versatile cargo pants with multiple pockets and comfortable fit. Durable cotton fabric with adjustable waist for perfect sizing.',
    price: 1599,
    category: 'Fashion',
    brand: 'H&M',
    images: [
      'https://images.unsplash.com/photo-1583001809809-4d2b1b8f5a4b?w=800&q=80',
      'https://images.unsplash.com/photo-1583001809809-4d2b1b8f5a4b?w=400&q=80'
    ],
    stock: 32,
    rating: 4.2,
    reviews: []
  },
  {
    name: 'Crossbody Bag',
    description: 'Chic crossbody bag with adjustable strap and secure zip closure. Premium synthetic leather with gold-tone hardware and organized compartments.',
    price: 1299,
    category: 'Accessories',
    brand: 'Michael Kors',
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80'
    ],
    stock: 22,
    rating: 4.6,
    reviews: []
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert fashion products
    const insertedProducts = await Product.insertMany(fashionProducts);
    console.log(`Inserted ${insertedProducts.length} fashion products`);

    // Add some sample reviews
    const sampleReviews = [
      {
        user: '65f8d4b2c9e3c4a3b8c7d6e5', // Sample user ID
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent quality product! Highly recommended.'
      },
      {
        user: '65f8d4b2c9e3c4a3b8c7d6e5',
        name: 'Jane Smith',
        rating: 4,
        comment: 'Good value for money. Fits as expected.'
      }
    ];

    // Add reviews to some products
    for (let i = 0; i < Math.min(5, insertedProducts.length); i++) {
      const product = insertedProducts[i];
      product.reviews = sampleReviews;
      product.calculateAverageRating();
      await product.save();
    }

    console.log('Added sample reviews to products');
    console.log('✅ Fashion & Accessories products seeded successfully!');
    
    // Display seeded products
    console.log('\n📦 Seeded Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
