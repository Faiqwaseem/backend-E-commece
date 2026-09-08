const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

const createProduct = async (productData) => {
  const { category, sku, slug } = productData;

  // Check category exists and is active
  const existingCategory = await Category.findOne({
    _id: category,
    isActive: true,
  });

  if (!existingCategory) {
    throw new ApiError(404, "Category not found or inactive");
  }

  // Check duplicate SKU
  const existingSku = await Product.findOne({ sku });

  if (existingSku) {
    throw new ApiError(409, "Product SKU already exists");
  }

  // Check duplicate slug
  const existingSlug = await Product.findOne({ slug });

  if (existingSlug) {
    throw new ApiError(409, "Product slug already exists");
  }

  const product = await Product.create(productData);

  return product;
};

const getProducts = async () => {
  const products = await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return products;
};

const getProductById = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId).populate(
    "category",
    "name slug",
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const updateProduct = async (productId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check category if category is being updated
  if (updateData.category) {
    const existingCategory = await Category.findOne({
      _id: updateData.category,
      isActive: true,
    });

    if (!existingCategory) {
      throw new ApiError(404, "Category not found or inactive");
    }
  }

  // Check duplicate SKU
  if (updateData.sku && updateData.sku !== product.sku) {
    const existingSku = await Product.findOne({
      sku: updateData.sku,
      _id: { $ne: productId },
    });

    if (existingSku) {
      throw new ApiError(409, "Product SKU already exists");
    }
  }

  // Check duplicate slug
  if (updateData.slug && updateData.slug !== product.slug) {
    const existingSlug = await Product.findOne({
      slug: updateData.slug,
      _id: { $ne: productId },
    });

    if (existingSlug) {
      throw new ApiError(409, "Product slug already exists");
    }
  }

  Object.assign(product, updateData);

  await product.save();

  return product;
};

const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();

  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};