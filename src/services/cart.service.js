const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalAmount: 0,
    });
  }

  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name slug price stock images isActive",
  );

  if (!cart) {
    return {
      user: userId,
      items: [],
      totalAmount: 0,
    };
  }

  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
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

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return await cart.populate(
    "items.product",
    "name slug price stock images isActive",
  );
};

const updateCartItem = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
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

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return await cart.populate(
    "items.product",
    "name slug price stock images isActive",
  );
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

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return await cart.populate(
    "items.product",
    "name slug price stock images isActive",
  );
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
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