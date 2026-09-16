const asyncHandler = require("../utils/asyncHandler");
const cartService = require("../services/cart.service");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;

  const cart = await cartService.addToCart(
    req.user._id,
    product,
    quantity,
  );

  return res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;

  const cart = await cartService.updateCartItem(
    req.user._id,
    product,
    quantity,
  );

  return res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: cart,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { product } = req.body;

  const cart = await cartService.removeFromCart(
    req.user._id,
    product,
  );

  return res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
