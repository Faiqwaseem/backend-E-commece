const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${timestamp}-${random}`;
};

const calculateSubtotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const createOrder = async (userId, orderData) => {
  const { shippingAddress, paymentMethod } = orderData;

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];

      for (const cartItem of cart.items) {
        const product = await Product.findById(cartItem.product).session(
          session,
        );

        if (!product) {
          throw new ApiError(404, "Product not found");
        }

        if (!product.isActive) {
          throw new ApiError(
            400,
            `Product "${product.name}" is no longer available`,
          );
        }

        if (product.stock < cartItem.quantity) {
          throw new ApiError(
            400,
            `Only ${product.stock} item(s) available for "${product.name}"`,
          );
        }

        const subtotal = product.price * cartItem.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          subtotal,
        });

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: { $gte: cartItem.quantity },
          },
          {
            $inc: {
              stock: -cartItem.quantity,
            },
          },
          {
            new: true,
            session,
          },
        );

        if (!updatedProduct) {
          throw new ApiError(400, `Insufficient stock for "${product.name}"`);
        }
      }

      const subtotal = calculateSubtotal(orderItems);

      const shippingFee = 0;

      const totalAmount = subtotal + shippingFee;

      const [order] = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            user: userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingFee,
            totalAmount,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
          },
        ],
        { session },
      );

      createdOrder = order;

      cart.items = [];
      cart.totalAmount = 0;

      await cart.save({ session });
    });

    return await Order.findById(createdOrder._id).populate(
      "items.product",
      "name slug images",
    );
  } finally {
    await session.endSession();
  }
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product", "name slug images")
    .sort({ createdAt: -1 });

  return orders;
};

const getOrderById = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate("items.product", "name slug images");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

const cancelOrder = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      }).session(session);

      if (!order) {
        throw new ApiError(404, "Order not found");
      }

      if (
        order.orderStatus === "shipped" ||
        order.orderStatus === "delivered" ||
        order.orderStatus === "cancelled"
      ) {
        throw new ApiError(
          400,
          `Order cannot be cancelled because it is ${order.orderStatus}`,
        );
      }

      if (order.paymentStatus === "paid") {
        throw new ApiError(400, "Paid order cannot be cancelled directly");
      }

      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          {
            session,
          },
        );
      }

      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();

      await order.save({ session });

      cancelledOrder = order;
    });

    return await Order.findById(cancelledOrder._id).populate(
      "items.product",
      "name slug images",
    );
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
