const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

const validateCreateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2 and 150 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Slug must be between 2 and 150 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number")
    .toFloat(),

  body("compareAtPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Compare-at price must be a valid positive number")
    .toFloat(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid ID"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand must not exceed 100 characters"),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("SKU must be between 2 and 100 characters"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean")
    .toBoolean(),

  body("bestSeller")
    .optional()
    .isBoolean()
    .withMessage("Best seller must be a boolean")
    .toBoolean(),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5")
    .toFloat(),

  body("reviewCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Review count must be a non-negative integer")
    .toInt(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean(),

  handleValidationErrors,
];

const validateUpdateProduct = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2 and 150 characters"),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Slug must be between 2 and 150 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number")
    .toFloat(),

  body("compareAtPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Compare-at price must be a valid positive number")
    .toFloat(),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand must not exceed 100 characters"),

  body("sku")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("SKU must be between 2 and 100 characters"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean")
    .toBoolean(),

  body("bestSeller")
    .optional()
    .isBoolean()
    .withMessage("Best seller must be a boolean")
    .toBoolean(),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5")
    .toFloat(),

  body("reviewCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Review count must be a non-negative integer")
    .toInt(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean(),

  handleValidationErrors,
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};