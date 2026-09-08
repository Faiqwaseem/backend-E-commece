const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

const createCategory = async (categoryData) => {
  const { name, slug, description, image, isActive } = categoryData;

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    if (existingCategory.name === name) {
      throw new ApiError(409, "Category name already exists");
    }

    throw new ApiError(409, "Category slug already exists");
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    isActive,
  });

  return category;
};

const getCategories = async () => {
  const categories = await Category.find().sort({ createdAt: -1 });

  return categories;
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (updateData.name || updateData.slug) {
    const duplicateCategory = await Category.findOne({
      _id: { $ne: categoryId },
      $or: [
        ...(updateData.name ? [{ name: updateData.name }] : []),
        ...(updateData.slug ? [{ slug: updateData.slug }] : []),
      ],
    });

    if (duplicateCategory) {
      if (
        updateData.name &&
        duplicateCategory.name === updateData.name
      ) {
        throw new ApiError(409, "Category name already exists");
      }

      throw new ApiError(409, "Category slug already exists");
    }
  }

  Object.assign(category, updateData);

  await category.save();

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();

  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};