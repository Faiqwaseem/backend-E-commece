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
│   └── db.js
│
├── controllers/
│   └── auth.controller.js
│
├── middlewares/
│   └── error.middleware.js
│
├── models/
│   └── user.model.js
│
├── routes/
│   ├── auth.route.js
│   └── index.route.js
│
├── services/
│
├── test/
│
├── utils/
│   ├── ApiError.js
│   ├── asyncHandler.js
│   └── generateAuthToken.js
│
├── validators/
│   └── user.validator.js
│
├── app.js
└── server.js