const express = require("express");
const multer = require("multer");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { validateProduct } = require("../validators/product.validator");

const upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

// Public routes
router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  validateProduct,
  upload.single('product'),
  productController.createProduct,
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  validateProduct,
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  productController.deleteProduct,
);

module.exports = router;
