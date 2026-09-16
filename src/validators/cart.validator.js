const { body, validationResult } = require("express-validator");

const validateAddToCart = [
  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

const validateUpdateCartItem = [
  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

const validateRemoveFromCart = [
  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
};
