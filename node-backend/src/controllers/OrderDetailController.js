const orderDetailModel = require("../models/OrderDetailModel");

// Add order details
const addOrderDetails = async (req, res) => {
  try {
    const { orderId, productId, quantity, price } = req.body;

    const newDetail = await orderDetailModel.create({
      orderId,
      productId,
      quantity,
      price,
    });

    res.status(201).json({
      message: "Order details added successfully",
      data: newDetail,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get details by order
const getDetailsByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const details = await orderDetailModel.find({ orderId }).populate("productId");

    res.status(200).json({
      message: "Order details fetched successfully",
      data: details,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addOrderDetails,
  getDetailsByOrder,
};