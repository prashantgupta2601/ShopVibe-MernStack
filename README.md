# ShopVibe - AI-Powered MERN Stack E-Commerce

A fully dynamic AI-powered industry-level e-commerce platform similar to Amazon/Flipkart, built with the MERN stack featuring modern UI, advanced animations, and intelligent features.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, React Router DOM, Axios, React Toastify, React Icons, Recharts, Socket.io-client, Stripe Elements, Three.js

**Backend:** Node.js, Express.js, MongoDB with Mongoose, JWT Authentication, bcrypt, OpenAI API, Stripe, Cloudinary, Socket.io, Helmet, Rate Limiting

## Features

### Core E-Commerce Features
- Responsive design (mobile, tablet, desktop)
- Smooth Framer Motion animations throughout
- JWT-based authentication (user & admin roles)
- Product catalog with advanced search, filter, sort, and pagination
- Shopping cart with Redux persistence
- Checkout with Stripe payment integration
- Order management and history with real-time tracking
- Product reviews and ratings
- Wishlist functionality
- Inventory management
- Real-time notifications with Socket.io

### AI-Powered Features
- **AI Smart Search**: Intelligent search with autocomplete and semantic suggestions using OpenAI
- **AI Product Recommendations**: Personalized recommendations based on category, purchase history, and trending products
- **AI Chatbot**: Customer support chatbot powered by OpenAI API for product questions, shipping info, returns, and order tracking

### Admin Dashboard
- Professional admin panel with analytics
- Dashboard stats: Total users, orders, revenue, products
- Interactive charts: Monthly sales, revenue analytics, top selling products, orders by status
- CRUD operations for products
- Order management with status updates
- User management
- Inventory tracking and low stock alerts

### Advanced UI/UX
- 3D Product Viewer (optional for premium products)
- Dark mode toggle
- Animated product sliders
- Loading skeletons
- Page transitions
- Cart drawer animations
- Order tracking timeline UI

### Security & Performance
- Helmet for security headers
- Rate limiting
- Input validation
- Protected routes
- Admin role middleware
- Image upload with Cloudinary

## Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, products, orders, AI features)
│   ├── middleware/       # Auth, error, admin middleware
│   ├── models/          # Mongoose schemas (User, Product, Order, Cart)
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Express entry point with Socket.io
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Chatbot, SearchBar, etc.)
│   │   ├── pages/       # Route pages
│   │   ├── redux/       # Redux store, slices
│   │   └── services/    # API service layer
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in backend directory and add:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mern-ecommerce
   JWT_SECRET=your_jwt_secret_here
   OPENAI_API_KEY=your_openai_api_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_URL=http://localhost:5173
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/categories` - Get product categories

### AI Features
- `GET /api/search?q=query` - AI-powered search
- `GET /api/recommendations/:productId` - Get product recommendations
- `POST /api/chatbot` - Chatbot interaction

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Admin Analytics
- `GET /api/analytics/stats` - Get dashboard stats
- `GET /api/analytics/monthly-sales` - Get monthly sales data
- `GET /api/analytics/top-products` - Get top selling products
- `GET /api/analytics/orders-status` - Get orders by status

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/confirm` - Confirm payment

## Usage

1. Register/Login as a user or admin
2. Browse products with AI search and recommendations
3. Add products to cart and wishlist
4. Checkout with Stripe payment
5. Track orders in real-time
6. Use AI chatbot for support
7. Admin can manage products, orders, and view analytics

## Admin Credentials

After seeding, you can login as admin with:
- Email: admin@example.com
- Password: 123456

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection string)

## Getting Started

### 1. Clone and setup environment

```bash
cd mern-ecommerce/backend
cp .env.example .env
```

Edit `.env` with your MongoDB URI and a JWT secret:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 2. Install dependencies

```bash
# Backend
cd mern-ecommerce/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Seed the database

```bash
cd ../backend
npm run seed
```

This creates sample products and two test accounts:
- **Admin:** admin@shopvibe.com / admin123
- **User:** john@example.com / password123

### 4. Run the application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (protected)
- `GET /api/auth/wishlist` - Get wishlist (protected)
- `POST /api/auth/wishlist` - Toggle wishlist item (protected)

### Products
- `GET /api/products` - List products (filter, sort, search, paginate)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review (protected)

### Cart
- `GET /api/cart` - Get cart (protected)
- `POST /api/cart` - Add to cart (protected)
- `PUT /api/cart` - Update cart item (protected)
- `DELETE /api/cart/:productId` - Remove item (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get my orders (protected)
- `GET /api/orders/all` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id` - Update order status (admin)

## Pages

1. **Home** - Hero banner, categories, featured products, promo, newsletter
2. **Products** - Grid with filters, search, sort, pagination
3. **Product Details** - Image gallery, reviews, add to cart
4. **Cart** - Item list, quantity controls, order summary
5. **Checkout** - Shipping form, payment method, place order
6. **Order Success** - Confirmation with order ID
7. **Login / Register** - Authentication forms
8. **Dashboard** - Order history, profile details
9. **Wishlist** - Saved products
10. **Admin Panel** - Product CRUD, order management

## License

MIT
