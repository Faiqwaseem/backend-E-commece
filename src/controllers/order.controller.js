const asyncHandler = require("../utils/asyncHandler");
const orderService = require("../services/order.service");

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(
    req.user._id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.user._id,
    req.params.id,
  );

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.user._id,
    req.params.id,
  );

  return res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};