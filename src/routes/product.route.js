const express = require("express");
const multer = require("multer");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validators/product.validator");

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

// Public
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Admin - Create
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  upload.array("images", 8),
  validateCreateProduct,
  productController.createProduct,
);

// Admin - Update
router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  upload.array("images", 8),
  validateUpdateProduct,
  productController.updateProduct,
);

// Admin - Delete
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  productController.deleteProduct,
);

module.exports = router;