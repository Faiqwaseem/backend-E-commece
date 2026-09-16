const express = require("express");

const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
} = require("../validators/cart.validator");

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// Get current user's cart
router.get("/", cartController.getCart);

// Add product to cart
router.post("/items", validateAddToCart, cartController.addToCart);

// Update cart item quantity
router.patch("/items", validateUpdateCartItem, cartController.updateCartItem);

// Remove product from cart
router.delete("/items", validateRemoveFromCart, cartController.removeFromCart);

// Clear entire cart
router.delete("/", cartController.clearCart);

module.exports = router;
