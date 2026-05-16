# 🚀 Backend E-Commerce API

A scalable and production-ready E-Commerce Backend API built with:

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cookie-Based Auth
- MVC Architecture
- Secure Production Middleware

---

# 📦 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- cookie-parser
- express-rate-limit
- helmet
- compression
- hpp
- express-mongo-sanitize
- morgan

---

# 📁 Project Structure

```bash
src/
├── config/
│   ├── db.js              ✅ tumhare paas hai
│   └── constants.js       ← abhi banayenge
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── validate.middleware.js
│   └── rateLimiter.middleware.js
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   ├── coupon.model.js
│   └── review.model.js
├── routes/
│   ├── index.js           ← master router
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   └── user.routes.js
├── services/
│   ├── email.service.js
│   └── payment.service.js
├── utils/
│   ├── ApiResponse.js
│   ├── ApiError.js
│   └── asyncHandler.js
├── validators/
│   ├── auth.validator.js
│   └── product.validator.js
├── app.js
└── server.js8
```
