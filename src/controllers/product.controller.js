const asyncHandler = require("../utils/asyncHandler");
const productService = require("../services/product.service");
const { uploadImage } = require("../services/storage.service");

const createProduct = asyncHandler(async (req, res) => {
const files = req.files;
  const images = [];

if (files && files.length > 0) {
    for (const file of files) {
      const imageResult = await uploadImage(
        file.buffer.toString("base64")
      );
      images.push(imageResult.url);
    }
  }

  const product = await productService.createProduct({
    ...req.body,
    images,
  });

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts();

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
