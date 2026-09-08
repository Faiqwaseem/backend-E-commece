const express = require("express");

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { validateCategory } = require("../validators/category.validator");

const router = express.Router();

// Public routes
router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  validateCategory,
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  validateCategory,
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  categoryController.deleteCategory,
);

module.exports = router;