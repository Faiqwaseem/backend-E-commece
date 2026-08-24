const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  validate.registerUserValidationRoles,
  authController.registerUser,
);

router.post(
  "/login",
  validate.loginUserValidationRoles,
  authController.userLogin,
);

router.get("/me", authMiddleware, authController.getCurrentUser);

router.post("/logout", authController.logoutUser);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
