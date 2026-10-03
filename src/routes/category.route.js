const express = require("express");

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { validateCategory } = require("../validators/category.validator");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Public routes
router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  upload.single("image"),
  validateCategory,
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  upload.single("image"),
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
