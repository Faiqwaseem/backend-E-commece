const { body, validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  try {
    result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const registerUserValidationRoles = [
  body("username")
    .isString()
    .withMessage("userName should be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("userName should be at least 3 characters long")
    .trim()
    .notEmpty()
    .withMessage("userName is required"),

  body("email")
    .isEmail()
    .withMessage("email should be a valid email")
    .normalizeEmail()
    .trim()
    .notEmpty()
    .withMessage("email is required"),

  body("password")
    .isString()
    .withMessage("password should be a string")
    .isLength({ min: 6, max: 15 })
    .withMessage("password should be at least 8 characters long")
    .trim()
    .notEmpty()
    .withMessage("password is required"),
  validateResult,
];

const loginUserValidationRoles = [
  body("email")
    .isEmail()
    .withMessage("email should be a valid email")
    .normalizeEmail()
    .trim()
    .notEmpty()
    .withMessage("email is required"),

  body("password")
    .isString()
    .withMessage("password should be a string")
    .isLength({ min: 6, max: 15 })
    .withMessage("password should be at least 8 characters long")
    .trim()
    .notEmpty()
    .withMessage("password is required"),
  validateResult,
];

module.exports = {
  registerUserValidationRoles,
  loginUserValidationRoles,
};
