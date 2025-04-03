const orderModel = require("../models/OrderModel");

// Create an order
const createOrder = async (req, res) => {
  try {
    const { userId, totalAmount, details } = req.body;

    const newOrder = await orderModel.create({
      userId,
      totalAmount,
      details: [details] // Wrap in array if you want to support multiple products later
    });

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to create order",
      error: err.message 
    });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderModel.find({ userId }).populate("details");

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
};