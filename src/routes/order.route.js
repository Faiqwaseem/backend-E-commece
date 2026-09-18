const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validateCreateOrder,} = require("../validators/order.validator");

const router = express.Router();

router.use(authMiddleware);

router.post("/",  validateCreateOrder, orderController.createOrder);

router.get("/", orderController.getMyOrders);

router.get("/:id", orderController.getOrderById);

router.patch("/:id/cancel", orderController.cancelOrder);

module.exports = router;