My Shopping App

Overview
My Shopping App is a full‑stack MERN e‑commerce sample with authentication, product browsing, cart, checkout, order history, user profile, multi‑address book, wishlist, and email notifications. The project is split into two apps:
- Backend - Shopping - App (Node.js/Express, MongoDB)
- Frontend - Shopping - App (React + Vite, TailwindCSS)

Key Features
- Auth: Signup via OTP, Login, protected routes (cart, orders, profile, addresses, wishlist)
- Navbar: Login/Signup vs Logout toggle, menu with Profile/Addresses/Orders/Order History/Wishlist, search box
- Products: Home with categories and banners, search, product detail view with add to cart/buy now/add to wishlist
- Cart: Quantity update, remove, save for later (moves to wishlist), order summary
- Checkout: Address form, use saved address option, payment method selection, order creation
- Orders: Order history page, order success page
- User: Profile page (name, phone, avatar, payment preference), Addresses page (add/edit/delete, set default, PIN autofill)
- Wishlist: Add from product page, save for later from cart, move item to cart
- Email: Order confirmation email on successful checkout (SMTP)
- Responsive: Mobile‑friendly layouts using Tailwind responsive utilities

Tech Stack
- Backend: Node.js, Express, Mongoose (MongoDB Atlas/local)
- Frontend: React 18, Vite, TailwindCSS, react-router-dom
- Email: nodemailer (SMTP)

Monorepo Structure
- Backend - Shopping - App/
  - api/v1/* route modules (auth, products, otps, cart, orders, users, wishlist)
  - models/* mongoose schemas (user, product, cart, order, otp, wishlist)
  - utils/emailhelper.js nodemailer setup and helpers
  - config/db.js Mongo connection
- Frontend - Shopping - App/
  - src/pages/* (home, search, view, cart, orders, login, signup, profile, addresses, wishlist)
  - src/components/* (navbar, footer, pagination)
  - src/utils/auth.js (local auth state helpers)

Prerequisites
- Node.js 18+
- MongoDB Atlas cluster or local MongoDB
- SMTP credentials (e.g., Gmail app password)

Environment Variables
Create a .env file for the backend (do NOT commit it): Backend - Shopping - App/.env
Example:
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority
PORT=3900
FRONTEND_URL=http://localhost:5173
SMPT_USER=your-email@example.com
SMPT_PASSWORD=your-app-password

Important: Never commit real secrets. Keep .env in .gitignore and rotate any leaked credentials immediately.

Install & Run
1) Backend
cd "Backend - Shopping - App"
npm install
npm run start

The server runs at http://localhost:3900 and connects using MONGODB_URL.

2) Frontend
Open a new terminal:
cd "Frontend - Shopping - App"
npm install
npm run dev

The app runs at http://localhost:5173.

Core Flows
- Auth
  - Signup: email OTP flow (POST /api/v1/otps, then POST /api/v1/auth/signup)
  - Login: POST /api/v1/auth/login; frontend stores isLoggedIn and userId in localStorage
- Product browsing
  - Home pulls products from GET /api/v1/products/list
  - View page loads product via PATCH /api/v1/products/view/:productId and supports Add to Cart/Buy Now/Add to Wishlist
- Cart
  - GET/POST/PUT/DELETE /api/v1/cart to fetch/add/update/remove items
  - Save for later moves an item to wishlist (POST /api/v1/wishlist) then removes from cart
- Orders
  - Checkout posts to POST /api/v1/orders with userId, shippingAddress, paymentMethod
  - Order success email is sent to the user (SMTP via utils/emailhelper.js)
  - Order history: GET /api/v1/orders/user/:userId
- User Profile & Addresses
  - Profile: GET/PUT /api/v1/users/:id/profile
  - Single address (legacy): GET/PUT /api/v1/users/:id/address
  - Multiple addresses: GET/POST/PUT/DELETE /api/v1/users/:id/addresses
  - Addresses page supports add/edit/delete, set default, and PIN autofill via https://api.postalpincode.in
- Wishlist
  - GET/POST/DELETE /api/v1/wishlist
  - POST /api/v1/wishlist/:id/move-to-cart

Route Protection (Frontend)
- Protected routes redirect to /login if not authenticated: /cart, /orders, /profile, /addresses, /order-history, /wishlist

Responsive Design
- Tailwind responsive utilities (sm/md/lg) used across Navbar, Home grids, View page layout, Cart, and forms for mobile usability

Customization
- Update brand colors, logo text, and footer in:
  - Frontend - Shopping - App/src/components/navbar.jsx
  - Frontend - Shopping - App/src/components/footer.jsx
- Email templates: adjust in Backend - Shopping - App/utils/emailhelper.js

Security Notes
- Keep secrets in environment variables only
- Rotate leaked MongoDB/SMTP credentials immediately
- Restrict MongoDB network access; avoid 0.0.0.0/0
- Consider JWT auth middleware for per‑user cart/wishlist scoping (roadmap)

Roadmap Ideas
- Per‑user carts and wishlists (associate with userId)
- Admin dashboard (products, orders, inventory, analytics)
- Payment gateway integration
- Reviews/ratings submissions with moderation
- Toast notifications and global error boundary

Troubleshooting
- JSON parse error with HTML response → verify backend URL and Content‑Type (application/json)
- Order History shows "User not found" → log in again so userId is in localStorage
- Emails not sending → confirm SMPT_USER/SMPT_PASSWORD, allow SMTP/app password, check server logs

License
This project is for educational/demo purposes. Replace branding and review licenses of dependencies before production use.


