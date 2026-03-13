# ShopVibe - MERN Stack E-Commerce

A fully functional animated e-commerce website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI with Tailwind CSS and Framer Motion animations.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router DOM, Axios, React Toastify, React Icons

**Backend:** Node.js, Express.js, MongoDB with Mongoose, JWT Authentication, bcrypt, express-validator

## Features

- Responsive design (mobile, tablet, desktop)
- Smooth Framer Motion animations throughout
- Dark mode toggle with persistence
- JWT-based authentication (user & admin roles)
- Product catalog with search, filter, sort, and pagination
- Shopping cart with localStorage persistence
- Checkout with shipping address form
- Order management and history
- Product reviews and ratings
- Wishlist functionality
- Admin panel (CRUD products, manage orders)
- Loading skeletons
- Toast notifications
- Protected and admin routes

## Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth & error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── pages/       # Route pages
│   │   └── services/    # API service layer
│   ├── index.html
│   └── vite.config.js
└── README.md
```

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
