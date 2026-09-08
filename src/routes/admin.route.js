const express = require("express");

const adminController = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const router = express.Router();

router.get(
  "/test",
  authMiddleware,
  authorize("admin"),
  adminController.adminTest,
);

module.exports = router;