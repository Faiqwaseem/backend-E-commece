const asyncHandler = require("../utils/asyncHandler");
const categoryService = require("../services/category.service");

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();

  return res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};