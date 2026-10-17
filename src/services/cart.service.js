const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const PRODUCT_FIELDS = "name slug price stock images isActive";

const isValidQuantity = (quantity) =>
  Number.isSafeInteger(quantity) && quantity >= 1;

const calculateTotal = (items) =>
  items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    return cart;
  }

  try {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalAmount: 0,
    });

    return cart;
  } catch (error) {
    // Another request may have created this user's cart first.
    if (error.code === 11000) {
      const existingCart = await Cart.findOne({ user: userId });

      if (existingCart) {
        return existingCart;
      }
    }

    throw error;
  }
};

// Synchronize saved prices with current active product prices.
// Deleted and inactive products are excluded from the cart total.
const refreshCartPricing = async (cart) => {
  await cart.populate({
    path: "items.product",
    select: PRODUCT_FIELDS,
  });

  let totalAmount = 0;
  let hasChanges = false;

  for (const item of cart.items) {
    const product = item.product;

    // A deleted product can populate as null.
    if (!product || !product.isActive) {
      continue;
    }

    if (item.price !== product.price) {
      item.price = product.price;
      hasChanges = true;
    }

    totalAmount += product.price * item.quantity;
  }

  if (cart.totalAmount !== totalAmount) {
    cart.totalAmount = totalAmount;
    hasChanges = true;
  }

  if (hasChanges) {
    await cart.save();
  }

  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return {
      user: userId,
      items: [],
      totalAmount: 0,
    };
  }

  return refreshCartPricing(cart);
};

const addToCart = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!isValidQuantity(quantity)) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isActive) {
    throw new ApiError(400, "Product is not available");
  }

  if (product.stock < quantity) {
    throw new ApiError(
      400,
      `Only ${product.stock} item(s) available in stock`,
    );
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new ApiError(
        400,
        `Only ${product.stock} item(s) available in stock`,
      );
    }

    existingItem.quantity = newQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  await refreshCartPricing(cart);

  return cart;
};

const updateCartItem = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!isValidQuantity(quantity)) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isActive) {
    throw new ApiError(400, "Product is not available");
  }

  if (product.stock < quantity) {
    throw new ApiError(
      400,
      `Only ${product.stock} item(s) available in stock`,
    );
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (cartItem) => cartItem.product.toString() === productId,
  );

  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }

  item.quantity = quantity;
  item.price = product.price;

  await refreshCartPricing(cart);

  return cart;
};

const removeFromCart = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (!itemExists) {
    throw new ApiError(404, "Product not found in cart");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await refreshCartPricing(cart);

  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return {
      user: userId,
      items: [],
      totalAmount: 0,
    };
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
